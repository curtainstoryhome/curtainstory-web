export type BusinessInfo = {
  id: true;
  name: string;
  name_en: string;
  tagline: string;
  description: string;
  phone: string;
  phone_href: string;
  line_url: string;
  line_qr_image: string;
  facebook_name: string;
  facebook_url: string;
  address: string;
  /** Free text, e.g. "จ-ส 9:00-18:00". Empty means the shop has not stated it. */
  hours: string;
  map_url: string;
  /** Google "write a review" link. Empty hides the review button. */
  review_url: string;
  video_url: string;
  video_title: string;
  updated_at: string;
};

export type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  image_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  video_url: string;
  // Which services this project demonstrates, e.g. ["curtains"].
  service_slugs: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectImageRow = {
  id: string;
  project_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
};

export type ProjectWithImages = ProjectRow & { images: ProjectImageRow[] };

export type WhyUsItemRow = {
  id: string;
  text: string;
  sort_order: number;
};

export type ReviewImageRow = {
  id: string;
  image_url: string;
  sort_order: number;
};

export type SiteSettingRow = {
  key: string;
  value: string;
  kind: "text" | "longtext" | "color" | "image";
  group_key: string;
  group_label: string;
  label: string;
  hint: string;
  sort_order: number;
  updated_at: string;
};

export type HeroImageRow = {
  id: string;
  image_url: string;
  caption: string;
  sort_order: number;
  created_at: string;
};

// Wording looked up by key, with the seeded default already applied.
export type SiteText = (key: string, fallback?: string) => string;

export type ServiceImageRow = {
  id: string;
  service_slug: string;
  image_url: string;
  label: string;
  sort_order: number;
};
