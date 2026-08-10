# Codex + Ollama 免費本地 AI Agent 設定教學

> 資料來源：零度解說｜2026-05-26｜https://www.freedidi.com/24310.html

---

## 方法一（簡單）：Ollama 原生接入 Codex

### Step 1：確認 Codex 已安裝
你的 Mac 已經有 Codex.app，版本 v26.519。

### Step 2：安裝 / 升級 Ollama 0.24+
> ⚠️ 只有 Ollama 0.24+ 才支援 Codex

```bash
# 如果還沒安裝
brew install ollama

# 如果已安裝，升級到最新版
brew upgrade ollama
```

下載備用：https://ollama.com 或 https://pan.quark.cn/s/24bb47c77009

### Step 3：下載模型

**Mac M 系列晶片建議用 mlx 版本（優化過，記憶體效率更好）**

```bash
# Qwen3.6 系列
ollama run qwen3.6:27b-mlx   # 推薦，27B 參數，MLX 優化版
ollama run qwen3.6:35b-mlx   # 更大模型，如果記憶體夠用

# 或 Google Gemma 4
ollama run gemma4:27b-mlx
ollama run gemma4:26b-mlx
```

**其他尺寸：**
- Qwen3.6：https://ollama.com/library/qwen3.6
- Gemma 4：https://ollama.com/library/gemma4

**越獄版（無審查）：**
- Qwen3.6 越獄版：https://pan.quark.cn/s/d971b8a8b139
- Gemma 4 越獄版：https://pan.quark.cn/s/bb2965aa60d7
  > 越獄版適合需要繞過內容審查的開發場景

### Step 4：啟動對接

```bash
ollama launch codex-app
```

這樣 Codex 就會自動透過 Ollama 調用你本地的 Qwen3.6 或 Gemma 4 模型，**完全免費、離線可用**，沒有任何 OpenAI API 消耗。

---

## 方法二（進階）：llama.cpp + Codex 接入越獄版模型

這個方法適合：
- 想跑 Qwen3.6 越獄版（完全無審查）
- 想用更靈活的模型量化（GGUF 格式）
- Windows / Mac 通用

### Step 1：下載 llama.cpp 本地表

```bash
# Mac
brew install llama.cpp

# 或下載編譯好的 binary
# https://github.com/ggerganov/llama.cpp/releases
```

### Step 2：下載 GGUF 模型

從 [HuggingFace](https://huggingface.co/models?other=gguf) 下載你想用的越獄版模型，例如：
- Qwen3.6-27B-UD-Q5_K_XL.gguf
- Gemma-27B-Q5_K_XL.gguf

放到本地資料夾，例如：`~/models/`

### Step 3：修改 Codex 設定檔

開啟 `~/.codex/config.toml`，新增：

```toml
model = "Qwen3.6-27B-UD-Q5_K_XL.gguf"
model_reasoning_effort = "low"       # "low" = 省記憶體，"medium" = 完整推理
profile = "llamacpp-codex"

model_provider = "llamacpp"

[profiles.llamacpp-codex]
model = "Qwen3.6-27B-UD-Q5_K_XL.gguf"
model_provider = "llamacpp"
model_reasoning_effort = "low"

[profiles.llamacpp-codex.windows]
sandbox = "elevated"

[model_providers.llamacpp]
name = "llama.cpp"
base_url = "http://127.0.0.1:8080/v1/"
wire_api = "responses"

[windows]
sandbox = "elevated"
```

### Step 4：啟動 llama-server

```bash
llama-server \
  -m ~/models/Qwen3.6-27B-UD-Q5_K_XL.gguf \
  -ngl 999 \
  -c 16384 \
  -n 2048 \
  -fa on \
  --jinja \
  --host 127.0.0.1 \
  --port 8080
```

參數說明：
| 參數 | 意思 |
|------|------|
| `-m` | 模型路徑 |
| `-ngl 999` | GPU 載入層數（999 = 全部用 GPU）|
| `-c 16384` | Context window 大小 |
| `-n 2048` | 生成最大 token 數 |
| `-fa` | Flash Attention，加速 |
| `--jinja` | Jinja 模板支援（Codex 需要）|

### Step 5：Codex 切換 profile

```bash
codex config set profile llamacpp-codex
```

---

## 硬體需求對照

| 顯卡 | 建議模型 |
|------|---------|
| 6~8G 顯存 | Qwen3.6:27b-mlx、Gemma 4:e2b-mlx |
| 10~16G 顯存 | Qwen3.6:35b-mlx、Gemma 4:27b-mlx |
| 24G+ 顯存 | Qwen3.6:35b 全精度、任何 40B 模型 |

> MacBook Air M 系列記憶體分配：如果系統記憶體 24G，MLX 模型會用統一記憶體，效果接近 GPU。

---

## 常見問題

**Q：`ollama launch codex-app` 報錯？**
A：確認 Ollama 版本是 0.24+：`ollama --version`

**Q： 模型載入很慢？**
A：第一次會下載模型的喵碎片（shard），後續載入就快了。用 `ollama ps` 看目前在跑的模型

**Q：Mac 無法用 NVIDIA 顯卡？**
A：Ollama 在 Mac 上自動用 Metal（Apple GPU），MLX 模型加速效果很好

**Q： 如何確認確實走本地模型？**
A：斷網測試 - 如果還能正常回覆，代表是本地模型在跑

---

## 影片提到的兩種用法示範

### 修復 Bug
```
「幫我修復這個遊戲項目的錯誤」
→ AI 自動掃描項目 → 分析代碼 → 定位錯誤 → 自動修改 → 重啟遊戲痊癒
```

### 自動開發
```
「做一個打地鼠小遊戲」
→ AI 自動建立 HTML + CSS + JS → 完成介面 + 遊戲邏輯 → 直接可運行
```

### 建立網頁
```
「做一個蘋果官網風格的 AI 產品頁面」
→ AI 自動完成頁面布局、動畫、響應式設計、CSS
```

---

## 相關連結

- OpenAI Codex 下載：https://openai.com/zh-Hans-CN/codex/
- Ollama 下載：https://ollama.com/
- 零度部落格（含備用下載）：https://www.freedidi.com/24310.html
- Qwen3.6 越獄版下載：https://pan.quark.cn/s/d971b8a8b139
- llama.cpp 部署教學：https://www.freedidi.com/24284.html
