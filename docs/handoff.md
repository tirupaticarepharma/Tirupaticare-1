# HANDOFF — read this first

Working notes for picking this project back up cold. The [README](../README.md)
explains **how to run and configure** things; this file covers **what state
it's in, why it's built this way, and what's still missing**.

Last updated: 2026-09-07.

---

## 1. What this is

A surgical instruments / medical equipment store, in three parts:

1. **Public catalogue** — Next.js, server-rendered from MySQL so Google can
   crawl the products.
2. **Cart that ends in WhatsApp, not a checkout.** No payment gateway
   anywhere. Visitors build an *inquiry list*, press one button, and WhatsApp
   opens with the list pre-written and addressed to the shop.
3. **Admin panel** — the store manager shows/hides products, marks them out of
   stock, edits and deletes them. Changes hit the public site on the next
   request.

**Stack:** Next.js 15.5.25 · React 19.2.8 · Tailwind v4.3.3 · TypeScript ·
Node/Express · MySQL 8 · JWT. Built and tested on Node 26.5.0.

**Three directories, two npm packages.**

| Directory | What | Own npm package? |
| --- | --- | --- |
| `frontend/` | Next.js site + admin UI, port 3000 | yes |
| `backend/` | Express API, port 4000 | yes |
| `database/` | MySQL schema, seed data, `docker-compose.yml` | no — plain files |

Not npm workspaces: `frontend/` and `backend/` install and run separately, so
they can still deploy to different hosts. The root `package.json` is only a
task runner (`npm run dev:backend`, `npm run db:up`, …) and has no dependencies
of its own.

`database/` holds the **definitions**; the code that talks to MySQL lives in
`backend/`. `backend/src/migrate.js` and `seed.js` reach up into `../database/`
for the schema and seed data — the only cross-directory dependency in the repo,
and one the *running* server (`npm start`) does not have, so `backend/` still
deploys on its own.

Each directory has its own README explaining its internals:
[frontend](../frontend/README.md) · [backend](../backend/README.md) ·
[database](../database/README.md).

---

## 2. Restarting work from cold

Start the database first:

```bash
npm run db:up
```

Then, in two terminals:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

> **If `db:up` fails on a name conflict:** an older `surgical-mysql` container
> made by hand (with `docker run`, and no restart policy) is still on this
> machine. It works, but it will not come back after a reboot. To switch over
> — this **deletes its data**, so re-seed after:
>
> ```bash
> docker rm -f surgical-mysql && npm run db:up && npm run db:migrate && npm run db:seed
> ```

| URL | What |
| --- | --- |
| http://localhost:3000 | Public site |
| http://localhost:3000/admin/login | Admin panel |
| http://localhost:4000/api/health | API + DB status — check this first if the site looks empty |

### On a fresh clone

`node_modules`, `.env.local` and `backend/.env` are gitignored, so a clone needs
setup before it runs. This exact sequence was tested from a clean copy and
works:

```bash
npm run setup
```

```bash
cp frontend/.env.example frontend/.env.local && cp backend/.env.example backend/.env
```

Fill in `backend/.env` (`DB_PASSWORD`, `JWT_SECRET`, `ADMIN_PASSWORD`), then:

```bash
npm run db:up && npm run db:migrate && npm run db:seed
```

`frontend/public/` is empty, and **git doesn't track empty directories** — it won't
exist after a clone. Nothing breaks (verified), but `mkdir frontend/public/products`
before adding photos.

---

## 3. Current state — credentials and data

**These are development values. Rotate everything before anything goes public
— they were generated in a chat transcript.**

| Thing | Value | Where |
| --- | --- | --- |
| Admin login | `admin` / `devpassword123` | `backend/.env` |
| JWT secret | dev placeholder | `backend/.env` |
| MySQL root | `devpassword` | `backend/.env` + the Docker container |
| Database | `surgical_store` on `127.0.0.1:3306` | |

