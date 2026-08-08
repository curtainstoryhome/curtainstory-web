import type { Metadata } from "next";
import { getBusinessInfo } from "@/lib/data";

// Applies to the login page and everything behind it, so the browser tab
// identifies the shop instead of just saying "Admin".
export async function generateMetadata(): Promise<Metadata> {
  const business = await getBusinessInfo();

  return {
    title: {
      // `absolute` so the public site's "%s | <shop name>" template does not
      // stack on top and print the shop name twice.
      absolute: `ระบบจัดการเว็บไซต์ | ${business.name}`,
      template: `%s | ระบบจัดการเว็บไซต์ ${business.name}`,
    },
    // The back office should never turn up in search results.
    robots: { index: false, follow: false },
  };
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
