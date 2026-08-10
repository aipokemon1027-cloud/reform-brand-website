# Zie619/n8n-workflows 研究記錄

## 基本資訊

| 項目 | 內容 |
|------|------|
| **Repo** | https://github.com/Zie619/n8n-workflows |
| **Stars** | 54,838 ⭐ |
| **Forks** | 7,231 |
| **描述** | all of the workflows of n8n i could find (also from the site itself) |
| **官方網站** | https://zie619.github.io/n8n-workflows |
| **Latest Tag** | dmca-compliance-2025-08-14 |
| **License** | MIT |

---

## 內容規模

| 指標 | 數量 |
|------|------|
| Workflows | 4,343+ |
| Integrations | 365+ |
| Total Nodes | 29,445 |
| Categories | 15 |

---

## Categories（分類目錄）

行銷、銷售、開發維運、資料庫、社群平台、通訊、電商、雲端服務、AI、檔案處理、支付、行政、人力資源、生產力工具等。

完整分類清單：
> Activecampaign, Acuityscheduling, Affinity, Airtable, Amqp, Asana, Automate, Awsrekognition, Awss3, Awssns, Bannerbear, Bitly, Calendar, Chargebee, Clickup, Code, Coingecko, Crypto, Customerio, Datetime, Discord, Dropbox, Email, Figma, Filter, Form, Function, Github, Gmail, Googleanalytics, Googlebigquery, Googlecalendar, Googlecontacts, Googledocs, Googledrive, Googlesheets, Gotowebinar, Graphql, Gumroad, Http, Hubspot, Intercom, Jira, Lemlist, LinkedIn, Mailchimp, Matrix, Mautic, Microsoft, Mondaycom, Mongodb, Mqtt, MySQL, Newsletter, Notion, Odoo, Openai, Paypal, Pipedrive, Postgres, Postmark, Quickbooks, Redis, RSS, Schedule, Sendgrid, Shopify, Slack, Spreadsheet, Stripe, Supabase, Telegram, Todoist, Toggl, Trello, Twilio, Twitter, Typeform, Webhook, Wise, Woocommerce, WordPress, XML, YouTube, Zendesk, Zohocrm...

---

## 使用方式

### 方式一：線上使用（最簡單，無需安裝）

1. 前往 https://zie619.github.io/n8n-workflows
2. 使用搜尋功能找想要的 workflow
3. 點擊下載 JSON 檔案
4. 匯入到 n8n

支援功能：
- 智慧搜尋（< 100ms 回應）
- 15+ 分類過濾
- 複雜度過濾（低 ≤5 nodes / 中 6-15 / 高 16+）
- Trigger 類型過濾（Webhook / Schedule / Manual / Complex）
- Service 過濾（365+ 整合）

### 方式二：本地安裝

#### 前提條件
- Python 3.9+
- pip
- 100MB 磁碟空間

#### Step by Step

```bash
# 1. Clone 回來
git clone https://github.com/Zie619/n8n-workflows.git
cd n8n-workflows

# 2. 安裝依賴
pip install -r requirements.txt

# 3. 啟動服務
python run.py

# 4. 開瀏覽器
# http://localhost:8000
```

#### Docker 安裝

```bash
# 方式A：直接用 Docker Hub
docker run -p 8000:8000 zie619/n8n-workflows:latest

# 方式B：本地 build
docker build -t n8n-workflows .
docker run -p 8000:8000 n8n-workflows
```

---

## 匯入 n8n 方法

1. 開啟 n8n（通常 http://localhost:5678）
2. 左側選單 → Workflows
3. 點擊右上角「Import from JSON」
4. 貼上下載的 workflow JSON
5. 點擊儲存

---

## API Endpoints（本地安裝後可用）

| Endpoint | Method | 說明 |
|----------|--------|------|
| `/` | GET | Web 介面 |
| `/api/search` | GET | 搜尋 workflows |
| `/api/stats` | GET | 統計資訊 |
| `/api/workflow/{id}` | GET | 取得 workflow JSON |
| `/api/categories` | GET | 分類列表 |
| `/api/export` | GET | 匯出 workflows |

---

## AI-BOM 安全掃描工具

此 Repo 附帶 AI-BOM（Apache 2.0 開源），專門掃描 n8n 工作流中的 AI 安全風險。

### 安裝方式
```bash
pip install ai-bom
ai-bom scan ./workflows/
```

### 偵測項目

| 風險 | 嚴重性 | 說明 |
|------|--------|------|
| AI Agent nodes | CRITICAL | 連接 LLM 並有工具存取權限的 Agent |
| Hardcoded credentials | CRITICAL | API Key 直接寫在 workflow JSON 而非 credential store |
| Dangerous tool combos | CRITICAL | Agent + Code Execution + HTTP Request = RCE 風險 |
| MCP clients | HIGH | Model Context Protocol 連接外部未知伺服器 |
| Unauthenticated webhooks | HIGH | 暴露在網路上的 Webhook trigger 未認證 |
| Agent chains | HIGH | Execute Workflow 串聯 Agent 但無輸入驗證 |

輸出格式：CycloneDX SBOM / SARIF / HTML Dashboard / Markdown / JSON

---

## 技術架構

```
n8n-workflows/
├── workflows/              # 4,343 個 workflow JSON 檔案（按 category 分目錄）
├── src/                    # 原始碼
├── static/                 # 靜態檔案
├── templates/              # 模板
├── docs/                   # 文件
├── scripts/                # 腳本
├── ai-stack/              # AI 堆疊相關
├── medcards-ai/           # 醫療卡 AI
├── api_server.py          # FastAPI 伺服器
├── run.py                  # 啟動腳本
├── requirements.txt        # Python 依賴
├── Dockerfile              # Docker 映像
├── docker-compose.yml     # Docker Compose 設定
└── CLAUDE.md / CLAUDE_ZH.md  # AI 助手說明文件
```

### Tech Stack
- **Backend**: Python, FastAPI, SQLite with FTS5
- **Frontend**: Vanilla JS, Tailwind CSS
- **Database**: SQLite with Full-Text Search
- **Deployment**: Docker, GitHub Actions, GitHub Pages
- **Security**: Trivy scanning, CORS protection, Input validation

---

## 與 reform. 的關聯

目前 reform. 品牌處於視覺/電商建立階段，n8n 自動化工作流**暫時用不上**。

### 未來可能應用場景：
- **庫存通知**：當 Pilates grip socks 庫存低於某數量時自動通知
- **客户資料整理**：收集 IG/Threads 粉絲資料到 Google Sheets
- **訂單處理**：接到訂單後自動發 email 確認
- **社群數據分析**：定期抓取 reform. 相關數據做報告

---

## 參考資料

- Repo: https://github.com/Zie619/n8n-workflows
- 官網: https://zie619.github.io/n8n-workflows
- AI-BOM: https://github.com/Trusera/ai-bom
- n8n 官網: https://n8n.io
- n8n 文件: https://docs.n8n.io
- n8n 社群: https://community.n8n.io

---

*最後更新：2026-05-28*