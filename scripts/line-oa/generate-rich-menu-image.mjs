// Renders the rich menu background PNG from richmenu.config.mjs.
// v2: real installation photos + logo palette (sage/gold/cream) so the menu
// carries the shop's actual identity instead of generic beige tiles.
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

function icon(kind, cx, cy, stroke) {
  const s = stroke;
  switch (kind) {
    case "tag":
      return `<path d="M${cx - 42} ${cy - 42} L${cx + 18} ${cy - 42} L${cx + 48} ${cy - 12} L${cx - 12} ${cy + 48} L${cx - 48} ${cy + 12} Z" fill="none" stroke="${s}" stroke-width="8" stroke-linejoin="round"/>
        <circle cx="${cx + 2}" cy="${cy - 24}" r="7" fill="${s}"/>`;
    case "phone":
      return `<path d="M${cx - 36} ${cy - 46} q12 -10 22 2 l12 17 q5 10 -5 17 l-10 7 q12 29 36 41 l7 -10 q7 -10 17 -5 l17 12 q12 10 2 22 q-17 22 -41 10 q-46 -22 -65 -67 q-10 -24 8 -46 Z" fill="${s}"/>`;
    default:
      return "";
  }
}

// Photo tiles: dark gradient at the bottom so the label reads over any photo.
function photoOverlay(p, idx) {
  const { x, y, width, height } = p.bounds;
  const cx = x + width / 2;
  const baseline = y + height - 150;
  return `
    <rect x="${x}" y="${y + height - 340}" width="${width}" height="340" fill="url(#fade${idx})"/>
    <line x1="${cx - 40}" y1="${baseline - 84}" x2="${cx + 40}" y2="${baseline - 84}" stroke="${COLORS.gold}" stroke-width="5"/>
    <text x="${cx}" y="${baseline}" font-family="${FONT_TH}" font-size="64" font-weight="700" fill="${COLORS.textOnPhoto}" text-anchor="middle">${p.label}</text>
    <text x="${cx}" y="${baseline + 62}" font-family="${FONT_EN}" font-size="30" letter-spacing="8" fill="${COLORS.goldSoft}" text-anchor="middle">${p.sub}</text>
  `;
}

// Solid tiles: flat brand color + icon — these are the two CTAs (quote/call).
function solidTile(p) {
  const { x, y, width, height } = p.bounds;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const isSage = p.visual.bg === "sage";
  const bg = isSage ? COLORS.sage : COLORS.cream;
  const fg = isSage ? COLORS.cream : COLORS.sageDark;
  const sub = isSage ? COLORS.goldSoft : COLORS.gold;
  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${bg}"/>
    <rect x="${x + 42}" y="${y + 42}" width="${width - 84}" height="${height - 84}" fill="none" stroke="${sub}" stroke-width="3" opacity="0.75"/>
    ${icon(p.icon, cx, cy - 130, sub)}
    <text x="${cx}" y="${cy + 40}" font-family="${FONT_TH}" font-size="68" font-weight="700" fill="${fg}" text-anchor="middle">${p.label}</text>
    <text x="${cx}" y="${cy + 112}" font-family="${FONT_EN}" font-size="34" letter-spacing="8" fill="${sub}" text-anchor="middle">${p.sub}</text>
  `;
}

// Brand band across the top: cream, gold hairline, wordmark flanking the
// logo emblem (composited separately as a raster).
function brandBand() {
  const w = CANVAS.width;
  const h = BRAND_BAND;
  const cy = h / 2;
  return `
    <rect x="0" y="0" width="${w}" height="${h}" fill="${COLORS.cream}"/>
    <line x1="0" y1="${h - 3}" x2="${w}" y2="${h - 3}" stroke="${COLORS.gold}" stroke-width="4"/>
    <text x="${w / 2 - 110}" y="${cy + 16}" font-family="${FONT_EN}" font-size="46" letter-spacing="10" fill="${COLORS.sageDark}" text-anchor="end">CURTAIN STORY</text>
    <text x="${w / 2 + 110}" y="${cy + 16}" font-family="${FONT_EN}" font-size="46" letter-spacing="10" fill="${COLORS.gold}" text-anchor="start">HOME</text>
    <line x1="120" y1="${cy}" x2="${w / 2 - 480}" y2="${cy}" stroke="${COLORS.goldSoft}" stroke-width="2"/>
    <line x1="${w / 2 + 400}" y1="${cy}" x2="${w - 120}" y2="${cy}" stroke="${COLORS.goldSoft}" stroke-width="2"/>
  `;
}

const fadeDefs = PANELS.map(
  (p, i) => `<linearGradient id="fade${i}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${COLORS.overlay}" stop-opacity="0"/>
    <stop offset="1" stop-color="${COLORS.overlay}" stop-opacity="0.82"/>
  </linearGradient>`
).join("\n");

const dividers = `
  <line x1="${CANVAS.width / 3}" y1="${BRAND_BAND}" x2="${CANVAS.width / 3}" y2="${CANVAS.height}" stroke="${COLORS.gold}" stroke-width="4"/>
  <line x1="${(CANVAS.width / 3) * 2}" y1="${BRAND_BAND}" x2="${(CANVAS.width / 3) * 2}" y2="${CANVAS.height}" stroke="${COLORS.gold}" stroke-width="4"/>
  <line x1="0" y1="${CANVAS.height / 2}" x2="${CANVAS.width}" y2="${CANVAS.height / 2}" stroke="${COLORS.gold}" stroke-width="4"/>
`;

// --- compose ---------------------------------------------------------------
const composites = [];

// 1) photos, cover-cropped into their tiles (leaving room for the brand band
//    on the top row so faces of the photos aren't hidden behind it)
for (const p of PANELS) {
  if (p.visual.type !== "photo") continue;
  const { x, y, width, height } = p.bounds;
  const top = y === 0 ? BRAND_BAND : y;
  const h = y === 0 ? height - BRAND_BAND : height;
  const buf = await sharp(path.join(IMAGES_DIR, p.visual.src))
    .resize(width, h, { fit: "cover", position: p.visual.position ?? "attention" })
    .toBuffer();
  composites.push({ input: buf, left: x, top });
}

// 2) SVG overlay: brand band, solid tiles, gradients, labels, dividers
const overlaySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS.width}" height="${CANVAS.height}">
  <defs>${fadeDefs}</defs>
  ${PANELS.filter((p) => p.visual.type === "solid").map(solidTile).join("\n")}
  ${PANELS.map((p, i) => (p.visual.type === "photo" ? photoOverlay(p, i) : "")).join("\n")}
  ${brandBand()}
  ${dividers}
</svg>`;
composites.push({ input: Buffer.from(overlaySvg), left: 0, top: 0 });

// 3) logo emblem centered in the brand band
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

// LINE caps rich menu images at 1MB — with photo tiles a PNG blows well past
// that, so encode JPEG and step quality down until it fits.
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
