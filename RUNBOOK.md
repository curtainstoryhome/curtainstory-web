# Runbook

Operational notes for whoever maintains this site next.

**Keep credentials out of this repository.** Passwords, API keys and anything
personal about a customer belong in the Vercel and Supabase dashboards, and are
handed over separately. `.env.local` is covered by `.gitignore` — keep it that
way. Treat the repo as if it will be shared, because it will be: the shop is
meant to end up holding a copy.

---

## What this is

A Next.js 16 site for a curtain and interior shop, deployed on Vercel, with
content stored in Supabase (Postgres + Storage + Auth). The shop owner edits
everything through `/admin` — no code change is needed to update wording,
photos, projects, services or the site's colours.

## Who owns what

The site and the shop's own channels sit in different accounts. Worth stating
plainly, because it decides who can rescue what when something breaks:

| Piece | Account |
| --- | --- |
| Vercel (the site) | **the developer** |
| Supabase (content + photos) | **the developer** |
| Domain registrar | **the shop** |
| Google Business Profile, LINE OA, Facebook page | **the shop** |

**This is being corrected.** Both projects are moving into the shop's own
accounts, with the developer kept on as a collaborator — see
`ย้ายทุกอย่างเป็นของลูกค้า.md` for the steps and the row counts to verify
against afterwards. Two reasons it is worth the fifteen minutes:

- **For the shop** — as things stand, ending the working relationship would
  leave them holding the domain but not the site.
- **For the developer** — as things stand, losing access to either account
  takes a paying client's website down with it.

Neither problem exists once the projects sit in the shop's accounts: changing
who maintains the site becomes an invite and a revoke, with nothing to migrate.

Order matters — **transfer the projects before attaching the real domain**, or
the domain has to be set up twice. Turn on 2FA on both new accounts.

## How the pieces fit

| Piece | Where | Notes |
| --- | --- | --- |
| Pages | Vercel | Prerendered; the database is not touched when a visitor loads a page |
| Content | Supabase Postgres | Row Level Security: anyone may read, only a signed-in admin may write |
| Photos | Supabase Storage, bucket `site-images` | Public read, authenticated write |
| Admin login | Supabase Auth | Single account; route protection in `proxy.ts` |

## The one thing that will bite you

Supabase pauses a free project after about a week without database activity.
The public pages would keep serving (they are prerendered) but the admin would
stop working and the next deploy would fail.

`/api/keep-alive` exists for this. `vercel.json` calls it once a day, which is
enough to keep the project counted as active. If the site is ever moved off
Vercel, that ping has to be recreated somewhere else — otherwise the database
quietly pauses and nobody notices until the owner tries to add a project.

## Routine tasks

**Deploy** — `npx vercel --prod`. The build reads content from Supabase, so the
database must be reachable or the build fails.

**Content changes** — done by the owner in `/admin`. They take effect
immediately; no deploy needed. `revalidatePath` is called by the server
actions.

**Moving to the real domain** — the shop has chosen **`curtainstoryhome.com`**
(`curtainstory.com` is held by a domain marketplace and priced accordingly).
Attach it in the Vercel dashboard and deploy once. `lib/site-url.ts` reads
Vercel's production domain, so canonical URLs, the sitemap and social share
images all follow automatically. There is no hardcoded domain to update.

**The old site is still live.** `www.buitincurtains.com` returns 200 and is
competing with this one for the same business. It is on Z.com (WordPress,
LiteSpeed, `118.27.146.15`). Do **not** switch it off — 301 it across so the
authority it has built transfers instead of evaporating. A ready-to-paste
`.htaccess`, mapped page by page rather than dumping everything on the home
page, is in `ย้ายเว็บเก่า-htaccess.md`. Keep the old domain renewed for a
couple of years afterwards; letting it lapse kills the redirect.

## Search (SEO)

Everything below is already in the build; none of it needs touching per deploy.

| Piece | Where it lives |
| --- | --- |
| Per-page canonical, title, description | each page's `generateMetadata` |
| Share preview image per service/project | the item's own photo, not a generic one |
| LocalBusiness schema (address, phone, geo, service list) | `components/StructuredData.tsx` |
| Breadcrumb schema on service/project pages | `components/BreadcrumbSchema.tsx` |
| Sitemap / robots | `app/sitemap.ts`, `app/robots.ts` |

**The map coordinates in `StructuredData.tsx` are hardcoded** and were read off
the shop's own Google Maps pin (`business_info.map_url` redirects to them). They
are what puts the shop in the local map results. If the shop moves, resolve the
new `map_url` and update `geo` in the same commit — an address that disagrees
with its coordinates is worse than no coordinates.