`backend/.env` and `.env.local` are gitignored and were confirmed absent from a
simulated clone — no secrets reach GitHub.

**Database contains:** 24 products across 6 categories, 1 admin account. Two
rows are deliberately non-default so the admin panel has something to show:

- `HF-5003` Foldable Wheelchair — **hidden** (so the public site shows 23)
- `OI-4003` Interlocking Intramedullary Nail — **out of stock**

**Real values already set:** WhatsApp `919370212516` and phone
`+91 93702 12516` in `frontend/src/config/site.ts`. Everything else there is still a
placeholder.

**Browser storage keys** (clear these when testing):

- `surgical-store-cart-v1` — the inquiry list
- `surgical-store-admin-token` — the admin JWT

---

## 4. How it fits together

> Expanded, with the request flow step by step and the reasoning behind each
> boundary, in [architecture.md](architecture.md).

```
Browser ──> Next.js :3000 ──(server components, cache:"no-store")──> Express :4000 ──> MySQL :3306
   │
   └──(admin panel only, fetch + Bearer JWT)──────────────────────> Express :4000
```

- **Public pages fetch on the server.** `frontend/src/lib/api.ts` runs inside server
  components, so products are in the HTML Google receives. Catalogue routes
  (`/`, `/products`, `/products/[slug]`, `/sitemap.xml`) are
  `dynamic = "force-dynamic"` — admin changes are live immediately.
- **The admin panel fetches from the browser** via `frontend/src/lib/adminApi.ts`,
  attaching the JWT. This is the only client-side API traffic, and the only
  reason `NEXT_PUBLIC_API_URL` exists.
- **`GET /api/products` only ever returns `is_visible = 1`.** Hiding a product
  removes it from the grid, the home page, the sitemap, and 404s its detail
  page — all from that one filter in `backend/src/routes/products.js`.
- **Route groups matter.** `frontend/src/app/(site)/` carries the public chrome (header,
  footer, cart drawer, floating WhatsApp button). `frontend/src/app/admin/` sits
  *outside* it and inherits none of that. The root `layout.tsx` holds only
  fonts, SEO and `CartProvider`.

### Source-of-truth map

| To change… | Edit… |
| --- | --- |
| Products | The admin panel (DB is authoritative). `database/seed/products.js` is only the first-run seed |
| WhatsApp / phone / address / hours / stats | `frontend/src/config/site.ts` |
| Categories | `frontend/src/data/categories.ts` (add the id, give it an `art` key) |
| Brand colours / fonts | `frontend/src/app/globals.css` → `@theme` |
| The WhatsApp message wording | `buildInquiryMessage()` in `frontend/src/lib/whatsapp.ts` — the only place it's built |
| Testimonials | `frontend/src/components/home/Testimonials.tsx` |
| DB schema | `database/schema/001_schema.sql` + `backend/src/serializers.js` (the field whitelist) |

---

## 5. Decisions made, and why

Don't undo these by accident:

1. **The `products` table keeps the originally-specified columns, plus extra
   nullable ones** (`slug`, `sku`, `summary`, `unit`, `art`, `is_featured`,
   `specs`, `features`). Without them the product pages lose specs tables,
   SKUs and pack sizes. Everything renders fine with them NULL, so they're
   safe to drop if you want the minimal schema back.

2. **Prices are stored and displayed when set**, falling back to "Price on
   request" when NULL. The schema and admin form include `price`, so storing
   it and never showing it would be odd. The WhatsApp inquiry message stays
   price-free deliberately — it's an inquiry, not a quote.

3. **Static export is no longer possible.** The catalogue comes from a
   database, so the site needs a Node runtime. If you want caching over
   instant updates, swap `cache: "no-store"` for `next: { revalidate: 60 }` in
   `frontend/src/lib/api.ts`.

