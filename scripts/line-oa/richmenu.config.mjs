// Shared spec for the CURTAIN STORY HOME rich menu — used by both the image
// generator and the deploy script so the picture and the tap zones never drift apart.
// Source of truth for panel copy/links: ../../ตั้งค่า-LINE-OA-ใหม่.md section 2.4

export const CANVAS = { width: 2500, height: 1686 };

// Palette pulled from the shop logo (public/images/logo.jpg): cream field,
// sage-green C, gold S, gold hairline ring. The menu should read as the logo
// blown up into a menu, not a generic beige grid.
export const COLORS = {
  cream: "#f7f1e6",
  sage: "#7c8767",
  sageDark: "#57614a",
  gold: "#c9a262",
  goldSoft: "#dcc294",
  overlay: "#241b10",
  textOnPhoto: "#fdf9f0",
};

// Height of the decorative brand band drawn across the top of the image.
// It lives INSIDE the top row's tap area (tap zones are unchanged).
export const BRAND_BAND = 150;

// 3 columns x 2 rows. bounds must exactly tile CANVAS (LINE requires this).
// visual: { type: "photo", src } uses a real installation photo from
// public/images; { type: "solid", bg } renders a flat brand-color CTA tile.
export const PANELS = [
  {
    label: "ดูผลงานจริง",
    sub: "PORTFOLIO",
    icon: "photo",
    visual: {
      type: "collage",
      srcs: [
        "proj-kharuehat-thayat-mansion-4.jpg",
        "proj-saransiri-91-3.jpg",
        "product-curtains-elegant.jpg",
        "proj-saransiri-91-6.jpg",
      ],
    },
    bounds: { x: 0, y: 0, width: 834, height: 843 },
    action: { type: "uri", uri: "https://www.curtainstoryhome.com/portfolio" },
  },
  {
    label: "บริการทั้งหมด",
    sub: "SERVICES",
    icon: "grid",
    visual: {
      type: "strips",
      srcs: ["proj-saransiri-91-6.jpg", "cat-wallpaper-1.jpg", "cat-blinds-1.jpg"],
      strips: ["ผ้าม่าน", "วอลล์เปเปอร์", "มู่ลี่"],
    },
    bounds: { x: 834, y: 0, width: 833, height: 843 },
    action: { type: "uri", uri: "https://www.curtainstoryhome.com/services" },
  },
  {
    label: "ขอประเมินราคาฟรี",
    sub: "FREE QUOTE",
    icon: "tag",
    visual: { type: "solid", bg: "sage" },
    bounds: { x: 1667, y: 0, width: 833, height: 843 },
    action: { type: "message", label: "ขอประเมินราคาฟรี", text: "ขอประเมินราคาค่ะ" },
  },
  {
    label: "โทรหาร้าน",
    sub: "098-910-4978",
    icon: "phone",
    visual: { type: "solid", bg: "cream" },
    bounds: { x: 0, y: 843, width: 834, height: 843 },
    action: { type: "uri", uri: "tel:0989104978" },
  },
  {
    label: "ที่ตั้งร้าน",
    sub: "MAP",
    icon: "pin",
    visual: { type: "map" },
    bounds: { x: 834, y: 843, width: 833, height: 843 },
    action: {
      type: "uri",
      uri: "https://www.google.com/maps/place/?q=place_id:ChIJ1cOM1rqd4jARvoLDGTRNT5c",
    },
  },
  {
    label: "เว็บไซต์",
    sub: "curtainstoryhome.com",
    icon: "globe",
    visual: { type: "browser", src: "hero-living-room.jpg" },
    bounds: { x: 1667, y: 843, width: 833, height: 843 },
    action: { type: "uri", uri: "https://www.curtainstoryhome.com" },
  },
];

export const RICHMENU_META = {
  size: CANVAS,
  selected: true,
  name: "CURTAIN STORY HOME - main menu",
  chatBarText: "เมนู",
};
