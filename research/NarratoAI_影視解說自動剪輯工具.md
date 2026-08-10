# NarratoAI — AI 影視解說自動剪輯工具

## 基本資料

- **GitHub：** https://github.com/linyqh/NarratoAI
- **雲端版：** https://www.narratoai.cn
- **最新版本：** v0.7.9（2026.04.27）
- ** LICENSE：** 僅供學習研究，嚴禁商用

---

## 這個工具是做什麼的

一站式 AI 影視創作工具，一鍵完成：

```
輸入影片 → AI 分析內容 → 自動生成文案（解說詞）→ 智能剪輯 → AI 配音 → 字幕生成 → 輸出成片
```

---

## 核心功能一覽

| 功能 | 說明 |
|------|------|
| **AI 文案生成** | 基於 LLM（DeepSeek/GPT/Qwen 等）自動產生影視解說文案 |
| **自動化剪輯** | 分析影片、切除廢鏡頭、拼接精華段落 |
| **多引擎配音（TTS）** | edge-tts、騰訊雲 TTS、語音克隆（IndexTTS2） |
| **字幕生成** | Fun-ASR 一鍵轉錄，支援繁體中文 |
| **短劇解說/混剪** | 支援短劇內容創作 |
| **Qwen2-VL 影片理解** | 阿里 VL 模型理解影片內容與情節 |
| **剪映草稿導出** | 可導出為剪映草稿格式 |

---

## 系統需求

- **OS：** macOS 11.0+ / Windows 10/11
- **Python：** 3.12+
- **CPU：** 4核心以上（非必須顯卡）
- **RAM：** 8G 以上
- **磁碟：** 約 5-10GB（主要為 ffmpeg + Python 依賴）

---

## 安裝方式

### 方式一：macOS Docker 部署（推薦）

```bash
# 1. 克隆項目
git clone https://github.com/linyqh/NarratoAI.git
cd NarratoAI

# 2. 一鍵部署
docker compose up -d

# 3. 訪問應用
# 瀏覽器打開 http://localhost:8501
```

### 方式二：本地運行（Python 直接裝）

```bash
# 1. 克隆項目
git clone https://github.com/linyqh/NarratoAI.git
cd NarratoAI

# 2. 建立虛擬環境（推薦）
python3 -m venv venv
source venv/bin/activate

# 3. 使用 uv 安裝依賴
uv pip install -r requirements.txt

# 4. 複製配置文件
cp config.example.toml config.toml

# 5. 編輯 config.toml，填入你的 API 密鑰
#   需要配置的項目：
#   - LLM API Key（支援 OpenAI 兼容格式）
#   - TTS 配置（騰訊雲 / edge-tts / IndexTTS2）
#   - 影片模型（可選 Qwen2-VL）

# 6. 啟動應用
streamlit run webui.py --server.maxUploadSize=2048

# 7. 瀏覽器打開 http://localhost:8501
```

### 方式三：Windows 整合包

關注微信公眾號 **NarratoAI 助手** → 右下角菜單欄获取下载链接

---

## 支援的 AI 模型

| 模型 | 用途 |
|------|------|
| OpenAI GPT 系列 | 文案生成、對話 |
| DeepSeek R1 / V3 | 文案生成 |
| 阿里 Qwen2-VL | 影片內容理解 |
| Google Gemini | 文案生成 |
| 騰訊雲 TTS | 配音 |
| edge-tts | 免費配音 |
| IndexTTS2 | 語音克隆 |

---

## 使用流程（基本操作步驟）

### Step 1：配置 API

編輯 `config.toml`，填入以下至少一項：

```toml
# LLM 配置（任選一）
OPENAI_API_KEY = "sk-xxxxx"           # OpenAI 格式
DEEPSEEK_API_KEY = "sk-xxxxx"          # DeepSeek

# 或使用 SiliconFlow（性價比高）
SILICONFLOW_API_KEY = "sk-xxxxx"

# Qwen2-VL（如需影片理解）
DASHSCOPE_API_KEY = "sk-xxxxx"

# TTS 配置（任選一）
# edge-tts（免費，預設使用）
# 或騰訊雲 TTS
TENCENTCLOUD_SecretId = "xxx"
TENCENTCLOUD_SecretKey = "xxx"
```

### Step 2：上傳影片

在 WebUI（http://localhost:8501）上傳原始影片檔案。

### Step 3：選擇模式

| 模式 | 說明 |
|------|------|
| **影視解說** | 輸入電影/影集 → AI 生成解说文案 → 剪輯配音 |
| **短劇混剪** | 短劇素材 → 多段剪輯重組 |
| **逐幀分析** | 深度理解影片情節（需 Qwen2-VL） |

### Step 4：設定參數

- 選擇配音引擎與聲音風格
- 設定輸出的影片長度
- 是否保留字幕

### Step 5：生成

點擊生成，AI 會自動完成整個 pipeline，最後輸出成片。

---

## 對 reform. 品牌的應用方向

當 reform. 需要製作品牌形象影片時，NarratoAI 可用於：

1. **產品展示影片配音** — 自動生成英文/中文解說文案 + TTS 配音
2. **幕後花絮剪輯** — 拍攝素材自動剪輯成短片
3. **行銷短片** — 結合品牌故事線，快速產出限時動態素材

---

## 參考價值

基於以下項目重構而來，感謝開源精神：

- [MoneyPrinter](https://github.com/FujiwaraChoki/MoneyPrinter)
- [MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo)

---

## 官方資源

- [英文 README](https://github.com/linyqh/NarratoAI/blob/main/README-en.md)
- [文件（飛書）](https://p9mf6rjv3c.feishu.cn/wiki/SP8swLLZki5WRWkhuFvc2CyInDg)
- [Discord 社群](https://discord.com/invite/V2pbAqqQNb)
- [微信公眾號：NarratoAI助手]

---

## ⚠️ 注意事項

1. **僅供學習研究，不得商用** — 如需商業授權需聯繫作者
2. **當前磁碟空間評估：** MacBook Air 可用空間尚可，安裝前建議確認用 `df -h /Users/nirvanaday`
3. **Python 版本：** 需 3.12+，MacBook Air 預設 Python 版本可能低於 3.12，建議用 `python3 -m venv` 建立乾淨環境
4. **辨別真假：** 近期有不良分子將 NarratoAI 改名後販售，認準 GitHub：linyqh/NarratoAI
5. **SiliconFlow 推廣連結帶邀請碼** — 註冊時填寫邀請碼可享免費額度，但 jojo 不主動推廣第三方邀請連結，使用前請自行評估
