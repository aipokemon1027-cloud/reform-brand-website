#!/usr/bin/env python3
"""
Threads 單帖發布腳本 - 修復版
直接用 JS 操作 DOM，繞過 accessibility tree 限制
"""
import subprocess
import sys
import time

CONTENT = """💬 夏天還沒到，你家那台會嘎嘎響的老古董電扇還打算繼續操嗎？WIRED 評選出 2026 年最值得入手的 11 款涼友，現在的電扇不只會吹風，還能自帶氛圍燈、噴水霧，甚至有會跟著你走的神奇機型。趁現在還沒熱到崩潰，趕快把家裡那台又吵又沒力的舊風扇換掉吧！

🔗 完整文章：https://www.wired.com/story/the-best-fans-2026/

#夏天必備 #家電推薦 #涼風扇 #WIRED #居家生活"""

def run(cmd, timeout=30):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
    return result.stdout.strip(), result.stderr.strip(), result.returncode

def type_via_js(content):
    """用 JS 直接寫入文字到 contentEditable 元素"""
    # Escape for JS string
    content_escaped = content.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
    js = f"""(function(){{
        const box = document.querySelector('[contenteditable=true][role=textbox]');
        if(!box) return 'TEXTBOX_NOT_FOUND';
        box.focus();
        // Clear and type
        box.innerText = '';
        document.execCommand('insertText', false, {repr(content_escaped)});
        return 'OK:' + box.innerText.substring(0,50);
    }})()"""
    out, err, rc = run(f"opencli operate eval {repr(js)}")
    return out

def click_publish_via_js():
    """用 JS 點擊發布按鈕"""
    js = """(function(){
        // Find all publish buttons
        const buttons = Array.from(document.querySelectorAll('div'));
        for(const b of buttons){
            if(b.innerText.trim() === '發佈'){
                b.click();
                return 'CLICKED_PUBLISH';
            }
        }
        return 'PUBLISH_NOT_FOUND';
    })()"""
    out, err, rc = run(f"opencli operate eval {repr(js)}")
    return out

def main():
    print("=== Threads 單帖發布 ===")
    
    # 1. 開啟主頁
    print("[1] 開啟 Threads...")
    run("opencli operate open https://www.threads.com/@pokenews2026")
    time.sleep(3)
    
    # 2. 點擊 compose
    print("[2] 點擊建立按鈕...")
    state_out, _, _ = run("opencli operate state 2>&1 | grep '文字欄位空白' | head -2")
    print(f"    State: {state_out[:100]}")
    
    # Extract compose button index
    import re
    m = re.search(r'\[(\d+)\]<div aria-label=文字欄位空白', state_out)
    if m:
        idx = m.group(1)
        run(f"opencli operate click {idx}")
        print(f"    點擊了 {idx}")
        time.sleep(2)
    
    # 3. 用 JS 輸入內容
    print("[3] 用 JS 寫入內容...")
    result = type_via_js(CONTENT)
    print(f"    結果: {result}")
    time.sleep(1)
    
    # 4. 驗證內容
    verify_out, _, _ = run("opencli operate eval \"(function(){ const b = document.querySelector('[contenteditable=true]'); return b ? b.innerText.substring(0,80) : 'none'; })()\"")
    print(f"    驗證: {verify_out[:80]}")
    
    # 5. 用 JS 點擊發布
    print("[4] 用 JS 點擊發布...")
    pub_result = click_publish_via_js()
    print(f"    結果: {pub_result}")
    time.sleep(4)
    
    # 6. 檢查新 post
    print("[5] 檢查新帖子...")
    state_out2, _, _ = run("opencli operate state 2>&1 | grep 'href=/@pokenews2026/post' | head -5")
    print(f"    所有帖子: {state_out2[:200]}")
    
    # Check if content cleared (means published)
    verify_out2, _, _ = run("opencli operate eval \"(function(){ const b = document.querySelector('[contenteditable=true]'); return b ? b.innerText.substring(0,50) : 'none'; })()\"")
    print(f"    文字框內容: {verify_out2[:50]}")
    
    print("=== 完成 ===")

if __name__ == "__main__":
    main()
