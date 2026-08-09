// Renders the rich menu background from richmenu.config.mjs.
// v4: a unified hand-drawn illustration set. Every tile is line art drawn in
// the logo's own language — gold + sage strokes on cream, the logo's little
// gold diamond divider, curtain folds and tassels — so the six tiles read as
// one engraved set instead of six mismatched photos.
// Run: node scripts/line-oa/generate-rich-menu-image.mjs
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";
import { CANVAS, COLORS, PANELS, BRAND_BAND } from "./richmenu.config.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(HERE, "..", "..", "public", "images");

const FONT_TH = "'Leelawadee UI', Tahoma, 'Segoe UI', sans-serif";
const FONT_EN = "Georgia, 'Times New Roman', serif";

// The logo's divider: ── ◆ ── in gold.
function diamondDivider(cx, y, halfLen, color) {
  return `
    <line x1="${cx - halfLen}" y1="${y}" x2="${cx - 22}" y2="${y}" stroke="${color}" stroke-width="3"/>
    <line x1="${cx + 22}" y1="${y}" x2="${cx + halfLen}" y2="${y}" stroke="${color}" stroke-width="3"/>
    <path d="M${cx} ${y - 9} L${cx + 9} ${y} L${cx} ${y + 9} L${cx - 9} ${y} Z" fill="${color}"/>
  `;
}

