import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import ThemeColors from "@/components/ThemeColors";
import StickyContactBar from "@/components/StickyContactBar";
import NavigationProgress from "@/components/NavigationProgress";
import { getBusinessInfo, getServices, getSiteSettings } from "@/lib/data";
import { siteUrl } from "@/lib/site-url";


export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [business, services, settings] = await Promise.all([
    getBusinessInfo(),
    getServices(),
    getSiteSettings(),
  ]);

  return (
    <>
      <ThemeColors settings={settings} />
      <StructuredData
        business={business}
        services={services}
        siteUrl={siteUrl}
      />
      <NavigationProgress />
      <Header business={business} />
      <main className="flex-1">{children}</main>
      <Footer business={business} />
      <StickyContactBar business={business} />
      {/* Reserves the space the fixed bar occupies so it can never cover the
          last line of the footer on a phone. */}
      <div aria-hidden className="h-[68px] md:hidden" />
    </>
  );
}
