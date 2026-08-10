import { createClient } from "@/lib/supabase/static";
import type {
  BusinessInfo,
  ServiceRow,
  ProjectWithImages,
  WhyUsItemRow,
  ReviewImageRow,
  SiteSettingRow,
  SiteText,
  HeroImageRow,
  ServiceImageRow,
} from "@/lib/types";

// The admin's image fields hold whatever URL was last saved into them, and an
// absolute URL on our own domain is the one shape <Image> cannot render: the
// optimizer rejects every host missing from next.config's remotePatterns, so
// the LINE QR on /contact came back 400 and drew as a broken image on the live
// site — and threw outright in dev.
//
// Uploads live on Supabase storage and nowhere else, so that host is the only
// absolute URL worth keeping. Everything else is one of our own files spelled
// the long way; reduce it to a path, which the optimizer always accepts.
// Deliberately NOT compared against siteUrl: that resolves to the .vercel.app
// fallback in dev and on previews, so the check would pass in production and
// fail everywhere the shop's own domain is not the deployment domain.
const storageHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname;
  } catch {
    return "";
  }
})();

function asLocalAsset(value: string): string {
  if (!value?.startsWith("http")) return value;
  try {
    const url = new URL(value);
    if (url.hostname === storageHost) return value;
    return `${url.pathname}${url.search}`;
  } catch {
    return value;
  }
}

export async function getBusinessInfo(): Promise<BusinessInfo> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("business_info")
    .select("*")
    .single();
  if (error || !data) throw new Error("Failed to load business info");
  return { ...data, line_qr_image: asLocalAsset(data.line_qr_image) };
}

export async function getServices(): Promise<ServiceRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error("Failed to load services");
  return data ?? [];
}

export async function getServiceBySlug(
  slug: string,
): Promise<ServiceRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  // A missing row is a 404, not a failure — only a real query error throws.
  if (error) throw new Error("Failed to load service");
  return data ?? null;
}

export async function getProjects(): Promise<ProjectWithImages[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, images:project_images(*)")
    .order("sort_order", { ascending: true });
  if (error) throw new Error("Failed to load projects");
  return (data ?? []).map((project) => ({
    ...project,
    // Defaulted here rather than at each call site: a null column or a stale
    // PostgREST schema cache should never be able to fail a whole build.
    service_slugs: project.service_slugs ?? [],
    images: [...project.images].sort((a, b) => a.sort_order - b.sort_order),
  }));
}

// Adding a project happens in two steps — details first, photos second — so
// there is always a moment where a project exists with no photos at all. Using
// getProjects() on the public site meant that half-finished project appeared on
// the portfolio immediately, as a card with an empty grey box where the work
// should be. A project with no photos is not finished, so the public site does
// not show it. The admin keeps using getProjects() and still sees everything.
export async function getPublishedProjects(): Promise<ProjectWithImages[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.images.length > 0);
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectWithImages | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, images:project_images(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return {
    ...data,
    service_slugs: data.service_slugs ?? [],
    images: [...data.images].sort((a, b) => a.sort_order - b.sort_order),
  };
}

export async function getWhyUsItems(): Promise<WhyUsItemRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("why_us_items")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error("Failed to load why-us items");
  return data ?? [];
}

export async function getReviewImages(): Promise<ReviewImageRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("review_images")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error("Failed to load review images");
  return data ?? [];
}

export async function getSiteSettings(): Promise<SiteSettingRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("group_key", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw new Error("Failed to load site settings");
  return data ?? [];
}

// Wording for the public pages, as a plain lookup. A missing or blank value
// falls back to the text passed at the call site, so a field the owner clears
// by accident leaves the page readable rather than empty.
export async function getSiteText(): Promise<SiteText> {
  const rows = await getSiteSettings();
  const map = new Map(rows.map((row) => [row.key, row.value]));
  return (key, fallback = "") => {
    const value = map.get(key);
    return value && value.trim() ? value : fallback;
  };
}

export async function getHeroImages(): Promise<HeroImageRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_images")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error("Failed to load hero images");
  return data ?? [];
}

// Catalogue sheets for one service: fabric swatches, wallpaper patterns,
// blind finishes. Empty for services that do not have a sample book.
export async function getServiceImages(
  serviceSlug: string,
): Promise<ServiceImageRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_images")
    .select("*")
    .eq("service_slug", serviceSlug)
    .order("sort_order", { ascending: true });
  if (error) throw new Error("Failed to load service images");
  return data ?? [];
}
