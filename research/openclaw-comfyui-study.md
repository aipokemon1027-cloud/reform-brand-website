# OpenClaw + ComfyUI 串接方法詳解

整理自：電磁波Studio YT影片 + OpenClaw官方文檔 + Jetter教學

---

## 🚧 當前狀態：擱置（2026-05-31）

硬體限制：MacBook Air M1 無法流暢運行 ComfyUI（散熱/VRAM不足）。

未來條件滿足時再重啟：
- 選項 A：Mac Mini M2 Pro（32GB RAM）或更高階的 Apple Silicon
- 選項 B：使用 Comfy Cloud（雲端托管，按用量付費）
- 選項 C：使用雲端 GPU（RunPod / Google Colab 等）

---

## 核心概念

OpenClaw 內建了一個 `comfy` 插件，專門用來執行 ComfyUI 的工作流。
插件的設計哲學是：**工作流驅動**——OpenClaw 不幫你映射 `size`、`aspectRatio` 等參數，而是直接把提示詞扔給你設定好的工作流，讓你完全控制生圖邏輯。

---

## 方法一：官方內建插件（OpenClaw → ComfyUI 直接呼叫）

適用情境：本地 ComfyUI 或 Comfy Cloud

### 基礎配置（config.json）

```json
{
  "plugins": {
    "entries": {
      "comfy": {
        "config": {
          "mode": "local",
          "baseUrl": "http://127.0.0.1:8188",
          "image": {
            "workflowPath": "./workflows/flux-api.json",
            "promptNodeId": "6",
            "outputNodeId": "9"
          },
          "video": {
            "workflowPath": "./workflows/video-api.json",
            "promptNodeId": "12",
            "outputNodeId": "21"
          }
        }
      }
    }
  },
  "agents": {
    "defaults": {
      "imageGenerationModel": {
        "primary": "comfy/workflow"
      },
      "videoGenerationModel": {
        "primary": "comfy/workflow"
      }
    }
  }
}
```

### 參數說明

| 參數 | 必要性 | 說明 |
|------|--------|------|
| `mode` | 必填 | `"local"`（本機）或 `"cloud"`（Comfy Cloud） |
| `baseUrl` | local必填 | ComfyUI 監聽地址，預設 `http://127.0.0.1:8188` |
| `workflowPath` | 必填 | 工作流 JSON 檔案路徑 |
| `promptNodeId` | 必填 | 接收文字 prompt 的節點 ID |
| `promptInputName` | 選填 | 預設 `"text"`，prompt 節點上的輸入欄位名 |
| `outputNodeId` | 選填 | 讀取輸出的節點 ID；省略則使用所有匹配的輸出節點 |
| `inputImageNodeId` | 參考圖必填 | 接收參考圖的節點 ID（image/video 編輯用） |
| `pollIntervalMs` | 選填 | 輪詢完成狀態的間隔（毫秒） |
| `timeoutMs` | 選填 | 工作流超時時間 |

### Comfy Cloud 額外設定

```bash
export COMFY_API_KEY="your-key"
# 或直接寫進 config
openclaw config set plugins.entries.comfy.config.apiKey "your-key"
```

---

## 方法二：Flask Webhook 中轉（影片中演示的方法）

適用情境：需要外部觸發 ComfyUI，或將 OpenClaw 的對話轉換為 API 呼叫

### 流程架構

```
用戶說「生成皮克斯風格卡通龍蝦」
        ↓
OpenClaw（Agent處理）
        ↓
Flask 接收 Webhook 觸發
        ↓
Flask 呼叫 ComfyUI API
        ↓
圖片生成完成
```

### Flask Server 範例（Python）

