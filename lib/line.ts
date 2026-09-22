import type { BusinessInfo } from "@/lib/types";

// The shop's official account. lin.ee/7gQYrTY, the link saved in admin
// settings, redirects here.
const SHOP_ACCOUNT_ID = "@410jcnxt";
const SHOP_LINE_LINKS = ["lin.ee/7gQYrTY", "410jcnxt"];

// What the customer sees already typed in the chat box. It carries the words
// the webhook answers to (สนใจ, ประเมิน, ราคา), so pressing send gets the shop's
// quick-reply questions back straight away.
const OPENING_MESSAGE = "สวัสดี สนใจทำผ้าม่าน ขอประเมินราคา";

// The add-friend link was losing almost everyone: 20 Sep 2026 had ten LINE
// taps from ads and not one message reached the shop, and 14 to 20 Sep had
// thirty taps against two messages. Adding a friend is a finished action on
// its own, so people stopped there. This opens the shop's chat with a message
// ready to send instead, which also works for someone who never adds the
// account.
//
// Only the shop's own account is rewritten. If the link in admin settings is
// ever changed to something else, that link is used as it is.
export function lineChatHref(business: BusinessInfo): string {
  const url = business.line_url ?? "";
  if (!SHOP_LINE_LINKS.some((known) => url.includes(known))) return url;
  return `https://line.me/R/oaMessage/${encodeURIComponent(SHOP_ACCOUNT_ID)}/?${encodeURIComponent(OPENING_MESSAGE)}`;
}
