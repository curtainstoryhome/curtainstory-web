// Renders the rich menu background PNG from richmenu.config.mjs.
// v3: every tile's artwork narrates its button —
//   ดูผลงานจริง   → 2x2 collage of real installations ("lots to browse")
//   บริการทั้งหมด → three labeled material strips: ม่าน/วอลล์เปเปอร์/มู่ลี่
//   ขอประเมินราคาฟรี / โทรหาร้าน → flat brand-color CTA tiles
//   ที่ตั้งร้าน   → hand-drawn minimal map in brand colors with a gold pin
//   เว็บไซต์      → browser window mock with the shop URL in the address bar
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
const GAP = 8; // gold gutter inside collage/strips

function tileGeom(p) {
  const { x, y, width, height } = p.bounds;
  const top = y === 0 ? BRAND_BAND : y;
  const h = y === 0 ? height - BRAND_BAND : height;
  return { x, top, width, h };
}

// Every photo goes through one grade so six different rooms, shot on
// different days under different light, read as a single warm set:
// saturation pulled back, a lift in brightness, then a cream veil in
// soft-light. Without this the green wallpaper and pink swatches fight
// the sage/gold palette.
const GRADE = { saturation: 0.62, brightness: 1.06 };
const VEIL = { color: "#f0dfc2", opacity: 0.22 };

async function cover(src, w, h, position = "attention") {
  const W = Math.round(w);
  const H = Math.round(h);
  const base = await sharp(path.join(IMAGES_DIR, src))
    .resize(W, H, { fit: "cover", position })
    .modulate(GRADE)
    .toBuffer();
  return sharp(base)
    .composite([
      {
        input: Buffer.from(
          `<svg width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="${VEIL.color}" opacity="${VEIL.opacity}"/></svg>`
        ),
        blend: "soft-light",
      },
    ])
    .toBuffer();
}

function icon(kind, cx, cy, s) {
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

function labelBlock(p, opts = {}) {
  const { x, y, width, height } = p.bounds;
  const cx = x + width / 2;
  const baseline = y + height - (opts.raise ?? 150);
  const fill = opts.fill ?? COLORS.textOnPhoto;
  const subFill = opts.subFill ?? COLORS.goldSoft;
  return `
    <line x1="${cx - 40}" y1="${baseline - 84}" x2="${cx + 40}" y2="${baseline - 84}" stroke="${COLORS.gold}" stroke-width="5"/>
    <text x="${cx}" y="${baseline}" font-family="${FONT_TH}" font-size="64" font-weight="700" fill="${fill}" text-anchor="middle">${p.label}</text>
    <text x="${cx}" y="${baseline + 62}" font-family="${FONT_EN}" font-size="30" letter-spacing="8" fill="${subFill}" text-anchor="middle">${p.sub}</text>
  `;
}

function bottomFade(p, idx) {
  const { x, y, width, height } = p.bounds;
  return `<rect x="${x}" y="${y + height - 340}" width="${width}" height="340" fill="url(#fade${idx})"/>`;
}

// --- per-visual composers (rasters) ---------------------------------------
async function composeCollage(p, composites) {
  const g = tileGeom(p);
  const cw = (g.width - GAP) / 2;
  const ch = (g.h - GAP) / 2;
  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    composites.push({
      input: await cover(p.visual.srcs[i], cw, ch),
      left: Math.round(g.x + col * (cw + GAP)),
      top: Math.round(g.top + row * (ch + GAP)),
    });
  }
}

async function composeStrips(p, composites) {
  const g = tileGeom(p);
  const sw = (g.width - 2 * GAP) / 3;
  for (let i = 0; i < 3; i++) {
    composites.push({
      input: await cover(p.visual.srcs[i], sw, g.h),
      left: Math.round(g.x + i * (sw + GAP)),
      top: g.top,
    });
  }
}

async function composeBrowser(p, composites) {
  const g = tileGeom(p);
  const m = 56; // window inset
  const bar = 78; // chrome bar height
  const winX = g.x + m;
  const winY = g.top + m;
  const winW = g.width - 2 * m;
  const winH = g.h - 2 * m - 180; // leave label room
  // Tile background must be a raster UNDER the photo — anything painted in
  // the overlay SVG would cover the composited photo instead.
  composites.push({
    input: Buffer.from(
      `<svg width="${g.width}" height="${g.h}"><rect width="${g.width}" height="${g.h}" fill="${COLORS.sage}"/></svg>`
    ),
    left: g.x,
    top: g.top,
  });
  composites.push({
    input: await cover(p.visual.src, winW, winH - bar),
    left: Math.round(winX),
    top: Math.round(winY + bar),
  });
}

