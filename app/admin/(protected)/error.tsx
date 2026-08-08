"use client";

import { useEffect } from "react";
import Link from "next/link";

// The owner needs to know what to do when a screen fails, not just see a blank
// page. Most failures here are the database being unreachable, which on the
// free tier can simply mean the project has been paused for inactivity.
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin] render failed", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-brand-100 bg-white p-6 text-center shadow-sm">
      <h1 className="font-heading text-xl font-semibold text-ink">
        หน้านี้โหลดไม่สำเร็จ
      </h1>
      <p className="mt-3 leading-relaxed text-ink-soft">
        ส่วนใหญ่เกิดจากอินเทอร์เน็ตสะดุดชั่วคราว ลองกดปุ่มด้านล่างดูก่อน
        ถ้ายังไม่หายให้ติดต่อผู้ดูแลเว็บ
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white transition-[background-color,transform] hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.97]"
        >
          ลองใหม่อีกครั้ง
        </button>
        <Link
          href="/admin"
          className="inline-flex min-h-11 items-center rounded-full border border-brand-200 px-5 text-sm font-medium text-ink-soft transition-[background-color,transform] hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.97]"
        >
          กลับหน้าแดชบอร์ด
        </Link>
      </div>
    </div>
  );
}
