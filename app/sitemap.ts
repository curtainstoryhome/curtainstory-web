import type { MetadataRoute } from "next";
import { getPublishedProjects, getServices } from "@/lib/data";
import { siteUrl } from "@/lib/site-url";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    "/services",
    // Its own page because people search the condo problem by name — the
    // no-drilling rule, the balcony sun — not "curtains" in general.
    "/curtains-condo",
    "/portfolio",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];
  const lastModified = new Date();
  const [projects, services] = await Promise.all([
    getPublishedProjects(),
    getServices(),
  ]);

  return [
    ...routes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    // Each service is its own page targeting its own search terms — people
    // search "ร้านวอลเปเปอร์" separately from "ร้านผ้าม่าน".
    ...services.map((service) => ({
      url: `${siteUrl}/services/${service.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...projects.map((project) => ({
      url: `${siteUrl}/portfolio/${project.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
