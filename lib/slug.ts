import type { SupabaseClient } from "@supabase/supabase-js";

// Thai characters are kept on purpose: these slugs become the public URL
// (/portfolio/<slug>) and Thai keywords in the URL help Thai-language search.
export function slugify(text: string): string {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙เ-๙]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Guarantees a slug that is not already taken. Without this, two items sharing
// a title hit the unique index and the user sees a raw Postgres error.
export async function generateUniqueSlug(
  supabase: SupabaseClient,
  table: "services" | "projects",
  title: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(title) || "item";

  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;

    let query = supabase.from(table).select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);

    const { data } = await query.maybeSingle();
    if (!data) return candidate;
  }

  // Extremely unlikely; keeps the function total rather than looping forever.
  return `${base}-${Date.now()}`;
}

// Turns Postgres/PostgREST errors into something a shop owner can act on.
export function friendlyDbError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("duplicate key") || m.includes("unique constraint")) {
    return "มีรายการชื่อนี้อยู่แล้ว กรุณาใช้ชื่ออื่น";
  }
  if (m.includes("row-level security") || m.includes("permission denied")) {
    return "ไม่มีสิทธิ์ทำรายการนี้ กรุณาเข้าสู่ระบบใหม่อีกครั้ง";
  }
  if (m.includes("เพิ่มรูปได้สูงสุด")) {
    // Our own trigger message is already user-facing Thai.
    return message;
  }
  if (m.includes("violates check constraint")) {
    return "ข้อมูลไม่ถูกต้องตามเงื่อนไขของระบบ กรุณาตรวจสอบอีกครั้ง";
  }
  if (m.includes("network") || m.includes("fetch failed")) {
    return "เชื่อมต่อไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่";
  }
  return `บันทึกไม่สำเร็จ: ${message}`;
}
