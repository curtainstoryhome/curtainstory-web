import type { SiteSettingRow } from "@/lib/types";

// Only these four are owner-editable. Everything else in the palette is
// derived from them below, so the shop can be recoloured without anyone
// having to understand what "brand-200" means.
const EDITABLE = [
  "color_brand",
  "color_cream",
  "color_cream_deep",
  "color_ink",
] as const;

const HEX = /^#[0-9a-fA-F]{6}$/;

function toRgb(hex: string) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

function toHex([r, g, b]: number[]) {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

// Mixes toward white (amount > 0) or black (amount < 0).
function shade(hex: string, amount: number) {
  const rgb = toRgb(hex);
  const target = amount > 0 ? 255 : 0;
  const t = Math.abs(amount);
  return toHex(rgb.map((c) => c + (target - c) * t));
}

export default function ThemeColors({
  settings,
}: {
  settings: SiteSettingRow[];
}) {
  const get = (key: string, fallback: string) => {
    const found = settings.find((s) => s.key === key)?.value?.trim();
    // Anything that is not a plain 6-digit hex is ignored rather than written
    // into the stylesheet — this value ends up inside a <style> tag.
    return found && HEX.test(found) ? found : fallback;
  };

  const brand = get("color_brand", "#6d5327");
  const cream = get("color_cream", "#faf8f4");
  const creamDeep = get("color_cream_deep", "#eee8df");
  const ink = get("color_ink", "#221d19");

  const css = `:root{
--background:${cream};
--foreground:${ink};
--color-cream:${cream};
--color-cream-deep:${creamDeep};
--color-ink:${ink};
--color-ink-soft:${shade(ink, 0.32)};
--color-brand-50:${shade(brand, 0.93)};
--color-brand-100:${shade(brand, 0.86)};
--color-brand-200:${shade(brand, 0.68)};
--color-brand-400:${shade(brand, 0.42)};
--color-brand-500:${shade(brand, 0.22)};
--color-brand-600:${shade(brand, 0.1)};
--color-brand-700:${brand};
--color-brand-800:${shade(brand, -0.2)};
}`;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

export { EDITABLE as EDITABLE_COLOR_KEYS };