```python
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# 啟動後保持運行，監聽 OpenClaw 的 Webhook
@app.route('/webhook', methods=['POST'])
def trigger_comfyui():
    data = request.json
    prompt = data.get('prompt', '')

    # 呼叫本地 ComfyUI
    payload = {
        "prompt": prompt,
        "image_node_id": "6"  # 你的 prompt node ID
    }

    comfy_response = requests.post(
        'http://192.168.1.98:8188/prompt',
        json=payload
    )

    return jsonify({"status": "submitted", "response": comfy_response.json()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

---

## 方法三：直接傳送工作流 JSON 給 OpenClaw（最簡單）

適用情境：快速實驗、不想寫程式

**步驟：**

1. 在 ComfyUI 設計並測試好工作流
2. 儲存為 JSON 檔（API 格式匯出）
3. 告訴 OpenClaw 你的 ComfyUI 位址
4. 把 JSON 檔傳給 OpenClaw
5. 請它用這個工作流生成圖片

```bash
# 告訴 OpenClaw ComfyUI 地址
openclaw config set plugins.entries.comfy.config.baseUrl "http://192.168.1.98:8188"
```

OpenClaw 收到 JSON 工作流後，會自動把用戶的 prompt 注入到 `promptNodeId` 指定的節點，然後呼叫 ComfyUI 執行。

---

## 前置作業：ComfyUI 對外暴露（跨機器/區域網）

如果 OpenClaw 和 ComfyUI 在不同電腦，需要手動開啟 ComfyUI 的對外監聽：

1. 開啟 ComfyUI → 設定 → 伺服器設定
2. 把「主要監聽的 IP 位址」從 `127.0.0.1` 改成 `0.0.0.0`
3. 重新啟動 ComfyUI（Windows 會跳出防火牆提示，務必允許）
4. 確認 IP 位址（建議設定固定 IP，例如 `192.168.1.98:8188`）
5. 在其他電腦的瀏覽器輸入 `http://IP:8188` 確認可連線

---

## 各種應用場景

### 場景 1：文字生圖（文生圖）

- OpenClaw 接收：「生成皮克斯風格卡通龍蝦」
- 注入 `promptNodeId`
- ComfyUI 執行 Flux/SD 工作流
- 圖片輸出到 `outputNodeId`

### 場景 2：參考圖編輯（圖生圖）

```json
{
  "plugins": {
    "entries": {
      "comfy": {
        "config": {
          "image": {
            "workflowPath": "./workflows/edit-api.json",
            "promptNodeId": "6",
            "inputImageNodeId": "7",
            "inputImageInputName": "image",
            "outputNodeId": "9"
          }
        }
      }
    }
  }
}
```

### 場景 3：AI 影片生成（LTX 2.3 / Sulphur 2 等）

```json
{
  "plugins": {
    "entries": {
      "comfy": {
        "config": {
          "video": {
            "workflowPath": "./workflows/ltx23-video.json",
            "promptNodeId": "12",
            "outputNodeId": "21"
          }
        }
      }
    }
  }
}
```

### 場景 4：結合多種工具

```
用戶：幫我生成一張產品圖，然後做一支展示影片
        ↓
OpenClaw 調度：
  1. ComfyUI（image workflow）→ 產品圖
  2. ComfyUI（video workflow）→ 展示影片
        ↓
結果回傳給用戶
```

---

## 優勢與限制

### 優勢

- **免費**：無需 OpenAI / Gemini 等付費 API
- **無尺度的生圖限制**：ComfyUI 自己跑，不受第三方約束
- **無限擴展**：可加入 LoRA、自定義工作流
- **本地部署**：所有資料留在本地，隱私安全
- **可結合 Agent 能力**：OpenClaw 的 Planning / Skill / Memory 全部可搭配使用

### 限制

- **需要硬體**：ComfyUI 需要足夠 VRAM（16GB+ 較舒適）
- **工作流需自己設計**：不像 MNA 那些直接給 prompt 就生圖，需要先設定好 ComfyUI 工作流
- **跨網路需手動設定**：需要設定網段、IP、防火牆

---

## 驗證是否串接成功

```bash
openclaw models list --provider comfy
```

如果有列出 `comfy/workflow` 模型，代表串接正常。

---

## 總結：三種使用方式對照

| 方法 | 複雜度 | 需要寫程式 | 適用情境 |
|------|--------|------------|----------|
| 官方內建插件 | 中 | 否 | 固定工作流、長期使用 |
| Flask Webhook 中轉 | 高 | 是 | 需要外部觸發、複雜整合 |
| 直接傳 JSON | 低 | 否 | 快速實驗、臨時使用 |