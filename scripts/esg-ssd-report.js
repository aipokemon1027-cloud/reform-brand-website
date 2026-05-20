const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// ─── Icon helpers ───────────────────────────────────────────────────────────────
function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}
async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}
async function makeIcons(entries) {
  const result = {};
  console.log("entries type:", typeof entries, Array.isArray(entries)); if (!entries || typeof entries !== "object") throw new Error("entries bad:" + JSON.stringify(entries)); for (const [key, [Icon, color]] of Object.entries(entries)) {
    if (!Icon) { console.log("BAD ICON KEY:", key); throw new Error("icon missing:" + key); }
    result[key] = await iconToBase64Png(Icon, color, 256);
  }
  return result;
}

// ─── Palette ───────────────────────────────────────────────────────────────────
const C = {
  primary:    "1B5E20",
  secondary:  "2E7D32",
  accent:     "00838F",
  accent2:    "00695C",
  teal:       "00897B",
  lightGreen: "E8F5E9",
  cardBg:     "F1F8E9",
  dark:       "1C2B1C",
  muted:      "546E7A",
  gold:       "F9A825",
  cream:      "F5F7F2",
  white:      "FFFFFF",
  warmGray:   "ECE8E3",
};

// ─── Helpers ────────────────────────────────────────────────────────────────────
function slideBg(slide, color) {
  slide.background = { color };
}
function accentTopBar(slide, color) {
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 0.07,
    fill: { color }, line: { color, width: 0 },
  });
}
function card(slide, x, y, w, h, accent) {
  slide.addShape('rect', {
    x, y, w, h,
    fill: { color: C.cardBg },
    line: { color: accent, width: 0.6 },
    shadow: { type: "outer", color: "000000", blur: 10, offset: 3, angle: 135, opacity: 0.09 },
  });
  slide.addShape('rect', {
    x, y, w: 0.07, h,
    fill: { color: accent }, line: { color: accent, width: 0 },
  });
}
function bigNum(slide, x, y, w, h, num, label, accent) {
  slide.addShape('rect', {
    x, y, w, h, fill: { color: accent, transparency: 10 },
    line: { color: accent, width: 0 },
  });
  slide.addText(num, {
    x, y: y + 0.08, w, h: h * 0.62,
    fontSize: 42, bold: true, color: accent,
    align: "center", valign: "bottom", margin: 0,
  });
  slide.addText(label, {
    x, y: y + h * 0.58, w, h: h * 0.38,
    fontSize: 11, color: C.muted,
    align: "center", valign: "top", margin: 0,
  });
}
function sectionPill(slide, text, x, y, accent) {
  const w = text.length * 0.13 + 0.36;
  slide.addShape('rect', {
    x, y, w, h: 0.3,
    fill: { color: accent, transparency: 88 },
    line: { color: accent, width: 0 },
  });
  slide.addText(text, {
    x: x + 0.18, y, w: w - 0.18, h: 0.3,
    fontSize: 10, bold: true, color: accent,
    align: "left", valign: "middle", margin: 0,
  });
}
function bulletList(slide, items, x, y, w, h, color, fontSize = 11) {
  const arr = items.map((t, i) => ({
    text: t, options: { bullet: true, breakLine: i < items.length - 1 },
  }));
  slide.addText(arr, {
    x, y, w, h,
    fontSize, color,
    align: "left", valign: "top",
    paraSpaceAfter: 5,
  });
}
function pageFooter(slide, text) {
  slide.addShape('rect', {
    x: 0, y: 5.3, w: 10, h: 0.325,
    fill: { color: C.primary, transparency: 92 },
    line: { color: C.primary, width: 0 },
  });
  slide.addText(text, {
    x: 0, y: 5.3, w: 10, h: 0.325,
    fontSize: 9, color: C.muted,
    align: "center", valign: "middle", margin: 0,
  });
}
function addIcon(slide, iconData, x, y, w, h) {
  slide.addImage({ data: iconData, x, y, w, h });
}

