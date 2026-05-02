#!/usr/bin/env python3
"""
Threads AI 資訊自動發文系統 - RSS 抓取器
作者：jojo / OpenClaw
日期：2026-04-19
"""

import feedparser
import sqlite3
from datetime import datetime
import os

DB_PATH = os.path.expanduser("~/openclaw/workspace/threads-ai-news.db")

RSS_SOURCES = [
    "https://www.theverge.com/rss/index.xml",
    "https://techcrunch.com/feed/",
    "https://www.wired.com/feed/rss",
    "https://feeds.arxiv.org/cs/AI/recent",
    "https://www.producthunt.com/feed",
    "https://www.36kr.com/feed",
    "https://www.pingwest.com/feed",
]

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            url TEXT UNIQUE,
            source TEXT,
            summary TEXT,
            published DATETIME,
            fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            score INTEGER DEFAULT 0,
            posted BOOLEAN DEFAULT 0
        )
    """)
    conn.commit()
    return conn

def fetch_rss(conn):
    total_saved = 0
    for rss_url in RSS_SOURCES:
        try:
            feed = feedparser.parse(rss_url)
            source_name = feed.feed.get('title', rss_url)
            c = conn.cursor()
            for entry in feed.entries[:10]:
                url = entry.get('link', '')
                title = entry.get('title', '')
                summary = entry.get('summary', '')[:500] if entry.get('summary') else ''
                published = entry.get('published', datetime.now().isoformat())
                if url and title:
                    c.execute("""
                        INSERT OR IGNORE INTO articles (title, url, source, summary, published)
                        VALUES (?, ?, ?, ?, ?)
                    """, (title, url, source_name, summary, published))
            conn.commit()
            saved = len(feed.entries[:10])
            total_saved += saved
            print(f"  ✓ {source_name}: {saved} 篇")
        except Exception as e:
            print(f"  ✗ {rss_url}: {e}")
    return total_saved

def main():
    print(f"[{datetime.now().strftime('%H:%M:%S')}] 開始抓取 RSS...")
    conn = init_db()
    total = fetch_rss(conn)
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM articles WHERE posted = 0")
    unposted = c.fetchone()[0]
    print(f"\n完成！抓取 {total} 篇，未發布 {unposted} 篇")
    conn.close()

if __name__ == "__main__":
    main()