// Generates the "add friend" QR code for the OA from its permanent LINE
// Basic ID URL — no manager.line.biz visit needed for this part.
import { fileURLToPath } from "node:url";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import QRCode from "qrcode";

// Premium ID as of 2026-08-09 (was the random @410jcnxt before purchase).
const BASIC_ID = "curtainstoryhome";
export const FRIEND_URL = `https://line.me/R/ti/p/%40${BASIC_ID}`;

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "output");
await mkdir(outDir, { recursive: true });
const outPath = path.join(outDir, "friend-qr.png");

// Brand-colored QR: deep sage modules on the logo's cream ground — still
// high-contrast enough for every scanner, but unmistakably the shop's.
await QRCode.toFile(outPath, FRIEND_URL, {
  width: 1000,
  margin: 2,
  color: { dark: "#57614aff", light: "#f7f1e6ff" },
});
console.log("Friend URL:", FRIEND_URL);
console.log("QR written to", outPath);
