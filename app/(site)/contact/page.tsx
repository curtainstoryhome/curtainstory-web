import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Faq from "@/components/Faq";
import { siteUrl } from "@/lib/site-url";
import { mapEmbedSrc } from "@/lib/geo";
import { getBusinessInfo,
  getSiteText,
} from "@/lib/data";
import {
  PhoneIcon,
  ChatIcon,
  FacebookIcon,
  PinIcon,
  ClockIcon,
  StarIcon,
} from "@/components/icons";

export async function generateMetadata(): Promise<Metadata> {
  const business = await getBusinessInfo();
  return {
    title: "ติดต่อเรา",
    description: `ติดต่อ ${business.name} ร้านผ้าม่านย่านลาดพร้าว-วังทองหลาง โทร ${business.phone} หรือแชท LINE ให้คำปรึกษาฟรี พร้อมนัดวัดพื้นที่หน้างานถึงบ้าน`,
    alternates: { canonical: "/contact" },
  };
}

export default async function ContactPage() {
  const [business, t] = await Promise.all([
    getBusinessInfo(),
    getSiteText(),
  ]);
  // Pulled by key so every question and answer stays editable in the admin.
  // Blank answers are dropped inside <Faq>, which is how the price, lead-time
  // and warranty entries stay invisible until the shop decides its wording.
  const faqItems = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    question: t(`faq_q${n}`, ""),
    answer: t(`faq_a${n}`, ""),
  }));

  return (
    <>
      <PageHero
        eyebrow={t("contact_hero_eyebrow", "ติดต่อเรา")}
        title={t("contact_hero_title", "พร้อมให้คำปรึกษาฟรี")}
        description={t("contact_hero_desc", "ทักหาเราได้ทุกช่องทาง ให้คำปรึกษาฟรี พร้อมนัดวัดพื้นที่หน้างาน")}
      />

      <section className="py-14 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <a
              href={business.phone_href}
              className="flex items-center gap-4 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm transition-[box-shadow,transform] duration-150 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.99]"
            >
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <PhoneIcon />
              </span>
              <span>
                <span className="block text-sm text-ink-soft">โทร</span>
                <span className="block font-heading text-lg font-semibold text-ink">
                  {business.phone}
                </span>
              </span>
            </a>

            <a
              href={business.line_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm transition-[box-shadow,transform] duration-150 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.99]"
            >
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-line/10 text-line">
                <ChatIcon />
              </span>
              <span className="flex-1">
                <span className="block text-sm text-ink-soft">LINE Official</span>
                <span className="block font-heading text-lg font-semibold text-ink">
                  แชทกับเราได้ทันที
                </span>
              </span>
              {business.line_qr_image && (
                <span className="relative h-16 w-16 flex-none overflow-hidden rounded-lg border border-brand-100">
                  <Image
                    src={business.line_qr_image}
                    alt="สแกนเพื่อแอด LINE"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </span>
              )}
            </a>

            {/* This card used to be plain text no matter what, so the Facebook
                page was never reachable from the contact page even once a URL
                was filled in — every other card here is tappable. Now it
                behaves like the rest when there is a link, and stays a quiet
                card when there is not. */}
            {(() => {
              const inner = (
                <>
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-facebook/10 text-facebook">
                    <FacebookIcon />
                  </span>
                  <span>
                    <span className="block text-sm text-ink-soft">Facebook</span>
                    <span className="block font-heading text-lg font-semibold text-ink">
                      {business.facebook_name}
                    </span>
                  </span>
                </>
              );
              return business.facebook_url ? (
                <a
                  href={business.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm transition-[box-shadow,transform] duration-150 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.99]"
                >
                  {inner}
                </a>
              ) : (
                <div className="flex items-center gap-4 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
                  {inner}
                </div>
              );
            })()}

            {/* "เปิดกี่โมง" is one of the first things anyone asks a shop, and
                the site had no answer. Hidden entirely until the owner fills it
                in — a blank "เวลาทำการ:" row looks worse than no row. */}
            {business.hours && (
              <div className="flex items-start gap-4 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <ClockIcon />
                </span>
                <span>
                  <span className="block text-sm text-ink-soft">เวลาทำการ</span>
                  <span className="block leading-relaxed text-ink">
                    {business.hours}
                  </span>
                </span>
              </div>
            )}

            <a
              href={business.map_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm transition-[box-shadow,transform] duration-150 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.99]"
            >
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <PinIcon />
              </span>
              <span>
                <span className="block text-sm text-ink-soft">ที่ตั้งร้าน</span>
                <span className="block leading-relaxed text-ink">
                  {business.address}
                </span>
              </span>
            </a>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-3xl border border-brand-100 shadow-sm">
            <iframe
              title="แผนที่ร้าน"
              src={mapEmbedSrc}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Container>
      </section>

      {/* More Google reviews is the strongest single lever on where the shop
          ranks in the local map results, and the site never asked for one.
          Aimed at people already on the contact page — they have dealt with
          the shop. No star count is printed here: quoting a rating we collected
          on Google, on our own site, is against Google's own guidelines. The
          link sends people to the real listing instead. */}
      {business.review_url && (
        <section className="border-t border-brand-100 py-12">
          <Container className="flex flex-col items-center gap-3 text-center">
            <h2 className="font-heading text-xl font-semibold text-ink sm:text-2xl">
              {t("review_cta_title", "เคยใช้บริการเราแล้วใช่ไหม")}
            </h2>
            <p className="max-w-xl text-ink-soft">
              {t(
                "review_cta_desc",
                "รีวิวสั้นๆ บน Google ช่วยให้ลูกค้าคนต่อไปตัดสินใจได้ง่ายขึ้นมาก ขอบคุณมากครับ",
              )}
            </p>
            <a
              href={business.review_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-200 bg-white px-6 text-sm font-semibold text-brand-700 shadow-[0_2px_8px_-3px_rgba(109,83,39,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-[0_10px_20px_-8px_rgba(109,83,39,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:translate-y-0"
            >
              <StarIcon className="h-4 w-4" />
              รีวิวให้เราบน Google
            </a>
          </Container>
        </section>
      )}

      <section className="border-t border-brand-100 bg-cream-deep py-14 sm:py-16">
        <Container className="max-w-3xl">
          <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
            {t("faq_title", "คำถามที่พบบ่อย")}
          </h2>
          <p className="mt-2 text-ink-soft">
            {t(
              "faq_desc",
              "ถ้ายังไม่เจอคำตอบที่ต้องการ ทักมาถามได้เลย ยินดีตอบทุกคำถาม",
            )}
          </p>
          <div className="mt-8">
            <Faq siteUrl={siteUrl} items={faqItems} />
          </div>
        </Container>
      </section>
    </>
  );
}
