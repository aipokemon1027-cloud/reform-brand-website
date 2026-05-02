# Threads AI 資訊自動發文系統 - 完整流程文檔

## 📋 系統概覽

| 項目 | 內容 |
|------|------|
| **帳號** | @pokenews2026 |
| **用途** | AI / 科技新聞自動發布 |
| **資料庫** | `~/openclaw/workspace/threads-ai-news.db` |
| **RSS 來源** | The Verge, TechCrunch, Wired, arxiv, Product Hunt, 36kr, PingWest |
| **資料庫總量** | 50 篇（4 篇已發布） |

---

## 🔄 完整流程

```
RSS 抓取 → 文章評分 → 內容生成（MiniMax）→ 瀏覽器自動發布（opencli operate）
```

---

## 第一步：RSS 抓取

### 腳本
```bash
python3 ~/openclaw/workspace/scripts/threads-rss-fetcher.py
```

### 說明
- 一次抓取 7 個來源，每個來源最多 10 篇
- 存入 `threads-ai-news.db`
- 欄位：`id`, `title`, `url`, `source`, `summary`, `published`, `fetched_at`, `score`, `posted`

### RSS 來源
| 來源 | 網址 | 權重 |
|------|------|------|
| The Verge | https://www.theverge.com/rss/index.xml | 9 |
| TechCrunch | https://techcrunch.com/feed/ | 9 |
| Wired | https://www.wired.com/feed/rss | 8 |
| arxiv | https://feeds.arxiv.org/cs/AI/recent | 5 |
| Product Hunt | https://www.producthunt.com/feed | 9 |
| 36kr | https://www.36kr.com/feed | 8 |
| PingWest | https://www.pingwest.com/feed | 7 |

---

## 第二步：文章評分

### 評分公式
```
分數 = 來源權重 × 10 + 熱門關鍵字 × 15 - 冷門關鍵字 × 20
```

### 熱門關鍵字（+15 分/個）
AI, Robot, GPT, Apple, Google, 小米, 華為, Meta, OpenAI, 晶片, 智慧, 機器人

### 冷門關鍵字（-20 分/個）
論文, 學術, PDF, arXiv, 預印本

### 範例
- The Verge 轉載 OpenAI 新聞：9×10 + 15 = **105 分**
- arxiv 數學論文：5×10 - 20 = **30 分**

---

## 第三步：內容生成（MiniMax）

### 腳本
```bash
python3 ~/openclaw/workspace/scripts/threads-content-generator.py
# 或全自動版
python3 ~/openclaw/workspace/scripts/threads-auto-poster.py
```

### 生成 prompt 邏輯
- 使用 `opencli gemini ask` 呼叫 MiniMax-M2.7
- 要求：繁體中文、80-130 字、口語化、第一行引發好奇心
- 格式：Hook → 內容 → CTA → 🔗 + 網址 → hashtags

### 產出格式範例
```
🤯 AI 居然可以自己寫 Prompt 了？

OpenAI 新推出的實驗功能，讓 AI 幫你優化 Prompt工程師都在討論這個...

你用過嗎？留言分享 👇

🔗 完整文章：https://techcrunch.com/xxx

#AI #OpenAI #ChatGPT #科技趨勢
```

---

## 第四步：瀏覽器自動發布（opencli operate）

### ⚠️ 關鍵：為什麼用 opencli operate 而不是 CDP fill

Threads 使用 React contenteditable 元件。CDP（browser tool）的 `fill` 指令對 React 無效——回傳 `ok: true` 但欄位依舊空白。

`opencli operate` 使用不同的 CDP 連線，能正確處理 React 元件。

