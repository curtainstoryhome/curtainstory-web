// The shop's Google tags. Not secrets — they ship in the page source of every
// site that runs ads, and Google's own setup screen hands them out as
// copy-paste HTML. Kept here rather than pasted into the layout so the ids
// live in exactly one place, next to the note explaining what they are for.
//
// What they do: tell Google Ads that a visitor arriving from an ad reached the
// site, which is what makes conversion reporting possible at all. Without a
// tag the account can only report clicks and spend — never whether the money
// turned into a phone call.
//
// Why a list. One gtag.js load can configure any number of destinations, and
// the shop needs more than one: the original tag (AW-18382922038) and the tag
// the Performance Max campaign asks for (AW-10892676599). Google Ads reports a
// campaign's site as "missing a Google tag" when it cannot find *its own* id,
// even if a different tag is present — which is exactly what happened here.
// Adding a second id fixes that campaign without disturbing the first.
//
// The env var is an override for the day the shop opens another Ads account or
// someone needs to point a preview build at a test tag: set it to a
// comma-separated list. Leave it unset and the shop's real tags are used.
const DEFAULT_TAG_IDS = ["AW-18382922038", "AW-10892676599"];

export const googleTagIds: string[] = (
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.split(",") ?? DEFAULT_TAG_IDS
)
  .map((id) => id.trim())
  .filter(Boolean);

// gtag.js is loaded once, keyed on the first id; every id is then registered
// through its own gtag('config', …) call. Loading the library a second time
// would re-run it against the same dataLayer and double-count.
export const gtagSrc = `https://www.googletagmanager.com/gtag/js?id=${googleTagIds[0]}`;

// Google's snippet, with one config line per destination. Kept as one string
// so what ships stays recognisably the code Google gave us — easier to diff
// against the console when something looks wrong.
export const gtagInit = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${googleTagIds.map((id) => `gtag('config', '${id}');`).join("\n")}`;
