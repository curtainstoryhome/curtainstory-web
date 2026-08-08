"use client";

import AdminButton from "@/components/admin/AdminButton";

import { useActionState } from "react";
import { changePassword } from "@/app/admin/(protected)/settings/password-actions";

export default function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, {
    error: null,
    success: false,
  });

  return (
    <form action={formAction} className="max-w-sm space-y-4">
      <div>
        <label
          htmlFor="new_password"
          className="block text-sm font-medium text-ink"
        >
          รหัสผ่านใหม่
        </label>
        <input
          id="new_password"
          name="new_password"
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-ink-soft">
          อย่างน้อย 10 ตัวอักษร แนะนำให้ผสมตัวเลขและตัวอักษร
        </p>
      </div>

      <div>
        <label
          htmlFor="confirm_password"
          className="block text-sm font-medium text-ink"
        >
          ยืนยันรหัสผ่านใหม่
        </label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="text-sm font-medium text-green-700" role="status">
          เปลี่ยนรหัสผ่านเรียบร้อยแล้ว — ครั้งต่อไปให้ใช้รหัสผ่านใหม่
        </p>
      )}

      <AdminButton type="submit" pending={pending} pendingLabel="กำลังเปลี่ยน...">
          {"เปลี่ยนรหัสผ่าน"}
        </AdminButton>
    </form>
  );
}
