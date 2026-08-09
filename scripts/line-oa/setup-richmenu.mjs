// Creates the CURTAIN STORY HOME rich menu, uploads its image, and sets it as
// the default menu for every user — via the official LINE Messaging API.
//
// Needs a channel access token — see line-token.mjs for the two ways to
// provide one via .env.local. Never put either value in a file that gets committed.
//
// Run:
//   node --env-file=.env.local scripts/line-oa/setup-richmenu.mjs
//   node --env-file=.env.local scripts/line-oa/setup-richmenu.mjs --list     (inspect existing menus)
//   node --env-file=.env.local scripts/line-oa/setup-richmenu.mjs --delete-all (cleanup before redeploy)

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { RICHMENU_META, PANELS } from "./richmenu.config.mjs";
import { getAccessToken } from "./line-token.mjs";

const TOKEN = await getAccessToken().catch((e) => {
  console.error(e.message);
  process.exit(1);
});

const API = "https://api.line.me/v2/bot";
const API_DATA = "https://api-data.line.me/v2/bot";
const headers = { Authorization: `Bearer ${TOKEN}` };

async function api(url, opts = {}) {
  const res = await fetch(url, { ...opts, headers: { ...headers, ...(opts.headers || {}) } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${opts.method || "GET"} ${url} -> ${res.status} ${body}`);
  }
  return res.status === 200 ? res.json().catch(() => ({})) : {};
}

async function listMenus() {
  const { richmenus } = await api(`${API}/richmenu/list`);
  console.log(`Found ${richmenus.length} existing rich menu(s):`);
  for (const m of richmenus) console.log(` - ${m.richMenuId}  ${m.name}`);
  return richmenus;
}

async function deleteAll() {
  const menus = await listMenus();
  for (const m of menus) {
    await api(`${API}/richmenu/${m.richMenuId}`, { method: "DELETE" });
    console.log("Deleted", m.richMenuId);
  }
}

function toAreas() {
  return PANELS.map((p) => ({
    bounds: p.bounds,
    action:
      p.action.type === "message"
        ? { type: "message", label: p.action.label, text: p.action.text }
        : { type: "uri", label: p.label, uri: p.action.uri },
  }));
}

async function deploy() {
  const imagePath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "output",
    "richmenu-2500x1686.jpg"
  );
  const image = await readFile(imagePath).catch(() => {
    throw new Error(`Image not found at ${imagePath} — run generate-rich-menu-image.mjs first`);
  });

  console.log("Creating rich menu...");
  const { richMenuId } = await api(`${API}/richmenu`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...RICHMENU_META, areas: toAreas() }),
  });
  console.log("Created:", richMenuId);

  console.log("Uploading image...");
  await api(`${API_DATA}/richmenu/${richMenuId}/content`, {
    method: "POST",
    headers: { "Content-Type": "image/jpeg" },
    body: image,
  });

  console.log("Setting as default for all users...");
  await api(`${API}/user/all/richmenu/${richMenuId}`, { method: "POST" });

  console.log(`\nDone. Rich menu "${RICHMENU_META.name}" (${richMenuId}) is now live.`);
}

const flag = process.argv[2];
if (flag === "--list") await listMenus();
else if (flag === "--delete-all") await deleteAll();
else await deploy();
