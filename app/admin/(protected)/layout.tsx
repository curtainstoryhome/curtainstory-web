import Link from "next/link";
import { ToastProvider } from "@/components/admin/Toast";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";
import NavigationProgress from "@/components/NavigationProgress";

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-cream">
        {/* Same bar the public site uses: pressing a menu item shows progress
            straight away instead of appearing to do nothing. */}
        <NavigationProgress />

        <header className="border-b border-brand-100 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/admin"
                className="rounded-lg leading-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
              >
                <span className="block font-heading text-base font-semibold text-ink">
                  CURTAIN STORY
                </span>
                <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-brand-700">
                  ระบบจัดการเว็บไซต์
                </span>
              </Link>
              <AdminNav />
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="inline-flex min-h-9 items-center rounded-lg px-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
              >
                ดูเว็บไซต์ →
              </Link>
              <LogoutButton />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      </div>
    </ToastProvider>
  );
}