// ─── Main ─────────────────────────────────────────────────────────────────────────
async function main() {
  const { FaLeaf, FaSolarPanel, FaRecycle, FaIndustry,
          FaServer, FaDatabase, FaBuilding, FaCheckCircle,
          FaBolt, FaSnowflake, FaShieldAlt, FaGlobeAmericas,
          FaChartLine, FaMicrochip, FaLock, FaClipboardList,
           FaArrowRight, FaStar, FaRecycleAlt, FaWind, FaBalanceScale, FaGavel, FaWater, FaTree, FaHandsHelping, FaHandshake, FaFileContract, FaLongArrowAltUp, FaMedal, FaTrophy, FaRoad, FaHandsWash } = require("react-icons/fa");



  const { SiAmazonwebservices, SiGooglecloud, SiMicrosoftazure } = require("react-icons/si");
  const { BiLeaf, BiWater } = require("react-icons/bi");

  const I = await makeIcons({
    leaf:         [FaLeaf, "#" + C.secondary],
    solar:        [FaSolarPanel, "#" + C.accent],
    recycle:      [FaRecycle, "#" + C.teal],
    industry:     [FaIndustry, "#" + C.primary],
    server:        [FaServer, "#" + C.secondary],
    database:      [FaDatabase, "#" + C.accent],
    building:     [FaBuilding, "#" + C.primary],
    check:         [FaCheckCircle, "#" + C.secondary],
    bolt:          [FaBolt, "#" + C.gold],
    snowflake:     [FaSnowflake, "#" + C.accent],
    shield:        [FaShieldAlt, "#" + C.accent2],
    globe:         [FaGlobeAmericas, "#" + C.accent],
    chart:         [FaChartLine, "#" + C.accent],
    chip:          [FaMicrochip, "#" + C.primary],
    lock:          [FaLock, "#" + C.accent2],
    clipboard:     [FaClipboardList, "#" + C.primary],
    arrow:         [FaArrowRight, "#" + C.accent],
    star:          [FaStar, "#" + C.gold],
    recycle2:      [FaRecycle, "#" + C.teal],
    wind:          [FaWind, "#" + C.accent],
    water:         [FaWater, "#" + C.accent],
    tree:          [FaTree, "#" + C.secondary],
    hands:         [FaHandsHelping, "#" + C.teal],
    handshake:     [FaHandshake, "#" + C.accent],
    balanceIcon:       [FaBalanceScale, "#" + C.accent],
    contract:      [FaFileContract, "#" + C.accent2],
    regulations:   [FaGavel, "#" + C.primary],
    trend:         [FaLongArrowAltUp, "#" + C.secondary],
    medal:         [FaMedal, "#" + C.gold],
    trophy:        [FaTrophy, "#" + C.gold],
    road:          [FaRoad, "#" + C.accent],
    hands2:        [FaHandsWash, "#" + C.accent2],
  });

  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title = "SSD 在 ESG 中的應用";
  pres.author = "ESG 專業報告";

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 1 · 封面
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.primary);
    s.addShape('ellipse', {
      x: 7.0, y: -1.5, w: 5, h: 5,
      fill: { color: C.secondary, transparency: 65 },
      line: { color: C.secondary, width: 0 },
    });
    s.addShape('ellipse', {
      x: -1.5, y: 3.5, w: 4, h: 4,
      fill: { color: C.accent2, transparency: 72 },
      line: { color: C.accent2, width: 0 },
    });
    s.addShape('rect', {
      x: 0.8, y: 1.3, w: 0.05, h: 3.1,
      fill: { color: C.white, transparency: 50 },
      line: { color: C.white, width: 0 },
    });
    // Pill label
    s.addShape('rect', {
      x: 1.0, y: 1.4, w: 1.5, h: 0.34,
      fill: { color: C.teal }, line: { color: C.teal, width: 0 },
    });
    s.addText("專業報告", {
      x: 1.0, y: 1.4, w: 1.5, h: 0.34,
      fontSize: 10, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText("SSD 在 ESG 中的應用", {
      x: 1.0, y: 1.95, w: 8.5, h: 1.3,
      fontSize: 36, bold: true, color: C.white,
      align: "left", valign: "middle", margin: 0,
    });
    s.addText("固態硬碟 × 企業永續策略 × 實踐指南", {
      x: 1.0, y: 3.3, w: 8, h: 0.45,
      fontSize: 16, color: C.white, transparency: 28,
      align: "left", valign: "top", margin: 0,
    });
    s.addShape('rect', {
      x: 0, y: 5.15, w: 10, h: 0.475,
      fill: { color: C.dark }, line: { color: C.dark, width: 0 },
    });
    s.addText("環境保護  ·  社會責任  ·  公司治理", {
      x: 0, y: 5.15, w: 10, h: 0.475,
      fontSize: 11, color: C.white, transparency: 35,
      align: "center", valign: "middle", margin: 0,
    });
    addIcon(s, I.chip, 7.8, 1.9, 1.8, 1.8);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 2 · 目錄
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.cream);
    accentTopBar(s, C.primary);
    s.addText("目錄", {
      x: 0.5, y: 0.25, w: 9, h: 0.55,
      fontSize: 28, bold: true, color: C.primary,
      align: "left", valign: "middle", margin: 0,
    });

    const toc = [
      { num: "01", title: "ESG 框架基礎",        pages: "3–4",   color: C.secondary },
      { num: "02", title: "SSD 核心技術",        pages: "5–6",   color: C.accent },
      { num: "03", title: "環境面向（E）",        pages: "7–12",  color: C.teal },
      { num: "04", title: "社會面向（S）",        pages: "13–15", color: C.accent2 },
      { num: "05", title: "治理面向（G）",        pages: "16–18", color: C.primary },
      { num: "06", title: "企業實踐路線圖",        pages: "19–20", color: C.gold },
      { num: "07", title: "個案研究",             pages: "21–22", color: C.accent },
      { num: "08", title: "總結與行動呼籲",        pages: "23",   color: C.secondary },
    ];

    toc.forEach((t, i) => {
      const row = Math.floor(i / 4);
      const col = i % 4;
      const x = 0.4 + col * 2.38;
      const y = 1.0 + row * 2.05;
      card(s, x, y, 2.2, 1.85, t.color);
      s.addShape('rect', {
        x: x + 0.15, y: y + 0.2, w: 0.6, h: 0.6,
        fill: { color: t.color }, line: { color: t.color, width: 0 },
      });
      s.addText(t.num, {
        x: x + 0.15, y: y + 0.2, w: 0.6, h: 0.6,
        fontSize: 16, bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText(t.title, {
        x: x + 0.85, y: y + 0.25, w: 1.2, h: 0.5,
        fontSize: 13, bold: true, color: t.color,
        align: "left", valign: "top", margin: 0,
      });
      s.addText("p. " + t.pages, {
        x: x + 0.85, y: y + 0.72, w: 1.2, h: 0.25,
        fontSize: 10, color: C.muted,
        align: "left", valign: "middle", margin: 0,
      });
      addIcon(s, I[t.num === "01" ? "leaf" : t.num === "02" ? "chip" : t.num === "03" ? "recycle" : t.num === "04" ? "hands" : t.num === "05" ? "shield" : t.num === "06" ? "road" : t.num === "07" ? "chart" : "check"], x + 0.8, y + 1.0, 0.7, 0.7);
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 3 · ESG 是什麼？（用生活比喻）
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.lightGreen);
    accentTopBar(s, C.secondary);
    s.addText("ESG 是什麼？", {
      x: 0.5, y: 0.25, w: 9, h: 0.55,
      fontSize: 28, bold: true, color: C.primary,
      align: "left", valign: "middle", margin: 0,
    });
    sectionPill(s, "企業永續的三大支柱", 0.5, 0.9, C.secondary);

    // Question box
    s.addShape('rect', {
      x: 0.5, y: 1.3, w: 9, h: 0.85,
      fill: { color: C.primary }, line: { color: C.primary, width: 0 },
    });
    s.addText("想像：一個人只顧賺錢、不管健康、忽略家人——你會信任他嗎？企業也是一樣的道理。", {
      x: 0.7, y: 1.3, w: 8.6, h: 0.85,
      fontSize: 15, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });

    const pillars = [
      { label: "E", zh: "環境保護", en: "Environmental", icon: I.leaf,
        color: C.secondary, desc: "減少環境負擔\n節能減碳\n保護自然生態" },
      { label: "S", zh: "社會責任", en: "Social",        icon: I.hands,
        color: C.accent,  desc: "善待員工\n回饋社區\n尊重人權" },
      { label: "G", zh: "公司治理", en: "Governance",    icon: I.shield,
        color: C.primary, desc: "透明營運\n誠實報告\n防腐與內線防範" },
    ];

    pillars.forEach((p, i) => {
      const x = 0.5 + i * 3.1;
      card(s, x, 2.3, 2.9, 2.75, p.color);
      s.addShape('ellipse', {
        x: x + 0.95, y: 2.45, w: 1.0, h: 1.0,
        fill: { color: p.color, transparency: 88 },
        line: { color: p.color, width: 0 },
      });
      addIcon(s, p.icon, x + 1.1, 2.6, 0.7, 0.7);
      s.addShape('rect', {
        x: x + 0.75, y: 3.55, w: 1.4, h: 0.4,
        fill: { color: p.color }, line: { color: p.color, width: 0 },
      });
      s.addText(p.label, {
        x: x + 0.75, y: 3.55, w: 1.4, h: 0.4,
        fontSize: 18, bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText(p.zh, {
        x: x, y: 4.05, w: 2.9, h: 0.38,
        fontSize: 15, bold: true, color: p.color,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText(p.en, {
        x: x, y: 4.38, w: 2.9, h: 0.22,
        fontSize: 10, color: C.muted,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText(p.desc, {
        x: x + 0.15, y: 4.6, w: 2.6, h: 0.42,
        fontSize: 10, color: C.muted,
        align: "center", valign: "top", margin: 0,
      });
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 4 · ESG 投資趨勢與法規壓力
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.cream);
    accentTopBar(s, C.accent);
    s.addText("ESG 趨勢：為何現在是關鍵時刻？", {
      x: 0.5, y: 0.25, w: 9, h: 0.55,
      fontSize: 26, bold: true, color: C.accent,
      align: "left", valign: "middle", margin: 0,
    });
    sectionPill(s, "全球趨勢與監管壓力", 0.5, 0.9, C.accent);

    const trends = [
      { num: "38",  unit: "兆美元",   label: "全球 ESG 資產規模（2025）", icon: I.globe,    color: C.accent },
      { num: "92%", unit: "",         label: "S&P 500 企業已發布 ESG 報告", icon: I.clipboard, color: C.secondary },
      { num: "2026", unit: "",         label: "台灣上市櫃公司強制碳揭露", icon: I.contract,  color: C.primary },
      { num: "2030", unit: "",         label: "淨零排放目標截止年",     icon: I.tree,      color: C.teal },
    ];
    trends.forEach((t, i) => {
      const x = 0.4 + i * 2.38;
      bigNum(s, x, 1.35, 2.2, 1.45, t.num + (t.unit ? " " + t.unit : ""), t.label, t.color);
      addIcon(s, t.icon, x + 0.7, 2.88, 0.8, 0.8);
    });

    // Cards below
    const cards = [
      { title: "投資人壓力", desc: "主權基金、退休基金要求被投資企業提出具體減碳路徑，否則退出持股", icon: I.trend },
      { title: "法規強制揭露", desc: "我國金管會規定 2026 年起上市櫃公司需依 TCFD 框架揭露氣候風險", icon: I.contract },
      { title: "供應鏈要求", desc: "國際品牌商要求供應鏈夥伴提供碳足跡資料，SSD 採購納入審查指標", icon: I.chain || I.recycle },
    ];

    // fallback icon
    const chainIcon = I.recycle;

    const factCards = [
      { title: "投資人壓力", desc: "主權基金、退休基金要求被投資企業提出具體減碳路徑，否則退出持股", icon: I.trend, color: C.accent },
      { title: "法規強制揭露", desc: "台灣金管會規定 2026 年起上市櫃公司需依 TCFD 框架揭露氣候風險", icon: I.contract, color: C.secondary },
      { title: "供應鏈要求", desc: "國際品牌商要求供應鏈夥伴提供碳足跡資料，SSD 採購已納入審查指標", icon: I.globe, color: C.primary },
    ];
    factCards.forEach((f, i) => {
      const x = 0.4 + i * 3.15;
      card(s, x, 3.85, 3.0, 1.3, f.color);
      addIcon(s, f.icon, x + 0.15, 3.98, 0.55, 0.55);
      s.addText(f.title, {
        x: x + 0.75, y: 4.0, w: 2.1, h: 0.32,
        fontSize: 12, bold: true, color: f.color,
        align: "left", valign: "top", margin: 0,
      });
      s.addText(f.desc, {
        x: x + 0.15, y: 4.58, w: 2.7, h: 0.52,
        fontSize: 10, color: C.muted,
        align: "left", valign: "top", margin: 0,
      });
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 5 · SSD 是什麼？
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.white);
    accentTopBar(s, C.accent2);
    s.addText("SSD 是什麼？", {
      x: 0.5, y: 0.25, w: 9, h: 0.55,
      fontSize: 28, bold: true, color: C.accent2,
      align: "left", valign: "middle", margin: 0,
    });
    sectionPill(s, "固態硬碟 Solid-State Drive", 0.5, 0.9, C.accent2);

    addIcon(s, I.chip, 0.5, 1.3, 3.5, 3.5);

    // Definition
    s.addShape('rect', {
      x: 4.2, y: 1.3, w: 5.3, h: 1.1,
      fill: { color: C.accent2 }, line: { color: C.accent2, width: 0 },
    });
    s.addText("SSD 是一種以 NAND 快閃記憶體儲存資料的裝置，\n無機械零件，讀寫速度快、耗電低、發熱少、壽命長。", {
      x: 4.4, y: 1.35, w: 5.0, h: 1.0,
      fontSize: 13, color: C.white,
      align: "left", valign: "middle", margin: 0,
    });

    const facts = [
      { icon: I.chip, text: "NAND Flash 記憶體顆粒（NAND Cells）儲存資料" },
      { icon: I.bolt, text: "無馬達、無轉盤、無讀寫頭——純電子訊號運作" },
      { icon: I.snowflake, text: "可在寬溫範圍（-40°C ~ 85°C）正常運作" },
      { icon: I.lock, text: "具備硬體加密功能（AES-256），保障資料安全" },
      { icon: I.trend, text: "讀寫速度可達 7,000 MB/s（PCIe Gen5 SSD）" },
      { icon: I.recycle, text: "使用壽命可達 5 年以上，平均無故障時間（MTBF）達 200 萬小時" },
    ];

    facts.forEach((f, i) => {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const x = 4.2 + col * 2.65;
      const y = 2.6 + row * 0.88;
      addIcon(s, f.icon, x, y + 0.05, 0.4, 0.4);
      s.addText(f.text, {
        x: x + 0.5, y, w: 2.1, h: 0.7,
        fontSize: 10.5, color: C.dark,
        align: "left", valign: "middle", margin: 0,
      });
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 6 · SSD 與資料中心
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.lightGreen);
    accentTopBar(s, C.primary);
    s.addText("SSD 在資料中心的角色", {
      x: 0.5, y: 0.25, w: 9, h: 0.55,
      fontSize: 28, bold: true, color: C.primary,
      align: "left", valign: "middle", margin: 0,
    });
    sectionPill(s, "資料中心是 SSD ESG 價值的核心場景", 0.5, 0.9, C.primary);

    // Data center diagram (simplified)
    s.addShape('rect', {
      x: 0.5, y: 1.3, w: 4.5, h: 3.6,
      fill: { color: C.primary, transparency: 96 },
      line: { color: C.primary, width: 0.5 },
    });
    s.addText("資料中心硬體組成", {
      x: 0.6, y: 1.38, w: 4.3, h: 0.32,
      fontSize: 11, bold: true, color: C.primary,
      align: "left", valign: "middle", margin: 0,
    });

    const dcParts = [
      { label: "伺服器 Server",  icon: I.server,  pos: "25%", top: "18%" },
      { label: "儲存系統 Storage", icon: I.database, pos: "60%", top: "18%" },
      { label: "網路設備 Network", icon: I.globe,   pos: "25%", top: "50%" },
      { label: "冷卻系統 Cooling", icon: I.snowflake, pos: "60%", top: "50%" },
      { label: "供電系統 Power", icon: I.bolt,     pos: "25%", top: "78%" },
      { label: "SSD ★ 核心儲存", icon: I.chip,    pos: "60%", top: "78%" },
    ];

    dcParts.forEach((p, i) => {
      const isSSD = i === 5;
      const bg = isSSD ? C.secondary : "FFFFFF";
      const fc = isSSD ? C.white : C.dark;
      const px = 0.6 + (i % 2) * 2.2;
      const py = 1.75 + Math.floor(i / 2) * 1.15;
      s.addShape('rect', {
        x: px, y: py, w: 2.0, h: 0.95,
        fill: { color: bg, transparency: isSSD ? 0 : 88 },
        line: { color: isSSD ? C.secondary : C.muted, width: isSSD ? 0 : 0.4 },
        shadow: isSSD ? { type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.12 } : {},
      });
      addIcon(s, p.icon, px + 0.08, py + 0.12, 0.6, 0.6);
      s.addText(p.label, {
        x: px + 0.72, y: py, w: 1.25, h: 0.95,
        fontSize: 10, bold: isSSD, color: isSSD ? C.white : C.dark,
        align: "left", valign: "middle", margin: 0,
      });
    });

    // Key point right side
    const points = [
      { icon: I.bolt, text: "SSD 是資料中心\n能耗優化的關鍵起點", color: C.gold },
      { icon: I.snowflake, text: "降低冷卻需求\n減少熱島效應", color: C.accent },
      { icon: I.recycle, text: "延長硬體壽命\n減少電子廢棄物", color: C.teal },
      { icon: I.trend, text: "提升效能支撐\nAI 分析與合規", color: C.secondary },
    ];
    points.forEach((p, i) => {
      const y = 1.35 + i * 0.95;
      s.addShape('rect', {
        x: 5.2, y, w: 4.3, h: 0.82,
        fill: { color: p.color, transparency: 90 },
        line: { color: p.color, width: 0.4 },
      });
      addIcon(s, p.icon, 5.3, y + 0.1, 0.55, 0.55);
      s.addText(p.text, {
        x: 5.95, y, w: 3.4, h: 0.82,
        fontSize: 11, bold: true, color: p.color,
        align: "left", valign: "middle", margin: 0,
      });
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 7 · E：能源效率
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.white);
    accentTopBar(s, C.teal);
    s.addShape('rect', {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fill: { color: C.teal }, line: { color: C.teal, width: 0 },
    });
    s.addText("E", {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fontSize: 22, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText("環境保護：能源效率", {
      x: 1.15, y: 0.25, w: 8, h: 0.55,
      fontSize: 26, bold: true, color: C.teal,
      align: "left", valign: "middle", margin: 0,
    });
    sectionPill(s, "能源效率是 SSD 最顯著的 ESG 貢獻", 0.5, 0.9, C.teal);

    // Comparison table
    const rows = [
      [
        { text: "能耗項目", options: { bold: true, fill: { color: C.teal }, color: C.white } },
        { text: "傳統 HDD 陣列", options: { bold: true, fill: { color: C.teal }, color: C.white } },
        { text: "SSD 方案", options: { bold: true, fill: { color: C.teal }, color: C.white } },
      ],
      [{ text: "每 TB 讀取能耗", options: {} }, { text: "8.5 瓦特小時（Wh/TB）", options: { color: C.muted } }, { text: "1.2 瓦特小時（Wh/TB）", options: { color: C.teal, bold: true } }],
      [{ text: "閒置功耗（W）", options: {} }, { text: "7~10W", options: { color: C.muted } }, { text: "0.5~3W", options: { color: C.teal, bold: true } }],
      [{ text: "平均功耗（W）", options: {} }, { text: "5~8W", options: { color: C.muted } }, { text: "2~4W", options: { color: C.teal, bold: true } }],
      [{ text: "每日耗電（kWh/年）", options: {} }, { text: "22~32 kWh", options: { color: C.muted } }, { text: "8~15 kWh", options: { color: C.teal, bold: true } }],
      [{ text: "節能幅度", options: { bold: true } }, { text: "基準", options: { color: C.muted } }, { text: "節省 55~70%", options: { color: C.teal, bold: true } }],
    ];

    s.addTable(rows, {
      x: 0.5, y: 1.3, w: 9, h: 2.8,
      colW: [2.4, 3.0, 3.6],
      border: { pt: 0.5, color: "D0D0D0" },
      fontFace: "Microsoft JhengHei",
      fontSize: 12,
      color: C.dark,
      align: "left",
      valign: "middle",
      rowH: 0.46,
    });

    // Key insight box
    s.addShape('rect', {
      x: 0.5, y: 4.25, w: 9, h: 0.9,
      fill: { color: C.teal, transparency: 92 },
      line: { color: C.teal, width: 0 },
    });
    s.addShape('rect', {
      x: 0.5, y: 4.25, w: 0.07, h: 0.9,
      fill: { color: C.teal }, line: { color: C.teal, width: 0 },
    });
    s.addText("💡 關鍵洞察：HDD 需要馬達持續旋轉，SSD 完全靠電子訊號——這是功耗差異的根本原因", {
      x: 0.75, y: 4.25, w: 8.6, h: 0.9,
      fontSize: 13, bold: true, color: C.teal,
      align: "left", valign: "middle", margin: 0,
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 8 · E：碳減排量化
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.lightGreen);
    accentTopBar(s, C.secondary);
    s.addShape('rect', {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fill: { color: C.secondary }, line: { color: C.secondary, width: 0 },
    });
    s.addText("E", {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fontSize: 22, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText("環境保護：碳減排量化", {
      x: 1.15, y: 0.25, w: 8, h: 0.55,
      fontSize: 26, bold: true, color: C.secondary,
      align: "left", valign: "middle", margin: 0,
    });
    sectionPill(s, "把節電轉化為碳減排數字", 0.5, 0.9, C.secondary);

    const stats = [
      { num: "68%", label: "一個 1,000 台伺服器資料中心\n全面 SSD 化後的碳減排幅度", color: C.secondary },
      { num: "1,200", label: "噸 CO₂e / 年\n（中型資料中心實測數據）", color: C.accent },
      { num: "15–20%", label: "電力費用節省\n（電費占資料中心營運成本 30–40%）", color: C.teal },
      { num: "ISO\n50001", label: "能源管理系統認證\n可用 SSD 節能數據申請", color: C.gold },
    ];
    stats.forEach((st, i) => {
      const x = 0.4 + i * 2.38;
      bigNum(s, x, 1.3, 2.2, 1.55, st.num, st.label, st.color);
    });

    // Calculation formula
    s.addShape('rect', {
      x: 0.5, y: 3.0, w: 9, h: 2.1,
      fill: { color: C.white },
      line: { color: C.secondary, width: 0.5 },
    });
    s.addShape('rect', {
      x: 0.5, y: 3.0, w: 9, h: 0.38,
      fill: { color: C.secondary }, line: { color: C.secondary, width: 0 },
    });
    s.addText("碳排放計算公式", {
      x: 0.7, y: 3.0, w: 8.6, h: 0.38,
      fontSize: 12, bold: true, color: C.white,
      align: "left", valign: "middle", margin: 0,
    });

    s.addText("碳減排量（噸CO₂e）=", {
      x: 0.7, y: 3.5, w: 3, h: 0.4,
      fontSize: 14, bold: true, color: C.dark,
      align: "left", valign: "middle", margin: 0,
    });
    s.addText("節電量（kWh） × 电网排放因子（0.509 kgCO₂e/kWh）", {
      x: 3.5, y: 3.5, w: 5.8, h: 0.4,
      fontSize: 14, color: C.secondary,
      align: "left", valign: "middle", margin: 0,
    });
    s.addShape('rect', {
      x: 0.7, y: 3.98, w: 8.6, h: 0.02,
      fill: { color: C.secondary, transparency: 70 }, line: { color: C.secondary, width: 0 },
    });
    s.addText([
      { text: "案例：", options: { bold: true } },
      { text: "1,000 台伺服器全面 SSD 化後，每年節省電力 600,000 kWh，相當於減少 ", options: {} },
      { text: "305 噸 CO₂e", options: { bold: true, color: C.secondary } },
      { text: "，等同於種植 ", options: {} },
      { text: "15,250 棵樹", options: { bold: true, color: C.teal } },
      { text: "（以每棵樹每年吸碳 20kg 計算）", options: {} },
    ], {
      x: 0.7, y: 4.08, w: 8.6, h: 0.9,
      fontSize: 12, color: C.dark,
      align: "left", valign: "top", margin: 0,
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 9 · E：散熱與溫控
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.white);
    accentTopBar(s, C.accent);
    s.addShape('rect', {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    });
    s.addText("E", {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fontSize: 22, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText("環境保護：散熱與溫控優化", {
      x: 1.15, y: 0.25, w: 8, h: 0.55,
      fontSize: 26, bold: true, color: C.accent,
      align: "left", valign: "middle", margin: 0,
    });
    sectionPill(s, "散熱是資料中心的隱性成本", 0.5, 0.9, C.accent);

    // Left side
    addIcon(s, I.snowflake, 0.5, 1.3, 3.5, 3.5);

    const coolPoints = [
      { icon: I.snowflake, text: "SSD 發熱量比 HDD 低 60~80%，機房無需大功率散熱設備", color: C.accent },
      { icon: I.wind, text: "冷卻系統（冷氣）耗電占資料中心總耗電 30~40%，SSD 直接降低這項負擔", color: C.teal },
      { icon: I.bolt, text: "低溫環境 = 空調設定溫度可提高 = 額外節能 10~15%", color: C.gold },
      { icon: I.recycle, text: "減少冷卻水使用量（液冷機房），降低水資源消耗", color: C.secondary },
    ];

    coolPoints.forEach((p, i) => {
      const y = 1.35 + i * 0.95;
      s.addShape('rect', {
        x: 4.1, y, w: 5.4, h: 0.82,
        fill: { color: p.color, transparency: 92 },
        line: { color: p.color, width: 0.4 },
      });
      addIcon(s, p.icon, 4.2, y + 0.12, 0.5, 0.5);
      s.addText(p.text, {
        x: 4.82, y, w: 4.55, h: 0.82,
        fontSize: 11, color: p.color,
        align: "left", valign: "middle", margin: 0,
      });
    });

    // Water saving note
    s.addShape('rect', {
      x: 0.5, y: 4.75, w: 9, h: 0.42,
      fill: { color: C.accent, transparency: 90 },
      line: { color: C.accent, width: 0 },
    });
    s.addText("📌 水資源節省：採用液冷（Liquid Cooling）的資料中心，SSD 可降低冷水需求達 40%", {
      x: 0.5, y: 4.75, w: 9, h: 0.42,
      fontSize: 11, color: C.accent,
      align: "center", valign: "middle", margin: 0,
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 10 · E：電子廢棄物減量
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.lightGreen);
    accentTopBar(s, C.teal);
    s.addShape('rect', {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fill: { color: C.teal }, line: { color: C.teal, width: 0 },
    });
    s.addText("E", {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fontSize: 22, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText("環境保護：電子廢棄物減量", {
      x: 1.15, y: 0.25, w: 8, h: 0.55,
      fontSize: 26, bold: true, color: C.teal,
      align: "left", valign: "middle", margin: 0,
    });
    sectionPill(s, "延長壽命 × 減少更換 = 減少電子廢棄物", 0.5, 0.9, C.teal);

    // Stats
    const wasteStats = [
      { num: "3~5x", label: "SSD 與 HDD\n平均壽命對比", color: C.teal },
      { num: "200萬+", label: "小時 MTBF\n（平均無故障時間）", color: C.accent },
      { num: "30%", label: "降低硬體\n更換頻率", color: C.secondary },
      { num: "1.5kg", label: "單顆 HDD 重量\n含稀有金屬與PCB", color: C.primary },
    ];
    wasteStats.forEach((st, i) => {
      const x = 0.4 + i * 2.38;
      bigNum(s, x, 1.3, 2.2, 1.45, st.num, st.label, st.color);
    });

    // E-waste problem
    s.addShape('rect', {
      x: 0.5, y: 2.9, w: 4.4, h: 2.2,
      fill: { color: C.primary }, line: { color: C.primary, width: 0 },
    });
    s.addText("全球電子廢棄物危機", {
      x: 0.7, y: 3.0, w: 4.0, h: 0.35,
      fontSize: 13, bold: true, color: C.gold,
      align: "left", valign: "middle", margin: 0,
    });
    s.addText([
      { text: "每年約 ", options: {} },
      { text: "5,000 萬噸", options: { bold: true } },
      { text: " 電子廢棄物，全球僅 22.3% 被妥善回收（UN Global E-waste Monitor 2024）", options: { breakLine: true } },
      { text: "HDD 含強迫馬達、稀有金屬（鈷、鉭）及磁性碟片，拆解處理成本高", options: { breakLine: true } },
      { text: "延長 SSD 使用壽命可直接減少進入回收鏈的硬體數量", options: {} },
    ], {
      x: 0.7, y: 3.42, w: 4.0, h: 1.6,
      fontSize: 11, color: C.white,
      align: "left", valign: "top", margin: 0,
    });

    // SSD benefit
    s.addShape('rect', {
      x: 5.1, y: 2.9, w: 4.4, h: 2.2,
      fill: { color: C.teal, transparency: 90 },
      line: { color: C.teal, width: 0 },
    });
    s.addText("SSD 的減廢策略", {
      x: 5.3, y: 3.0, w: 4.0, h: 0.35,
      fontSize: 13, bold: true, color: C.teal,
      align: "left", valign: "middle", margin: 0,
    });
    s.addText([
      { text: "1. ", options: { bold: true } },
      { text: "選擇高耐久性（DWPD≥1）SSD，延長使用週期", options: { breakLine: true } },
      { text: "2. ", options: { bold: true } },
      { text: "建立硬碟生命週期管理系統，及時遷移資料後下線", options: { breakLine: true } },
      { text: "3. ", options: { bold: true } },
      { text: "与製造商簽署回收合約，確保報廢後合規處理", options: { breakLine: true } },
      { text: "4. ", options: { bold: true } },
      { text: "將減廢量計入 ESG 報告 E（環境）章節", options: {} },
    ], {
      x: 5.3, y: 3.42, w: 4.0, h: 1.6,
      fontSize: 11, color: C.dark,
      align: "left", valign: "top", margin: 0,
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 11 · E：綠色資料中心認證
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.white);
    accentTopBar(s, C.secondary);
    s.addShape('rect', {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fill: { color: C.secondary }, line: { color: C.secondary, width: 0 },
    });
    s.addText("E", {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fontSize: 22, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText("環境保護：綠色資料中心認證", {
      x: 1.15, y: 0.25, w: 8, h: 0.55,
      fontSize: 26, bold: true, color: C.secondary,
      align: "left", valign: "middle", margin: 0,
    });
    sectionPill(s, "SSD 是取得綠色認證的基礎設施條件", 0.5, 0.9, C.secondary);

    const certs = [
      { name: "LEED",         full: "Leadership in Energy and\nEnvironmental Design", icon: I.building,   color: C.secondary, score: "能耗降低 20~30%" },
      { name: "ISO 50001",    full: "能源管理系統標準",                            icon: I.chart,     color: C.accent,    score: "年度能耗下降 5~15%" },
      { name: "ISO 14001",    full: "環境管理系統標準",                            icon: I.recycle,   color: C.teal,      score: "廢棄物減少 10~20%" },
      { name: "TOS 50050",    full: "歐洲绿色資料中心標準",                        icon: I.globe,     color: C.primary,   score: "PUE ≤ 1.2 強制要求" },
    ];

    certs.forEach((c, i) => {
      const x = 0.4 + (i % 2) * 4.7;
      const y = 1.3 + Math.floor(i / 2) * 2.0;
      card(s, x, y, 4.45, 1.85, c.color);
      s.addShape('rect', {
        x, y, w: 4.45, h: 0.4,
        fill: { color: c.color }, line: { color: c.color, width: 0 },
      });
      addIcon(s, c.icon, x + 0.15, y + 0.5, 0.55, 0.55);
      s.addText(c.name, {
        x: x + 0.8, y: y + 0.05, w: 2, h: 0.35,
        fontSize: 16, bold: true, color: C.white,
        align: "left", valign: "middle", margin: 0,
      });
      s.addText(c.full, {
        x: x + 0.15, y: y + 1.0, w: 4.1, h: 0.35,
        fontSize: 10, color: C.dark,
        align: "left", valign: "top", margin: 0,
      });
      s.addShape('rect', {
        x: x + 0.15, y: y + 1.4, w: 4.1, h: 0.35,
        fill: { color: c.color, transparency: 88 },
        line: { color: c.color, width: 0 },
      });
      s.addText("關鍵效益：" + c.score, {
        x: x + 0.25, y: y + 1.4, w: 3.9, h: 0.35,
        fontSize: 10, bold: true, color: c.color,
        align: "left", valign: "middle", margin: 0,
      });
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 12 · E 總結：SSD 的環境效益儀表板
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.lightGreen);
    accentTopBar(s, C.primary);
    s.addText("E 總結：SSD 環境效益儀表板", {
      x: 0.5, y: 0.25, w: 9, h: 0.55,
      fontSize: 26, bold: true, color: C.primary,
      align: "left", valign: "middle", margin: 0,
    });
    sectionPill(s, "把 SSD 環保效益量化為 ESG 指標", 0.5, 0.9, C.primary);

    const eItems = [
      { metric: "能源消耗",       before: "100%（基準）", after: "30~45%",   reduction: "55~70%", icon: I.bolt,     color: C.gold },
      { metric: "碳排放量",        before: "100%（基準）", after: "28~38%",   reduction: "62~72%", icon: I.recycle,   color: C.secondary },
      { metric: "散熱設備能耗",   before: "100%（基準）", after: "40~60%",   reduction: "40~60%", icon: I.snowflake, color: C.accent },
      { metric: "電子廢棄物產生", before: "100%（基準）", after: "20~30%",   reduction: "70~80%", icon: I.recycle2,      color: C.teal },
      { metric: "機房空間佔用",   before: "100%（基準）", after: "40~60%",   reduction: "40~60%", icon: I.database, color: C.primary },
    ];

    eItems.forEach((item, i) => {
      const y = 1.3 + i * 0.82;
      s.addShape('rect', {
        x: 0.5, y, w: 9, h: 0.7,
        fill: { color: C.white },
        line: { color: item.color, width: 0.4 },
      });
      addIcon(s, item.icon, 0.6, y + 0.08, 0.5, 0.5);
      s.addText(item.metric, {
        x: 1.2, y, w: 2.2, h: 0.7,
        fontSize: 13, bold: true, color: item.color,
        align: "left", valign: "middle", margin: 0,
      });
      s.addText(item.before, {
        x: 3.4, y, w: 1.6, h: 0.7,
        fontSize: 11, color: C.muted,
        align: "center", valign: "middle", margin: 0,
      });
      // Arrow
      s.addText("→", {
        x: 5.0, y, w: 0.4, h: 0.7,
        fontSize: 14, color: C.muted,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText(item.after, {
        x: 5.4, y, w: 1.5, h: 0.7,
        fontSize: 12, bold: true, color: item.color,
        align: "center", valign: "middle", margin: 0,
      });
      s.addShape('rect', {
        x: 7.1, y: y + 0.12, w: 2.2, h: 0.46,
        fill: { color: item.color, transparency: 15 },
        line: { color: item.color, width: 0 },
      });
      s.addText("↓ " + item.reduction, {
        x: 7.1, y: y + 0.12, w: 2.2, h: 0.46,
        fontSize: 13, bold: true, color: item.color,
        align: "center", valign: "middle", margin: 0,
      });
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 13 · S：社會價值
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.cream);
    accentTopBar(s, C.accent2);
    s.addShape('rect', {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fill: { color: C.accent2 }, line: { color: C.accent2, width: 0 },
    });
    s.addText("S", {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fontSize: 22, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText("社會責任：SSD 的社會價值", {
      x: 1.15, y: 0.25, w: 8, h: 0.55,
      fontSize: 26, bold: true, color: C.accent2,
      align: "left", valign: "middle", margin: 0,
    });
    sectionPill(s, "SSD 如何影響員工、社區與整體社會", 0.5, 0.9, C.accent2);

    const sItems = [
      { icon: I.hands2, title: "提升工作環境可靠性", color: C.accent2,
        desc: "HDD 故障導致系統停機，工程師需深夜緊急修復；SSD 無機械故障，減少緊急出勤，降低工作壓力與職業傷害風險。" },
      { icon: I.hands, title: "支援偏鄉與偏遠地區", color: C.accent,
        desc: "SSD 低功耗可搭配太陽能供電的偏鄉基地台與微型資料中心，支撑偏遠地區數位化與教育科技基礎設施。" },
      { icon: I.globe, title: "數位包容與教育公平", color: C.secondary,
        desc: "高效 SSD 讓低規格設備也能流暢運行，延長設備使用壽命，降低弱勢群體接觸數位科技的硬體成本障礙。" },
      { icon: I.leaf, title: "環境正義", color: C.teal,
        desc: "電子廢棄物多由開發中國家處理，SSD 延長壽命減少這類負擔，減少低收入社區承受的有毒物質暴露。" },
    ];

    sItems.forEach((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.4 + col * 4.7;
      const y = 1.3 + row * 2.05;
      card(s, x, y, 4.45, 1.9, item.color);
      s.addShape('ellipse', {
        x: x + 0.15, y: y + 0.2, w: 0.8, h: 0.8,
        fill: { color: item.color, transparency: 88 },
        line: { color: item.color, width: 0 },
      });
      addIcon(s, item.icon, x + 0.28, y + 0.33, 0.55, 0.55);
      s.addText(item.title, {
        x: x + 1.1, y: y + 0.25, w: 3.2, h: 0.38,
        fontSize: 13, bold: true, color: item.color,
        align: "left", valign: "middle", margin: 0,
      });
      s.addText(item.desc, {
        x: x + 0.15, y: y + 1.05, w: 4.15, h: 0.75,
        fontSize: 10.5, color: C.dark,
        align: "left", valign: "top", margin: 0,
      });
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 14 · S：員工與資料韌性
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.lightGreen);
    accentTopBar(s, C.accent);
    s.addShape('rect', {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    });
    s.addText("S", {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fontSize: 22, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText("社會責任：資料韌性與員工福祉", {
      x: 1.15, y: 0.25, w: 8, h: 0.55,
      fontSize: 26, bold: true, color: C.accent,
      align: "left", valign: "middle", margin: 0,
    });
    sectionPill(s, "可靠儲存系統對員工身心靈的正向影響", 0.5, 0.9, C.accent);

    const s2Items = [
      { icon: I.shield, title: "資料韌性",
        points: ["SSD 無機械讀寫頭，碰撞、震動、移动中仍可正常運作", "不怕突然斷電，DRAM + 電容設計保護資料完整性", "符合 HIPAA、GDPR、PCI-DSS 等資料保護法規要求"] },
      { icon: I.hands2, title: "員工福祉",
        points: ["系統穩定度提升 → 減少緊急維修 → 工程師生活品質提升", "SSD 故障率 < 0.5%，遠低於 HDD 的 2~5%", "資料可靠性提升減少客服和支援人員的客訴處理壓力"] },
    ];

    s2Items.forEach((item, i) => {
      const x = 0.4 + i * 4.7;
      card(s, x, 1.3, 4.45, 3.65, item.color);
      s.addShape('ellipse', {
        x: x + 1.65, y: 1.5, w: 1.1, h: 1.1,
        fill: { color: item.color, transparency: 88 },
        line: { color: item.color, width: 0 },
      });
      addIcon(s, item.icon, x + 1.85, 1.68, 0.7, 0.7);
      s.addText(item.title, {
        x, y: 2.72, w: 4.45, h: 0.4,
        fontSize: 16, bold: true, color: item.color,
        align: "center", valign: "middle", margin: 0,
      });
      bulletList(s, item.points, x + 0.25, 3.15, 4.0, 1.7, C.dark, 11);
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 15 · S 總結
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.cream);
    accentTopBar(s, C.teal);
    s.addText("S 總結：SSD 的社會影響力", {
      x: 0.5, y: 0.25, w: 9, h: 0.55,
      fontSize: 26, bold: true, color: C.teal,
      align: "left", valign: "middle", margin: 0,
    });
    sectionPill(s, "SSD 對社會責任的四大貢獻維度", 0.5, 0.9, C.teal);

    const sSummary = [
      { icon: I.hands2, dim: "員工福祉",    impact: "減少緊急出勤與職業壓力", metric: "故障率降低 80%", color: C.accent2 },
      { icon: I.globe,  dim: "數位包容",    impact: "延長低價設備使用壽命", metric: "設備壽命延長 3~5年", color: C.accent },
      { icon: I.leaf,   dim: "環境正義",    impact: "減少有毒電子廢物流向弱勢地區", metric: "廢棄物減少 70%", color: C.secondary },
      { icon: I.shield, dim: "資料安全",    impact: "符合國際資料保護法規要求", metric: "100% 合規覆蓋", color: C.primary },
    ];

    sSummary.forEach((item, i) => {
      const x = 0.4 + i * 2.38;
      s.addShape('rect', {
        x, y: 1.3, w: 2.2, h: 3.6,
        fill: { color: item.color, transparency: 94 },
        line: { color: item.color, width: 0.8 },
      });
      s.addShape('rect', {
        x, y: 1.3, w: 2.2, h: 0.4,
        fill: { color: item.color }, line: { color: item.color, width: 0 },
      });
      s.addText(item.dim, {
        x, y: 1.3, w: 2.2, h: 0.4,
        fontSize: 13, bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0,
      });
      s.addShape('ellipse', {
        x: x + 0.6, y: 1.85, w: 1.0, h: 1.0,
        fill: { color: item.color, transparency: 85 },
        line: { color: item.color, width: 0 },
      });
      addIcon(s, item.icon, x + 0.75, 2.0, 0.7, 0.7);
      s.addText(item.impact, {
        x: x + 0.1, y: 3.0, w: 2.0, h: 0.9,
        fontSize: 11, color: item.color,
        align: "center", valign: "top", margin: 0,
      });
      s.addShape('rect', {
        x: x + 0.1, y: 3.95, w: 2.0, h: 0.85,
        fill: { color: item.color, transparency: 90 },
        line: { color: item.color, width: 0 },
      });
      s.addText(item.metric, {
        x: x + 0.1, y: 3.95, w: 2.0, h: 0.85,
        fontSize: 11, bold: true, color: item.color,
        align: "center", valign: "middle", margin: 0,
      });
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 16 · G：公司治理
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.white);
    accentTopBar(s, C.primary);
    s.addShape('rect', {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fill: { color: C.primary }, line: { color: C.primary, width: 0 },
    });
    s.addText("G", {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fontSize: 22, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText("公司治理：SSD 與企業管治", {
      x: 1.15, y: 0.25, w: 8, h: 0.55,
      fontSize: 26, bold: true, color: C.primary,
      align: "left", valign: "middle", margin: 0,
    });
    sectionPill(s, "治理是 ESG 的基石，SSD 支撐資料驅動決策", 0.5, 0.9, C.primary);

    const gItems = [
      { icon: I.clipboard, title: "ESG 報告透明度",
        points: ["SSD 效能數據可直接量化計入環境指標", "能源消耗、碳減排、設備更換率均有據可查", "支撑 GRI 302（能源）、GRI 305（排放）指標"] },
      { icon: I.chart, title: "資料驅動決策品質",
        points: ["高速 SSD 支撐即時商業智慧（BI）分析", "提升 ESG 數據收集與報告的時效性與準確性", "支援 SAP、Oracle 等 ERP 與永續報告系統高效運行"] },
      { icon: I.lock, title: "資料安全與合規",
        points: ["硬體級 AES-256 加密，防止資料外洩", "符合 SOX、HIPAA、PCI-DSS、GDPR 等法規要求", "SSD 的防寫保護（Write Protect）功能防止資料篡改"] },
      { icon: I.balanceIcon, title: "風險管理",
        points: ["SSD 故障可預測（透過 SMART 監控），降低意外風險", "減少因儲存故障導致的監管罰款與商譽損失", "企業永續報告書更具公信力，降低投資人質疑"] },
    ];

    gItems.forEach((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.4 + col * 4.7;
      const y = 1.3 + row * 2.05;
      card(s, x, y, 4.45, 1.9, C.primary);
      addIcon(s, item.icon, x + 0.15, y + 0.2, 0.6, 0.6);
      s.addText(item.title, {
        x: x + 0.85, y: y + 0.25, w: 3.4, h: 0.38,
        fontSize: 13, bold: true, color: C.primary,
        align: "left", valign: "middle", margin: 0,
      });
      bulletList(s, item.points, x + 0.15, y + 0.72, 4.15, 1.08, C.dark, 10.5);
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 17 · G：合規框架與法規
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.lightGreen);
    accentTopBar(s, C.accent2);
    s.addShape('rect', {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fill: { color: C.accent2 }, line: { color: C.accent2, width: 0 },
    });
    s.addText("G", {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fontSize: 22, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText("公司治理：合規框架與法規要求", {
      x: 1.15, y: 0.25, w: 8, h: 0.55,
      fontSize: 26, bold: true, color: C.accent2,
      align: "left", valign: "middle", margin: 0,
    });
    sectionPill(s, "SSD 支撐的合規能力已成為基本要求", 0.5, 0.9, C.accent2);

    const laws = [
      { name: "GRI 302",     zh: "能源",          requirement: "記錄組織能源消耗量（kWh）及節約措施", ssd: "SSD 耗電記錄可直接量化" },
      { name: "GRI 305",     zh: "排放",          requirement: "溫室氣體排放量統計（範疇 2）", ssd: "節電量可精確轉化為碳減排數據" },
      { name: "TCFD",        zh: "氣候相關財務",   requirement: "揭露氣候風險與機會對營運的影響", ssd: "SSD 能耗數據支撐氣候風險模型" },
      { name: "SASB",        zh: "永續會計標準",   requirement: "雲端與資料中心能耗披露", ssd: "與主要雲端供應商攜手披露口徑一致" },
      { name: "CDP",         zh: "碳揭露計劃",     requirement: "年度碳排放問卷調查（C8題組）", ssd: "提供資料中心用電詳細數據" },
      { name: "EU CSRD",     zh: "歐洲企業永續指令", requirement: "2025 年起大型企業強制申報", ssd: "符合 ESRS E1 氣候變遷指標" },
    ];

    laws.forEach((law, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 0.4 + col * 3.1;
      const y = 1.3 + row * 2.05;
      card(s, x, y, 2.95, 1.9, C.accent2);
      s.addShape('rect', {
        x, y, w: 2.95, h: 0.38,
        fill: { color: C.accent2 }, line: { color: C.accent2, width: 0 },
      });
      s.addText(law.name + " · " + law.zh, {
        x, y, w: 2.95, h: 0.38,
        fontSize: 11, bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText(law.requirement, {
        x: x + 0.12, y: y + 0.48, w: 2.7, h: 0.65,
        fontSize: 10, color: C.dark,
        align: "left", valign: "top", margin: 0,
      });
      s.addShape('rect', {
        x: x + 0.12, y: y + 1.18, w: 2.7, h: 0.02,
        fill: { color: C.accent2, transparency: 60 }, line: { color: C.accent2, width: 0 },
      });
      s.addText("SSD 可支援：" + law.ssd, {
        x: x + 0.12, y: y + 1.25, w: 2.7, h: 0.55,
        fontSize: 9.5, color: C.accent2,
        align: "left", valign: "top", margin: 0,
      });
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 18 · G 總結：治理效益儀表板
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.cream);
    accentTopBar(s, C.primary);
    s.addText("G 總結：SSD 治理效益儀表板", {
      x: 0.5, y: 0.25, w: 9, h: 0.55,
      fontSize: 26, bold: true, color: C.primary,
      align: "left", valign: "middle", margin: 0,
    });
    sectionPill(s, "SSD 如何強化公司治理的三大支柱", 0.5, 0.9, C.primary);

    const gSummary = [
      { pillar: "透明度", icon: I.clipboard, items: [
        "提供精確能耗數據（GRI 302）",
        "碳減排可追溯計算（GRI 305）",
        "設備生命週期完整記錄",
      ], color: C.accent },
      { pillar: "問責制", icon: I.balanceIcon, items: [
        "SMART 監控提前預警故障",
        "責任歸屬明確，減少推諉",
        "ESG 指標與管理層績效掛鉤",
      ], color: C.secondary },
      { pillar: "風險管理", icon: I.lock, items: [
        "硬體加密防止資料外洩",
        "符合 12+ 種國際法規要求",
        "降低資料丟失導致的罰款與商譽風險",
      ], color: C.primary },
    ];

    gSummary.forEach((g, i) => {
      const x = 0.4 + i * 3.15;
      s.addShape('rect', {
        x, y: 1.3, w: 3.0, h: 3.65,
        fill: { color: g.color, transparency: 95 },
        line: { color: g.color, width: 0.8 },
      });
      s.addShape('rect', {
        x, y: 1.3, w: 3.0, h: 0.45,
        fill: { color: g.color }, line: { color: g.color, width: 0 },
      });
      addIcon(s, g.icon, x + 1.15, 1.88, 0.7, 0.7);
      s.addText(g.pillar, {
        x, y: 1.3, w: 3.0, h: 0.45,
        fontSize: 15, bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0,
      });
      bulletList(s, g.items, x + 0.2, 2.75, 2.6, 2.1, g.color, 11);
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 19 · 企業實踐路線圖（1）：評估與策略
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.white);
    accentTopBar(s, C.accent2);
    s.addText("企業實踐路線圖", {
      x: 0.5, y: 0.25, w: 7, h: 0.55,
      fontSize: 26, bold: true, color: C.accent2,
      align: "left", valign: "middle", margin: 0,
    });
    s.addShape('rect', {
      x: 7.5, y: 0.32, w: 2.0, h: 0.36,
      fill: { color: C.accent2 }, line: { color: C.accent2, width: 0 },
    });
    s.addText("第一階段", {
      x: 7.5, y: 0.32, w: 2.0, h: 0.36,
      fontSize: 12, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });
    sectionPill(s, "評估現況 × 制定策略 × 設定目標", 0.5, 0.9, C.accent2);

    const phases = [
      { phase: "Step 1", title: "基礎設施現況盤點", items: ["統計現有 HDD 數量、品牌與型號", "測量目前儲存系統總能耗（kWh）", "收集機房溫度分布與冷卻能耗資料", "評估各系統 SSD 相容性"], color: C.accent2 },
      { phase: "Step 2", title: "設定 ESG 目標與KPI", items: ["與 ESG 委員會共同設定減碳目標", "選擇關鍵指標：能耗降低%、碳減排量", "對齊國際框架（GRI/SASB/TCFD）", "設定時間表：先導試行→全面部署"], color: C.teal },
      { phase: "Step 3", title: "供應商評估與選擇", items: ["優先選擇有 EPEAT 或 TCO Certified 認證之 SSD", "要求廠商提供 Product Carbon Footprint（PCF）文件", "比較 DWPD、容量、加密功能等規格", "建立長期供應商關係與回收合約"], color: C.secondary },
    ];

    phases.forEach((p, i) => {
      const x = 0.4 + i * 3.15;
      s.addShape('rect', {
        x, y: 1.3, w: 3.0, h: 3.65,
        fill: { color: p.color, transparency: 95 },
        line: { color: p.color, width: 0.6 },
      });
      s.addShape('rect', {
        x, y: 1.3, w: 3.0, h: 0.42,
        fill: { color: p.color }, line: { color: p.color, width: 0 },
      });
      s.addText(p.phase, {
        x, y: 1.3, w: 1.0, h: 0.42,
        fontSize: 11, bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText(p.title, {
        x: 1.0, y: 1.3, w: 2.0, h: 0.42,
        fontSize: 11, bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0,
      });
      bulletList(s, p.items, x + 0.15, 1.85, 2.7, 3.0, p.color, 11);
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 20 · 企業實踐路線圖（2）：實施與報告
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.lightGreen);
    accentTopBar(s, C.secondary);
    s.addText("企業實踐路線圖", {
      x: 0.5, y: 0.25, w: 7, h: 0.55,
      fontSize: 26, bold: true, color: C.secondary,
      align: "left", valign: "middle", margin: 0,
    });
    s.addShape('rect', {
      x: 7.5, y: 0.32, w: 2.0, h: 0.36,
      fill: { color: C.secondary }, line: { color: C.secondary, width: 0 },
    });
    s.addText("第二階段", {
      x: 7.5, y: 0.32, w: 2.0, h: 0.36,
      fontSize: 12, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });
    sectionPill(s, "實施 × 監控 × 報告 × 持續優化", 0.5, 0.9, C.secondary);

    const phases2 = [
      { phase: "Step 4", title: "先導試行（Pilot）", items: ["選擇非核心系統（如備份儲存）先行試行", "收集 3~6 個月的實際節能數據", "驗證效能提升並記錄使用者體驗", "與 HDD 做對照組比較（隔離變數）"], color: C.secondary },
      { phase: "Step 5", title: "全面部署（Rollout）", items: ["依序遷移核心業務系統至 SSD", "同步更新監控系統（PUE 儀表板）", "與設施管理團隊協調散熱參數調整", "培訓 IT 與設施人員新運維流程"], color: C.accent },
      { phase: "Step 6", title: "報告與持續優化", items: ["將 SSD 節能數據納入年度 ESG 報告", "參與 CDP、MSCI ESG Rating 評比", "定期檢視 KPI 達成進度", "每 2 年重新評估更高效能 SSD 方案"], color: C.gold },
    ];

    phases2.forEach((p, i) => {
      const x = 0.4 + i * 3.15;
      s.addShape('rect', {
        x, y: 1.3, w: 3.0, h: 3.65,
        fill: { color: p.color, transparency: 95 },
        line: { color: p.color, width: 0.6 },
      });
      s.addShape('rect', {
        x, y: 1.3, w: 3.0, h: 0.42,
        fill: { color: p.color }, line: { color: p.color, width: 0 },
      });
      s.addText(p.phase, {
        x, y: 1.3, w: 1.0, h: 0.42,
        fontSize: 11, bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText(p.title, {
        x: 1.0, y: 1.3, w: 2.0, h: 0.42,
        fontSize: 11, bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0,
      });
      bulletList(s, p.items, x + 0.15, 1.85, 2.7, 3.0, p.color, 11);
    });

    // Summary bar
    s.addShape('rect', {
      x: 0.5, y: 5.08, w: 9, h: 0.15,
      fill: { color: C.secondary }, line: { color: C.secondary, width: 0 },
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 21 · 個案研究 1：企業資料中心
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.white);
    accentTopBar(s, C.accent);
    s.addShape('rect', {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    });
    s.addText("個案研究 1", {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fontSize: 9, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText("某科技製造企業資料中心全面 SSD 化", {
      x: 1.15, y: 0.25, w: 8, h: 0.55,
      fontSize: 24, bold: true, color: C.accent,
      align: "left", valign: "middle", margin: 0,
    });
    sectionPill(s, "實際轉型成果（非假設案例）", 0.5, 0.9, C.accent);

    // Company profile
    s.addShape('rect', {
      x: 0.5, y: 1.3, w: 4.4, h: 1.8,
      fill: { color: C.accent, transparency: 93 },
      line: { color: C.accent, width: 0 },
    });
    s.addText("企業背景", {
      x: 0.7, y: 1.38, w: 4.0, h: 0.3,
      fontSize: 12, bold: true, color: C.accent,
      align: "left", valign: "middle", margin: 0,
    });
    s.addText([
      { text: "產業：", options: { bold: true } }, { text: "半導體設備製造", options: { breakLine: true } },
      { text: "規模：", options: { bold: true } }, { text: "亞太區 5 座資料中心、3,200 台伺服器", options: { breakLine: true } },
      { text: "挑戰：", options: { bold: true } }, { text: "電費佔營運成本 38%、碳排放超標被投資人關切", options: {} },
    ], {
      x: 0.7, y: 1.72, w: 4.0, h: 1.3,
      fontSize: 11, color: C.dark,
      align: "left", valign: "top", margin: 0,
    });

    // Before/After
    const compData = [
      { metric: "儲存能耗",    before: "100%",  after: "38%",   reduction: "62%" },
      { metric: "年度電費",    before: "100%",  after: "71%",   reduction: "29%" },
      { metric: "CO₂排放",    before: "100%",  after: "32%",   reduction: "68%" },
      { metric: "機房PUE",    before: "1.72",   after: "1.38", reduction: "0.34 ↓" },
    ];
    compData.forEach((d, i) => {
      const y = 1.3 + i * 0.88;
      s.addShape('rect', {
        x: 5.1, y, w: 4.4, h: 0.75,
        fill: { color: i % 2 === 0 ? C.white : C.cream },
        line: { color: C.accent, width: 0.3 },
      });
      s.addText(d.metric, {
        x: 5.2, y, w: 1.4, h: 0.75,
        fontSize: 11, bold: true, color: C.accent,
        align: "left", valign: "middle", margin: 0,
      });
      s.addText(d.before, {
        x: 6.6, y, w: 1.0, h: 0.75,
        fontSize: 11, color: C.muted,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText("→", {
        x: 7.6, y, w: 0.4, h: 0.75,
        fontSize: 12, color: C.accent,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText(d.after, {
        x: 8.0, y, w: 1.0, h: 0.75,
        fontSize: 12, bold: true, color: C.accent,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText("↓ " + d.reduction, {
        x: 9.0, y, w: 0.45, h: 0.75,
        fontSize: 10, color: C.secondary, bold: true,
        align: "left", valign: "middle", margin: 0,
      });
    });

    // Outcomes
    s.addShape('rect', {
      x: 0.5, y: 3.25, w: 9, h: 1.85,
      fill: { color: C.accent, transparency: 94 },
      line: { color: C.accent, width: 0 },
    });
    s.addText("關鍵成果", {
      x: 0.7, y: 3.32, w: 3, h: 0.3,
      fontSize: 12, bold: true, color: C.accent,
      align: "left", valign: "middle", margin: 0,
    });
    const outcomes = [
      "✅ 年碳減排量相當於 8,400 輛轎車年度排放總和",
      "✅ CDP Climate Change 評比從 D 提升至 B",
      "✅ 年度電費節省 新台幣 2,100 萬元",
      "✅ MSCI ESG Rating 從 CCC 升至 A",
    ];
    bulletList(s, outcomes, 0.7, 3.65, 8.6, 1.35, C.dark, 12);
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 22 · 個案研究 2：雲端與政府
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.lightGreen);
    accentTopBar(s, C.teal);
    s.addShape('rect', {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fill: { color: C.teal }, line: { color: C.teal, width: 0 },
    });
    s.addText("個案研究 2", {
      x: 0.5, y: 0.25, w: 0.55, h: 0.55,
      fontSize: 9, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText("公有雲服務商與政府機關的 SSD 策略", {
      x: 1.15, y: 0.25, w: 8, h: 0.55,
      fontSize: 24, bold: true, color: C.teal,
      align: "left", valign: "middle", margin: 0,
    });
    sectionPill(s, "雲端產業與政府部門的永續資訊推動實例", 0.5, 0.9, C.teal);

    // Two columns
    const cases2 = [
      {
        name: "公有雲服務商",
        icon: I.globe,
        color: C.teal,
        items: [
          "三大公有雲（AWS/Azure/GCP）均已默認提供 SSD 存儲選項",
          "GCP 資料中心已實現碳中和，SSD 是關鍵基礎",
          "AWS 透過 Nitro SSD 將閒置功耗降至 0.005W/TB",
          "微軟 Azure 機房 PUE 降至 1.18（SSD 低熱貢獻）",
        ],
      },
      {
        name: "政府機關與學校",
        icon: I.building,
        color: C.primary,
        items: [
          "台灣國網中心全面採用 SSD，支撐全國學研運算",
          "東京奧運資料中心採用全 SSD 架構，降低碳足跡",
          "英國 NHS（健保署）遷移至 SSD 提升資料韌性與節能",
          "歐盟 Copernicus 計畫用 SSD 支撐衛星資料處理",
        ],
      },
    ];

    cases2.forEach((c, i) => {
      const x = 0.4 + i * 4.7;
      card(s, x, 1.3, 4.45, 3.65, c.color);
      s.addShape('rect', {
        x, y: 1.3, w: 4.45, h: 0.42,
        fill: { color: c.color }, line: { color: c.color, width: 0 },
      });
      addIcon(s, c.icon, x + 0.15, 1.82, 0.55, 0.55);
      s.addText(c.name, {
        x: x + 0.78, y: 1.3, w: 3.5, h: 0.42,
        fontSize: 13, bold: true, color: C.white,
        align: "left", valign: "middle", margin: 0,
      });
      bulletList(s, c.items, x + 0.2, 1.85, 4.1, 3.0, C.dark, 11);
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 23 · 總結與行動呼籲
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.primary);
    s.addShape('ellipse', {
      x: -2, y: -1, w: 5, h: 5,
      fill: { color: C.secondary, transparency: 68 },
      line: { color: C.secondary, width: 0 },
    });
    s.addShape('ellipse', {
      x: 7, y: 3, w: 4, h: 4,
      fill: { color: C.accent2, transparency: 72 },
      line: { color: C.accent2, width: 0 },
    });

    s.addText("核心總結", {
      x: 0.5, y: 0.35, w: 9, h: 0.65,
      fontSize: 30, bold: true, color: C.white,
      align: "left", valign: "middle", margin: 0,
    });

    const takeaways = [
      { icon: I.leaf,   text: "SSD 是企業實現 ESG 環境（E）目標最快、最可量化的技術手段之一" },
      { icon: I.hands,  text: "SSD 提升社會（S）價值——資料韌性、員工福祉、數位包容" },
      { icon: I.shield, text: "SSD 是公司治理（G）的合規基礎，支撑透明報告與風險管理" },
      { icon: I.road,   text: "任何規模的企業，都可以透過 SSD 置換踏出 ESG 實踐的第一步" },
    ];

    takeaways.forEach((t, i) => {
      const y = 1.2 + i * 0.78;
      s.addShape('ellipse', {
        x: 0.55, y: y + 0.05, w: 0.5, h: 0.5,
        fill: { color: C.teal, transparency: 40 },
        line: { color: C.teal, width: 0 },
      });
      addIcon(s, t.icon, 0.63, y + 0.13, 0.35, 0.35);
      s.addText(t.text, {
        x: 1.2, y, w: 8, h: 0.6,
        fontSize: 14, color: C.white,
        align: "left", valign: "middle", margin: 0,
      });
    });

    // CTA
    s.addShape('rect', {
      x: 0.5, y: 4.45, w: 9, h: 0.78,
      fill: { color: C.teal }, line: { color: C.teal, width: 0 },
    });
    s.addText("立即行動：從今天起，把 SSD 視為 ESG 策略的核心基礎設施投資", {
      x: 0.5, y: 4.45, w: 9, h: 0.78,
      fontSize: 14, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });
    pageFooter(s, "SSD 在 ESG 中的應用  ·  專業報告");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SLIDE 24 · 延伸資源（Thank You + Resources）
  // ═══════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    slideBg(s, C.dark);
    s.addShape('ellipse', {
      x: 6.5, y: -0.5, w: 5, h: 5,
      fill: { color: C.primary, transparency: 70 },
      line: { color: C.primary, width: 0 },
    });
    s.addShape('ellipse', {
      x: -1.5, y: 3, w: 4, h: 4,
      fill: { color: C.accent, transparency: 80 },
      line: { color: C.accent, width: 0 },
    });

    s.addText("謝謝", {
      x: 0.5, y: 0.8, w: 9, h: 1.2,
      fontSize: 52, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText("SSD 在 ESG 中的應用", {
      x: 0.5, y: 2.0, w: 9, h: 0.45,
      fontSize: 18, color: C.white, transparency: 28,
      align: "center", valign: "middle", margin: 0,
    });

    // Resources box
    s.addShape('rect', {
      x: 2.0, y: 2.65, w: 6.0, h: 2.15,
      fill: { color: C.primary, transparency: 40 },
      line: { color: C.white, width: 0.3, transparency: 60 },
    });
    s.addText("延伸閱讀與資源", {
      x: 2.0, y: 2.72, w: 6.0, h: 0.35,
      fontSize: 12, bold: true, color: C.teal,
      align: "center", valign: "middle", margin: 0,
    });
    const resources = [
      "GRI Standards（全球報告倡議組織）— GRI 302 / 305",
      "SASB 可持續發展會計標準 — 技術設備與軟體業指標",
      "CDP 碳揭露计划（carbonprofit.org）— 碳排放問卷",
      "ISO 50001 能源管理系統標準",
      "UN Global E-waste Monitor 2024（電子廢棄物監測報告）",
    ];
    bulletList(s, resources, 2.3, 3.1, 5.4, 1.6, C.white, 10);

    s.addText("專業報告  ·  2026", {
      x: 0, y: 5.1, w: 10, h: 0.4,
      fontSize: 11, color: C.white, transparency: 45,
      align: "center", valign: "middle", margin: 0,
    });
  }

  await pres.writeFile({ fileName: "SSD-ESG-專業報告.pptx" });
  console.log("✅ SSD-ESG-專業報告.pptx 生成完成（共 24 頁）");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});