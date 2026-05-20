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

async function makeIcons(icons) {
  const results = {};
  for (const [key, [Icon, color]] of Object.entries(icons)) {
    results[key] = await iconToBase64Png(Icon, color, 256);
  }
  return results;
}

// ─── Palette ───────────────────────────────────────────────────────────────────
const C = {
  // ESG theme: forest green + tech blue
  primary:    "1B5E20",   // deep green
  secondary:  "2E7D32",   // medium green
  accent:     "0288D1",   // tech blue
  accent2:    "00A896",   // teal
  lightGreen: "E8F5E9",   // very light green bg
  white:      "FFFFFF",
  dark:       "1C2B1C",   // near-black green
  muted:      "546E7A",   // blue-grey
  gold:       "F9A825",   // energy yellow
  coral:      "E64A19",   // warm red-orange
  cream:      "F5F7F2",   // off-white
  cardBg:     "F8FBF3",   // card background
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function card(slide, pres, x, y, w, h, accentColor) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: C.cardBg },
    line: { color: accentColor, width: 0.5 },
    shadow: { type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.08 },
  });
  // left accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.06, h,
    fill: { color: accentColor },
    line: { color: accentColor, width: 0 },
  });
}

function bigStat(slide, pres, x, y, w, h, number, label, accentColor) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: accentColor, transparency: 10 },
    line: { color: accentColor, width: 0 },
  });
  slide.addText(number, {
    x, y: y + 0.1, w, h: h * 0.6,
    fontSize: 40, bold: true, color: accentColor,
    align: "center", valign: "bottom", margin: 0,
  });
  slide.addText(label, {
    x, y: y + h * 0.55, w, h: h * 0.4,
    fontSize: 11, color: C.muted,
    align: "center", valign: "top", margin: 0,
  });
}

function sectionTag(slide, pres, text, x, y, bgColor) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: text.length * 0.13 + 0.4, h: 0.32,
    fill: { color: bgColor, transparency: 15 },
    line: { color: bgColor, width: 0 },
  });
  slide.addText(text, {
    x: x + 0.2, y, w: text.length * 0.13 + 0.2, h: 0.32,
    fontSize: 10, bold: true, color: bgColor,
    align: "left", valign: "middle", margin: 0,
  });
}

