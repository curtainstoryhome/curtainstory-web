// Shared spec for the CURTAIN STORY HOME rich menu — used by both the image
// generator and the deploy script so the picture and the tap zones never drift apart.
// Source of truth for panel copy/links: ../../ตั้งค่า-LINE-OA-ใหม่.md section 2.4

export const CANVAS = { width: 2500, height: 1686 };

export const COLORS = {
  background: "#f5ede1",
  panelAlt: "#efe3d1",
  divider: "#c9a876",
  text: "#5a3d2b",
  subtext: "#8a6b4f",
  icon: "#a97c50",
};

// 3 columns x 2 rows. bounds must exactly tile CANVAS (LINE requires this).
export const PANELS = [
  {
    label: "ดูผลงานจริง",
    sub: "PORTFOLIO",
    icon: "photo",
    bounds: { x: 0, y: 0, width: 834, height: 843 },
    action: { type: "uri", uri: "https://www.curtainstoryhome.com/portfolio" },
  },
  {
    label: "บริการทั้งหมด",
    sub: "SERVICES",
    icon: "grid",
    bounds: { x: 834, y: 0, width: 833, height: 843 },
    action: { type: "uri", uri: "https://www.curtainstoryhome.com/services" },
  },
  {
    label: "ขอประเมินราคาฟรี",
    sub: "FREE QUOTE",
    icon: "tag",
    bounds: { x: 1667, y: 0, width: 833, height: 843 },
    action: { type: "message", label: "ขอประเมินราคาฟรี", text: "ขอประเมินราคาค่ะ" },
  },
  {
    label: "โทรหาร้าน",
    sub: "098-910-4978",
    icon: "phone",
    bounds: { x: 0, y: 843, width: 834, height: 843 },
    action: { type: "uri", uri: "tel:0989104978" },
  },
  {
    label: "ที่ตั้งร้าน",
    sub: "MAP",
    icon: "pin",
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
