// The shop's pin, read off its own Google Maps listing rather than estimated
// from the street address. A house number down a Bangkok soi does not geocode:
// handing the written address to Google opened the contact map on the right
// neighbourhood with no marker anywhere on it, which tells a customer nothing.
//
// The JSON-LD and the embedded map both read from here so they can never drift
// apart. If the shop ever moves, re-resolve business_info.map_url to its new
// pin and change these two numbers once.
export const shopGeo = {
  latitude: 13.78625,
  longitude: 100.5930833,
};

// A bare lat/lng query is what makes Google drop a pin instead of running a
// search, and it needs no API key — the Embed API's place_id form does.
export const mapEmbedSrc =
  `https://maps.google.com/maps?q=${shopGeo.latitude},${shopGeo.longitude}` +
  `&z=17&hl=th&output=embed`;
