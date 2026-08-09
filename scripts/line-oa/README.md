# LINE OA rich menu automation — CURTAIN STORY HOME

Automates the one part of LINE OA setup that has a real API: the rich menu.
Greeting message / away message / profile status are web-UI-only settings —
copy them in by hand from `../../ตั้งค่า-LINE-OA-ใหม่.md` section 2.2–2.3.

## One-time setup

**`.env.local` already has `LINE_CHANNEL_ID` filled in** (that value isn't
secret — it's the number in the console URL). The only thing left is the one
line already sitting there waiting:

```
LINE_CHANNEL_SECRET=
```

LINE Developers → your channel → **Basic settings** tab → copy **Channel
secret** → paste it after the `=`. Save the file. That's the whole setup —
`line-token.mjs` mints its own short-lived access token from these two values
at run time via LINE's OAuth `client_credentials` grant; no token ever
touches disk.

(Alternative: set `LINE_CHANNEL_ACCESS_TOKEN` instead — a persistent token
from Messaging API tab → Issue. If present it's used as-is and the two values
above are ignored. Not necessary; the default path above is simpler.)

## Usage

```bash
npm run line:richmenu:image    # regenerate the PNG from richmenu.config.mjs
npm run line:richmenu:deploy   # create it on LINE, upload the image, set as default
```

Inspect or clean up before redeploying:

```bash
node --env-file=.env.local scripts/line-oa/setup-richmenu.mjs --list
node --env-file=.env.local scripts/line-oa/setup-richmenu.mjs --delete-all
```

## Editing the menu

Everything — panel labels, links, the message that "ขอประเมินราคาฟรี" sends,
icon, colors — lives in `richmenu.config.mjs`. Change it, re-run both npm
scripts, done. The image and the tap zones are generated from the same file
so they can't drift out of sync.

## About the background image

`output/richmenu-2500x1686.png` is a clean, on-brand placeholder generated
from code — good enough to ship today. If your designer wants to hand you a
polished version later (matching the site's photography/logo more closely),
just drop their PNG in at that exact path and re-run `line:richmenu:deploy` —
no code changes needed as long as it's 2500x1686.
