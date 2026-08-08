"use client";

import AdminButton from "@/components/admin/AdminButton";

import { useActionState } from "react";
import { login } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, {
    error: null,
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-2xl border border-brand-100 bg-white p-8 shadow-sm">
        {/* Names the shop, so whoever opens this page knows exactly whose
            system it is rather than seeing a bare login box. */}
        <p className="font-heading text-lg font-semibold tracking-tight text-ink">
          CURTAIN STORY HOME
        </p>
        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-brand-700">
          ระบบจัดการเว็บไซต์ของร้าน
        </p>

        <h1 className="mt-6 font-heading text-xl font-semibold text-ink">
          เข้าสู่ระบบผู้ดูแล
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          สำหรับเจ้าของร้านเท่านั้น
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-ink"
            >
              อีเมล
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-ink"
            >
              รหัสผ่าน
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none"
            />
          </div>

          {state.error && (
            <p className="text-sm text-red-600" role="alert">
              {state.error}
            </p>
          )}

          <AdminButton
            type="submit"
            pending={pending}
            pendingLabel="กำลังเข้าสู่ระบบ..."
            className="w-full"
          >
            {"เข้าสู่ระบบ"}
          </AdminButton>
        </form>
      </div>
    </div>
  );
}
