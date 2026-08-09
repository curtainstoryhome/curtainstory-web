"use client";

import { useEffect } from "react";
import Link from "next/link";

// Last line of defence for the public site. Every data helper throws when the
// database is unreachable, and the free Supabase tier pauses a project after a
// week of inactivity — so "the database is not there" is a real state, not a
// theoretical one.
//
// A customer who hits it must still be able to reach the shop, so the phone
// number and LINE link are written in here rather than fetched. They are the
// one thing that must survive when nothing else does.
const FALLBACK_PHONE = "098-910-4978";
// The permanent @curtainstoryhome address, not a lin.ee short link: this is
// the last contact route a customer has when the page has failed, so it must
// not depend on a redirect that can be retired with the old account.
const FALLBACK_LINE = "https://line.me/R/ti/p/%40curtainstoryhome";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Without this the failure is invisible — the visitor sees a polite page
    // and nobody ever finds out the site was broken.
    console.error("[site] render failed", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 py-16 text-center">
      <p className="font-heading text-sm font-semibold tracking-widest text-brand-700">
        ขออภัยในความไม่สะดวก
      </p>
      <h1 className="mt-3 font-heading text-2xl font-semibold text-ink sm:text-3xl">
        ขณะนี้หน้านี้แสดงผลไม่ได้ชั่วคราว
      </h1>
      <p className="mt-3 max-w-md leading-relaxed text-ink-soft">
        ลองกดโหลดใหม่อีกครั้ง หรือติดต่อเราโดยตรงได้เลย
        เรายินดีให้คำปรึกษาและตอบทุกคำถามครับ
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={FALLBACK_LINE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-line px-6 text-sm font-semibold text-white transition-[opacity,transform] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line active:scale-[0.97]"
        >
          แชทกับเราทาง LINE
        </a>
        <a
          href={`tel:${FALLBACK_PHONE.replace(/-/g, "")}`}
          className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-brand-500 px-6 text-sm font-semibold text-brand-700 transition-[background-color,transform] hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.97]"
        >
          โทร {FALLBACK_PHONE}
        </a>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center rounded-full border border-brand-200 bg-white px-5 text-sm font-medium text-ink-soft transition-[background-color,transform] hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.97]"
        >
          ลองใหม่อีกครั้ง
        </button>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </div>
  );
}
