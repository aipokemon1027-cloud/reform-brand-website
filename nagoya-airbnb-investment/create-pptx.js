const pptxgen = require("pptxgenjs");

// ─── Color Palette ────────────────────────────────────────────────────────────
const C = {
  navy:    "1E3A5F",
  cream:   "F8F5F0",
  gold:    "D4A373",
  coral:   "C97064",
  text:    "2C3E50",
  muted:   "8B9BAD",
  white:   "FFFFFF",
  card:    "FFFFFF",
  green:   "5D8A66",
  red:     "C0504D",
  lightGold:"EDD9B5",
  lightNavy:"2D5F8A",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shadow(opts = {}) {
  return {
    type: "outer",
    color: "000000",
    blur: opts.blur || 6,
    offset: opts.offset || 3,
    angle: opts.angle || 135,
    opacity: opts.opacity || 0.12,
  };
}

function makeCard(pres, slide, x, y, w, h, opts = {}) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.fill || C.card },
    shadow: shadow({ blur: 8, offset: 3, opacity: 0.1 }),
    line: opts.line ? { color: opts.line, width: 1 } : undefined,
  });
}

function makeRoundCard(pres, slide, x, y, w, h, fillColor) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h,
    fill: { color: fillColor },
    rectRadius: 0.08,
  });
}

function makeOval(pres, slide, x, y, w, h, fillColor) {
  slide.addShape(pres.shapes.OVAL, {
    x, y, w, h,
    fill: { color: fillColor },
  });
}

function slideTitle(slide, text, opts = {}) {
  slide.addText(text, {
    x: 0.5, y: opts.y || 0.35, w: 9, h: 0.6,
    fontSize: opts.size || 28,
    fontFace: "Arial",
    bold: true,
    color: opts.color || C.text,
    margin: 0,
  });
}