// --- the six illustrations -------------------------------------------------
// Each is drawn centered at (cx, cy) inside a ~460x420 box, stroke-first.
function illusArt(kind, cx, cy, C) {
  const { main, accent, ground } = C; // main = line color, accent = gold-ish
  const sw = 9;
  switch (kind) {
    // ดูผลงานจริง — arched window, scalloped valance, two tied-back
    // curtains: the logo's own curtain blown up into a scene.
    case "gallery":
      return `
        <g fill="none" stroke="${main}" stroke-width="${sw}" stroke-linejoin="round">
          <path d="M${cx - 170} ${cy + 170} L${cx - 170} ${cy - 30} a170 170 0 0 1 340 0 L${cx + 170} ${cy + 170} Z"/>
          <line x1="${cx}" y1="${cy - 196}" x2="${cx}" y2="${cy + 170}" opacity="0.3"/>
          <line x1="${cx - 170}" y1="${cy + 40}" x2="${cx + 170}" y2="${cy + 40}" opacity="0.3"/>
        </g>
        <path d="M${cx - 170} ${cy - 30} q42 66 85 6 q42 60 85 8 q42 52 85 -8 q43 60 85 -6" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>
        <g fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
          <path d="M${cx - 168} ${cy - 18} q30 60 22 106 q-4 26 -22 40 q34 18 30 42 L${cx - 168} ${cy + 168}"/>
          <path d="M${cx - 118} ${cy - 8} q6 58 -14 96 q22 22 16 80"/>
          <path d="M${cx - 144} ${cy - 14} q16 56 2 100"/>
          <path d="M${cx + 168} ${cy - 18} q-30 60 -22 106 q4 26 22 40 q-34 18 -30 42 L${cx + 168} ${cy + 168}"/>
          <path d="M${cx + 118} ${cy - 8} q-6 58 14 96 q-22 22 -16 80"/>
          <path d="M${cx + 144} ${cy - 14} q-16 56 -2 100"/>
        </g>
        <path d="M${cx - 172} ${cy + 122} q28 -16 58 0" fill="none" stroke="${main}" stroke-width="8" stroke-linecap="round"/>
        <path d="M${cx + 172} ${cy + 122} q-28 -16 -58 0" fill="none" stroke="${main}" stroke-width="8" stroke-linecap="round"/>
        <circle cx="${cx - 114}" cy="${cy + 124}" r="9" fill="${accent}"/>
        <g stroke="${accent}" stroke-width="4" stroke-linecap="round">
          <line x1="${cx - 114}" y1="${cy + 133}" x2="${cx - 121}" y2="${cy + 168}"/>
          <line x1="${cx - 114}" y1="${cy + 133}" x2="${cx - 114}" y2="${cy + 172}"/>
          <line x1="${cx - 114}" y1="${cy + 133}" x2="${cx - 107}" y2="${cy + 168}"/>
        </g>
        <circle cx="${cx + 114}" cy="${cy + 124}" r="9" fill="${accent}"/>
        <g stroke="${accent}" stroke-width="4" stroke-linecap="round">
          <line x1="${cx + 114}" y1="${cy + 133}" x2="${cx + 107}" y2="${cy + 168}"/>
          <line x1="${cx + 114}" y1="${cy + 133}" x2="${cx + 114}" y2="${cy + 172}"/>
          <line x1="${cx + 114}" y1="${cy + 133}" x2="${cx + 121}" y2="${cy + 168}"/>
        </g>
      `;
    // บริการทั้งหมด — three emblems: curtain panel, unrolling wallpaper
    // carrying the logo's laurel leaf, and slat blinds with a pull cord.
    case "materials":
      return `
        <rect x="${cx - 250}" y="${cy - 130}" width="150" height="250" rx="12" fill="none" stroke="${main}" stroke-width="${sw}"/>
        <path d="M${cx - 250} ${cy - 130} q75 44 150 0" fill="none" stroke="${accent}" stroke-width="6"/>
        <g fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round">
          <path d="M${cx - 222} ${cy - 112} q10 104 -8 216"/>
          <path d="M${cx - 190} ${cy - 108} q6 104 -4 212"/>
          <path d="M${cx - 158} ${cy - 108} q-4 104 4 212"/>
          <path d="M${cx - 128} ${cy - 112} q-10 104 8 216"/>
        </g>
        <g fill="none" stroke="${main}" stroke-width="${sw}" stroke-linejoin="round">
          <circle cx="${cx}" cy="${cy - 100}" r="34"/>
          <path d="M${cx - 34} ${cy - 100} L${cx - 34} ${cy + 92} q34 42 68 0 L${cx + 34} ${cy - 100}"/>
        </g>
        <circle cx="${cx}" cy="${cy - 100}" r="10" fill="${accent}"/>
        <path d="M${cx} ${cy + 62} q-18 -60 0 -118" fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
        <g fill="${accent}">
          <path d="M${cx - 4} ${cy + 34} q-30 -4 -34 -32 q30 4 34 32 Z"/>
          <path d="M${cx - 8} ${cy - 6} q-30 -4 -34 -32 q30 4 34 32 Z"/>
          <path d="M${cx - 2} ${cy + 14} q30 -12 58 4 q-28 22 -58 -4 Z" opacity="0.85"/>
          <path d="M${cx - 4} ${cy - 28} q30 -12 58 4 q-28 22 -58 -4 Z" opacity="0.85"/>
          <path d="M${cx - 2} ${cy - 56} q-4 -26 18 -40 q10 24 -18 40 Z"/>
        </g>
        <rect x="${cx + 100}" y="${cy - 130}" width="150" height="250" rx="12" fill="none" stroke="${main}" stroke-width="${sw}"/>
        <g stroke="${accent}" stroke-width="7" stroke-linecap="round">
          <line x1="${cx + 120}" y1="${cy - 86}" x2="${cx + 230}" y2="${cy - 86}"/>
          <line x1="${cx + 120}" y1="${cy - 40}" x2="${cx + 230}" y2="${cy - 40}"/>
          <line x1="${cx + 120}" y1="${cy + 6}" x2="${cx + 230}" y2="${cy + 6}"/>
          <line x1="${cx + 120}" y1="${cy + 52}" x2="${cx + 230}" y2="${cy + 52}"/>
          <line x1="${cx + 210}" y1="${cy + 52}" x2="${cx + 210}" y2="${cy + 92}"/>
        </g>
        <circle cx="${cx + 210}" cy="${cy + 102}" r="9" fill="${accent}"/>
      `;
    // ขอประเมินราคาฟรี — luggage tag reading ฟรี + a real measuring tape.
    case "quote":
      return `
        <g transform="rotate(-10 ${cx} ${cy - 30})">
          <path d="M${cx - 170} ${cy - 128} L${cx + 86} ${cy - 128} q16 0 27 11 l58 58 q11 11 0 22 l-58 58 q-11 11 -27 11 L${cx - 170} ${cy + 32} q-14 0 -14 -14 L${cx - 184} ${cy - 114} q0 -14 14 -14 Z" fill="none" stroke="${main}" stroke-width="${sw}" stroke-linejoin="round"/>
          <circle cx="${cx + 112}" cy="${cy - 48}" r="13" fill="none" stroke="${main}" stroke-width="7"/>
          <text x="${cx - 52}" y="${cy - 20}" font-family="${FONT_TH}" font-size="76" font-weight="700" fill="${main}" text-anchor="middle">ฟรี</text>
        </g>
        <path d="M${cx + 124} ${cy - 92} q64 -46 112 -14" fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
        <g transform="rotate(6 ${cx} ${cy + 128})">
          <rect x="${cx - 180}" y="${cy + 96}" width="330" height="64" rx="10" fill="none" stroke="${accent}" stroke-width="7"/>
          <g stroke="${accent}" stroke-width="5" stroke-linecap="round">
            <line x1="${cx - 138}" y1="${cy + 96}" x2="${cx - 138}" y2="${cy + 122}"/>
            <line x1="${cx - 96}" y1="${cy + 96}" x2="${cx - 96}" y2="${cy + 136}"/>
            <line x1="${cx - 54}" y1="${cy + 96}" x2="${cx - 54}" y2="${cy + 122}"/>
            <line x1="${cx - 12}" y1="${cy + 96}" x2="${cx - 12}" y2="${cy + 136}"/>
            <line x1="${cx + 30}" y1="${cy + 96}" x2="${cx + 30}" y2="${cy + 122}"/>
            <line x1="${cx + 72}" y1="${cy + 96}" x2="${cx + 72}" y2="${cy + 136}"/>
            <line x1="${cx + 114}" y1="${cy + 96}" x2="${cx + 114}" y2="${cy + 122}"/>
          </g>
        </g>
      `;
    // โทรหาร้าน — classic solid handset with gold ring arcs.
    case "call":
      return `
        <g transform="rotate(-6 ${cx} ${cy})">
          <path d="M${cx - 146} ${cy - 124} q32 -28 58 4 l34 46 q15 20 -8 41 l-22 20 q28 62 86 98 l24 -18 q22 -17 41 4 l38 42 q24 28 -6 54 q-48 41 -114 8 q-120 -62 -167 -191 q-21 -62 36 -108 Z" fill="${main}"/>
        </g>
        <g fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round">
          <path d="M${cx + 70} ${cy - 126} q34 8 44 42"/>
          <path d="M${cx + 102} ${cy - 164} q54 13 69 67"/>
          <path d="M${cx + 134} ${cy - 202} q73 19 94 92"/>
        </g>
      `;
    // ที่ตั้งร้าน — soi grid with a gold pin (kept from v3, tuned).
    case "map":
      return `
        <g stroke="${main}" stroke-width="12" opacity="0.3" stroke-linecap="round">
          <line x1="${cx - 350}" y1="${cy - 40}" x2="${cx + 350}" y2="${cy - 100}"/>
          <line x1="${cx - 330}" y1="${cy + 170}" x2="${cx + 360}" y2="${cy + 110}"/>
          <line x1="${cx - 200}" y1="${cy - 220}" x2="${cx - 240}" y2="${cy + 240}"/>
          <line x1="${cx + 60}" y1="${cy - 250}" x2="${cx + 20}" y2="${cy + 250}"/>
          <line x1="${cx + 280}" y1="${cy - 220}" x2="${cx + 250}" y2="${cy + 230}"/>
        </g>
        <line x1="${cx - 360}" y1="${cy + 60}" x2="${cx + 370}" y2="${cy - 10}" stroke="${accent}" stroke-width="18" opacity="0.5" stroke-linecap="round"/>
        <path d="M${cx} ${cy - 175} a75 75 0 0 1 75 75 q0 62 -75 130 q-75 -68 -75 -130 a75 75 0 0 1 75 -75 Z" fill="${accent}"/>
        <circle cx="${cx}" cy="${cy - 100}" r="32" fill="${ground}"/>
        <ellipse cx="${cx}" cy="${cy + 60}" rx="95" ry="17" fill="${main}" opacity="0.2"/>
        <text x="${cx}" y="${cy - 232}" font-family="${FONT_TH}" font-size="32" fill="${main}" text-anchor="middle">ซอยลาดพร้าว 64 แยก 12</text>
      `;
    // เว็บไซต์ — browser window whose page is a drawn curtain.
    case "web":
      return `
        <g fill="none" stroke="${main}" stroke-width="${sw}">
          <rect x="${cx - 210}" y="${cy - 170}" width="420" height="330" rx="20"/>
          <line x1="${cx - 210}" y1="${cy - 96}" x2="${cx + 210}" y2="${cy - 96}"/>
        </g>
        <circle cx="${cx - 172}" cy="${cy - 133}" r="10" fill="${accent}"/>
        <circle cx="${cx - 136}" cy="${cy - 133}" r="10" fill="${main}"/>
        <circle cx="${cx - 100}" cy="${cy - 133}" r="10" fill="${accent}" opacity="0.5"/>
        <rect x="${cx - 64}" y="${cy - 148}" width="256" height="30" rx="15" fill="none" stroke="${accent}" stroke-width="5"/>
        <g fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round">
          <path d="M${cx - 150} ${cy - 66} q8 90 -12 196"/>
          <path d="M${cx - 110} ${cy - 66} q6 90 -8 196"/>
          <path d="M${cx + 150} ${cy - 66} q-8 90 12 196"/>
          <path d="M${cx + 110} ${cy - 66} q-6 90 8 196"/>
        </g>
        <g transform="translate(${cx + 140} ${cy + 78}) scale(3.1)">
          <path d="M0 0 L0 30 L7.5 23 L13 36 L18.5 33.5 L13 21 L23 21 Z" fill="${main}" stroke="${ground}" stroke-width="1.6" stroke-linejoin="round"/>
        </g>
      `;
    default:
      return "";
  }
}

