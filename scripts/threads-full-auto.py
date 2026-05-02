#!/usr/bin/env python3
"""
Threads 全自動發文腳本 v4.0（最終可靠版）
更新：2026-04-21
- 加入 90 秒結算等待（Threads 發布超慢）
- JS DOM 操作繞過 accessibility tree 索引問題
- 成功：Nibbo (DXZcvhDEUP3), Verdent 2.0 (DXZeGijkXIx)
"""
import sqlite3, os, subprocess, json, time, re
from datetime import datetime

DB_PATH = os.path.expanduser("~/openclaw/workspace/threads-ai-news.db")
LOG_DIR = os.path.expanduser("~/openclaw/workspace/logs/published")

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

def run(cmd, timeout=30):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
    return r.stdout.strip(), r.stderr.strip(), r.returncode

def get_best_article():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, title, url, source, summary FROM articles WHERE posted=0 ORDER BY fetched_at DESC LIMIT 1")
    row = c.fetchone()
    conn.close()
    if not row: return None
    return {"id": row[0], "title": row[1], "url": row[2], "source": row[3], "summary": row[4]}

def generate_content(article):
    """用 MiniMax 直接生成內容"""
    prompt = f"""你是一個很會寫社群文案的人，專門為台灣讀者寫容易理解、有共鳴的科技新聞。

請根據以下文章，幫我寫成一篇吸引人的 Threads 推文。

標題：{article['title']}
來源：{article['source']}
摘要：{(article['summary'] or '無')[:500]}

請用以下格式輸出（直接輸出文字）：

第一行：超強的標題句（問句或驚嘆句），引發好奇心
內容：2-3句話解釋這個新聞，用「一般人」說的話，不要用術語
一句行動號召或引導語
🔗 完整文章：{article['url']}
hashtags：3-5個相關標籤（用繁體中文或英文，#開頭）

注意：繁體中文，口氣像在跟朋友聊天，總字數 80-130 字"""

    cmd = f'''opencli gemini ask {json.dumps(prompt)}'''
    try:
        out, err, rc = run(cmd, timeout=120)
        if rc == 0 and out and len(out) > 50:
            return out.strip()
    except: pass
    return None

def post_content(content):
    """執行發布流程"""
    # 1. 關閉舊瀏覽器，開乾淨 session
    run("opencli operate close")
    time.sleep(1)
    run("opencli operate open https://www.threads.com/@pokenews2026")
    time.sleep(5)

    # 2. JS 點擊 compose
    js_click = "(function(){var bts=Array.from(document.querySelectorAll('div[role=button]'));var b=bts.find(x=>x.getAttribute('aria-label')&&x.getAttribute('aria-label').includes('文字欄位空白')&&x.getAttribute('role')==='button');if(b){b.click();return'OK';}return'FAIL';})()"
    out, _, _ = run(f"opencli operate eval {repr(js_click)}")
    log(f"點擊 compose：{out}")
    time.sleep(3)

    # 3. 找文字框索引
    state, _, _ = run("opencli operate state 2>/dev/null | grep 'contenteditable=true.*textbox' | head -3")
    m = re.search(r'\[(\d+)\]<div aria-label=文字欄位空白.*contenteditable=true', state)
    if not m:
        log("找不到文字框"); return False
    tb_idx = m.group(1)
    log(f"文字框：{tb_idx}")

    # 4. 打字
    run(f"opencli operate type {tb_idx} {json.dumps(content)}")
    time.sleep(2)

    # 5. 驗證
    verify, _, _ = run('opencli operate eval "(function(){ const b = document.querySelector(\'[contenteditable=true][role=textbox]\'); return b ? b.innerText.substring(0,60) : \'\'; })()"')
    log(f"驗證：{verify[:60]}")

    # 6. JS 點擊發布
    time.sleep(1)
    js_pub = "(function(){var ds=Array.from(document.querySelectorAll('div'));var c=false;for(const d of ds){if(d.innerText&&d.innerText.trim()==='發佈'&&d.offsetParent!==null){d.click();c=true;}}return c?'OK':'FAIL';})()"
    out, _, _ = run(f"opencli operate eval {repr(js_pub)}")
    log(f"點擊發布：{out}")

    # 7. 關鍵：等 90 秒讓 Threads 結算（不要做任何事！）
    log("等 90 秒讓 Threads 結算...")
    time.sleep(90)

    # 8. 檢查結算狀態
    state2, _, _ = run("opencli operate state 2>/dev/null | grep '發佈中' | head -3")
    if "發佈中" in state2:
        log("仍在發布中，再等 30 秒...")
        time.sleep(30)

    return True

def verify_post():
    """驗證並取得新 post ID"""
    run("opencli operate open https://www.threads.com/@pokenews2026?sort_by=time")
    time.sleep(5)
    state, _, _ = run("opencli operate state 2>/dev/null | grep 'href=/@pokenews2026/post' | head -10")
    ids = re.findall(r'/post/([A-Za-z0-9]+)', state)
    if ids:
        log(f"最新 Post ID：{ids[0]}")
        return ids[0]
    return None

def main():
    log("=" * 50)
    log("Threads 全自動發文 v4.0 啟動")

    article = get_best_article()
    if not article:
        log("沒有待發布的文章")
        return
    log(f"文章：{article['title'][:50]}...")

    content = generate_content(article)
    if not content:
        log("內容生成失敗")
        return

    if not post_content(content):
        log("發布流程失敗")
        return

    post_id = verify_post()
    if post_id:
        conn = sqlite3.connect(DB_PATH)
        conn.execute("UPDATE articles SET posted=1 WHERE id=?", (article["id"],))
        conn.commit()
        conn.close()
        ts = datetime.now().strftime('%Y-%m-%d_%H%M%S')
        with open(os.path.join(LOG_DIR, f"{ts}_{post_id}.txt"), "w") as f:
            f.write(f"發布時間：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"文章ID：{article['id']}\n")
            f.write(f"標題：{article['title']}\n")
            f.write(f"Post ID：{post_id}\n\n")
            f.write(f"內容：\n{content}\n")
        log(f"✅ 成功！https://www.threads.com/@pokenews2026/post/{post_id}")
    else:
        log("⚠️ 發布結果未確認")

if __name__ == "__main__":
    main()
