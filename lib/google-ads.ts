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
// The old site fired this on its contact actions. The label is the second half
// of send_to and is what tells Google Ads *which* conversion happened — the
// account can count phone taps and LINE opens only if something sends it.
//
// Exposed as a global so any button can call it: gtag_report_conversion() to
// just report, or gtag_report_conversion(url) to report and then navigate once
// Google has acknowledged (or after a timeout, so a slow tag never traps a
// customer on the page).
export const conversionLabel =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL ||
  "AW-10892676599/jnhJCMSqup0aEPebhMoo";

export const conversionHelper = `function gtag_report_conversion(url) {
  var fired = false;
  var go = function () {
    if (fired) return;
    fired = true;
    if (typeof url !== 'undefined') { window.location = url; }
  };
  // Never let a blocked or slow tag hold up the tap.
  setTimeout(go, 1000);
  gtag('event', 'conversion', {
    'send_to': '${conversionLabel}',
    'value': 1.0,
    'currency': 'THB',
    'event_callback': go
  });
  return false;
}`;
