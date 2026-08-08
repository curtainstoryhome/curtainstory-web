"use server";

import { createClient } from "@/lib/supabase/server";

export async function changePassword(
  _prev: { error: string | null; success: boolean },
  formData: FormData,
): Promise<{ error: string | null; success: boolean }> {
  const next = (formData.get("new_password") as string) ?? "";
  const confirm = (formData.get("confirm_password") as string) ?? "";

  if (next.length < 10) {
    return { error: "รหัสผ่านต้องยาวอย่างน้อย 10 ตัวอักษร", success: false };
  }
  if (next !== confirm) {
    return { error: "รหัสผ่านทั้งสองช่องไม่ตรงกัน", success: false };
  }

  const supabase = await createClient();

  // Confirm there really is a signed-in session before changing anything.
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) {
    return { error: "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่", success: false };
  }

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) {
    return { error: `เปลี่ยนรหัสผ่านไม่สำเร็จ: ${error.message}`, success: false };
  }

  return { error: null, success: true };
}
