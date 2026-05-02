#!/usr/bin/env python3
"""
Threads 全自動發文 v5.0（每日即時新聞版）
更新：2026-04-23
- 每天發文前動態抓 Product Hunt 今日排行榜第1名
- 不再依賴本地 SQLite 資料庫
- JS contenteditable 打字（繞過 Illegal invocation 問題）
- 90秒結算等待
"""
import subprocess, json, time, re, os
from datetime import datetime

LOG_DIR = os.path.expanduser("~/openclaw/workspace/logs/published")

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}", flush=True)

def run(cmd, timeout=30):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
    return r.stdout.strip(), r.stderr.strip(), r.returncode

# ---- 抓今日最新文章 ----
def get_today_top_article():
    out, err, rc = run("opencli producthunt today 2>&1", timeout=30)
    if rc != 0 or not out:
        return None

    items = []
    name, tagline, url = None, None, None
    for line in out.split("\n"):
        line = line.strip()
        if line.startswith("name:"):
            if name: items.append({"name": name, "tagline": tagline or "", "url": url})
            name = line.split("name:", 1)[1].strip()
            tagline, url = None, None
        elif line.startswith("tagline:"):
            tagline = line.split("tagline:", 1)[1].strip()
        elif line.startswith("url:"):
            url = line.split("url:", 1)[1].strip()
    if name and url:
        items.append({"name": name, "tagline": tagline or "", "url": url})

    return items[0] if items else None

# ---- 生成內容 ----
def generate_content(item):
    prompt = f'''你是一個台灣科技小編，幫我幫以下這個 AI 產品寫一篇 Threads 短文。

產品：{item["name"]}
標語：{item["tagline"]}
連結：{item["url"]}

要求：
- 100-150字以內
- 用台灣口語，活潑友善
- 第一句用 Emoji 💬 開頭
- 最後一行是🔗 完整文章： + 連結
- 最少 2 個 hashtag（#AI 或相關主題）
- 不要用「首先」「其次」「最後」這類制式開頭
- 直接輸出文字就好，不需要加任何格式標記'''

    try:
        out, err, rc = run(f'opencli gemini ask {json.dumps(prompt)} --timeout 40', timeout=45)
        if rc == 0 and out:
            # 去掉表格格式的干擾文字
            lines = out.split("\n")
            content_lines = [l.strip() for l in lines if l.strip()
                          and not l.startswith("---")
                          and not l.startswith("name:")
                          and not l.startswith("tagline:")
                          and not l.startswith("url:")
                          and not l.startswith("rank:")]
            result = "\n".join(content_lines).strip()
            if result:
                return result
    except Exception as e:
        log(f"gemini ask 失敗: {e}")

    # fallback 內容
    return f'''💬 {item["name"]} 來了！{item["tagline"]}

{item["url"]}
#AI #科技新知'''

# ---- 打字進 contenteditable ----
def type_via_js(content):
    """用 JS execCommand('insertText') 打字，繞過 Illegal invocation 問題"""
    js = f'''
(function(){{
  var d = document.querySelector('div[aria-label*="文字欄位"]');
  if(!d) {{ d = document.querySelector('[role=dialog]'); }}
  if(!d) {{ return 'dialog not found'; }}

  var el = d.querySelector('[contenteditable="true"]') || d.querySelector('[contenteditable]') || d;
  el.click();
  document.execCommand('selectAll', false, null);
  document.execCommand('insertText', false, {json.dumps(content)});
  return 'ok typed';
}})()
'''
    out, _, rc = run(f"opencli operate eval {repr(js)}", timeout=20)
    return out

# ---- 點擊發布 ----
def click_publish():
    js = '''(function(){
  var els = document.querySelectorAll('div[role="button"]');
  for(var e of els) {
    var t = e.innerText ? e.innerText.trim() : '';
    if(t === '發佈' || t === '發布') {
      if(e.offsetParent !== null) {
        e.dispatchEvent(new MouseEvent('click', {bubbles:true}));
        return 'ok';
      }
    }
  }
  return 'not found';
})()'''
    out, _, rc = run(f"opencli operate eval {repr(js)}", timeout=15)
    return out