**Two pages must never share a title.** The folding-door project and the
folding-door service are both called "ฉากกั้นห้อง" since the shop renamed them,
which produced two identically-titled pages. Project pages now append
"— ผลงานติดตั้ง". If a service and a project are ever given the same name again,
that suffix is what keeps them apart.

**Hero photos carry alt text.** `PageHero` takes an `imageAlt`, and every page
passes one. It is the largest photo on the page and the shop sells on
photography, so leaving it empty threw away Google Images entirely. Write
something that adds to the heading rather than repeating it.

**Google Search Console.** Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel
to the token Google gives you, then deploy — the meta tag appears only when that
variable is set. Do this **after** the real domain is attached, not before: a
property verified against the `.vercel.app` address has to be set up again from
scratch once the domain changes, and the crawl history does not carry over.

**Opening hours** live in `business_info.hours` as free text, edited under
ข้อมูลร้าน in the admin. It is deliberately not a structured schedule — the
owner has to be able to write "จ-ส 9:00-18:00 (อาทิตย์ปิด)" or "โทรนัดล่วงหน้า"
without fighting a form. While it is empty the contact page hides the row
entirely rather than showing a blank label.

It is **not** in the JSON-LD yet, because `openingHoursSpecification` needs
machine-readable day/time pairs that free text cannot be parsed into safely.
If the shop settles on fixed hours and wants them in the map results, add a
structured field alongside this one — do not try to parse the free text, and
never guess the hours.

## A project is only public once it has a photo

Adding a project is two steps — details, then photos — so there is always a
window where a project exists with none. The public site uses
`getPublishedProjects()`, which drops those; the admin uses `getProjects()` and
still shows everything, with an amber "ยังไม่แสดงบนเว็บ" badge explaining why.
The detail page calls `notFound()` for them too, so an unfinished project cannot
be reached by URL either.

If you ever add a public surface that lists projects, use
`getPublishedProjects()` — reaching for `getProjects()` there is how an empty
grey card ends up on the portfolio.

## One ask at a time

The home page once carried **thirteen** contact buttons — LINE and the phone
number repeated six times over — and on a phone the end of the page stacked
three identical pairs on top of each other. The shop owner noticed before we
did.

Two rules keep it from creeping back:

1. **One CTA block per page.** Any `<CtaGroup>` renders `data-cta-block`. If you
   are about to add a second one to a page, delete the first instead.
2. **The floating dock hands over.** `StickyContactBar` measures every
   `[data-cta-block]` and the footer on scroll, and hides itself whenever one is
   on screen. So a new CTA block needs no wiring — it is picked up
   automatically, and the dock gets out of its way.

The dock uses `getBoundingClientRect` on scroll rather than an
`IntersectionObserver`. Both work in a browser, but IntersectionObserver never
fires in a headless/background pane, so the hand-over could not be tested. A
behaviour nobody can verify is one that quietly rots.

## FAQ

Questions and answers live in `site_settings` under `group_key = 'faq'`
(`faq_q1..8` / `faq_a1..8`) and are edited in the admin like any other text.
**A question whose answer is blank renders nowhere and is left out of the
FAQPage schema**, which is deliberate: price, lead time and warranty ship empty
because the shop has not set them, and a rich result that disagrees with the
visible page is worse than no rich result.

Adding a ninth question means an INSERT, which RLS blocks by design — it needs a
migration, the same as any other new settings key.

## Limits enforced in the database, not just the UI

These are triggers, so they hold even if someone bypasses the admin screens:

- 10 photos per project
- 6 banner photos on the home page
- `site_settings` rows may have their value changed, but cannot be added,
  deleted or renamed
- a project's `service_slugs` must reference services that actually exist

## Known constraints

**Photo resolution.** Most existing photos are about 1280px wide because they
were sent through LINE, which recompresses. Nothing in the code can recover
detail that was thrown away before upload. New photos uploaded through the
admin are stored at up to 2400px, so they will be noticeably sharper — the
originals need to reach the admin by a route that does not recompress them
(cloud storage, email, AirDrop), not by chat.

**Leaked-password checking** is a Supabase paid-plan feature and is off. The
compensating control is a long, unique admin password.

## If something breaks

Every section has an error boundary that still shows the shop's phone number
and LINE link, so a failure never leaves a customer with no way to make
contact. Failures are logged to the browser console with a `[site]`, `[root]`
or `[admin]` prefix.

Check in this order: is the Supabase project paused; did the last deploy
succeed; does `/api/keep-alive` return `{"ok":true}`.
