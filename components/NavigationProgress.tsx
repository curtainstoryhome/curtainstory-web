"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// A click that appears to do nothing feels broken, even when the navigation
// is actually working. This puts a thin bar across the top the moment an
// internal link is pressed, and clears it once the new page is showing.
//
// It waits 120ms before appearing, so instant navigations — which is most of
// them, since every page here is prerendered — never flash a bar.
export default function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const delay = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Ignore anything the browser will handle itself: new tabs, modified
      // clicks, downloads, external sites, same-page anchors.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as HTMLElement | null)?.closest("a");
      if (!link) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return;

      if (delay.current) clearTimeout(delay.current);
      delay.current = setTimeout(() => setVisible(true), 120);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      if (delay.current) clearTimeout(delay.current);
    };
  }, []);

  // The new route has rendered — stop.
  useEffect(() => {
    if (delay.current) clearTimeout(delay.current);
    setVisible(false);
  }, [pathname]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`h-full bg-brand-700 ${visible ? "animate-nav-progress" : "w-0"}`}
      />
    </div>
  );
}
