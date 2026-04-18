# reform. 網站變更日誌

## v2 — 2026-04-16
**主題：** ESTUDIO ANÓNIMO 風格重新設計

### 變更內容
- **Hero：** 全屏 100dvh、左側對齊超大襯線字（playfair Display → Cormorant Garamond）
- **設計語言：** 去除模板感、非居中佈局、雜誌感排版、大量留白
- **色彩：** 柔粉 #F5E6E8 / 薰衣草 #E8E0F0 / 米白 #FDFBF7 / 炭灰 #2D2D2D / 玫瑰 #C4A4A4
- **動效：** 極度克制（僅 hover scale 1.03、scroll 呼吸動畫、nav 滑動隱藏）
- **字體：** Cormorant Garamond（襯線）+ Inter（無襯線）
- **所有頁面：** Home / About / Products / Blog / Contact 同步更新
- **Products：** 加入篩選器（All / Grip Socks / Gift / Accessories）
- **Blog：** Featured 大圖區塊 + 網格文章列表
- **Contact：** 表單 + FAQ 折疊組件

### 部署
- URL: https://aipokemon1027-cloud.github.io/reform-brand-website/
- Branch: gh-pages

---

## v1 — 2026-04-12
**主題：** 初始版本（品牌網站骨架）

### 內容
- 5 個頁面：Home / About / Products / Blog / Contact
- 基礎的品牌視覺設定
- 粉色系配色

### 狀態
已被 v2 覆蓋

---

## v3.1 — 2026-04-19
**主題：** 圖片填充優化

### 變更內容
- **Gemini Nano 2 生成品牌圖片：** 4張圖片填入所有頁面占位符
- **首頁：** 3個 preview 圖片更新為真實產品照
- **商品頁：** 6個商品圖片更新為真實產品照
- **Blog：** 6個文章卡片圖片 + 1個 Featured 圖片更新
- **About：** 團隊成員頭像更新
- **新增 CSS：** `.preview-img-src`, `.product-img-src`, `.blog-card-img-src`, `.blog-featured-img-src`, `.about-img-src`, `.about-team-img-src`

### 生成圖片
- `reform-product-01.png` — 白色大理石背景產品照
- `reform-gift-set.png` — 禮盒組生活風格照
- `reform-lifestyle-hero.png` — 生活風格場景照
- `reform-product-detail.png` — 產品細節特寫

---

## v3 — 2026-04-17
**主題：** Glossier 風格 Hover 互動優化

### 變更內容
- **導航連結：** hover 時底線從左側滑入（::after + scaleX）
- **商品卡片 hover：** 卡片上浮 + 陰影加深 + 名稱變玫瑰色
- **Journal 文章列表：** 滑鼠移入時底線加深 + 標題變色
- **箭頭 icon：** hover 時向右滑動（translateX: 4px）
- **Footer 連結：** opacity 過渡（0.7 → 1）
- **Blog 卡片：** 陰影上浮 + 標題變色

### 設計參考
- Glossier.com — 乾淨的 hover 回饋、白色卡片陰影上浮效果

### 版本管理
- 同步更新 `current/` 資料夾
- `main` branch 最新 commit: 3cc837a

