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

// --- Google Tag Manager ----------------------------------------------------
// Carried over from the old site, which ran this container alongside gtag.
// It is a separate system: gtag reports to Google Ads directly, while the
// container holds whatever tags were configured inside it over the years. The
// old site is redirecting now, so anything still living in this container only
// keeps working if the new site loads it too.
export const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "GTM-K73CT57R";

export const gtmInit = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`;

// GTM's fallback for browsers without JavaScript. Google's own snippet puts
// this immediately after <body>.
export const gtmNoscriptSrc = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;

// --- Conversion reporting --------------------------------------------------
// A conversion label is the second half of send_to and is what tells Google
// Ads *which* action happened. Without one the account can report spend but
// never whether the money turned into a customer.
//
// The LINE label came across from the old site, where it sat in a
// gtag_report_conversion() helper. Its Ads conversion action is named
// "Add LINE conversion page".
//
// The call label is deliberately empty, and must stay that way unless the
// behaviour below changes. Measured in the browser: a tap on a tel: link
// already reports a conversion on its own, without any code here — the Google
// tag detects those clicks itself. A lin.ee tap does not, and a plain outbound
// link (the shop's Facebook page) reports nothing at all, so this is specific
// to tel: rather than blanket outbound-click tracking.
//
// The two are told apart by the value parameter: conversions this file sends
// carry value=1&currency=THB, and the automatic one does not. Filling this in
// would make every call count twice.
export const conversionLabels: Record<"line" | "phone", string> = {
  line:
    process.env.NEXT_PUBLIC_GOOGLE_ADS_LINE_LABEL ||
    "AW-10892676599/jnhJCMSqup0aEPebhMoo",
  phone: process.env.NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL || "",
};

// gtag.js defines this global once the snippet in app/layout.tsx has run.
// Declared here, next to everything else that knows about Google's tag, so the
// call sites do not each have to re-assert it.
declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      target: string,
      params?: Record<string, unknown>
    ) => void;
  }
}