// ─── Main Script ───────────────────────────────────────────────────────────────
async function main() {
  const { FaLeaf, FaRecycle, FaDatabase, FaServer, FaBuilding, FaCheckCircle,
          FaBolt, FaSnowflake, FaShieldAlt, FaArrowRight, FaChartLine,
          FaMicrochip, FaPlug, FaGlobeAmericas, FaIndustry } = require("react-icons/fa");
  const { MdRecycle, MdSpeed } = require("react-icons/md");
  const { BiLeaf } = require("react-icons/bi");

  const icons = await makeIcons({
    leaf:      [FaLeaf, "#" + C.secondary],
    recycle:   [FaRecycle, "#" + C.accent2],
    database:  [FaDatabase, "#" + C.accent],
    server:    [FaServer, "#" + C.secondary],
    building:  [FaBuilding, "#" + C.primary],
    check:     [FaCheckCircle, "#" + C.secondary],
    bolt:      [FaBolt, "#" + C.gold],
    snowflake: [FaSnowflake, "#" + C.accent],
    shield:    [FaShieldAlt, "#" + C.accent2],
    arrow:     [FaArrowRight, "#" + C.accent],
    chart:     [FaChartLine, "#" + C.accent],
    chip:      [FaMicrochip, "#" + C.muted],
    plug:      [FaPlug, "#" + C.muted],
    globe:     [FaGlobeAmericas, "#" + C.accent],
    industry:  [FaIndustry, "#" + C.primary],
  });

  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title = "ESG 與 SSD：從基礎到實務";
  pres.author = "教育訓練教材";

  // ───────────────────────────────────────────────────────────────────────────────
  // SLIDE 1 · 標題頁
  // ───────────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    // full dark green background
    s.background = { color: C.primary };
    // decorative circle top-right
    s.addShape(pres.shapes.OVAL, {
      x: 7.5, y: -1.5, w: 4, h: 4,
      fill: { color: C.secondary, transparency: 60 },
      line: { color: C.secondary, width: 0 },
    });
    // decorative circle bottom-left
    s.addShape(pres.shapes.OVAL, {
      x: -1, y: 3.5, w: 3, h: 3,
      fill: { color: C.accent2, transparency: 70 },
      line: { color: C.accent2, width: 0 },
    });
    // white accent line left
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.7, y: 1.2, w: 0.05, h: 3.2,
      fill: { color: C.white, transparency: 40 },
      line: { color: C.white, width: 0 },
    });
    // ESG badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.9, y: 1.3, w: 1.6, h: 0.36,
      fill: { color: C.accent2 },
      line: { color: C.accent2, width: 0 },
    });
    s.addText("ESG × SSD", {
      x: 0.9, y: 1.3, w: 1.6, h: 0.36,
      fontSize: 11, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });
    // main title
    s.addText("永續科技 from SSD", {
      x: 0.9, y: 1.9, w: 8, h: 1.4,
      fontSize: 38, bold: true, color: C.white,
      align: "left", valign: "middle", margin: 0,
    });
    // subtitle
    s.addText("固態硬碟的 ESG 價值 × 企業永續實踐", {
      x: 0.9, y: 3.3, w: 8, h: 0.5,
      fontSize: 16, color: C.white, transparency: 25,
      align: "left", valign: "top", margin: 0,
    });
    // bottom info bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 5.1, w: 10, h: 0.525,
      fill: { color: C.dark },
      line: { color: C.dark, width: 0 },
    });
    s.addText("教育訓練教材  ·  入門課程  ·  2026", {
      x: 0, y: 5.1, w: 10, h: 0.525,
      fontSize: 11, color: C.white, transparency: 35,
      align: "center", valign: "middle", margin: 0,
    });
    // icon
    s.addImage({ data: icons.chip, x: 7.8, y: 2.0, w: 1.6, h: 1.6 });
  }

  // ───────────────────────────────────────────────────────────────────────────────
  // SLIDE 2 · 什麼是 ESG？（用日常比喻切入）
  // ───────────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.cream };

    // Top accent bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.08,
      fill: { color: C.primary },
      line: { color: C.primary, width: 0 },
    });

    // Title
    s.addText("先問一個問題", {
      x: 0.5, y: 0.25, w: 9, h: 0.55,
      fontSize: 28, bold: true, color: C.primary,
      align: "left", valign: "middle", margin: 0,
    });

    // Big question box
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 0.95, w: 9, h: 1.0,
      fill: { color: C.lightGreen },
      line: { color: C.secondary, width: 0.5 },
    });
    s.addText("一間公司，只顧賺錢、不管環境、欺負員工——你會想買它的股票嗎？", {
      x: 0.7, y: 0.95, w: 8.6, h: 1.0,
      fontSize: 18, color: C.dark,
      align: "center", valign: "middle", margin: 0,
    });

    // Three E S G cards
    const items = [
      { icon: icons.leaf,    label: "E", zh: "環境保護",    en: "Environmental", color: C.secondary,
        desc: "減少污染、節約能源、\n保護自然資源" },
      { icon: icons.globe,   label: "S", zh: "社會責任",    en: "Social",        color: C.accent,
        desc: "善待員工、回饋社區、\n尊重人權" },
      { icon: icons.shield,   label: "G", zh: "公司治理",    en: "Governance",    color: C.primary,
        desc: "透明營運、誠實報告、\n反腐敗、防內線" },
    ];

    items.forEach((item, i) => {
      const x = 0.5 + i * 3.1;
      card(s, pres, pres, x, 2.2, 2.9, 2.65, item.color);
      s.addImage({ data: item.icon, x: x + 0.95, y: 2.35, w: 1.0, h: 1.0 });
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.7, y: 3.45, w: 1.5, h: 0.38,
        fill: { color: item.color },
        line: { color: item.color, width: 0 },
      });
      s.addText(item.label, {
        x: x + 0.7, y: 3.45, w: 1.5, h: 0.38,
        fontSize: 18, bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText(item.zh, {
        x, y: 3.93, w: 2.9, h: 0.38,
        fontSize: 16, bold: true, color: item.color,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText(item.en, {
        x, y: 4.28, w: 2.9, h: 0.22,
        fontSize: 10, color: C.muted,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText(item.desc, {
        x: x + 0.15, y: 4.5, w: 2.6, h: 0.35,
        fontSize: 10, color: C.muted,
        align: "center", valign: "top", margin: 0,
      });
    });

    // Bottom tip
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 5.05, w: 9, h: 0.4,
      fill: { color: C.gold, transparency: 80 },
      line: { color: C.gold, width: 0 },
    });
    s.addText("💡 ESG 是評估一家公司「是否值得長期投資」的核心框架", {
      x: 0.5, y: 5.05, w: 9, h: 0.4,
      fontSize: 12, color: C.dark,
      align: "center", valign: "middle", margin: 0,
    });
  }

  // ───────────────────────────────────────────────────────────────────────────────
  // SLIDE 3 · 什麼是 SSD？
  // ───────────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.white };

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.08,
      fill: { color: C.accent },
      line: { color: C.accent, width: 0 },
    });

    s.addText("SSD 是什麼？", {
      x: 0.5, y: 0.25, w: 9, h: 0.55,
      fontSize: 28, bold: true, color: C.accent,
      align: "left", valign: "middle", margin: 0,
    });

    sectionTag(s, pres, "固態硬碟 Solid-State Drive", 0.5, 0.9, C.accent);

    // Two-column: 圖示 left, 比較 right
    s.addImage({ data: icons.chip, x: 0.6, y: 1.4, w: 3.2, h: 3.2 });

    // HDD vs SSD comparison table
    const rows = [
      [
        { text: "比一比", options: { bold: true, fill: { color: C.accent }, color: C.white } },
        { text: "傳統 HDD", options: { bold: true, fill: { color: C.coral }, color: C.white } },
        { text: "SSD", options: { bold: true, fill: { color: C.accent2 }, color: C.white } },
      ],
      [
        { text: "儲存原理", options: { bold: true } },
        { text: "旋轉磁盤 + 讀寫頭", options: { color: C.coral } },
        { text: "快閃記憶體（NAND Flash）", options: { color: C.accent2 } },
      ],
      [
        { text: "有機械零件？", options: { bold: true } },
        { text: "✅ 有（會磨損）", options: { color: C.coral } },
        { text: "❌ 沒有（全固態）", options: { color: C.accent2 } },
      ],
      [
        { text: "讀寫速度", options: { bold: true } },
        { text: "慢（50~150 MB/s）", options: { color: C.coral } },
        { text: "快（500~7,000 MB/s）", options: { color: C.accent2 } },
      ],
      [
        { text: "耗電量", options: { bold: true } },
        { text: "高（需馬達旋轉）", options: { color: C.coral } },
        { text: "低（無機械動作）", options: { color: C.accent2 } },
      ],
      [
        { text: "發熱量", options: { bold: true } },
        { text: "高", options: { color: C.coral } },
        { text: "低", options: { color: C.accent2 } },
      ],
      [
        { text: "價格（同容量）", options: { bold: true } },
        { text: "便宜", options: { color: C.coral } },
        { text: "較貴", options: { color: C.accent2 } },
      ],
    ];

    s.addTable(rows, {
      x: 3.9, y: 1.35, w: 5.7,
      colW: [1.6, 2.0, 2.1],
      border: { pt: 0.5, color: "E0E0E0" },
      fontFace: "Microsoft JhengHei",
      fontSize: 11,
      color: C.dark,
      align: "left",
      valign: "middle",
      rowH: 0.4,
    });

    // Bottom note
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 4.9, w: 9, h: 0.55,
      fill: { color: C.accent, transparency: 90 },
      line: { color: C.accent, width: 0 },
    });
    s.addText("📌 SSD 不只是「比較快的硬碟」——它改變了整個資料中心的能源邏輯", {
      x: 0.5, y: 4.9, w: 9, h: 0.55,
      fontSize: 13, bold: true, color: C.accent,
      align: "center", valign: "middle", margin: 0,
    });
  }

  // ───────────────────────────────────────────────────────────────────────────────
  // SLIDE 4 · SSD 的 ESG 價值觀（三大 benefit cards）
  // ───────────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.lightGreen };

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.08,
      fill: { color: C.primary },
      line: { color: C.primary, width: 0 },
    });

    s.addText("SSD 的 ESG 價值", {
      x: 0.5, y: 0.25, w: 9, h: 0.55,
      fontSize: 28, bold: true, color: C.primary,
      align: "left", valign: "middle", margin: 0,
    });

    sectionTag(s, pres, "為什麼 SSD 能幫助 ESG？", 0.5, 0.9, C.primary);

    const benefits = [
      {
        icon: icons.bolt, color: C.gold, tag: "E · 環境",
        title: "節能 70%",
        points: ["無馬達，無旋轉損耗", "發熱量低，空調需求下降", "讀寫速度快 = 任務更快完成 = 待機時間更長", "等同減少碳排放"],
      },
      {
        icon: icons.snowflake, color: C.accent, tag: "E · 環境",
        title: "散热 × 空間",
        points: ["低熱產生，機房溫控負擔降低", "體積小（2.5吋/M.2），機房占用空間更少", "可靠性高，減少硬體更換頻率", "降低電子廢棄物"],
      },
      {
        icon: icons.shield, color: C.accent2, tag: "G · 治理",
        title: "穩定 × 合規",
        points: ["無機械故障風險，系統穩定度提升", "符合企業永續報告（CSR/ESG Report）要求", "高效能支撐資料分析，合規審查更快速", "支援绿色資料中心認證（如 LEED、ISO 50001）"],
      },
    ];

    benefits.forEach((b, i) => {
      const x = 0.4 + i * 3.15;
      // Card background
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.4, w: 3.0, h: 3.85,
        fill: { color: C.white },
        line: { color: b.color, width: 0.5 },
        shadow: { type: "outer", color: "000000", blur: 10, offset: 3, angle: 135, opacity: 0.1 },
      });
      // Top color band
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.4, w: 3.0, h: 0.08,
        fill: { color: b.color },
        line: { color: b.color, width: 0 },
      });
      // Icon circle
      s.addShape(pres.shapes.OVAL, {
        x: x + 0.95, y: 1.6, w: 1.1, h: 1.1,
        fill: { color: b.color, transparency: 85 },
        line: { color: b.color, width: 0 },
      });
      s.addImage({ data: b.icon, x: x + 1.1, y: 1.75, w: 0.8, h: 0.8 });
      // Tag
      s.addText(b.tag, {
        x, y: 2.8, w: 3.0, h: 0.28,
        fontSize: 10, bold: true, color: b.color,
        align: "center", valign: "middle", margin: 0,
      });
      // Title
      s.addText(b.title, {
        x, y: 3.05, w: 3.0, h: 0.4,
        fontSize: 18, bold: true, color: C.dark,
        align: "center", valign: "middle", margin: 0,
      });
      // Bullet points
      const bulletText = b.points.map((pt, pi) => ({
        text: pt,
        options: { bullet: true, breakLine: pi < b.points.length - 1 },
      }));
      s.addText(bulletText, {
        x: x + 0.2, y: 3.5, w: 2.6, h: 1.65,
        fontSize: 10, color: C.muted,
        align: "left", valign: "top",
        paraSpaceAfter: 4,
      });
    });
  }

  // ───────────────────────────────────────────────────────────────────────────────
  // SLIDE 5 · 數據說話（用數字建立說服力）
  // ───────────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.white };

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.08,
      fill: { color: C.accent },
      line: { color: C.accent, width: 0 },
    });

    s.addText("用數據說話", {
      x: 0.5, y: 0.25, w: 9, h: 0.55,
      fontSize: 28, bold: true, color: C.accent,
      align: "left", valign: "middle", margin: 0,
    });

    sectionTag(s, pres, "SSD vs HDD 真實數據對比", 0.5, 0.9, C.accent);

    const stats = [
      { number: "70%", label: "能耗節省", sub: "SSD vs HDD（無機械馬達）", color: C.secondary },
      { number: "3~5x", label: "壽命延長", sub: "平均無故障運行時間", color: C.accent2 },
      { number: "50%", label: "機房空間", sub: "相同容量，SSD 佔用空間", color: C.accent },
      { number: "30%", label: "散熱降低", sub: "機房溫控負擔減輕", color: C.gold },
    ];

    stats.forEach((st, i) => {
      const x = 0.5 + i * 2.35;
      bigStat(s, pres, x, 1.35, 2.15, 1.55, st.number, st.label, st.color);
      s.addText(st.sub, {
        x, y: 2.95, w: 2.15, h: 0.35,
        fontSize: 10, color: C.muted,
        align: "center", valign: "top", margin: 0,
      });
    });

    // Comparison visual: energy bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 3.5, w: 9, h: 0.38,
      fill: { color: "EEEEEE" },
      line: { color: "EEEEEE", width: 0 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 3.5, w: 9 * 0.7, h: 0.38,
      fill: { color: C.secondary, transparency: 20 },
      line: { color: C.secondary, width: 0 },
    });
    s.addText("HDD 能耗", {
      x: 0.6, y: 3.5, w: 2, h: 0.38,
      fontSize: 10, bold: true, color: C.secondary,
      align: "left", valign: "middle", margin: 0,
    });
    s.addText("SSD 能耗（節省 30%）", {
      x: 0.5 + 9 * 0.7 + 0.15, y: 3.5, w: 3, h: 0.38,
      fontSize: 10, bold: true, color: C.accent,
      align: "left", valign: "middle", margin: 0,
    });

    // Real-world context
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 4.1, w: 9, h: 1.3,
      fill: { color: C.lightGreen },
      line: { color: C.secondary, width: 0.5 },
    });
    s.addText("🌍 實際案例", {
      x: 0.7, y: 4.2, w: 3, h: 0.32,
      fontSize: 12, bold: true, color: C.primary,
      align: "left", valign: "middle", margin: 0,
    });
    s.addText([
      { text: "一個中型資料中心（1,000 台伺服器）全面換裝 SSD：", options: { breakLine: true } },
      { text: "每年減少碳排放約 ", options: {} },
      { text: "1,200 噸 CO₂", options: { bold: true, color: C.secondary } },
      { text: "，節省電力費用約 ", options: {} },
      { text: "15~20%", options: { bold: true, color: C.accent } },
      { text: "（資料來源：企業永續報告常見數據）", options: {} },
    ], {
      x: 0.7, y: 4.55, w: 8.6, h: 0.8,
      fontSize: 13, color: C.dark,
      align: "left", valign: "top", margin: 0,
    });
  }

  // ───────────────────────────────────────────────────────────────────────────────
  // SLIDE 6 · ESG 報告怎麼寫進 SSD？（實務操作）
  // ───────────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.cream };

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.08,
      fill: { color: C.primary },
      line: { color: C.primary, width: 0 },
    });

    s.addText("ESG 報告怎麼呈現 SSD 效益？", {
      x: 0.5, y: 0.25, w: 9, h: 0.55,
      fontSize: 26, bold: true, color: C.primary,
      align: "left", valign: "middle", margin: 0,
    });

    sectionTag(s, pres, "把技術行動轉化為 ESG 敘事", 0.5, 0.9, C.primary);

    // 4 steps flow
    const steps = [
      { num: "01", title: "盤點基礎設施", desc: "統計目前 HDD 數量、耗電量、機房面積", icon: icons.server, color: C.secondary },
      { num: "02", title: "計算置換效益", desc: "用公式推估節能、減碳、空間節省數字", icon: icons.chart, color: C.accent },
      { num: "03", title: "對應 ESG 框架", desc: "寫入 E（節能減碳）+ G（風險管理）章節", icon: icons.building, color: C.accent2 },
      { num: "04", title: "量化並視覺化", desc: "用圖表呈現年度能耗差異、碳減排成果", icon: icons.leaf, color: C.gold },
    ];

    steps.forEach((st, i) => {
      const x = 0.4 + i * 2.38;
      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.35, w: 2.2, h: 2.75,
        fill: { color: C.white },
        line: { color: st.color, width: 0.5 },
        shadow: { type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.08 },
      });
      // Number badge
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.15, y: 1.5, w: 0.65, h: 0.65,
        fill: { color: st.color },
        line: { color: st.color, width: 0 },
      });
      s.addText(st.num, {
        x: x + 0.15, y: 1.5, w: 0.65, h: 0.65,
        fontSize: 18, bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0,
      });
      s.addImage({ data: st.icon, x: x + 0.95, y: 1.55, w: 1.0, h: 1.0 });
      s.addText(st.title, {
        x: x + 0.1, y: 2.6, w: 2.0, h: 0.4,
        fontSize: 13, bold: true, color: C.dark,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText(st.desc, {
        x: x + 0.1, y: 3.0, w: 2.0, h: 1.0,
        fontSize: 10, color: C.muted,
        align: "center", valign: "top", margin: 0,
      });
      // Arrow between cards
      if (i < 3) {
        s.addImage({ data: icons.arrow, x: x + 2.1, y: 2.35, w: 0.35, h: 0.35 });
      }
    });

    // Bottom example box
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 4.3, w: 9, h: 1.1,
      fill: { color: C.primary },
      line: { color: C.primary, width: 0 },
    });
    s.addText("📝 報告內文範例", {
      x: 0.7, y: 4.4, w: 3, h: 0.3,
      fontSize: 11, bold: true, color: C.accent2,
      align: "left", valign: "middle", margin: 0,
    });
    s.addText("「本公司於 2025 年將資料中心儲存系統全面升級至 SSD，相較傳統 HDD 架構，年耗電量減少 42%，相當於減少 680 噸碳排放，並獲得 ISO 50001 能源管理認證。」", {
      x: 0.7, y: 4.72, w: 8.6, h: 0.6,
      fontSize: 12, color: C.white, italic: true,
      align: "left", valign: "top", margin: 0,
    });
  }

  // ───────────────────────────────────────────────────────────────────────────────
  // SLIDE 7 · 企業實踐路線圖（從決策到行動）
  // ───────────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.white };

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.08,
      fill: { color: C.accent2 },
      line: { color: C.accent2, width: 0 },
    });

    s.addText("企業行動路線圖", {
      x: 0.5, y: 0.25, w: 9, h: 0.55,
      fontSize: 28, bold: true, color: C.accent2,
      align: "left", valign: "middle", margin: 0,
    });

    sectionTag(s, pres, "從評估到減碳，一步步實踐 ESG", 0.5, 0.9, C.accent2);

    // Timeline
    const timeline = [
      { phase: "第一階段", title: "評估與規劃", dur: "1~2 個月", items: ["盤點現有 HDD 數量與能耗", "計算 SSD 置換ROI", "擬定分階段置換計畫"], color: C.secondary },
      { phase: "第二階段", title: "先導試行", dur: "2~3 個月", items: ["選擇非核心系統先行", "收集實際節能數據", "驗證效能提升效果"], color: C.accent },
      { phase: "第三階段", title: "全面部署", dur: "6~12 個月", items: ["核心系統陸續遷移", "更新機房溫控設定", "建立監控儀表板"], color: C.accent2 },
      { phase: "第四階段", title: "報告與優化", dur: "持續", items: ["年報呈現減碳成果", "參與 ESG 評比（MSCI、S&P）", "持續追蹤優化效益"], color: C.gold },
    ];

    timeline.forEach((t, i) => {
      const x = 0.35 + i * 2.4;
      // Phase card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.35, w: 2.2, h: 3.2,
        fill: { color: t.color, transparency: 92 },
        line: { color: t.color, width: 1 },
      });
      // Phase label
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.35, w: 2.2, h: 0.42,
        fill: { color: t.color },
        line: { color: t.color, width: 0 },
      });
      s.addText(t.phase, {
        x, y: 1.35, w: 2.2, h: 0.42,
        fontSize: 13, bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText(t.title, {
        x, y: 1.82, w: 2.2, h: 0.4,
        fontSize: 14, bold: true, color: t.color,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText(t.dur, {
        x, y: 2.18, w: 2.2, h: 0.25,
        fontSize: 10, color: C.muted,
        align: "center", valign: "middle", margin: 0,
      });
      // Items
      const bulletText = t.items.map((it, pi) => ({
        text: it,
        options: { bullet: true, breakLine: pi < t.items.length - 1 },
      }));
      s.addText(bulletText, {
        x: x + 0.15, y: 2.5, w: 1.9, h: 1.95,
        fontSize: 10, color: C.dark,
        align: "left", valign: "top",
        paraSpaceAfter: 4,
      });
    });

    // Bottom note
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 4.75, w: 9, h: 0.7,
      fill: { color: C.accent2, transparency: 90 },
      line: { color: C.accent2, width: 0.5 },
    });
    s.addText("💡 關鍵原則：ESG 不是口號，是可量化、可報告、可追蹤的實際行動", {
      x: 0.5, y: 4.75, w: 9, h: 0.7,
      fontSize: 13, bold: true, color: C.accent2,
      align: "center", valign: "middle", margin: 0,
    });
  }

  // ───────────────────────────────────────────────────────────────────────────────
  // SLIDE 8 · 常見問題（Q&A）
  // ───────────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.lightGreen };

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.08,
      fill: { color: C.primary },
      line: { color: C.primary, width: 0 },
    });

    s.addText("常見問題 Q&A", {
      x: 0.5, y: 0.25, w: 9, h: 0.55,
      fontSize: 28, bold: true, color: C.primary,
      align: "left", valign: "middle", margin: 0,
    });

    const qas = [
      { q: "SSD 價格比 HDD 貴，值得嗎？", a: "初期成本高，但 2~3 年內透過節省電費、維護成本，總持有成本（TCO）通常更低。" },
      { q: "只有大企業才需要關注 ESG 嗎？", a: "不，ESG 是所有企業的趨勢。投資人、客戶、供應鏈要求越來越嚴格，越早佈局越有利。" },
      { q: "SSD 的壽命是否比 HDD 短？", a: "現代 SSD 壽命已大幅提升（平均 5 年以上），且無機械故障風險，整體可靠性更高。" },
      { q: "如何讓 SSD 的效益計入 ESG 報告？", a: "從能耗、碳排放、設備更換率等指標量化，寫入環境（E）與治理（G）章節。" },
    ];

    qas.forEach((qa, i) => {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const x = 0.4 + col * 4.7;
      const y = 1.0 + row * 1.85;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 4.45, h: 1.7,
        fill: { color: C.white },
        line: { color: C.secondary, width: 0.5 },
        shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.07 },
      });
      // Q label
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 0.45, h: 0.45,
        fill: { color: C.primary },
        line: { color: C.primary, width: 0 },
      });
      s.addText("Q", {
        x, y, w: 0.45, h: 0.45,
        fontSize: 14, bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText(qa.q, {
        x: x + 0.55, y: y + 0.05, w: 3.8, h: 0.4,
        fontSize: 12, bold: true, color: C.dark,
        align: "left", valign: "top", margin: 0,
      });
      s.addText(qa.a, {
        x: x + 0.15, y: y + 0.52, w: 4.15, h: 1.08,
        fontSize: 11, color: C.muted,
        align: "left", valign: "top", margin: 0,
      });
    });
  }

  // ───────────────────────────────────────────────────────────────────────────────
  // SLIDE 9 · 總結
  // ───────────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.primary };

    // Decorative circles
    s.addShape(pres.shapes.OVAL, {
      x: -1.5, y: -1, w: 4, h: 4,
      fill: { color: C.secondary, transparency: 65 },
      line: { color: C.secondary, width: 0 },
    });
    s.addShape(pres.shapes.OVAL, {
      x: 7.5, y: 3.5, w: 3.5, h: 3.5,
      fill: { color: C.accent2, transparency: 70 },
      line: { color: C.accent2, width: 0 },
    });

    s.addText("重點回顧", {
      x: 0.5, y: 0.5, w: 9, h: 0.65,
      fontSize: 30, bold: true, color: C.white,
      align: "left", valign: "middle", margin: 0,
    });

    const takeaways = [
      { icon: icons.check, text: "ESG 是評估企業永續價值的核心框架（E / S / G）" },
      { icon: icons.check, text: "SSD 比 HDD 更節能、更穩定、更環保" },
      { icon: icons.check, text: "SSD 幫助企業減少能耗、碳排放、降低電子廢棄物" },
      { icon: icons.check, text: "SSD 效益可以量化，寫入 ESG 報告，成為加分證據" },
      { icon: icons.check, text: "任何規模的企業都可以從 SSD 置換開始實踐 ESG" },
    ];

    takeaways.forEach((t, i) => {
      const y = 1.35 + i * 0.7;
      s.addShape(pres.shapes.OVAL, {
        x: 0.6, y: y + 0.05, w: 0.45, h: 0.45,
        fill: { color: C.accent2, transparency: 20 },
        line: { color: C.accent2, width: 0 },
      });
      s.addImage({ data: t.icon, x: 0.68, y: y + 0.13, w: 0.3, h: 0.3 });
      s.addText(t.text, {
        x: 1.2, y, w: 7.8, h: 0.55,
        fontSize: 15, color: C.white,
        align: "left", valign: "middle", margin: 0,
      });
    });

    // CTA
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 4.9, w: 9, h: 0.55,
      fill: { color: C.accent2 },
      line: { color: C.accent2, width: 0 },
    });
    s.addText("下一步：從今天起，把 SSD 視為 ESG 行動的第一步", {
      x: 0.5, y: 4.9, w: 9, h: 0.55,
      fontSize: 14, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });
  }

  // ───────────────────────────────────────────────────────────────────────────────
  // SLIDE 10 · 結尾（Thank you + 資源）
  // ───────────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.dark };

    s.addShape(pres.shapes.OVAL, {
      x: 6.5, y: -0.5, w: 5, h: 5,
      fill: { color: C.primary, transparency: 70 },
      line: { color: C.primary, width: 0 },
    });
    s.addShape(pres.shapes.OVAL, {
      x: -1, y: 3, w: 4, h: 4,
      fill: { color: C.accent, transparency: 80 },
      line: { color: C.accent, width: 0 },
    });

    s.addText("謝謝", {
      x: 0.5, y: 1.0, w: 9, h: 1.2,
      fontSize: 56, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText("ESG 與 SSD 教育訓練", {
      x: 0.5, y: 2.2, w: 9, h: 0.5,
      fontSize: 18, color: C.white, transparency: 30,
      align: "center", valign: "middle", margin: 0,
    });

    // Resource links box
    s.addShape(pres.shapes.RECTANGLE, {
      x: 2, y: 2.95, w: 6, h: 1.6,
      fill: { color: C.primary, transparency: 30 },
      line: { color: C.white, width: 0.3 },
    });
    s.addText("推薦延伸資源", {
      x: 2, y: 3.05, w: 6, h: 0.35,
      fontSize: 12, bold: true, color: C.accent2,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText([
      { text: "GRI 永續報導準則（GRI Standards）", options: { bullet: true, breakLine: true } },
      { text: "SASB 產業指標（Sustainability standards）", options: { bullet: true, breakLine: true } },
      { text: "ISO 50001 能源管理系統", options: { bullet: true, breakLine: true } },
      { text: "CDP 碳揭露計畫（carbonprofit.org）", options: { bullet: true } },
    ], {
      x: 2.3, y: 3.42, w: 5.4, h: 1.1,
      fontSize: 11, color: C.white, transparency: 15,
      align: "left", valign: "top",
      paraSpaceAfter: 3,
    });

    s.addText("教育訓練教材  ·  2026", {
      x: 0, y: 5.1, w: 10, h: 0.4,
      fontSize: 11, color: C.white, transparency: 50,
      align: "center", valign: "middle", margin: 0,
    });
  }

  // ───────────────────────────────────────────────────────────────────────────────
  // Output
  // ───────────────────────────────────────────────────────────────────────────────
  await pres.writeFile({ fileName: "ESG-SSD-教育訓練.pptx" });
  console.log("✅ ESG-SSD-教育訓練.pptx 生成完成！");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});