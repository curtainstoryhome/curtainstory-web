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
    // The listener attaches unconditionally, and gtag is looked up when a tap
    // actually happens rather than here. gtag.js is an afterInteractive script,
    // so it loads *after* hydration: an effect that bailed out when the global
    // was missing would bail on every real page load and silently never count
    // anything — the exact failure this component was written to fix.

    // A double-tap on a phone should be one conversion, not two.
    const lastFired = new Map<string, number>();
    const DEDUPE_MS = 2000;

    // Thirty days of reports showed 362 "LINE taps" against roughly thirty
    // new LINE followers. The gap is mostly two things: a thumb landing on the
    // floating button while the page is still settling after an ad click, and
    // the same visitor tapping LINE on three pages in a row. Either way the
    // bidding system was being told those were customers. A tap in the first
    // seconds is ignored, and each kind counts once per visit.
    const MIN_DWELL_MS = 3000;
    const mountedAt = Date.now();
    const sessionKey = (kind: string) => `conversion-sent:${kind}`;
    const alreadySentThisVisit = (kind: string) => {
      try {
        return sessionStorage.getItem(sessionKey(kind)) !== null;
      } catch {
        return false;
      }
    };
    const markSentThisVisit = (kind: string) => {
      try {
        sessionStorage.setItem(sessionKey(kind), String(Date.now()));
      } catch {
        // Private mode or blocked storage: fall back to the in-memory dedupe.
      }
    };

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

      const gtag = window.gtag;
      if (typeof gtag !== "function") return;

      const now = Date.now();
      if (now - mountedAt < MIN_DWELL_MS) return;
      if (now - (lastFired.get(kind) ?? 0) < DEDUPE_MS) return;
      if (alreadySentThisVisit(kind)) return;
      lastFired.set(kind, now);
      markSentThisVisit(kind);

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
