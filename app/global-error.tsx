"use client";

import { useEffect } from "react";

// Catches failures in the root layout itself — the case the per-section error
// page cannot reach, because at that point no layout, fonts or stylesheet have
// rendered. Everything here is inline for that reason.
const FALLBACK_PHONE = "098-910-4978";
// Permanent @curtainstoryhome address — see the note in (site)/error.tsx.
const FALLBACK_LINE = "https://line.me/R/ti/p/%40curtainstoryhome";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[root] render failed", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="th">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf8f4",
          color: "#221d19",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#6d5327", margin: 0 }}>
            CURTAIN STORY HOME
          </p>
          <h1 style={{ fontSize: 24, margin: "12px 0 0", lineHeight: 1.35 }}>
            ขณะนี้เว็บไซต์ขัดข้องชั่วคราว
          </h1>
          <p style={{ margin: "12px 0 0", lineHeight: 1.8, color: "#6a605a" }}>
            ขออภัยในความไม่สะดวก ติดต่อเราได้โดยตรงตามช่องทางด้านล่างครับ
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              marginTop: 28,
            }}
          >
            <a
              href={FALLBACK_LINE}
              style={{
                minHeight: 44,
                display: "inline-flex",
                alignItems: "center",
                padding: "0 22px",
                borderRadius: 999,
                background: "#04833a",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              แชทกับเราทาง LINE
            </a>
            <a
              href={`tel:${FALLBACK_PHONE.replace(/-/g, "")}`}
              style={{
                minHeight: 44,
                display: "inline-flex",
                alignItems: "center",
                padding: "0 22px",
                borderRadius: 999,
                border: "2px solid #a68541",
                color: "#6d5327",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              โทร {FALLBACK_PHONE}
            </a>
          </div>

          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 20,
              minHeight: 44,
              padding: "0 20px",
              borderRadius: 999,
              border: "1px solid #ddcbaf",
              background: "#fff",
              color: "#6a605a",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </body>
    </html>
  );
}
