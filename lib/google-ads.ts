// The shop's Google Ads tag. Not a secret — it ships in the page source of
// every site that runs ads, and Google's own setup screen hands it out as
// copy-paste HTML. Kept here rather than pasted into the layout so the id
// lives in exactly one place, next to the note explaining what it is for.
//
// What it does: tells Google Ads that a visitor arriving from an ad reached
// the site, which is what makes conversion reporting possible at all. Without
// it the account can only report clicks and spend — never whether the money
// turned into a phone call.
//
// The env var is an override for the day the shop opens a second Ads account
// or someone needs to point a preview build at a test tag; leave it unset and
// the shop's real tag is used.
export const googleAdsId =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-18382922038";

export const gtagSrc = `https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`;

// Google's snippet, with the id substituted. Kept as one string so what ships
// stays recognisably the code Google gave us — easier to diff against the
// console when something looks wrong.
export const gtagInit = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAdsId}');`;