# ---- 主流程 ----
def main():
    log("=" * 50)
    log("Threads v5.0 每日即時發文")

    # 1. 抓今日第1名
    log("抓 Product Hunt 今日排行榜...")
    item = get_today_top_article()
    if not item:
        log("❌ 無法抓取排行榜")
        return
    log(f"今日第1名：{item['name']} — {item['tagline']}")

    # 2. 生成內容
    log("生成文案...")
    content = generate_content(item)
    log(f"文案：{content[:80]}...")

    # 3. 準備發文
    run("opencli operate close", timeout=5)
    time.sleep(1)
    run("opencli operate open 'https://www.threads.net/@pokenews2026'", timeout=15)
    time.sleep(5)

    # 4. 點擊建立（[16] = svg[aria-label="建立"] 的父元素 div[role=button]）
    log("點擊建立按鈕...")
    run("opencli operate click 16", timeout=10)
    time.sleep(4)

    # 5. 找文字框 — 對話框出現後，contenteditable=true 的 textbox 在 accessibility tree 裡有獨立索引
    # 先確認對話框出現
    state, _, _ = run("opencli operate state 2>&1 | grep 'contenteditable=true.*role=textbox' | head -3", timeout=10)
    m = re.search(r"\[(\d+)\]<div aria-label=文字欄位空白.*contenteditable=true role=textbox", state)
    if not m:
        # 找不到就擴大範圍：找所有含 contenteditable 的元素
        state2, _, _ = run("opencli operate state 2>&1 | grep 'contenteditable=true' | head -3", timeout=10)
        m2 = re.search(r"\[(\d+)\].*?contenteditable=true role=textbox", state2)
        if m2:
            tb_idx = m2.group(1)
        else:
            log("找不到文字框索引")
            return
    else:
        tb_idx = m.group(1)
    log(f"文字框索引：{tb_idx}")

    # 6. 打字（直接用 type 對 contenteditable div，繞過 Illegal invocation）
    log("打字進文字框...")
    out, _, rc = run(f'opencli operate type {tb_idx} {json.dumps(content)}', timeout=30)
    if rc == 0:
        log("打字：OK")
    else:
        log(f"打字失敗：{out}")
    time.sleep(2)

    # 7. 找「發佈」按鈕
    state_pub, _, _ = run("opencli operate state 2>&1 | grep '發佈' | head -5", timeout=10)
    m_pub = re.search(r"\[(\d+)\]<div>發佈</div>", state_pub)
    if m_pub:
        pub_idx = m_pub.group(1)
        log(f"點擊發布按鈕 [{pub_idx}]...")
        out, _, rc = run(f"opencli operate click {pub_idx}", timeout=10)
        log("點擊發布：" + out)
    else:
        # fallback: JS 點擊
        log("使用 JS 點擊發布...")
        js_pub = repr("(function(){var els=document.querySelectorAll('div[role='button']');for(var e of els){if(e.innerText&&e.innerText.trim()==='發佈'&&e.offsetParent!==null){e.dispatchEvent(new MouseEvent('click',{bubbles:true}));return'ok';}}return'not found';})()")
        out, _, _ = run(f"opencli operate eval {js_pub}", timeout=10)
        log("JS 發布：" + out)

    # 8. 等 90 秒結算
    log("等 90 秒讓 Threads 結算...")
    time.sleep(90)

    # 9. 驗證
    log("驗證...")
    run("opencli operate open 'https://www.threads.net/@pokenews2026?sort_by=time'", timeout=15)
    time.sleep(5)
    state2, _, _ = run("opencli operate state 2>&1", timeout=15)
    ids = re.findall(r"/post/([A-Za-z0-9]+)", state2)
    if ids:
        pid = ids[0]
        log(f"✅ 成功！https://www.threads.com/@pokenews2026/post/{pid}")
        os.makedirs(LOG_DIR, exist_ok=True)
        ts = datetime.now().strftime("%Y-%m-%d_%H%M%S")
        with open(os.path.join(LOG_DIR, f"{ts}_{pid}.txt"), "w") as f:
            f.write(f"發布時間：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"來源：Product Hunt 今日第1名\n")
            f.write(f"產品：{item['name']}\n")
            f.write(f"Post ID：{pid}\n\n")
            f.write(f"內容：\n{content}\n")
        log(f"📝 記錄：{ts}_{pid}.txt")
    else:
        log("⚠️ 無法確認 Post ID，內容可能已發布（需手動確認）")

if __name__ == "__main__":
    main()
