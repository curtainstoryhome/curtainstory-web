"use client";

import { useEffect } from "react";
import { conversionLabels } from "@/lib/google-ads";

// Reports LINE and phone taps to Google Ads.
//
// Why a document-level listener rather than an onClick on each button: those
// two actions appear in at least six places — the hero pair, the sticky bar,
// the footer, the contact page, the 404 page and the curtain reveal — and a new
// one gets added every time a page is written. Anything that has to be
// remembered per button eventually gets forgotten on one of them, and a
// conversion that silently stops counting is worse than one that was never set
// up, because the reports still look plausible.
//
// So the rule lives in one place and keys off what the link actually does: a
// tel: link is a call, a lin.ee/line.me link is a LINE chat. Any future button
// pointing at either is counted automatically.
//
// Nothing is prevented or delayed. Both destinations leave the page intact —
// tel: hands off to the dialer, LINE opens in a new tab — so the beacon gtag
// sends has time to go out on its own. Blocking navigation to wait for Google
// would risk stranding a customer mid-tap to protect a statistic.
export default function ConversionTracking() {
  useEffect(() => {
    if (typeof window.gtag !== "function") return;
    const gtag = window.gtag;

    // A double-tap on a phone should be one conversion, not two.
    const lastFired = new Map<string, number>();
    const DEDUPE_MS = 2000;

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest?.("a[href]");
      if (!link) return;

      const href = link.getAttribute("href") ?? "";
      const kind = href.startsWith("tel:")
        ? "phone"
        : /(^|\/\/|\.)(lin\.ee|line\.me)/.test(href)
          ? "line"
          : null;
      if (!kind) return;

      const label = conversionLabels[kind];
      if (!label) return; // no conversion action configured for this one yet

      const now = Date.now();
      if (now - (lastFired.get(kind) ?? 0) < DEDUPE_MS) return;
      lastFired.set(kind, now);

      gtag("event", "conversion", {
        send_to: label,
        value: 1.0,
        currency: "THB",
      });
    };

    // Capture phase: the count should not depend on whether some other
    // handler upstream decides to stop the event.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
