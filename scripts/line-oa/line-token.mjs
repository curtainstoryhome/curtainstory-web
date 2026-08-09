// Resolves a LINE channel access token without ever hard-coding a secret.
//
// Preferred: set LINE_CHANNEL_ACCESS_TOKEN directly (long-lived token issued
// by hand from LINE Developers -> Messaging API tab).
//
// Or, to skip that console click entirely: set LINE_CHANNEL_ID and
// LINE_CHANNEL_SECRET (both on the Basic settings tab of your channel — the
// same screen shown in the LINE Developers screenshot). This mints a
// short-lived (30-day) stateless token on the fly via LINE's OAuth endpoint.
// Nothing is written to disk; the token exists only for this process.
export async function getAccessToken() {
  if (process.env.LINE_CHANNEL_ACCESS_TOKEN) {
    return process.env.LINE_CHANNEL_ACCESS_TOKEN;
  }

  const clientId = process.env.LINE_CHANNEL_ID;
  const clientSecret = process.env.LINE_CHANNEL_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "Set either LINE_CHANNEL_ACCESS_TOKEN, or both LINE_CHANNEL_ID and " +
        "LINE_CHANNEL_SECRET, in .env.local. See scripts/line-oa/README.md."
    );
  }

  const res = await fetch("https://api.line.me/oauth2/v3/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to mint LINE access token: ${res.status} ${body}`);
  }
  const { access_token } = await res.json();
  return access_token;
}
