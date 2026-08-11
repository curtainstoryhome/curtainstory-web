// Where the shop is, in the two forms Google needs.
//
// `shopPlaceId` is the shop's own listing on Google Maps — the same listing
// business_info.map_url points at. Prefer it over coordinates everywhere a
// customer might tap "directions": routing to a listing uses Google's own
// entrance and access data for that business, while routing to a bare
// latitude/longitude just aims at a dot and lets the router guess how to reach
// it. Down a Bangkok soi that guess is often wrong, which is why the map could
// show the right spot and still fail to navigate there.
//
// `shopGeo` stays because JSON-LD wants literal numbers, not a place id. Read
// off the same listing, not estimated from the street address.
//
// If the shop ever moves, both of these and business_info.map_url describe the
// same place and must be updated together.
export const shopPlaceId = "ChIJ1cOM1rqd4jARvoLDGTRNT5c";

export const shopGeo = {
  latitude: 13.78625,
  longitude: 100.5930833,
};

// The keyless embed accepts a place id in its `q`, same as a search string —
// so the iframe shows the real listing (name, hours, photos) and its built-in
// directions button inherits the correct routing. The Embed API's place mode
// would need a billed API key for the same result.
export const mapEmbedSrc =
  `https://maps.google.com/maps?q=place_id:${shopPlaceId}` +
  `&z=17&hl=th&output=embed`;

// Documented keyless deep link. On a phone this opens the Maps app already
// navigating; `destination_place_id` is what makes it aim at the business
// rather than at the text of its address.
export const directionsUrl =
  `https://www.google.com/maps/dir/?api=1` +
  `&destination=${encodeURIComponent("CURTAIN STORY HOME")}` +
  `&destination_place_id=${shopPlaceId}`;
