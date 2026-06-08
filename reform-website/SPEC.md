# reform. 品牌網站 - 完整規格書
## Version 5.0 — Cinematic Brand Experience

---

## 1. 品牌核心定位

**品牌名稱：** reform.
**標語：** be the reform
**核心價值：** 重新定義你的每一次練習

**目標客群：**
- 女性，25-40歲
- Pilates / Yoga 愛好者
- 注重生活美學與品質
- 願意為質感付出溢價
- 喜歡簡約、有故事的設計
- 台北/台灣市場為主

**品牌個性：**
- 温柔但有力量
- 简约但精緻
- 運動但不失優雅
- 現代但有溫度

---

## 2. 視覺風格 - 「電影化品牌美學」

### Overall Aesthetic
以電影感的節奏與光影為核心，融合時尚雜誌的排版節制，創造「安靜但有張力」的視覺體驗。

### 關鍵元素
- **光影對比**：明亮的場景搭配深色的情緒區塊，模擬電影的對比度
- **節奏感留白**：大量留白創造呼吸感，但適時用密集內容創造戲劇張力
- **膠片質感**：微妙的顆粒感、暈影、色彩溢出，營造電影膠片感
- **動態字幕**：文字如電影標題般緩緩浮現
- **景深效果**：前景/背景虛化，模擬淺景深攝影

### Typography
- **主標題：** Cormorant Garamond（襯線字體，電影感強）
- **副標題/內文：** Inter（現代、簡潔）
- **特殊數字：** 光學數字字體
- **字重對比**：300 (light) 到 600 (semibold) 的對比使用

### Spacing System
- Base unit: 8px
- Section padding: 120px (desktop) / 80px (tablet) / 48px (mobile)
- Content max-width: 1440px
- Grid: 12-column with 24px gutters

---

## 3. 色彩系統 - 「柔光電影調色板」

### 主色調（Primary Palette）

| 名稱 | 色值 | 用途 |
|------|------|------|
| **Cream White** | `#FAF8F5` | 主背景、乾淨區塊 |
| **Soft Blush** | `#F5E6E0` | 次要背景、卡片底色 |
| **Light Pink** | `#F2D4D0` | 強調色、hover 狀態 |
| **Dusty Rose** | `#D4A5A5` | 按鈕、連結、品牌元素 |
| **Muted Lavender** | `#C5B8D9` | 裝飾、hover 次要色 |
| **Deep Plum** | `#3D2C3D` | 主要文字、深度區塊 |
| **Charcoal** | `#2A2A2A` | 副文字、功能性元素 |

### 電影氛圍色調（Cinematic Accents）

| 名稱 | 色值 | 用途 |
|------|------|------|
| **Warm Glow** | `#E8D5C4` | 光暈效果、漸層起點 |
| **Golden Hour** | `#C9A87C` | 金色高光、品牌強調 |
| **Film Grain** | `rgba(0,0,0,0.03)` | 膠片顆粒疊加層 |
| **Vignette** | `radial-gradient` | 邊緣暈影效果 |

### 情緒區塊（Dark Sections）

| 名稱 | 色值 | 用途 |
|------|------|------|
| **Deep Night** | `#1A1A1F` | 電影化深色區塊背景 |
| **Soft Black** | `#242428` | 卡片、對話框背景 |
| **Twilight** | `#2D2D35` | 深色模式中的次要 |

---

## 4. 頁面結構

### 首頁 (index.html)
- Hero Section（英雄區 - 全屏電影感）
- Brand Statement（品牌宣言 - 節奏感的文字展示）
- Philosophy Grid（哲學區 - 2x2電影膠片網格）
- Product Showcase（產品展示 - 電影海報牆）
- Journal Preview（日誌預覽 - 電影預告片風格）
- Footer（頁腳 - 電影結束後的字幕）

### 關於頁 (about.html)
- Brand Film（品牌電影區 - 全屏敘事視頻）
- Origin Story（起源故事 - 時間線章節）
- Team（團隊 - 人物訪談卡片）
- Values（價值觀 - 電影場景式展示）

### 產品頁 (products.html)
- Product Grid（產品網格 - 電影膠片牆）
- Filter System（篩選系統 - 電影類型風格）
- Quick View Modal（快速查看 - 電影預覽彈窗）

### 日誌/部落格 (blog.html)
- Featured Article（精選文章 - 電影精選預告）
- Article Grid（文章網格 - 電影膠片牆）
- Categories（分類 - 電影類型標籤）

### 品牌體驗 Dashboard（dashboard.html）
- Brand Mood（品牌情緒板 - 視覺化情緒牆）
- Style Guide（品牌風格指南 - 互動式展示）
- Color System（色彩系統 - 可視化色板）
- Typography Lab（字體實驗室 - 字體展示）
- Motion Library（動效庫 - 動畫示範）
- Component Gallery（組件畫廊 - UI 組件展示）

---

## 5. 動效系統

### 滾動動效 (Scroll Effects)
- **Parallax Scrolling**: 背景與前景以不同速度滾動
- **Reveal on Scroll**: 元素進入視口時緩慢浮現（opacity 0→1, translateY 40px→0, 600ms ease-out）
- **Staggered Reveal**: 網格元素依序出現（每個元素 delay 100ms）
- **Horizontal Scroll**: 部分區塊使用水平滾動

### Hover 動效
- **光暈效果 (Glow Effect)**: 卡片 hover 時邊緣發出柔和光暈
- **透視傾斜 (3D Tilt)**: 卡片 hover 時輕微傾斜（max 5deg）
- **文字浮現**: Hover 時次要文字緩慢顯示
- **圖片縮放**: 圖片 hover 時輕微放大（scale 1.02）

### 頁面過渡
- **Fade In/Out**: 頁面間的淡入淡出（400ms）
- **Slide Transitions**: 內容區塊的水平滑動
- **Film Reel Effect**: 特殊的膠片過渡效果

### 微互動
- **按鈕脈衝**: CTA 按鈕有微妙的呼吸動畫
- **載入指示器**: 電影風格的載入進度條
- **打字機效果**: 標題文字如打字般出現
- **漂浮元素**: 裝飾元素有微妙的漂浮動畫

---

## 6. 技術實現

### 前端技術棧
- HTML5 + CSS3 + Vanilla JavaScript
- CSS Variables for theming
- CSS Grid + Flexbox for layout
- Intersection Observer for scroll animations
- CSS animations + JS for complex effects

### 動效實現
- CSS @keyframes 定義基本動畫
- Intersection Observer API 觸發滾動動畫
- requestAnimationFrame 處理複雜動畫
- CSS transitions 處理 hover 效果

### 性能優化
- 圖片 lazy loading
- CSS will-change 提示瀏覽器優化
- 動畫使用 transform/opacity 避免重排
- 資源預加載（preload critical assets）

---

## 7. 響應式策略

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: 1024px - 1440px
- Large: > 1440px

### 適配策略
- Mobile: 單欄佈局、簡化動效、觸控優化
- Tablet: 雙欄佈局、保留核心動效
- Desktop: 完整體驗、所有動效
- Large: 最大寬度限制、更多留白

---

## 8. 內容策略

### 品牌語氣
- 温柔但有力量
- 簡潔但有深度
- 運動但不失優雅
- 現代但有溫度

### 圖像風格
- 明亮、自然光
- 淺景深（shallow depth of field）
- 柔和色調（soft tones）
- 極簡背景
- 強調產品質感

### 文案調性
- 雙語並行（中文為主、英文為輔）
- 詩意的描述
- 電影化標題
- 短句優先