function illusTile(p) {
  const { x, y, width, height } = p.bounds;
  const cx = x + width / 2;
  const isSage = p.visual.bg === "sage";
  const bg = isSage ? COLORS.sage : COLORS.cream;
  const main = isSage ? COLORS.cream : COLORS.sage;
  const accent = isSage ? COLORS.goldSoft : COLORS.gold;
  const label = isSage ? COLORS.cream : COLORS.sageDark;
  const sub = isSage ? COLORS.goldSoft : COLORS.gold;
  const artCy = y + (y === 0 ? BRAND_BAND : 0) / 2 + height / 2 - 118;
  const baseline = y + height - 128;
  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${bg}"/>
    <rect x="${x + 34}" y="${y + (y === 0 ? BRAND_BAND : 0) + 30}" width="${width - 68}" height="${height - (y === 0 ? BRAND_BAND : 0) - 60}" fill="none" stroke="${accent}" stroke-width="3" opacity="0.55"/>
    ${illusArt(p.visual.kind, cx, artCy, { main, accent, ground: bg })}
    ${diamondDivider(cx, baseline - 78, 78, sub)}
    <text x="${cx}" y="${baseline}" font-family="${FONT_TH}" font-size="64" font-weight="700" fill="${label}" text-anchor="middle">${p.label}</text>
    <text x="${cx}" y="${baseline + 58}" font-family="${FONT_EN}" font-size="29" letter-spacing="7" fill="${sub}" text-anchor="middle">${p.sub}</text>
  `;
}

function brandBand() {
  const w = CANVAS.width;
  const h = BRAND_BAND;
  const cyy = h / 2;
  return `
    <rect x="0" y="0" width="${w}" height="${h}" fill="${COLORS.cream}"/>
    <line x1="0" y1="${h - 3}" x2="${w}" y2="${h - 3}" stroke="${COLORS.gold}" stroke-width="4"/>
    <text x="${w / 2 - 110}" y="${cyy + 16}" font-family="${FONT_EN}" font-size="46" letter-spacing="10" fill="${COLORS.sageDark}" text-anchor="end">CURTAIN STORY</text>
    <text x="${w / 2 + 110}" y="${cyy + 16}" font-family="${FONT_EN}" font-size="46" letter-spacing="10" fill="${COLORS.gold}" text-anchor="start">HOME</text>
    <line x1="120" y1="${cyy}" x2="${w / 2 - 480}" y2="${cyy}" stroke="${COLORS.goldSoft}" stroke-width="2"/>
    <line x1="${w / 2 + 400}" y1="${cyy}" x2="${w - 120}" y2="${cyy}" stroke="${COLORS.goldSoft}" stroke-width="2"/>
  `;
}

const dividers = `
  <line x1="${CANVAS.width / 3}" y1="${BRAND_BAND}" x2="${CANVAS.width / 3}" y2="${CANVAS.height}" stroke="${COLORS.gold}" stroke-width="4"/>
  <line x1="${(CANVAS.width / 3) * 2}" y1="${BRAND_BAND}" x2="${(CANVAS.width / 3) * 2}" y2="${CANVAS.height}" stroke="${COLORS.gold}" stroke-width="4"/>
  <line x1="0" y1="${CANVAS.height / 2}" x2="${CANVAS.width}" y2="${CANVAS.height / 2}" stroke="${COLORS.gold}" stroke-width="4"/>
`;

// --- compose ---------------------------------------------------------------
const overlaySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS.width}" height="${CANVAS.height}">
  ${PANELS.map((p) => illusTile(p)).join("\n")}
  ${brandBand()}
  ${dividers}
</svg>`;

const composites = [{ input: Buffer.from(overlaySvg), left: 0, top: 0 }];

const logoSize = 118;
const logo = await sharp(path.join(IMAGES_DIR, "logo.jpg"))
  .resize(logoSize, logoSize, { fit: "cover" })
  .composite([
    {
      input: Buffer.from(
        `<svg width="${logoSize}" height="${logoSize}"><circle cx="${logoSize / 2}" cy="${logoSize / 2}" r="${logoSize / 2}" fill="#fff"/></svg>`
      ),
      blend: "dest-in",
    },
  ])
  .png()
  .toBuffer();
composites.push({
  input: logo,
  left: Math.round(CANVAS.width / 2 - logoSize / 2),
  top: Math.round((BRAND_BAND - logoSize) / 2),
});

const outDir = path.join(HERE, "output");
await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, "richmenu-source.svg"), overlaySvg);

// LINE caps rich menu images at 1MB — encode JPEG, stepping quality down.
const outPath = path.join(outDir, "richmenu-2500x1686.jpg");
const composed = sharp({
  create: {
    width: CANVAS.width,
    height: CANVAS.height,
    channels: 3,
    background: COLORS.cream,
  },
}).composite(composites);

let quality = 88;
let buf = await composed.clone().jpeg({ quality, mozjpeg: true }).toBuffer();
while (buf.length > 1_000_000 && quality > 50) {
  quality -= 6;
  buf = await composed.clone().jpeg({ quality, mozjpeg: true }).toBuffer();
}
await writeFile(outPath, buf);
console.log(
  `Rich menu image written to ${outPath} (${(buf.length / 1024).toFixed(0)}KB, q${quality})`
);
