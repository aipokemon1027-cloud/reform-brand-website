#!/usr/bin/env python3
"""
YouTube 影片內容抓取腳本
流程：
  1. 嘗試 opencli youtube transcript（快速，有字幕的影片）
  2. 若無字幕，用 yt-dlp 下載音訊 + Whisper AI 轉錄

使用方式：
  python3 youtube-transcribe.py <YouTube_URL> [model]
  
範例：
  python3 youtube-transcribe.py "https://www.youtube.com/watch?v=..."
  python3 youtube-transcribe.py "https://www.youtube.com/watch?v=..." small
"""

import sys
import os
import subprocess
import json

# 設定環境變數（Mac whisper 需要）
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

def get_youtube_video_id(url: str) -> str:
    """從 URL 取出 video ID"""
    if "watch?v=" in url:
        return url.split("watch?v=")[1].split("&")[0].split("?")[0]
    elif "youtu.be/" in url:
        return url.split("youtu.be/")[1].split("?")[0]
    return url

def try_opencli_transcript(url: str) -> dict:
    """
    嘗試用 opencli youtube transcript 取得字幕
    回傳：{"success": bool, "transcript": str, "error": str}
    """
    print(f"[Step 1] 嘗試 opencli youtube transcript...")
    try:
        result = subprocess.run(
            ["opencli", "youtube", "transcript", url, "-f", "plain"],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0 and result.stdout.strip():
            return {"success": True, "transcript": result.stdout.strip(), "source": "opencli"}
        else:
            return {"success": False, "error": result.stderr.strip() or "No transcript available"}
    except Exception as e:
        return {"success": False, "error": str(e)}

def download_audio(url: str, output_path: str = "audio.mp3") -> dict:
    """
    用 yt-dlp 下載 YouTube 影片的音訊
    回傳：{"success": bool, "path": str, "error": str}
    """
    print(f"[Step 2] 用 yt-dlp 下載音訊...")
    video_id = get_youtube_video_id(url)
    audio_file = f"audio_{video_id}.mp3"
    
    try:
        result = subprocess.run(
            [
                "yt-dlp",
                "--extract-audio",
                "--audio-format", "mp3",
                "--audio-quality", "0",
                "-o", audio_file,
                url
            ],
            capture_output=True, text=True, timeout=300
        )
        if result.returncode == 0 and os.path.exists(audio_file):
            return {"success": True, "path": audio_file}
        else:
            error_msg = result.stderr.strip()
            if "Video unavailable" in error_msg:
                error_msg = "影片不存在或已被移除"
            return {"success": False, "error": error_msg}
    except Exception as e:
        return {"success": False, "error": str(e)}

def transcribe_with_whisper(audio_path: str, model_size: str = "small") -> dict:
    """
    用 Whisper AI 將音訊轉錄為文字
    回傳：{"success": bool, "transcript": str, "language": str, "error": str}
    """
    print(f"[Step 3] 用 Whisper AI 轉錄（模型: {model_size}）...")
    
    # 動態 import whisper（需要時再載入）
    import whisper
    
    try:
        model = whisper.load_model(model_size)
        result = model.transcribe(audio_path, verbose=False)
        
        transcript = result["text"].strip()
        language = result.get("language", "unknown")
        duration = result.get("duration", 0)
        
        if not transcript:
            return {
                "success": False, 
                "error": "Whisper 辨識到空白內容（可能無語音）"
            }
        
        return {
            "success": True,
            "transcript": transcript,
            "language": language,
            "duration": round(duration, 1),
            "source": "whisper"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

def main():
    if len(sys.argv) < 2:
        print("使用方法: python3 youtube-transcribe.py <YouTube_URL> [whisper_model]")
        print("範例: python3 youtube-transcribe.py \"https://www.youtube.com/watch?v=...\"")
        print("\n可用 Whisper 模型: tiny, base, small, medium, large-v3-turbo")
        sys.exit(1)
    
    url = sys.argv[1]
    model = sys.argv[2] if len(sys.argv) > 2 else "small"
    
    video_id = get_youtube_video_id(url)
    print(f"📹 影片 ID: {video_id}")
    print(f"🔗 URL: {url}")
    print("=" * 50)
    
    # Step 1: 嘗試 opencli youtube transcript
    result = try_opencli_transcript(url)
    
    if result["success"]:
        print(f"\n✅ 成功取得字幕！（來源：{result.get('source', 'unknown')}）")
        print("-" * 50)
        print(result["transcript"])
    else:
        print(f"\n⚠️ 無可用字幕: {result['error']}")
        print("→ 嘗試用 yt-dlp + Whisper 轉錄...")
        
        # Step 2: 下載音訊
        audio_result = download_audio(url)
        
        if not audio_result["success"]:
            print(f"\n❌ 下載失敗: {audio_result['error']}")
            sys.exit(1)
        
        audio_path = audio_result["path"]
        print(f"✅ 音訊下載完成: {audio_path}")
        
        # Step 3: Whisper 轉錄
        whisper_result = transcribe_with_whisper(audio_path, model)
        
        if whisper_result["success"]:
            print(f"\n✅ Whisper 轉錄成功！")
            print(f"   語言: {whisper_result['language']}")
            print(f"   時長: {whisper_result.get('duration', 'N/A')} 秒")
            print("-" * 50)
            print(whisper_result["transcript"])
            
            # 清理音訊檔
            try:
                os.remove(audio_path)
                print(f"\n🗑️ 已清理暫存檔: {audio_path}")
            except:
                pass
        else:
            print(f"\n❌ Whisper 轉錄失敗: {whisper_result['error']}")
            sys.exit(1)

if __name__ == "__main__":
    main()