// --- per-visual SVG layers -------------------------------------------------
function svgForPanel(p, idx) {
  const { x, y, width, height } = p.bounds;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const g = tileGeom(p);
  switch (p.visual.type) {
    case "collage":
      return `${bottomFade(p, idx)}${labelBlock(p)}`;
    case "strips": {
      const sw = (g.width - 2 * GAP) / 3;
      const chips = p.visual.strips
        .map((name, i) => {
          const scx = g.x + i * (sw + GAP) + sw / 2;
          return `<rect x="${scx - 128}" y="${g.top + 34}" width="256" height="62" rx="31" fill="${COLORS.cream}" opacity="0.94"/>
            <text x="${scx}" y="${g.top + 77}" font-family="${FONT_TH}" font-size="34" font-weight="700" fill="${COLORS.sageDark}" text-anchor="middle">${name}</text>`;
        })
        .join("");
      return `${chips}${bottomFade(p, idx)}${labelBlock(p)}`;
    }
    case "solid": {
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
    case "map": {
      // Minimal brand-colored street map: soi grid + main road + gold pin.
      const px = cx;
      const py = cy - 105;
      return `
        <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${COLORS.cream}"/>
        <g stroke="${COLORS.sage}" stroke-width="14" opacity="0.35" stroke-linecap="round">
          <line x1="${x + 60}" y1="${y + 210}" x2="${x + width - 60}" y2="${y + 150}"/>
          <line x1="${x + 90}" y1="${y + 430}" x2="${x + width - 40}" y2="${y + 370}"/>
          <line x1="${x + 200}" y1="${y + 80}" x2="${x + 150}" y2="${y + 560}"/>
          <line x1="${x + 470}" y1="${y + 60}" x2="${x + 430}" y2="${y + 590}"/>
          <line x1="${x + 690}" y1="${y + 100}" x2="${x + 660}" y2="${y + 560}"/>
        </g>
        <g stroke="${COLORS.gold}" stroke-width="20" opacity="0.55" stroke-linecap="round">
          <line x1="${x + 40}" y1="${y + 330}" x2="${x + width - 40}" y2="${y + 260}"/>
        </g>
        <path d="M${px} ${py - 70} a70 70 0 0 1 70 70 q0 58 -70 122 q-70 -64 -70 -122 a70 70 0 0 1 70 -70 Z" fill="${COLORS.gold}"/>
        <circle cx="${px}" cy="${py}" r="30" fill="${COLORS.cream}"/>
        <ellipse cx="${px}" cy="${cy + 82}" rx="90" ry="16" fill="${COLORS.sage}" opacity="0.25"/>
        <text x="${cx}" y="${y + 96}" font-family="${FONT_TH}" font-size="30" fill="${COLORS.sageDark}" opacity="0.8" text-anchor="middle">ซอยลาดพร้าว 64 แยก 12</text>
        ${labelBlock(p, { fill: COLORS.sageDark, subFill: COLORS.gold })}
      `;
    }
    case "browser": {
      const m = 56;
      const bar = 78;
      const winX = g.x + m;
      const winY = g.top + m;
      const winW = g.width - 2 * m;
      const winH = g.h - 2 * m - 180;
      return `
        <rect x="${winX - 5}" y="${winY - 5}" width="${winW + 10}" height="${winH + 10}" rx="20" fill="none" stroke="${COLORS.goldSoft}" stroke-width="6"/>
        <rect x="${winX}" y="${winY}" width="${winW}" height="${bar}" rx="18" fill="${COLORS.cream}"/>
        <rect x="${winX}" y="${winY + bar - 18}" width="${winW}" height="18" fill="${COLORS.cream}"/>
        <circle cx="${winX + 44}" cy="${winY + bar / 2}" r="11" fill="${COLORS.gold}"/>
        <circle cx="${winX + 82}" cy="${winY + bar / 2}" r="11" fill="${COLORS.sage}"/>
        <circle cx="${winX + 120}" cy="${winY + bar / 2}" r="11" fill="${COLORS.goldSoft}"/>
        <rect x="${winX + 156}" y="${winY + 14}" width="${winW - 200}" height="${bar - 28}" rx="${(bar - 28) / 2}" fill="#fff" opacity="0.9"/>
        <text x="${winX + 180}" y="${winY + bar / 2 + 11}" font-family="${FONT_EN}" font-size="30" letter-spacing="2" fill="${COLORS.sageDark}">curtainstoryhome.com</text>
        ${labelBlock(p, { raise: 96 })}
      `;
    }
    default:
      return "";
  }
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
for (const p of PANELS) {
  if (p.visual.type === "collage") await composeCollage(p, composites);
  else if (p.visual.type === "strips") await composeStrips(p, composites);
  else if (p.visual.type === "browser") await composeBrowser(p, composites);
  else if (p.visual.type === "photo") {
    const g = tileGeom(p);
    composites.push({
      input: await cover(p.visual.src, g.width, g.h, p.visual.position),
      left: g.x,
      top: g.top,
    });
  }
}

const overlaySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS.width}" height="${CANVAS.height}">
  <defs>${fadeDefs}</defs>
  ${PANELS.map((p, i) => svgForPanel(p, i)).join("\n")}
  ${brandBand()}
  ${dividers}
</svg>`;
composites.push({ input: Buffer.from(overlaySvg), left: 0, top: 0 });

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