// ─── Presentation Setup ────────────────────────────────────────────────────────
let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "名古屋 Airbnb 投資攻略";
pres.author = "jojo ⚡";

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — Title
// ═══════════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.12, fill: { color: C.gold } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.5, w: 10, h: 0.125, fill: { color: C.gold } });

  s.addText("名古屋 Airbnb", {
    x: 0.6, y: 1.5, w: 8.8, h: 1.0,
    fontSize: 52, fontFace: "Arial Black", bold: true,
    color: C.white, margin: 0,
  });
  s.addText("投資攻略", {
    x: 0.6, y: 2.5, w: 8.8, h: 0.9,
    fontSize: 52, fontFace: "Arial Black", bold: true,
    color: C.gold, margin: 0,
  });
  s.addText("日本不動產 × 民宿經營 × 實務攻略", {
    x: 0.6, y: 3.6, w: 8.8, h: 0.5,
    fontSize: 18, fontFace: "Arial", color: C.lightGold, margin: 0,
  });
  s.addText("整理 by jojo ⚡   2026.07", {
    x: 0.6, y: 4.9, w: 8.8, h: 0.4,
    fontSize: 12, fontFace: "Arial", color: C.muted, margin: 0,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — Why Nagoya
// ═══════════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.cream };
  slideTitle(s, "為什麼選擇名古屋？");

  const stats = [
    { num: "第3", label: "日本都市規模\n僅次東京、大阪", color: C.navy },
    { num: "5,000萬", label: "年住宿人次\n2024年數據", color: C.coral },
    { num: "¥800萬~", label: "一戶建入手價\n比東京便宜50%", color: C.green },
  ];

  stats.forEach((st, i) => {
    const x = 0.6 + i * 3.1;
    makeCard(pres, s, x, 1.2, 2.9, 2.8, { fill: C.white });
    s.addText(st.num, {
      x, y: 1.4, w: 2.9, h: 0.9,
      fontSize: 36, bold: true, align: "center",
      color: st.color, margin: 0,
    });
    s.addText(st.label, {
      x: x + 0.15, y: 2.4, w: 2.6, h: 1.4,
      fontSize: 13, align: "center", valign: "top",
      color: C.muted, margin: 0,
    });
  });

  s.addText([
    { text: "✓  民宿法規比東京大阪友善", options: { breakLine: true } },
    { text: "✓  中部國際機場入境，外國旅客多", options: { breakLine: true } },
    { text: "✓  Toyota 等企業總部在，商務客剛性需求", options: { breakLine: true } },
    { text: "✓  一戶建選擇多，入手門檻低", options: {} },
  ], {
    x: 0.6, y: 4.2, w: 9, h: 1.2,
    fontSize: 14, color: C.text, valign: "top",
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — Residential vs Commercial
// ═══════════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.cream };
  slideTitle(s, "住宅區 還是 商業區？");

  const cols = [
    {
      title: "住宅地域",
      badge: "推薦首選 ⭐",
      badgeColor: C.green,
      items: [
        " Airbnb 天數上限：180天",
        " 土地取得成本較低",
        " 中村區旅客量足夠支撐",
        " 報酬率 CP 值更高",
        " 淡旺季分配即可做滿",
      ],
      foot: "適合多數投資者",
    },
    {
      title: "商業地域",
      badge: "進階選擇",
      badgeColor: C.coral,
      items: [
        " 天數限制較少（視條例）",
        " 土地取得成本較高",
        " 人潮流動但競爭也大",
        " 額外彈性未必 cover 溢價",
        " 需要更精準的商業算計",
      ],
      foot: "適合有經驗的投資者",
    },
  ];

  cols.forEach((col, i) => {
    const x = 0.5 + i * 4.65;
    makeCard(pres, s, x, 1.1, 4.25, 3.5, { fill: C.white });

    // Badge
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.2, y: 1.2, w: 2.0, h: 0.35,
      fill: { color: col.badgeColor }, rectRadius: 0.05,
    });
    s.addText(col.badge, {
      x: x + 0.2, y: 1.2, w: 2.0, h: 0.35,
      fontSize: 11, bold: true, align: "center",
      color: C.white, margin: 0,
    });

    s.addText(col.title, {
      x: x + 0.2, y: 1.65, w: 3.85, h: 0.45,
      fontSize: 20, bold: true, color: C.navy, margin: 0,
    });

    s.addShape(pres.shapes.LINE, {
      x: x + 0.2, y: 2.15, w: 3.85, h: 0,
      line: { color: C.lightGold, width: 1.5 },
    });

    col.items.forEach((item, j) => {
      s.addText(item, {
        x: x + 0.25, y: 2.25 + j * 0.38, w: 3.85, h: 0.38,
        fontSize: 13, color: C.text, margin: 0,
      });
    });

    s.addText(col.foot, {
      x: x + 0.2, y: 4.15, w: 3.85, h: 0.35,
      fontSize: 11, italic: true, color: C.muted, margin: 0,
    });
  });

  makeCard(pres, s, 0.5, 4.75, 8.8, 0.65, { fill: C.navy });
  s.addText("結論：多數人先從住宅地域入手，180 天做滿其實已經很不錯。", {
    x: 0.6, y: 4.82, w: 8.6, h: 0.45,
    fontSize: 14, bold: true, color: C.gold, margin: 0,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — 180 Days
// ═══════════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.cream };
  slideTitle(s, "Q：可以做 180 天嗎？");

  makeCard(pres, s, 0.5, 1.1, 9, 1.3, { fill: C.navy });
  s.addText("✅  可以！", {
    x: 0.7, y: 1.2, w: 8.6, h: 0.55,
    fontSize: 30, bold: true, color: C.gold, margin: 0,
  });
  s.addText("住宅地域合法申請民宿許可後，即可在「連續3個月滾動區間」內，經營最多180天。", {
    x: 0.7, y: 1.78, w: 8.6, h: 0.5,
    fontSize: 14, color: C.white, margin: 0,
  });

  s.addText("180天怎麼算？", {
    x: 0.5, y: 2.6, w: 4.5, h: 0.4,
    fontSize: 16, bold: true, color: C.navy, margin: 0,
  });

  const months = [
    { m: "7月", d: "31天" },
    { m: "8月", d: "31天" },
    { m: "9月", d: "30天" },
  ];

  months.forEach((m, i) => {
    const x = 0.5 + i * 1.7;
    makeCard(pres, s, x, 3.05, 1.5, 0.85, { fill: C.white });
    s.addText(m.m, {
      x, y: 3.1, w: 1.5, h: 0.35,
      fontSize: 12, bold: true, align: "center", color: C.muted, margin: 0,
    });
    s.addText(m.d, {
      x, y: 3.42, w: 1.5, h: 0.4,
      fontSize: 18, bold: true, align: "center", color: C.navy, margin: 0,
    });
  });

  s.addText("→", {
    x: 5.3, y: 3.05, w: 0.5, h: 0.85,
    fontSize: 28, bold: true, align: "center", color: C.gold, margin: 0,
  });

  makeCard(pres, s, 5.9, 3.05, 3.6, 0.85, { fill: C.gold });
  s.addText("滾動三個月合計 = 最多180天", {
    x: 6.0, y: 3.2, w: 3.4, h: 0.55,
    fontSize: 13, bold: true, align: "center", color: C.white, margin: 0,
  });

  s.addText("合規的必要條件", {
    x: 0.5, y: 4.15, w: 9, h: 0.35,
    fontSize: 15, bold: true, color: C.navy, margin: 0,
  });

  const reqs = [
    "向名古屋市政府申請民宿登錄許可",
    "消防檢查合格",
    "在 Airbnb 頁面顯示許可編號",
    "製作住房者名冊（隨時備查）",
  ];

  reqs.forEach((req, i) => {
    const x = 0.5 + (i % 2) * 4.5;
    const y = 4.6 + Math.floor(i / 2) * 0.5;
    s.addText("✓  " + req, {
      x, y, w: 4.4, h: 0.45,
      fontSize: 13, color: C.text, margin: 0,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — Minpaku Law
// ═══════════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.navy };

  s.addText("民宿新法（民泊新法）", {
    x: 0.5, y: 0.35, w: 9, h: 0.6,
    fontSize: 28, bold: true, color: C.white, margin: 0,
  });
  s.addText("2018年6月實施 — 日本住宅民宿事業法", {
    x: 0.5, y: 0.95, w: 9, h: 0.35,
    fontSize: 14, color: C.gold, margin: 0,
  });

  const rules = [
    { icon: "📋", title: "必須取得許可", desc: "無許可經營者，處6個月以下有期徒刑或100萬日幣罰金" },
    { icon: "📅", title: "180天上限", desc: "住宅地域：連續3個月滾動上限180天（商業地域視條例）" },
    { icon: "🚪", title: "識別標示", desc: "玄関須設置民宿辨識標示牌" },
    { icon: "📒", title: "住房者名冊", desc: "須製作住房者名冊，隨時備查" },
    { icon: "🔥", title: "消防標準", desc: "須設置滅火器、有效期限內、緊急照明設備" },
    { icon: "💰", title: "東京/大阪更嚴", desc: "東京23區幾乎全面禁止；大阪京都也有嚴格限制；名古屋相對友善" },
  ];

  rules.forEach((r, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 4.75;
    const y = 1.5 + row * 1.3;

    makeCard(pres, s, x, y, 4.5, 1.1, { fill: C.lightNavy });

    s.addText(r.icon, {
      x: x + 0.15, y: y + 0.15, w: 0.6, h: 0.6,
      fontSize: 26, align: "center", color: C.white, margin: 0,
    });

    s.addText(r.title, {
      x: x + 0.85, y: y + 0.12, w: 3.5, h: 0.38,
      fontSize: 14, bold: true, color: C.gold, margin: 0,
    });
    s.addText(r.desc, {
      x: x + 0.85, y: y + 0.52, w: 3.5, h: 0.5,
      fontSize: 11, color: C.white, margin: 0,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — Nagoya Investment Areas
// ═══════════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.cream };
  slideTitle(s, "名古屋投資區域推薦");

  const areas = [
    {
      rank: "1", rankLabel: "首選",
      name: "中村區",
      subtitle: "名古屋駅周邊",
      price: "¥1,000萬~2,500萬",
      rent: "月租 ¥6萬~12萬",
      why: "交通最強，商務+觀光雙需求",
      bg: C.navy,
      badgeColor: C.green,
    },
    {
      rank: "2", rankLabel: "進階",
      name: "中區",
      subtitle: "榮商圈・市中心",
      price: "¥1,200萬~3,000萬",
      rent: "月租 ¥8萬~15萬",
      why: "觀光核心，可能突破180天限制",
      bg: C.lightNavy,
      badgeColor: C.coral,
    },
    {
      rank: "3", rankLabel: "CP值",
      name: "熱田區",
      subtitle: "熱田神宮周邊",
      price: "¥800萬~1,800萬",
      rent: "月租 ¥5萬~9萬",
      why: "CP值最高，觀光客穩定，門檻低",
      bg: C.green,
      badgeColor: C.gold,
    },
  ];

  areas.forEach((a, i) => {
    const x = 0.4 + i * 3.15;

    // Card shadow wrapper
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.05, w: 3.0, h: 4.2,
      fill: { color: C.white },
      shadow: shadow({ blur: 10, offset: 4, opacity: 0.1 }),
    });

    // Header
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.05, w: 3.0, h: 1.3,
      fill: { color: a.bg },
    });

    // Rank circle — positioned well within header to avoid clipping
    s.addShape(pres.shapes.OVAL, {
      x: x + 1.1, y: 1.2, w: 0.8, h: 0.8,
      fill: { color: a.badgeColor },
    });
    s.addText(a.rank, {
      x: x + 1.1, y: 1.2, w: 0.8, h: 0.8,
      fontSize: 28, bold: true, align: "center", valign: "middle",
      color: C.white, margin: 0,
    });
    s.addText(a.name, {
      x, y: 2.08, w: 3.0, h: 0.4,
      fontSize: 18, bold: true, align: "center", color: C.white, margin: 0,
    });
    s.addText(a.subtitle, {
      x, y: 2.45, w: 3.0, h: 0.3,
      fontSize: 11, align: "center", color: C.lightGold, margin: 0,
    });

    // Badge label — moved well below header top edge
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.15, y: 1.15, w: 0.9, h: 0.28,
      fill: { color: a.badgeColor }, rectRadius: 0.05,
    });
    s.addText(a.rankLabel, {
      x: x + 0.15, y: 1.15, w: 0.9, h: 0.28,
      fontSize: 10, bold: true, align: "center", color: C.white, margin: 0,
    });

    // Stats
    s.addText("入手價", { x: x + 0.15, y: 2.5, w: 2.7, h: 0.28, fontSize: 11, color: C.muted, margin: 0 });
    s.addText(a.price, { x: x + 0.15, y: 2.78, w: 2.7, h: 0.35, fontSize: 13, bold: true, color: C.text, margin: 0 });
    s.addText("月租行情", { x: x + 0.15, y: 3.18, w: 2.7, h: 0.28, fontSize: 11, color: C.muted, margin: 0 });
    s.addText(a.rent, { x: x + 0.15, y: 3.46, w: 2.7, h: 0.35, fontSize: 13, bold: true, color: C.text, margin: 0 });

    s.addShape(pres.shapes.LINE, {
      x: x + 0.15, y: 4.0, w: 2.7, h: 0,
      line: { color: C.lightGold, width: 1 },
    });

    s.addText(a.why, {
      x: x + 0.15, y: 4.1, w: 2.7, h: 1.0,
      fontSize: 12, color: C.muted, margin: 0,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — Financial Breakdown
// ═══════════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.cream };
  slideTitle(s, "報酬試算 — 中村區一戶建");

  // Left: 購入條件
  makeCard(pres, s, 0.5, 1.05, 4.3, 2.1, { fill: C.white });
  s.addText("購入條件", {
    x: 0.65, y: 1.15, w: 4.0, h: 0.35,
    fontSize: 14, bold: true, color: C.navy, margin: 0,
  });
  const inputs = [
    "購入價格：¥1,500萬",
    "類型：一戶建 3DK（30坪）",
    "地域：中村區，徒步10分",
    "用途：第二種住居地域",
  ];
  inputs.forEach((item, i) => {
    s.addText("· " + item, {
      x: 0.65, y: 1.52 + i * 0.38, w: 4.0, h: 0.36,
      fontSize: 13, color: C.text, margin: 0,
    });
  });

  // Right: 年收入
  makeCard(pres, s, 5.0, 1.05, 4.5, 2.1, { fill: C.white });
  s.addText("年收入", {
    x: 5.15, y: 1.15, w: 4.2, h: 0.35,
    fontSize: 14, bold: true, color: C.green, margin: 0,
  });
  const income = [
    "住房天數：180天（上限）",
    "平均日租：¥8,000",
    "年總收入：¥144萬",
  ];
  income.forEach((item, i) => {
    s.addText("· " + item, {
      x: 5.15, y: 1.52 + i * 0.42, w: 4.2, h: 0.4,
      fontSize: 13, color: C.text, margin: 0,
    });
  });

  // 年支出
  makeCard(pres, s, 0.5, 3.3, 9, 1.4, { fill: C.white });
  s.addText("年支出", {
    x: 0.65, y: 3.4, w: 8.7, h: 0.35,
    fontSize: 14, bold: true, color: C.coral, margin: 0,
  });

  const expenses = [
    ["固定資產税", "¥15萬"],
    ["代管費（20%）", "¥29萬"],
    ["民宿保險", "¥3萬"],
    ["裝修預備金", "¥10萬"],
    ["其他（管理等）", "¥5萬"],
    ["所得稅等", "¥10萬"],
  ];

  expenses.forEach(([label, val], i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    s.addText(label, {
      x: 0.65 + col * 3.0, y: 3.8 + row * 0.4, w: 2.2, h: 0.35,
      fontSize: 12, color: C.navy, bold: true, margin: 0,
    });
    s.addText(val, {
      x: 2.75 + col * 3.0, y: 3.8 + row * 0.4, w: 0.8, h: 0.35,
      fontSize: 12, bold: true, color: C.navy, align: "right", margin: 0,
    });
  });

  // Bottom result
  makeCard(pres, s, 0.5, 4.85, 9, 0.6, { fill: C.navy });
  s.addText("淨年收入：¥72萬　　｜　　淨報酬率：4.8%　　｜　　合理預期：4～6%", {
    x: 0.6, y: 4.95, w: 8.8, h: 0.4,
    fontSize: 15, bold: true, align: "center", color: C.gold, margin: 0,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 8 — Step by Step Process
// ═══════════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.cream };
  slideTitle(s, "投資流程 Step by Step");

  const steps = [
    { num: "1", title: "準備期（Month 1-3）", items: ["財務評估與資金準備", "開立日本銀行帳戶", "聘請代書（很重要！）", "找代管公司"] },
    { num: "2", title: "找房期（Month 3-6）", items: ["設定條件：中村區優先", "實地看屋（必要！）", "確認用途地域", "計算報酬率"] },
    { num: "3", title: "簽約過戶（Month 6-8）", items: ["支付手附金（10%）", "代書辦理過戶登記", "申請民宿登錄許可", "向名古屋市政府申報"] },
    { num: "4", title: "裝修準備（Month 8-9）", items: ["消防檢查申報", "設置滅火器/照明", "安裝智慧門鎖", "Wi-Fi、設備、家具"] },
    { num: "5", title: "上架營運（Month 9-10）", items: ["Airbnb 上架設定", "填入民宿許可編號", "上傳照片與描述", "開始接受預訂 ✅"] },
  ];

  steps.forEach((step, i) => {
    const x = 0.4 + (i % 3) * 3.15;
    const y = i < 3 ? 1.1 : 3.5;
    const w = i < 3 ? 3.0 : 4.55;

    makeCard(pres, s, x, y, w, 2.2, { fill: C.white });

    makeOval(pres, s, x + 0.15, y + 0.15, 0.5, 0.5, C.navy);
    s.addText(step.num, {
      x: x + 0.15, y: y + 0.17, w: 0.5, h: 0.5,
      fontSize: 16, bold: true, align: "center", color: C.white, margin: 0,
    });

    s.addText(step.title, {
      x: x + 0.75, y: y + 0.22, w: w - 0.9, h: 0.4,
      fontSize: 13, bold: true, color: C.navy, margin: 0,
    });

    step.items.forEach((item, j) => {
      s.addText("· " + item, {
        x: x + 0.2, y: y + 0.72 + j * 0.38, w: w - 0.35, h: 0.36,
        fontSize: 12, color: C.text, margin: 0,
      });
    });
  });

  // Arrow connectors — removed: arrows were overlapping card edges
  // [1, 2].forEach(i => {
  //   s.addText("→", {
  //     x: 3.3 + i * 3.15, y: 1.95, w: 0.5, h: 0.5,
  //     fontSize: 22, bold: true, color: C.gold, align: "center", margin: 0,
  //   });
  // });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 9 — Risks
// ═══════════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.cream };
  slideTitle(s, "風險與注意事項");

  const risks = [
    { icon: "⚠", title: "空室風險", desc: "淡季（1-3月）住房率低，不要只算旺季數字", level: "中等", levelColor: C.gold },
    { icon: "📉", title: "匯率風險", desc: "日幣貶值時，租金換回台幣會變少", level: "高", levelColor: C.coral },
    { icon: "⚖", title: "法律風險", desc: "無許可經營或超天數，最高罰款100萬日幣", level: "高", levelColor: C.coral },
    { icon: "🔧", title: "維修成本", desc: "老屋管線、漏水、設備故障，都是錢", level: "中等", levelColor: C.gold },
    { icon: "👥", title: "管理麻煩", desc: "不在日本需要代管公司，每月費用約20%", level: "低", levelColor: C.green },
    { icon: "🏦", title: "流動性低", desc: "不動產變現不易，急用錢時麻煩", level: "中等", levelColor: C.gold },
  ];

  risks.forEach((r, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.4 + col * 3.15;
    const y = 1.1 + row * 2.2;

    makeCard(pres, s, x, y, 3.0, 2.0, { fill: C.white });

    makeOval(pres, s, x + 0.15, y + 0.15, 0.55, 0.55, C.coral);
    s.addText(r.icon, {
      x: x + 0.15, y: y + 0.17, w: 0.55, h: 0.55,
      fontSize: 22, align: "center", color: C.white, margin: 0,
    });

    s.addText(r.title, {
      x: x + 0.8, y: y + 0.22, w: 2.05, h: 0.4,
      fontSize: 14, bold: true, color: C.navy, margin: 0,
    });

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.15, y: y + 1.55, w: 0.8, h: 0.3,
      fill: { color: r.levelColor }, rectRadius: 0.05,
    });
    s.addText(r.level, {
      x: x + 0.15, y: y + 1.55, w: 0.8, h: 0.3,
      fontSize: 10, bold: true, align: "center", color: C.white, margin: 0,
    });

    s.addText(r.desc, {
      x: x + 0.15, y: y + 0.82, w: 2.7, h: 0.7,
      fontSize: 12, color: C.muted, margin: 0,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — Key Numbers
// ═══════════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.navy };

  s.addText("投資關鍵數據", {
    x: 0.5, y: 0.35, w: 9, h: 0.6,
    fontSize: 28, bold: true, color: C.white, margin: 0,
  });
  s.addText("整理给你的重要数字，一目了然", {
    x: 0.5, y: 0.95, w: 9, h: 0.35,
    fontSize: 14, color: C.gold, margin: 0,
  });

  const nums = [
    { big: "¥800萬~", small: "一戶建入手價" },
    { big: "180天", small: "住宅區 Airbnb 上限" },
    { big: "4~6%", small: "合理淨報酬率" },
    { big: "6.1%", small: "中村區試算報酬率" },
    { big: "7~10%", small: "一次性購屋成本（房價佔比）" },
    { big: "20%", small: "代管公司費用（月租）" },
  ];

  nums.forEach((n, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.4 + col * 3.15;
    const y = 1.5 + row * 1.9;

    makeCard(pres, s, x, y, 3.0, 1.7, { fill: C.lightNavy });

    s.addText(n.big, {
      x: x + 0.15, y: y + 0.25, w: 2.7, h: 0.8,
      fontSize: 28, bold: true, align: "center", color: C.gold, margin: 0,
    });
    s.addText(n.small, {
      x: x + 0.15, y: y + 1.1, w: 2.7, h: 0.45,
      fontSize: 13, align: "center", color: C.white, margin: 0,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — Action Checklist
// ═══════════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.cream };
  slideTitle(s, "行動檢查清單");

  const checks = [
    {
      phase: "帳戶準備",
      items: [
        "開立日本銀行帳戶（台灣銀行東京分行）",
        "聘請土地上家屋所有人（代書）",
        "准備護照公證文件",
      ],
    },
    {
      phase: "找房條件",
      items: [
        "預算 ¥800萬～2,500萬",
        "一戶建 3DK 以上、徒步 15 分以內",
        "用途地域：第二種住居地域",
      ],
    },
    {
      phase: "法規確認",
      items: [
        "申請民宿登錄許可（向名古屋市政府）",
        "通過消防檢查",
        "加入住宅民宿責任保險",
      ],
    },
    {
      phase: "Airbnb 上架",
      items: [
        "上傳民宿許可編號",
        "拍攝清晰房源照片（廣角鏡頭）",
        "設定智慧門鎖 + 多語言說明",
      ],
    },
  ];

  checks.forEach((ch, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.4 + col * 4.75;
    const y = 1.1 + row * 2.15;

    makeCard(pres, s, x, y, 4.5, 2.0, { fill: C.white });

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 1.3, h: 0.4, fill: { color: C.navy },
    });
    s.addText(ch.phase, {
      x, y, w: 1.3, h: 0.4,
      fontSize: 11, bold: true, align: "center", color: C.white, margin: 0,
    });

    ch.items.forEach((item, j) => {
      s.addText("□  " + item, {
        x: x + 0.15, y: y + 0.5 + j * 0.48, w: 4.2, h: 0.45,
        fontSize: 12, color: C.text, margin: 0,
      });
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — End
// ═══════════════════════════════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.1, fill: { color: C.gold } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.525, w: 10, h: 0.1, fill: { color: C.gold } });

  s.addText("下一步？", {
    x: 0.5, y: 1.4, w: 9, h: 0.7,
    fontSize: 36, bold: true, align: "center", color: C.white, margin: 0,
  });

  s.addText("找 jojo 繼續聊 👇", {
    x: 0.5, y: 2.2, w: 9, h: 0.5,
    fontSize: 18, align: "center", color: C.gold, margin: 0,
  });

  const nextSteps = [
    "🔍  查詢中村區目前在售的一戶建價格",
    "📋  了解代書的費用與流程",
    "💰  計算你個人的報酬率",
    "🏠  規劃實地看屋的行程",
  ];

  nextSteps.forEach((ns, i) => {
    s.addText(ns, {
      x: 1.5, y: 2.9 + i * 0.5, w: 7, h: 0.45,
      fontSize: 16, color: C.white, margin: 0,
    });
  });

  s.addText("資料存放：~/openclaw/workspace/nagoya-airbnb-investment/", {
    x: 0.5, y: 5.0, w: 9, h: 0.35,
    fontSize: 11, align: "center", color: C.muted, margin: 0,
  });
}

// ─── Write File ───────────────────────────────────────────────────────────────
const outputPath = "名古屋Airbnb投資攻略.pptx";
pres.writeFile({ fileName: outputPath })
  .then(() => console.log("✅  簡報生成成功！檔案：" + outputPath))
  .catch(err => console.error("❌  錯誤：", err));
