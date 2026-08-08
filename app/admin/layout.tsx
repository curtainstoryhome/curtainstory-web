import type { Metadata } from "next";

// Applies to the login page and everything behind it, so the browser tab
// identifies the shop instead of just saying "Admin".
export const metadata: Metadata = {
  title: {
    // `absolute` so the public site's "%s | CURTAIN STORY" template does not
    // stack on top and print the shop name twice.
    absolute: "ระบบจัดการเว็บไซต์ | CURTAIN STORY",
    template: "%s | ระบบจัดการเว็บไซต์ CURTAIN STORY",
  },
  // The back office should never turn up in search results.
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
