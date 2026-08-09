// Generates the "add friend" QR code for the new OA (@410jcnxt) from its
// permanent LINE Basic ID URL — no manager.line.biz visit needed for this part.
import { fileURLToPath } from "node:url";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import QRCode from "qrcode";

const BASIC_ID = "410jcnxt";
export const FRIEND_URL = `https://line.me/R/ti/p/%40${BASIC_ID}`;

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "output");
await mkdir(outDir, { recursive: true });
const outPath = path.join(outDir, "friend-qr.png");

await QRCode.toFile(outPath, FRIEND_URL, { width: 1000, margin: 2 });
console.log("Friend URL:", FRIEND_URL);
console.log("QR written to", outPath);
