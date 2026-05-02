#!/usr/bin/env python3
"""
GitHub 知識探索脚本
自動搜尋、學習、記錄有趣的開源項目
"""

import subprocess
import json
import os
from datetime import datetime
import re

GITHUB_KNOWLEDGE_DB = os.path.expanduser("~/openclaw/workspace/knowledge/github-discoveries.json")
LOG_FILE = os.path.expanduser("~/openclaw/workspace/knowledge/github-log.md")

TOPICS = [
    "AI-agent", "open-source-ai", "ChatGPT", "Cursor-AI", "Claude-Code",
    "raspberry-pi", "home-automation", "smart-home",
    "productivity", "automation", "workflow",
    "twitter-bot", "instagram-bot", "social-media-automation",
    "web-scraper", "api-client",
    "python", "javascript", "typescript",
]

def log(msg):
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"[{datetime.now().strftime('%Y-%m-%d %H:%M')}] {msg}\n")
    print(msg)

def run(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=60)
    return result.stdout.strip()

def search_github(query, limit=5):
    """用 GitHub API 搜尋項目(公開 repos 不需登入)"""
    import urllib.parse
    encoded = urllib.parse.quote(query)
    url = f"https://api.github.com/search/repositories?q={encoded}&sort=stars&per_page={limit}"
    out = run(f"curl -s '{url}' 2>/dev/null")
    try:
        data = json.loads(out)
        items = data.get('items', [])
        return [
            {
                'name': r['full_name'],
                'url': r['html_url'],
                'description': r.get('description', ''),
                'stars': r.get('stargazers_count', 0),
                'language': r.get('language', '')
            }
            for r in items
        ]
    except:
        return []

def summarize_description(repo_name, description):
    """用 MiniMax 將 description 翻譯並美化"""
    if not description:
        return None
    
    prompt = f"項目：{repo_name}\n描述：{description[:300]}\n\n請用繁體中文用 30-50 字總結這個項目，重點是什麼、有什麼特色。用一般人的語言，不是翻譯。"
    
    try:
        out = run(f'''opencli gemini ask {json.dumps(prompt)}''')
        if out and len(out) > 10:
            return out.strip()[:100]
    except:
        pass
    return None

def load_knowledge_db():
    if os.path.exists(GITHUB_KNOWLEDGE_DB):
        with open(GITHUB_KNOWLEDGE_DB, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"discoveries": [], "last_update": None}

def save_knowledge_db(db):
    os.makedirs(os.path.dirname(GITHUB_KNOWLEDGE_DB), exist_ok=True)
    with open(GITHUB_KNOWLEDGE_DB, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

def add_discovery(repo_name, url, description, summary, stars, language):
    db = load_knowledge_db()

    # 避免重複
    existing = [d for d in db["discoveries"] if d["url"] == url]
    if existing:
        return False

    db["discoveries"].append({
        "name": repo_name,
        "url": url,
        "description": description[:200] if description else "",
        "summary": summary,
        "stars": stars,
        "language": language,
        "discovered_at": datetime.now().strftime("%Y-%m-%d")
    })
    db["last_update"] = datetime.now().strftime("%Y-%m-%d %H:%M")

    # 按 stars 排序
    db["discoveries"].sort(key=lambda x: x.get("stars", 0), reverse=True)

    # 只保留前 50 個
    db["discoveries"] = db["discoveries"][:50]

    save_knowledge_db(db)
    return True

def explore_topic(topic, limit=3):
    """探索一個主題"""
    log(f"探索主題:{topic}")
    repos = search_github(topic, limit=limit)

    if not repos:
        # Try alternative search
        repos = search_github(f"{topic} awesome", limit=limit)

    added = 0
    for repo in repos[:limit]:
        name = repo.get("name", "")
        url = repo.get("url", "")
        desc = repo.get("description", "")
        stars = repo.get("stars", 0)
        lang = repo.get("language", "")

        if not name or not url:
            continue

        log(f"  發現:{name} ⭐{stars}")

        if add_discovery(name, url, desc, desc[:100], stars, lang):
            added += 1
            log(f"    ✓ 新增:{desc[:60]}...")
        else:
            log(f"    - 已存在")

    return added

def main():
    log("=" * 50)
    log("GitHub 知識探索開始")

    total_added = 0
    for topic in TOPICS:
        try:
            added = explore_topic(topic)
            total_added += added
        except Exception as e:
            log(f"  錯誤:{e}")

    log(f"\n完成!本次新增 {total_added} 個發現")

    # 顯示前 5 名
    db = load_knowledge_db()
    if db["discoveries"]:
        log("\n熱門發現 TOP 5:")
        for i, d in enumerate(db["discoveries"][:5], 1):
            log(f"  {i}. {d['name']} ⭐{d['stars']}")
            if d.get('summary'):
                log(f"     {d['summary'][:60]}...")

if __name__ == "__main__":
    main()