4. **The JWT lives in `localStorage`.** Simpler, and fine for one
   store-manager account — but readable by any script on the page, so an XSS
   bug would leak it. To harden: have `POST /api/admin/login` set an httpOnly,
   Secure, SameSite=Strict cookie and drop the `Authorization` header in
   `frontend/src/lib/adminApi.ts`.

5. **The Send Inquiry button is a real `<a href>`, not `window.open()`.** That
   is why mobile hands off to the installed WhatsApp app and desktop popup
   blockers don't eat the click. Don't "improve" it into an onClick handler.

6. **WhatsApp green is reserved for WhatsApp actions only.** Nothing else on
   the site uses green, which is what makes "chat with us" instantly
   recognisable. The `whatsapp` variant in `frontend/src/components/ui/Button.tsx` is
   the only thing that should use it.

7. **Product artwork is inline SVG, not image files** (`ProductArt.tsx`, ~24
   hand-drawn glyphs keyed by the `art` column). No network requests, no
   layout shift, sharp at any size. Setting a product's Image URL overrides
   the glyph with a real photo.

---

## 6. What's NOT done

### Blocking — content that would be dishonest if published

- **Fabricated trust signals.** The home page claims **"ISO 13485"**, **"25+
  years in business"** and **"500+ hospitals served"** (`frontend/src/config/site.ts` →
  `stats`), and shows three testimonials from **invented doctors at invented
  hospitals** (`frontend/src/components/home/Testimonials.tsx`). These were written to
  fill the layout. Publishing them would present fake certifications and fake
  reviews as genuine — replace with real ones or delete the sections.
- **24 invented products** with invented specs — steel grades, sterilisation
  temperatures, filtration ratings, prices. Fine as a demo; not fine as a live
  medical catalogue.

### Blocking — config

- [ ] Rotate `JWT_SECRET` and `ADMIN_PASSWORD` (`backend/.env`)
- [ ] `url: "https://www.example.com"` → real domain (breaks canonical tags,
      `sitemap.xml` and OG tags until you do)
- [ ] Business name, legal name, address, email, Google Maps embed
      (`frontend/src/config/site.ts`)
- [ ] `CORS_ORIGIN` → real frontend origin (`backend/.env`)
- [ ] Point `DB_*` at a managed MySQL; run `npm run db:migrate && npm run db:seed`
      once against it
- [ ] Serve both over HTTPS

Find every remaining placeholder:

```bash
grep -rn "REPLACE_ME" frontend/src/
```

### Known feature gaps

- **No image upload.** The admin form takes an image *URL* only. Upload needs
  a storage backend (S3 / Cloudinary / disk) that wasn't built. Tell whoever
  uses the panel.
- **Login rate limiting is in-memory** (`backend/src/middleware/auth.js`) — 10
  attempts per IP per 10 min, but it resets on restart and doesn't work across
  multiple instances. Use a real limiter or a WAF rule if you scale out.
- **No automated tests.** Everything was verified by hand (see §7).
- **No password change UI** — the admin password is reset by editing
  `backend/.env` and re-running `npm run db:seed`.
- **No pagination** on the shop grid or admin table. Fine at 24 products, will
  need attention in the hundreds.
- **No `updated_at` display or audit log** — you can't see who changed what.

---

## 7. What was actually verified

Manually, against live MySQL — not assumed:

- **Cart → WhatsApp:** add, badge increments, quantities merge, survives
  reload via `localStorage`, produces
  `https://wa.me/919370212516?text=<encoded>` with the correct message body.
- **Admin auth:** wrong password → 401; no token → redirect to login; bogus
  token → 401; correct login → JWT.
- **Admin CRUD:** create (slug auto-generated), edit, visibility toggle, stock
  toggle, delete with confirmation — via both curl and the real UI.
- **Hiding propagates:** a product hidden in the UI vanished from
  `/api/products`, from the server-rendered HTML of `/products`, from
  `sitemap.xml`, and its detail page returned 404.
- **SEO:** product names confirmed present in raw server HTML.
- **Out of stock:** card shows the badge, dims the artwork, and renders a
  `disabled` "Out of Stock" button.
