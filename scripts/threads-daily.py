#!/usr/bin/env python3
"""
Threads 全自動發文 v5.7（及時回調 refs）
更新：2026-05-07 01:08
- 每次點擊前都重新 state，確保拿到最新 refs
- 流程：open → state找建立[7] → click → state找文字框[31] → click → state找contenteditable[n] → type → state找發佈[n] → click → 等95秒
"""
import subprocess, json, time, re, os
from datetime import datetime

LOG_DIR = os.path.expanduser("~/openclaw/workspace/logs/published")

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}", flush=True)

def run(cmd, timeout=30):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
    return r.stdout.strip(), r.stderr.strip(), r.returncode

def get_state():
    out, _, _ = run("opencli browser state 2>&1", timeout=15)
    return out

def find_in_state(state, pattern):
    """找第一個匹配行，返回 (ref數字, 整行) 或 (None, None)"""
    for l in state.split("\n"):
        if pattern in l:
            m = re.search(r"\[(\d+)\]<", l)
            return (m.group(1) if m else None), l.strip()
    return None, None

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
            if name:
                items.append({"name": name, "tagline": tagline or "", "url": url})
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
- 最後一行是🔗 完整文章： + 連結（直接放完整 URL，不要截斷）
- 最少 2 個 hashtag（#AI 或相關主題）
- 不要用「首先」「其次」「最後」這類制式開頭
- 直接輸出文字就好，不需要加任何格式標記'''

    try:
        out, err, rc = run(f'opencli gemini ask {json.dumps(prompt)} --timeout 40', timeout=45)
        if rc == 0 and out:
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

    return f'''💬 {item["name"]} 來了！{item["tagline"]}

{item["url"]}
#AI #科技新知'''

# ---- 主流程 ----
def main():
    log("=" * 50)
    log("Threads v5.7 每日即時發文（即時回調版）")

    # 1. 抓今日第1名
    log("抓 Product Hunt 今日排行榜...")
    item = get_today_top_article()
    if not item:
        log("❌ 無法抓取排行榜")
        return
    log(f"今日第1名：{item['name']} — {item['tagline']}")
    log(f"URL：{item['url']}")

    # 2. 生成內容
    log("生成文案...")
    content = generate_content(item)
    log(f"文案：{content[:80]}...")

    # 3. 開啟 Threads
    log("開啟 Threads...")
    run("opencli browser close", timeout=5)
    time.sleep(1)
    run("opencli browser open 'https://www.threads.net/@pokenews2026'", timeout=15)
    time.sleep(6)

    # 4. 重新 state，找「建立」按鈕
    log("找建立按鈕...")
    state = get_state()
    ref, line = find_in_state(state, 'aria-label=建立 role=img')
    if not ref:
        log("❌ 找不到建立按鈕")
        return
    log(f"點擊建立 [{ref}]...")
    out, _, rc = run(f"opencli browser click {ref}", timeout=10)
    log("建立點擊：" + out)
    time.sleep(3)

    # 5. 重新 state，找「文字欄位空白」按鈕
    log("找文字框按鈕...")
    state = get_state()
    ref, line = find_in_state(state, 'aria-label=文字欄位空白')
    if not ref:
        log("❌ 找不到文字框按鈕")
        return
    log(f"點擊文字框 [{ref}]...")
    out, _, rc = run(f"opencli browser click {ref}", timeout=10)
    log("文字框點擊：" + out)
    time.sleep(2)

    # 6. 重新 state，找 contenteditable
    log("找 contenteditable 文字框...")
    state = get_state()
    # 優先找完整的 contenteditable=true role=textbox
    ref, line = find_in_state(state, 'contenteditable=true role=textbox')
    if not ref:
        # fallback: aria-label 包含「文字欄位空白」且帶 contenteditable
        m = re.search(r"\[(\d+)\]<div aria-label=文字欄位空白", state)
        if m:
            ref = m.group(1)
    if not ref:
        log("❌ 找不到 contenteditable")
        return
    log(f"打字進文字框 [{ref}]...")
    out, _, rc = run(f"opencli browser type {ref} {json.dumps(content)}", timeout=30)
    if rc == 0 and '"typed": true' in out:
        log("打字：OK")
    else:
        log(f"打字結果：{out}")
    time.sleep(2)

    # 7. 重新 state，找「發佈」按鈕
    log("找發布按鈕...")
    state = get_state()
    ref, line = find_in_state(state, '<div>發佈</div>')
    if not ref:
        log("⚠️ 正則找不到，試 JS...")
        js_pub = repr("(function(){var els=document.querySelectorAll('div[role=button]');for(var e of els){if(e.innerText&&e.innerText.trim()==='發佈'&&e.offsetParent!==null){e.click();return'ok';}}return'not found';})()")
        out, _, _ = run(f"opencli browser eval {js_pub}", timeout=15)
        log("JS 發布：" + out)
    else:
        log(f"點擊發布 [{ref}]...")
        out, _, rc = run(f"opencli browser click {ref}", timeout=10)
        log("發布點擊：" + out)

    # 8. 等 95 秒結算
    log("等 95 秒讓 Threads 結算...")
    time.sleep(95)

    # 9. 驗證
    log("驗證...")
    run("opencli browser open 'https://www.threads.net/@pokenews2026?sort_by=time'", timeout=15)
    time.sleep(5)
    out, _, _ = run("opencli browser state 2>&1", timeout=15)
    ids = re.findall(r"/post/([A-Za-z0-9]+)", out)
    if ids:
        pid = ids[0]
        log(f"✅ 成功！https://www.threads.com/@pokenews2026/post/{pid}")
        os.makedirs(LOG_DIR, exist_ok=True)
        ts = datetime.now().strftime("%Y-%m-%d_%H%M%S")
        with open(os.path.join(LOG_DIR, f"{ts}_{pid}.txt"), "w") as f:
            f.write(f"發布時間：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"來源：Product Hunt 今日第1名\n")
            f.write(f"產品：{item['name']}\n")
            f.write(f"URL：{item['url']}\n")
            f.write(f"Post ID：{pid}\n\n")
            f.write(f"內容：\n{content}\n")
        log(f"📝 記錄：{ts}_{pid}.txt")
    else:
        log("⚠️ 無法確認 Post ID，內容可能已發布（需手動確認）")

if __name__ == "__main__":
    main()