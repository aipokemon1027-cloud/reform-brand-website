# reform. 網站專案

## 資料夾結構

```
reform-website/
├── v1/              ← 第一版（已被覆蓋）
├── v2/              ← ESTUDIO ANÓNIMO 重新設計版
├── v3/              ← 下次修改區域
├── current/         ← 當前部署版本
├── CHANGELOG.md    ← 變更日誌
└── README.md        ← 本文件
```

## 版本管理原則

1. **每次重大修改前**先複製 current → v{N+1}
2. 在 current 資料夾裡修改
3. 確認完成後提交並同步到 gh-pages
4. 更新 CHANGELOG.md

## 部署方式

```bash
# 1. 進入 current 資料夾
cd ~/openclaw/workspace/reform-website/current

# 2. 提交到 main
git add -A
git commit -m "v{N} - 變更描述"
git push origin main

# 3. 同步到 gh-pages
git checkout gh-pages
git merge main
git push origin gh-pages
git checkout main
```

## 設計規範

- **風格：** ESTUDIO ANÓNIMO — 超大襯線字、極簡導航、充足留白
- **MOTION_INTENSITY:** 4-5（克制）
- **VISUAL_DENSITY:** 2-3（藝廊感）
- **色彩：** 柔粉 #F5E6E8 / 薰衣草 #E8E0F0 / 米白 #FDFBF7 / 炭灰 #2D2D2D / 玫瑰 #C4A4A4
- **字體：** Cormorant Garamond（襯線）+ Inter（無襯線）

## 即時預覽

直接用瀏覽器開啟 `current/index.html` 即可預覽。
