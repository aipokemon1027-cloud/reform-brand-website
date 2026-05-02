# Vibe Coding 流程：Stitch + AI Studio + Antigravity

> 完整文檔。來源：APP 从 0 → 上线发布！免费Vibe Coding 流程（YouTube, 2026-01-10）

---

## 五步流程總覽

```
想法 → Stitch（UI設計）→ AI Studio（前端）→ Antigravity（後端+資料庫）→ GitHub（版本）→ Vercel（部署）
```

---

## Step 1：Stitch — AI UI 設計

### 入口
- Google Stitch：https://stitch.withgoogle.com/

### 操作流程

1. **新建專案** → 輸入 App 名稱和描述
2. **選擇 AI 模型**（Gemini 2.5/3）→ 輸入設計需求
3. **生成 UI 頁面**（歡迎頁、列表頁、詳情頁、個人中心）
4. **編輯修改**：圈選區塊 → AI 對話修改（文字、刪除品類等）
5. **熱圖分析**：Predict Heatmap 預測用戶注意力熱點
6. **導出**：
   - Figma 文件（`.fig`）
   - HTML 程式碼（給 AI Studio）
   - HTML to Figma 插件（效果最好）

### 注意事項
- Stitch 產生的設計稿是**相互獨立的頁面**，頁面之間沒有關聯
- 需要 AI Studio 將頁面組織成整體

---

## Step 2：Google AI Studio — 前端程式碼生成

### 入口
- https://aistudio.google.com/

### 操作流程

1. **導入設計**：Stitch 選擇所有頁面 → 導出 → Build with AI Studio
2. **選擇模型** → 點擊執行
3. **生成前端代碼**：HTML/CSS/JS 可交互頁面
4. **交互調整**：對話修復問題（如按鈕跳轉邏輯）
5. **下載代碼** → 準備導入 Antigravity

### 注意事項
- 如果圖片沒顯示，需手動修復

---

## Step 3：Antigravity — 後端邏輯 + 資料庫

### 操作流程

1. **導入前端代碼** → AI 分析需求
2. **生成後端架構**：
   - API 接口
   - 資料處理邏輯
   - 資料庫結構（Schema）
3. **確認執行計劃** → 點擊 Proceed
4. **配置 .env**：填入 Supabase 的 Database URL 和 API Key
5. **初始化資料庫**：複製 `init.sql` → Supabase SQL Editor 執行
6. **本地測試**：`npm run dev`

### 資料庫（Supabase）

1. 新建專案：https://supabase.com/
2. 獲取：Settings → Data API → Database URL
3. 獲取：Settings → API → service_role API Key
4. 在 SQL Editor 執行 init.sql 建立資料表

---

## Step 4：GitHub — 版本控制

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:username/repo.git
git push -u origin main
```

---

## Step 5：Vercel — 部署

1. Vercel 連結 GitHub 專案
2. 配置：
   - Build Command: `npm run build`
   - Environment Variables: 所有 .env 變數
3. 點擊 Deploy → 取得公開 URL

---

## 工具鏈

| 階段 | 工具 | 費用 |
|------|------|------|
| UI 設計 | Stitch | 免費（每日 400 積分）|
| 前端開發 | Google AI Studio | 免費 |
| 後端開發 | Antigravity | 免費/部分付費 |
| 資料庫 | Supabase | 免費層級 |
| 版本控制 | GitHub | 免費 |
| 部署 | Vercel | 免費（Hobby Plan）|

**總成本：$0**

---

## 相關資源

- 原始影片：https://www.youtube.com/watch?v=LRmp2ob8-b0
- 詳細教學：https://tenten.co/learning/vibe-coding-stitch-ai-studio-antigravity/
- 圖文筆記：https://lilys.ai/zh/notes/vibe-coding-20260203/app-launch-vibe-coding-stitch-ai-antigravity