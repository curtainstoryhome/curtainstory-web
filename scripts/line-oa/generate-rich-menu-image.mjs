// Renders the rich menu background PNG from richmenu.config.mjs.
// Run: node scripts/line-oa/generate-rich-menu-image.mjs
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";
import { CANVAS, COLORS, PANELS } from "./richmenu.config.mjs";

const FONT = "Tahoma, 'Leelawadee UI', 'Segoe UI', sans-serif";

function icon(kind, cx, cy) {
  const s = COLORS.icon;
  const size = 70;
  switch (kind) {
    case "photo":
      return `<rect x="${cx - size / 2}" y="${cy - size / 2.6}" width="${size}" height="${size * 0.75}" rx="10" fill="none" stroke="${s}" stroke-width="7"/>
        <circle cx="${cx}" cy="${cy + 2}" r="16" fill="none" stroke="${s}" stroke-width="7"/>
        <rect x="${cx - 14}" y="${cy - size / 2.6 - 10}" width="28" height="14" rx="4" fill="${s}"/>`;
    case "grid":
      return [0, 1].flatMap((r) =>
        [0, 1].map(
          (c) =>
            `<rect x="${cx - 40 + c * 44}" y="${cy - 40 + r * 44}" width="34" height="34" rx="6" fill="none" stroke="${s}" stroke-width="7"/>`
        )
      ).join("");
    case "tag":
      return `<path d="M${cx - 35} ${cy - 35} L${cx + 15} ${cy - 35} L${cx + 40} ${cy - 10} L${cx - 10} ${cy + 40} L${cx - 40} ${cy + 10} Z" fill="none" stroke="${s}" stroke-width="7" stroke-linejoin="round"/>
        <circle cx="${cx + 2}" cy="${cy - 20}" r="6" fill="${s}"/>`;
    case "phone":
      return `<path d="M${cx - 30} ${cy - 38} q10 -8 18 2 l10 14 q4 8 -4 14 l-8 6 q10 24 30 34 l6 -8 q6 -8 14 -4 l14 10 q10 8 2 18 q-14 18 -34 8 q-38 -18 -54 -56 q-8 -20 6 -38 Z" fill="${s}"/>`;
    case "pin":
      return `<path d="M${cx} ${cy - 42} a30 30 0 0 1 30 30 q0 26 -30 52 q-30 -26 -30 -52 a30 30 0 0 1 30 -30 Z" fill="none" stroke="${s}" stroke-width="7" stroke-linejoin="round"/>
        <circle cx="${cx}" cy="${cy - 12}" r="11" fill="${s}"/>`;
    case "globe":
      return `<circle cx="${cx}" cy="${cy}" r="40" fill="none" stroke="${s}" stroke-width="7"/>
        <ellipse cx="${cx}" cy="${cy}" rx="17" ry="40" fill="none" stroke="${s}" stroke-width="6"/>
        <line x1="${cx - 40}" y1="${cy}" x2="${cx + 40}" y2="${cy}" stroke="${s}" stroke-width="6"/>`;
    default:
      return "";
  }
}

function panelSvg(p, i) {
  const { x, y, width, height } = p.bounds;
  const cx = x + width / 2;
  const cy = y + height / 2 - 40;
  const alt = i % 2 === 1 ? COLORS.panelAlt : COLORS.background;
  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${alt}"/>
    ${icon(p.icon, cx, cy)}
    <text x="${cx}" y="${y + height / 2 + 70}" font-family="${FONT}" font-size="52" font-weight="600" fill="${COLORS.text}" text-anchor="middle">${p.label}</text>
    <text x="${cx}" y="${y + height / 2 + 118}" font-family="${FONT}" font-size="30" letter-spacing="2" fill="${COLORS.subtext}" text-anchor="middle">${p.sub}</text>
  `;
}

const dividers = `
  <line x1="${CANVAS.width / 3}" y1="0" x2="${CANVAS.width / 3}" y2="${CANVAS.height}" stroke="${COLORS.divider}" stroke-width="3"/>
  <line x1="${(CANVAS.width / 3) * 2}" y1="0" x2="${(CANVAS.width / 3) * 2}" y2="${CANVAS.height}" stroke="${COLORS.divider}" stroke-width="3"/>
  <line x1="0" y1="${CANVAS.height / 2}" x2="${CANVAS.width}" y2="${CANVAS.height / 2}" stroke="${COLORS.divider}" stroke-width="3"/>
`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS.width}" height="${CANVAS.height}">
  <rect width="${CANVAS.width}" height="${CANVAS.height}" fill="${COLORS.background}"/>
  ${PANELS.map(panelSvg).join("\n")}
  ${dividers}
</svg>`;

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "output");
await writeFile(path.join(outDir, "richmenu-source.svg"), svg).catch(async (e) => {
  if (e.code === "ENOENT") {
    const { mkdir } = await import("node:fs/promises");
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, "richmenu-source.svg"), svg);
  } else throw e;
});

const outPath = path.join(outDir, "richmenu-2500x1686.png");
await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log("Rich menu image written to", outPath);
