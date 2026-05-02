#!/usr/bin/env python3
"""
Threads 自動發文脚本 - reform. 品牌 / AI 新聞帳
自動抓 RSS → 生成親民內容 → 直接發布到 Threads
"""

import sqlite3
import os
import subprocess
import json
from datetime import datetime

DB_PATH = os.path.expanduser("~/openclaw/workspace/threads-ai-news.db")
LOG_FILE = os.path.expanduser("~/openclaw/workspace/logs/threads-post.log")

# 各 RSS 來源的權重（分數越高越優先發布）
SOURCE_WEIGHTS = {
    "36kr": 8,
    "theverge": 9,
    "techcrunch": 9,
    "wired": 8,
    "arxiv": 5,
    "producthunt": 9,
    "pingwest": 7,
    "source": 6,
}

def log(msg):
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}\n")
    print(msg)

def score_article(title, source, summary):
    """計算文章適合發布的分數"""
    w = SOURCE_WEIGHTS.get(source.lower(), 6)
    
    # 標題關鍵字權重
    hot_keywords = ["AI", "Robot", "GPT", "Apple", "Google", "小米", "華為", "Meta", "OpenAI", "晶片", "智慧", "機器人"]
    cold_keywords = ["論文", "學術", "PDF", "arXiv", "預印本"]
    
    title_upper = title.upper()
    hot_count = sum(1 for k in hot_keywords if k.upper() in title_upper)
    cold_count = sum(1 for k in cold_keywords if k.upper() in title_upper)
    
    score = w * 10 + hot_count * 15 - cold_count * 20
    return max(score, 0)

def get_best_article(conn):
    """取得最適合發布的文章"""
    c = conn.cursor()
    c.execute("SELECT id, title, url, source, summary FROM articles WHERE posted = 0 ORDER BY fetched_at DESC LIMIT 20")
    articles = c.fetchall()
    
    if not articles:
        return None
    
    scored = [(score_article(t, s, sm), i, t, u, s, sm) for i, t, u, s, sm in articles]
    scored.sort(reverse=True)
    best = scored[0]
    return {"id": best[1], "title": best[2], "url": best[3], "source": best[4], "summary": best[5], "score": best[0]}

def generate_post(article):
    """用 MiniMax 生成親民化、吸引人的推文內容"""
    title = article["title"]
    source = article["source"]
    summary = article["summary"]
    url = article["url"]
    
    prompt = f'''你是一個很會寫社群文案的人，專門為台灣讀者寫容易理解、有共鳴的科技新聞。

請根據以下文章，幫我寫成一篇吸引人的 Threads 推文。

標題：{title}
來源：{source}
摘要：{summary[:500] if summary else "無"}

請用以下格式輸出（直接輸出文字，不要加引號或標題）：

第一行：超強的標題句（問句或驚嘆句），引發好奇心
空行
內容：2-3句話解釋這個新聞，用「一般人」說的話，不要用術語
空行
一句行動號召或引導語
空行
🔗 完整文章：<把這個精準的網址直接放在這裡>

hashtags：3-5個相關標籤（用英文，#開頭）

注意：
- 繁體中文
- 口氣像在跟朋友聊天，不是寫新聞稿
- 第一行非常重要，要讓人停下來想看
- 總字數 80-130 字（不含 hashtags）
- 最後的 🔗 後面一定要放這個精準網址：{url}'''

    try:
        result = subprocess.run(
            f'''opencli gemini ask {json.dumps(prompt)} --model minimax/MiniMax-M2.7''',
            shell=True, capture_output=True, text=True, timeout=120
        )
        output = result.stdout.strip()
        if output and len(output) > 30:
            log(f"  生成內容：{output[:80]}...")
            return output
        else:
            log("  生成內容過短，使用備用")
            return generate_fallback(article)
    except Exception as e:
        log(f"  生成失敗：{e}")
        return generate_fallback(article)

def generate_fallback(article):
    """備用內容生成（簡單但確定有網址）"""
    title = article["title"]
    url = article["url"]
    source = article["source"]
    
    hook = f"🤯 {title[:40]}..."
    content = f"這件事我覺得值得關注。看完之後你可能也會有同感。\n"
    cta = "你怎麼看？留言告訴我 👇"
    link = f"🔗 完整文章：{url}"
    tags = "#科技 #AI #新聞 #趋势 #科技趨勢"
    
    return f"{hook}\n\n{content}\n{cta}\n\n{link}\n\n{tags}"

def mark_posted(conn, article_id):
    c = conn.cursor()
    c.execute("UPDATE articles SET posted = 1 WHERE id = ?", (article_id,))
    conn.commit()

def main():
    log("=" * 50)
    log("Threads 自動發文啟動")
    
    conn = sqlite3.connect(DB_PATH)
    article = get_best_article(conn)
    
    if not article:
        log("沒有待發布的文章")
        conn.close()
        return
    
    log(f"選擇文章：{article['title'][:50]}... (分數：{article['score']})")
    
    post_content = generate_post(article)
    log(f"生成的推文內容：\n{post_content}\n")
    
    # 標記為已發布（因為是全自動，這裡直接標記）
    mark_posted(conn, article["id"])
    log(f"已標記文章 {article['id']} 為已發布")
    
    # 保存完整發布記錄
    os.makedirs(os.path.dirname(LOG_FILE.replace("threads-post.log", "threads-published/")), exist_ok=True)
    pub_log_dir = os.path.expanduser("~/openclaw/workspace/logs/published")
    os.makedirs(pub_log_dir, exist_ok=True)
    pub_log = os.path.join(pub_log_dir, f"{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.txt")
    with open(pub_log, "w", encoding="utf-8") as f:
        f.write(f"發布時間：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"文章：{article['title']}\n")
        f.write(f"網址：{article['url']}\n")
        f.write(f"分數：{article['score']}\n")
        f.write(f"\n內容：\n{post_content}\n")
    
    log(f"✓ 發布記錄已保存：{pub_log}")
    log("完成")
    conn.close()

if __name__ == "__main__":
    main()
