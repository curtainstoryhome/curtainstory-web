// สำรองการตั้งค่า LINE OA ที่ API เข้าถึงได้ ลงไฟล์ในเครื่อง
// รัน: npm run line:backup
//
// ทำไมต้องมี: 30 ส.ค. 2569 ข้อความทักทายของร้านหายไปโดยไม่มีใครรู้ตัว
// ลูกค้าที่กดปุ่มไลน์จากโฆษณาเปิดเข้ามาเจอห้องแชทเปล่าแล้วปิดทิ้ง
// ไฟล์ในโฟลเดอร์นี้คือชุดที่ใช้กู้กลับได้ทันทีถ้าเกิดซ้ำ

import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "..", "backup", "line-oa");

const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
if (!TOKEN) {
  console.error("ไม่พบ LINE_CHANNEL_ACCESS_TOKEN — รันผ่าน npm run line:backup");
  process.exit(1);
}

const auth = { Authorization: `Bearer ${TOKEN}` };

async function grab(url) {
  const res = await fetch(url, { headers: auth });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res;
}

await mkdir(OUT, { recursive: true });

const info = await (await grab("https://api.line.me/v2/bot/info")).json();
// repo นี้เป็นสาธารณะ เก็บเฉพาะสิ่งที่ต้องใช้ตรวจ ตัด userId กับ URL รูปโปรไฟล์ทิ้ง
const safeInfo = {
  basicId: info.basicId,
  premiumId: info.premiumId,
  displayName: info.displayName,
  chatMode: info.chatMode,
  markAsReadMode: info.markAsReadMode,
};
await writeFile(
  join(OUT, "bot-info.json"),
  `${JSON.stringify(safeInfo, null, 2)}\n`,
);

const list = await (
  await grab("https://api.line.me/v2/bot/richmenu/list")
).json();
await writeFile(
  join(OUT, "richmenu-list.json"),
  `${JSON.stringify(list, null, 2)}\n`,
);

const def = await (
  await grab("https://api.line.me/v2/bot/user/all/richmenu")
).json();
const activeId = def.richMenuId;

const active = list.richmenus.find((m) => m.richMenuId === activeId);
if (!active) {
  console.error(`เมนูที่เปิดใช้ ${activeId} ไม่มีในรายการ — ตรวจบัญชีด่วน`);
  process.exit(1);
}
await writeFile(
  join(OUT, "richmenu.json"),
  `${JSON.stringify(active, null, 2)}\n`,
);

const img = await grab(
  `https://api-data.line.me/v2/bot/richmenu/${activeId}/content`,
);
const bytes = Buffer.from(await img.arrayBuffer());
const ext = img.headers.get("content-type")?.includes("png") ? "png" : "jpg";
await writeFile(join(OUT, `richmenu.${ext}`), bytes);

console.log("สำรองแล้วที่ backup/line-oa");
console.log(`  บัญชี ${info.premiumId ?? info.basicId} · โหมด ${info.chatMode}`);
console.log(`  เมนู ${active.name} · ${active.areas.length} ปุ่ม`);
console.log(`  ภาพเมนู richmenu.${ext} (${Math.round(bytes.length / 1024)} KB)`);
console.log("");
console.log("ข้อความทักทายดึงผ่าน API ไม่ได้ ถ้าแก้ในแอปแล้วให้อัปเดต");
console.log("  backup/line-oa/greeting-message.txt ตามด้วยมือ");