### 指令流程
```bash
# 1. 開啟 Threads 頁面
opencli operate open https://www.threads.com/@pokenews2026

# 2. 等待頁面載入（確認不是 splash screen）
opencli operate state | grep barcelona-splash-screen  # 有內容 = 還在 splash
sleep 3

# 3. 點擊「建立新串文」按鈕（index 16）
opencli operate click 16

# 4. 等待發文框出現
sleep 2

# 5. 在文字框輸入內容（index 1073）
opencli operate type 1073 "你的推文內容"

# 6. 驗證內容有沒有輸入
opencli operate eval "document.querySelector('[role=textbox][contenteditable]')?.textContent"

# 7. 點擊發布（index 1098）
opencli operate click 1098

# 8. 等待幾秒確認發布成功
sleep 5

# 9. 確認 Post ID
opencli operate state | grep 'post/DXS'
```

### 元素索引參考
| 元素 | Index |
|------|-------|
| 建立新串文（主頁按鈕） | 16 |
| 文字輸入框 | 1073 |
| 發布按鈕 | 1098 |

### 驗證方式
發布成功後，URL 會變成 `https://www.threads.com/@pokenews2026/post/DXS...`

---

## 第五步：記錄保存

### 自動產生的檔案
- **發布記錄**：每篇發布後自動保存到 `~/openclaw/workspace/logs/published/YYYY-MM-DD_HH-MM-SS.txt`
- **完整日誌**：`~/openclaw/workspace/logs/threads-post.log`

### 資料庫狀態更新
- `posted = 1`（標記為已發布，避免重複）

---

## 全自動一鍵執行

```bash
python3 ~/openclaw/workspace/scripts/threads-full-auto.py
```

或手動分步執行：
```bash
# Step 1: 抓 RSS
python3 ~/openclaw/workspace/scripts/threads-rss-fetcher.py

# Step 2: 生成並發布
python3 ~/openclaw/workspace/scripts/threads-auto-poster.py
```

---

## 資料庫查詢

```bash
# 查看未發布文章
sqlite3 ~/openclaw/workspace/threads-ai-news.db "SELECT id, title, source FROM articles WHERE posted = 0 LIMIT 5;"

# 查看已發布文章
sqlite3 ~/openclaw/workspace/threads-ai-news.db "SELECT id, title, posted FROM articles WHERE posted = 1;"

# 查看統計
sqlite3 ~/openclaw/workspace/threads-ai-news.db "SELECT COUNT(*) as total, SUM(posted=1) as posted FROM articles;"

# 重置所有文章為未發布（用於重新測試）
sqlite3 ~/openclaw/workspace/threads-ai-news.db "UPDATE articles SET posted = 0;"
```

---

## 常見問題

### Q: CDP fill 無法輸入文字到 Threads
A: 正常。Threads 是 React contenteditable，CDP fill 對此無效。使用 `opencli operate` 替代。

### Q: 如何確認瀏覽器已登入？
A: 執行 `opencli operate open https://www.threads.com` 並截圖確認。

### Q: 發布按鈕 index 不是 1098？
A: 先執行 `opencli operate state | grep -E '發布|發佈|publish'` 動態查找。

### Q: 想手動審查內容再發布？
A: 執行 `threads-content-generator.py` 而非 `threads-auto-poster.py`，草稿會保存在 `threads-posts-draft.txt`。

---

## 檔案位置總整理

| 檔案 | 路徑 |
|------|------|
| 資料庫 | `~/openclaw/workspace/threads-ai-news.db` |
| RSS 抓取腳本 | `~/openclaw/workspace/scripts/threads-rss-fetcher.py` |
| 內容生成腳本 | `~/openclaw/workspace/scripts/threads-content-generator.py` |
| 自動發布腳本 | `~/openclaw/workspace/scripts/threads-auto-poster.py` |
| 全自動腳本 | `~/openclaw/workspace/scripts/threads-full-auto.py` |
| 草稿輸出 | `~/openclaw/workspace/threads-posts-draft.txt` |
| 發布日誌 | `~/openclaw/workspace/logs/threads-post.log` |
| 發布記錄（每篇） | `~/openclaw/workspace/logs/published/YYYY-MM-DD_HH-MM-SS.txt` |

---

*最後更新：2026-04-19 by jojo*
