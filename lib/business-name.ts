import type { BusinessInfo } from "@/lib/types";

// The shop's full official name: "CURTAIN STORY | ผ้าม่าน วอลล์เปเปอร์ มู่ลี่".
//
// It is stored as two fields so the header can stack them on a narrow phone,
// but anywhere the name is read as one piece of text — the browser tab, search
// results, the LINE share card, structured data — it should be the whole thing.
export function fullBusinessName(business: BusinessInfo) {
  const suffix = business.name_en?.trim();
  return suffix ? `${business.name} | ${suffix}` : business.name;
}