- **Fresh clone:** 73 tracked files, clean install, migrate, seed, build and
  serve — all worked, with no `.env` files and no `frontend/public/` directory.
  ⚠️ This was verified against the **old flat layout**, before the split into
  `frontend/` / `backend/` / `database/`. It has *not* been re-run since.

### Re-verified after the restructure (2026-09-07)

The move to three directories was checked end to end against live MySQL:

- `npm run db:migrate` and `npm run db:seed` both work through the root
  delegator — confirming `backend/src/migrate.js` finds `../database/schema/`
  and `seed.js` finds `../../database/seed/products.js`.
- API healthy, 23 visible products, unchanged.
- `/`, `/products`, `/products/[slug]`, `/admin/login`, `/sitemap.xml` all 200;
  product names still present in the server-rendered HTML; no console errors.
- `npm run build` succeeds and the static/dynamic split is unchanged — the
  catalogue routes are still `ƒ` (server-rendered on demand).

**Not** re-verified: an actual fresh clone of the new layout, because the repo
is still not in git. Worth re-running once it is.

---

## 8. Gotchas that will bite you

- **Never run `next build` while `next dev` is running.** They share `.next`
  and the dev server dies with `Cannot find module './124.js'`. Symptom: a
  blank dark page. Fix: stop both, `rm -rf frontend/.next`, restart.
- **The site rendering empty usually means the API is down**, not a frontend
  bug. Check `curl http://localhost:4000/api/health` first. The catalogue
  pages fail soft — they show "temporarily unavailable" with WhatsApp/call
  CTAs rather than crashing.
- **`getCatalogue()` deliberately re-throws Next's `DYNAMIC_SERVER_USAGE`
  error** (`frontend/src/lib/api.ts`). That's control flow, not a failure — swallowing
  it breaks static/dynamic detection at build time.
- **Grid items need `min-w-0`.** A wide grid child pushes its track past the
  viewport and clips content on mobile. This already bit the hero once; the
  fix is commented in `frontend/src/components/home/Hero.tsx`.
- **Two `npm install`s.** `frontend/` and `backend/` — `npm run setup` from
  the root does both. Forgetting the backend gives confusing
  `Cannot find module 'express'` errors.
- **`npm run <script>` at the root is a delegator, not the real script.**
  `npm run db:seed` at the root runs `npm run seed` inside `backend/`. To pass
  flags through, they need the extra `--`: `npm run db:seed -- --fresh`.
- **`npm run db:seed` resets the admin password** to whatever is in `backend/.env`
  (`ON DUPLICATE KEY UPDATE`). Re-running it is safe for products (matched on
  `slug`), but `npm run db:seed -- --fresh` wipes the products table first.
- **JSON columns.** `specs` and `features` come back parsed from MySQL 8 but
  are handled defensively in `backend/src/serializers.js` in case they're
  stored as text.

---

## 9. Cleaning up the dev environment

The local MySQL runs in Docker. Stop it, keeping the data:

```bash
npm run db:down
```

To delete the data as well:

```bash
docker compose -f database/docker-compose.yml down -v
```

Docker Desktop was also started on this machine and will keep running until
you quit it.

---

## 10. Suggested next steps

1. Strip or replace the fabricated stats and testimonials — that's the one
   thing that can't ship as-is.
2. `git init`, first commit, push to GitHub (nothing is version controlled
   yet).
3. Replace the sample catalogue with the real products, via the admin panel or
   by rewriting `database/seed/products.js` and re-seeding.
4. Fill in the real business details in `frontend/src/config/site.ts`.
5. Deploy: frontend on Vercel, API on a Node host, MySQL managed. Set
   `API_URL`, `NEXT_PUBLIC_API_URL` and `CORS_ORIGIN` to match.
6. Then consider the feature gaps in §6 — image upload is the one the store
   manager will ask for first.
