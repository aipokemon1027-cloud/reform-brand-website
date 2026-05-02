#!/usr/bin/env python3
"""
用 MiniMax 生成 Threads 推文內容
"""

import sqlite3
import os
import subprocess
from datetime import datetime

DB_PATH = os.path.expanduser("~/openclaw/workspace/threads-ai-news.db")
DRAFT_FILE = os.path.expanduser("~/openclaw/workspace/threads-posts-draft.txt")

def get_articles(conn, limit=3):
    c = conn.cursor()
    c.execute("""
        SELECT id, title, url, source, summary 
        FROM articles 
        WHERE posted = 0 
        ORDER BY fetched_at DESC 
        LIMIT ?
    """, (limit,))
    return c.fetchall()

def generate_post(title, source, summary):
    prompt = f'''請根據以下文章生成一篇 100-150 字的 Threads/推文。

標題：{title}
來源：{source}

要求：
- 繁體中文
- 80-150 字
- 加入 1-2 個 相關 hashtag
- 結尾加 "🔗 看更多"
- 制造好奇心讓人想點擊
- 直接輸出內容，不要加標題或引號'''

    try:
        result = subprocess.run(
            f'opencli gemini ask "{prompt.replace(chr(34), chr(34)+chr(34))}" --model minimax/MiniMax-M2.7',
            shell=True, capture_output=True, text=True, timeout=90
        )
        return result.stdout.strip() if result.stdout.strip() else f"🤖 {title[:100]}...\n\n#AI #新聞 🔗 看更多"
    except:
        return f"🤖 {title[:100]}...\n\n#AI #新聞 🔗 看更多"

def main():
    print(f"[{datetime.now().strftime('%H:%M:%S')}] 生成推文...")
    conn = sqlite3.connect(DB_PATH)
    articles = get_articles(conn, limit=3)
    
    if not articles:
        print("沒有待發布的文章，先執行 threads-rss-fetcher.py")
        conn.close()
        return
    
    posts = []
    for article_id, title, url, source, summary in articles:
        print(f"  生成：{title[:50]}...")
        post = generate_post(title, source, summary)
        posts.append(post)
        # 標記為已處理（還沒真的發布）
        c = conn.cursor()
        c.execute("UPDATE articles SET posted = 1 WHERE id = ?", (article_id,))
        conn.commit()
        print(f"  ✓ 完成")
    
    # 保存草稿
    with open(DRAFT_FILE, 'w', encoding='utf-8') as f:
        f.write(f"Threads 推文草稿 - {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
        f.write("="*50 + "\n\n")
        for i, post in enumerate(posts, 1):
            f.write(f"【推文 {i}】\n{post}\n\n")
    
    print(f"\n✓ 已生成 {len(posts)} 篇推文")
    print(f"✓ 草稿保存：{DRAFT_FILE}")
    conn.close()

if __name__ == "__main__":
    main()