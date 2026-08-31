// ตรวจสุขภาพ LINE OA ของร้าน — รันได้ทุกวันเพื่อจับกรณีเมนู/การตั้งค่าหายเงียบ
// เคยเกิดจริง 30 ส.ค. 2569: ข้อความทักทายหายไปโดยไม่มีใครรู้ ลูกค้ากดปุ่มไลน์
// จากโฆษณา 129 ครั้งแต่เป็นเพื่อนจริงแค่ 3 คน เพราะเปิดเข้ามาเจอห้องแชทเปล่า
//
// รัน: npm run line:check
// exit 0 = ปกติ, exit 1 = พบปัญหา (ใช้ต่อใน CI หรือ cron ได้)
//
// ข้อจำกัด: LINE ไม่มี API อ่านข้อความทักทาย (greeting) ตัวนี้จึงตรวจได้แค่
// rich menu กับจำนวนผู้ติดตาม ส่วนข้อความทักทายต้องเปิดดูในแอปเอง
// สำเนาข้อความล่าสุดเก็บไว้ที่ backup/line-oa/greeting-message.txt

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const BACKUP = join(HERE, "..", "..", "backup", "line-oa");

const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
if (!TOKEN) {
  console.error("ไม่พบ LINE_CHANNEL_ACCESS_TOKEN — รันผ่าน npm run line:check");
  process.exit(1);
}

const problems = [];
const notes = [];

async function api(path, base = "https://api.line.me") {
  const res = await fetch(`${base}${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}`);
  return res.json();
}

// 1. เมนูด้านล่างห้องแชทยังตั้งเป็นค่าเริ่มต้นอยู่หรือไม่
let activeId = null;
try {
  const def = await api("/v2/bot/user/all/richmenu");
  activeId = def.richMenuId;
  notes.push(`เมนูที่เปิดใช้อยู่: ${activeId}`);
} catch (err) {
  problems.push(
    `ไม่มีเมนูตั้งเป็นค่าเริ่มต้น ลูกค้าจะไม่เห็นปุ่มใต้ห้องแชทเลย (${err.message})`,
  );
}

// 2. เมนูที่เปิดอยู่ตรงกับที่สำรองไว้ และปุ่มครบทุกอัน
try {
  const saved = JSON.parse(
    await readFile(join(BACKUP, "richmenu.json"), "utf8"),
  );
  const { richmenus } = await api("/v2/bot/richmenu/list");
  const live = richmenus.find((m) => m.richMenuId === activeId);

  if (!live) {
    problems.push("เมนูที่เปิดใช้อยู่ไม่มีในบัญชีแล้ว");
  } else {
    if (live.areas.length !== saved.areas.length) {
      problems.push(
        `จำนวนปุ่มเปลี่ยนไป: ตอนนี้ ${live.areas.length} ปุ่ม เดิม ${saved.areas.length} ปุ่ม`,
      );
    }
    const target = (a) => a.action.uri ?? a.action.text ?? "";
    const missing = saved.areas
      .map(target)
      .filter((t) => !live.areas.some((a) => target(a) === t));
    if (missing.length) {
      problems.push(`ปุ่มที่หายไป: ${missing.join(" , ")}`);
    }
    notes.push(`ปุ่มในเมนู: ${live.areas.length} ปุ่ม ครบตามที่สำรองไว้`);
  }
} catch (err) {
  problems.push(`ตรวจเมนูไม่สำเร็จ: ${err.message}`);
}

// 3. ผู้ติดตามลดลงหรือไม่ (ข้อมูลของ LINE ตามหลังจริงราวหนึ่งวัน)
try {
  const two = new Date(Date.now() - 2 * 86400000);
  const one = new Date(Date.now() - 86400000);
  const key = (d) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const [prev, now] = await Promise.all([
    api(`/v2/bot/insight/followers?date=${key(two)}`),
    api(`/v2/bot/insight/followers?date=${key(one)}`),
  ]);
  if (now.status === "ready" && prev.status === "ready") {
    const diff = now.followers - prev.followers;
    notes.push(
      `ผู้ติดตาม ${now.followers} คน (${diff >= 0 ? "+" : ""}${diff} จากวันก่อน) บล็อก ${now.blocks} คน`,
    );
    if (diff < 0) {
      problems.push(`ผู้ติดตามลดลง ${Math.abs(diff)} คน`);
    }
  }
} catch (err) {
  notes.push(`อ่านสถิติผู้ติดตามไม่ได้: ${err.message}`);
}

// 4. โหมดตอบกลับ ถ้าสลับไปเป็นบอทอัตโนมัติ พนักงานจะไม่เห็นแชทลูกค้า
try {
  const info = await api("/v2/bot/info");
  notes.push(`โหมดตอบกลับ: ${info.chatMode} · บัญชี ${info.premiumId ?? info.basicId}`);
  if (info.chatMode !== "chat") {
    problems.push(
      `โหมดตอบกลับเปลี่ยนเป็น ${info.chatMode} พนักงานอาจไม่เห็นข้อความลูกค้า`,
    );
  }
} catch (err) {
  notes.push(`อ่านข้อมูลบัญชีไม่ได้: ${err.message}`);
}

console.log("ตรวจสุขภาพ LINE OA — CURTAIN STORY HOME");
for (const n of notes) console.log(`  ${n}`);

if (problems.length) {
  console.error("\nพบปัญหา");
  for (const p of problems) console.error(`  - ${p}`);
  console.error("\nกู้เมนูกลับ: npm run line:richmenu:deploy");
  console.error("ข้อความทักทาย: ตั้งในแอป LINE OA เอง ใช้ข้อความจาก");
  console.error("  backup/line-oa/greeting-message.txt");
  process.exit(1);
}

console.log("\nปกติทุกอย่าง");
console.log("หมายเหตุ ข้อความทักทายตรวจผ่าน API ไม่ได้ ต้องเปิดดูในแอปเอง");
