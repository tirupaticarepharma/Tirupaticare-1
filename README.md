# Surgical Equipment Store — Catalogue, WhatsApp Inquiry & Admin Panel

A surgical instruments / medical equipment store site with three parts:

1. **A public catalogue** — fast, SEO-friendly, server-rendered from the database.
2. **A cart that ends in WhatsApp, not a checkout.** There is no payment
   gateway anywhere in this project. Visitors add products to an *inquiry
   list*, press **Send Inquiry via WhatsApp**, and WhatsApp opens with the
   whole list already written out and addressed to the shop.
3. **An admin panel** for the store manager — show/hide products, mark them
   out of stock, edit and delete them. Changes appear on the public site on
   the next request.

**Stack:** Next.js 15 (App Router) + React 19 + Tailwind CSS v4 + TypeScript ·
Node.js + Express · MySQL · JWT auth.

---

> **Picking this project up after a break?** Read [docs/handoff.md](docs/handoff.md)
> first — it covers current state, credentials, design decisions, what's still
> missing before launch, and the gotchas.

## Contents

- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Database: migrate and seed](#database-migrate-and-seed)
- [The four things you'll want to change](#the-four-things-youll-want-to-change)
- [The cart → WhatsApp flow](#the-cart--whatsapp-flow)
- [The admin panel](#the-admin-panel)
- [API reference](#api-reference)
- [Folder structure](#folder-structure)
- [Deploying](#deploying)

---

## Quick start

You need **Node 18+** and **Docker** (or your own MySQL 5.7+ / 8.x server).

Every command below runs **from the repo root** — the root `package.json` is a
task runner that delegates into `frontend/`, `backend/` and `database/`.

### 0. Install and configure

```bash
npm run setup
```

```bash
cp frontend/.env.example frontend/.env.local && cp backend/.env.example backend/.env
```

Edit `backend/.env` — at minimum `DB_PASSWORD`, `JWT_SECRET` and
`ADMIN_PASSWORD`.

### 1. Database

Start MySQL, create the tables, load the sample catalogue:

```bash
npm run db:up && npm run db:migrate && npm run db:seed
```

### 2. Backend

```bash
npm run dev:backend
```

The API is now on <http://localhost:4000>. Check it:

```bash
curl http://localhost:4000/api/health
```

Interactive API docs, with a **Try it out** button on every endpoint:
<http://localhost:4000/docs>

### 3. Frontend

In a second terminal:

```bash
npm run dev:frontend
```

| URL | What it is |
| --- | --- |
| <http://localhost:3000> | The public site |
| <http://localhost:3000/products> | The catalogue |
| <http://localhost:3000/admin/login> | Admin panel |

Sign in with the `ADMIN_USERNAME` / `ADMIN_PASSWORD` you set in `backend/.env`.

---

## Environment variables

### `backend/.env` (copy from `backend/.env.example`)

| Variable | Default | What it does |
| --- | --- | --- |
| `PORT` | `4000` | Port the API listens on |
| `CORS_ORIGIN` | `http://localhost:3000` | Comma-separated list of origins allowed to call the API from a browser |
| `DB_HOST` | `127.0.0.1` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_USER` | `root` | MySQL user |
| `DB_PASSWORD` | — | MySQL password |
| `DB_NAME` | `surgical_store` | Database name (created by `npm run db:migrate`) |
| `JWT_SECRET` | **required** | Signing secret for admin tokens. The server refuses to start without it |
| `JWT_EXPIRES_IN` | `8h` | How long an admin session lasts |
| `ADMIN_USERNAME` | `admin` | Seeded admin account |
| `ADMIN_PASSWORD` | — | Seeded admin password (bcrypt-hashed on seed, min 8 chars) |

Generate a strong `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### `frontend/.env.local` (copy from `frontend/.env.example`)

| Variable | Default | What it does |
| --- | --- | --- |
| `API_URL` | `http://localhost:4000` | Used by **server** components. Can be an internal address (e.g. `http://api:4000` in Docker) |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Used by the **browser** (the admin panel). Must be publicly reachable and listed in `CORS_ORIGIN` |

> The WhatsApp number, phone number, address and hours are **not** environment
> variables — they live in `frontend/src/config/site.ts` (see below).

---

## Database: migrate and seed

All commands run from the **repo root**.

| Command | What it does |
| --- | --- |
| `npm run db:up` | Starts the MySQL container (`database/docker-compose.yml`) |
| `npm run db:down` | Stops it, keeping the data |
| `npm run db:migrate` | Creates the database if missing, then applies every file in `database/schema/` in order |
| `npm run db:seed` | Creates/updates the admin account and inserts any sample products not already present (safe to re-run) |
| `npm run db:seed -- --fresh` | Same, but empties the `products` table first |
| `npm run db:reset` | `migrate` then `seed --fresh` |

The runners themselves live in `backend/` (they need the connection pool and
bcrypt); the schema and seed data they read live in `database/`.

### Schema

`database/schema/001_schema.sql` creates two tables.

`products` has the columns from the spec — `id`, `name`, `description`,
`category`, `price`, `image_url`, `is_visible`, `in_stock`, `created_at`,
`updated_at` — plus a few **nullable, additive** columns that make the product
pages richer: `slug`, `sku`, `summary`, `unit`, `art`, `is_featured`, `specs`
(JSON) and `features` (JSON). The site renders fine with all of them NULL, so
drop any you don't want.

`admins` is `id`, `username`, `password_hash` (bcrypt, cost 12).

### Sample data

`database/seed/products.js` holds **24 sample products across 6
categories**. It is clearly marked as sample data — replace it with the real
catalogue, or just seed it once and then manage products in the admin panel.

Two rows are seeded deliberately non-default so the admin panel has something
to demonstrate straight away:

- `OI-4003` Interlocking Intramedullary Nail — **out of stock**
- `HF-5003` Foldable Wheelchair — **hidden** (so 23 of 24 show publicly)

---

## The four things you'll want to change

| What | Where |
| --- | --- |
| **WhatsApp number** | `frontend/src/config/site.ts` → `whatsappNumber` |
| **Phone number** | `frontend/src/config/site.ts` → `phoneDisplay` / `phoneHref` |
| **Products** | The admin panel at `/admin/products` (or the seed file for first load) |
| **Brand colours** | `frontend/src/app/globals.css` → the `@theme` block |

### WhatsApp number

```ts
// frontend/src/config/site.ts
whatsappNumber: "919370212516",
```

**Digits only.** No `+`, no spaces, no dashes. Country code first.

| Country | Format | Example |
| --- | --- | --- |
| India | `91` + 10 digits | `919370212516` |
| USA / Canada | `1` + 10 digits | `15551234567` |
| UK | `44` + number without the leading 0 | `447700900123` |

This one constant powers **every** WhatsApp link on the site: the floating
button, the header, the footer, product cards, product pages, the contact page
and the cart inquiry.

### Phone number

```ts
phoneDisplay: "+91 93702 12516",   // what visitors see
phoneHref: "+919370212516",        // what tel: dials
```

Set these to a different number from `whatsappNumber` if calls and chats go to
different lines.

### Everything else about the business

Also in `frontend/src/config/site.ts`, every value still needing attention is marked
`[REPLACE_ME]`:

```bash
grep -rn "REPLACE_ME" frontend/src/
```

`name`, `tagline`, `legalName`, `description`, `url` (the live domain, used for
canonical tags and the sitemap), `email`, `address`, `mapsLink` / `mapsEmbed`
(Google Maps → **Share** → **Embed a map** → copy the URL inside `src="..."`),
`hours`, `stats` and `social`.

Sample **testimonials** are in `frontend/src/components/home/Testimonials.tsx`, also
marked `[REPLACE_ME]`.

### Brand colours

`frontend/src/app/globals.css`, in the `@theme` block. These are Tailwind v4 theme
tokens, so `--color-brand-600` is available as `bg-brand-600`,
`text-brand-600`, `border-brand-600` and so on.

```css
@theme {
  --color-brand-50:  #eefaff;
  ...
  --color-brand-700: #0c6991;   /* primary buttons, links */
  --color-brand-900: #134864;   /* dark bands, footer     */

  --color-whatsapp: #25d366;    /* WhatsApp only */
}
```

Replace the `--color-brand-*` ramp with your own 50→950 scale and the whole
site follows.

> **Leave the WhatsApp greens alone.** They are deliberately reserved for
> WhatsApp actions only, so "chat with us" always reads as the same
> unmistakable button. Nothing else on the site uses green.

Fonts are set in `frontend/src/app/layout.tsx` (Inter for body, Plus Jakarta Sans for
headings), wired to the `--font-sans` / `--font-display` tokens.

### Product images

Products render a hand-drawn inline SVG illustration chosen by their `art`
key. To use a real photo instead, set **Image URL** on the product in the admin
panel — either an absolute URL, or a path like `/products/forceps.jpg`
pointing at a file you put in `public/products/`. Square images look best.

---

## The cart → WhatsApp flow

1. **Add to cart.** `AddToCartButton` calls `addItem()` on the cart context.
   Each line stores `slug`, `name`, `sku`, `unit`, `quantity` and the artwork —
   no prices. The header badge updates immediately and a toast confirms.
   Products marked out of stock render a disabled **Out of Stock** button
   instead, with the WhatsApp CTA still available beside it.
2. **Persistence.** Every change is mirrored to `localStorage` under
   `surgical-store-cart-v1`, so the list survives refreshes and syncs across
   open tabs.
3. **Send.** The **Send Inquiry via WhatsApp** button (in the drawer and on
   `/cart`) calls `buildInquiryMessage()` then `whatsappLink()`, producing:

   ```
   https://wa.me/919370212516?text=<url-encoded message>
   ```

   It is a real `<a target="_blank" rel="noopener noreferrer">` rather than a
   scripted `window.open`, so mobile hands off to the installed WhatsApp app
   and desktop popup blockers never swallow the click.

The message:

```
Hello, I'm interested in the following products:

1. Adson Tissue Forceps 12cm (SKU: SI-1001) x 1
2. Disposable Syringe 5ml (Box of 100) (SKU: DC-2001) x 2

Please share pricing and availability.
```

To change the wording, edit `buildInquiryMessage()` in `frontend/src/lib/whatsapp.ts` —
the only place the cart message is built.

### Testing it

1. Open <http://localhost:3000/products>
2. **Add to Cart** on two or three products — the header badge increments
3. Open the drawer from the header, change a quantity
4. Refresh — the list is still there
5. Go to `/cart` and expand **Preview the WhatsApp message**
6. Click **Send Inquiry via WhatsApp** — a new tab opens `wa.me` with the
   message pre-filled

To read the generated link without leaving the page:

```js
document.querySelector('a[aria-label^="Send an inquiry"]').href
```

### Where WhatsApp and Call appear

Floating buttons bottom-right on every page · top bar · header · mobile menu ·
hero · every product card · product detail · cart drawer · cart page · the
contact band repeated at the bottom of every page · footer.

---

## The admin panel

`/admin/login` → `/admin/products`. It sits outside the `(site)` route group,
so it renders none of the public chrome, and it is `noindex` plus disallowed in
`robots.txt`.

- **Sign in** with `ADMIN_USERNAME` / `ADMIN_PASSWORD`. The API returns a JWT
  which is stored in `localStorage`; `/admin/products` redirects to the login
  page if there is no valid token.
- **Visible / Hidden** and **In stock / Out of stock** are one-click toggles.
  They update the row optimistically, call `PUT /api/admin/products/:id`
  immediately, show a toast, and roll the row back if the request fails.
  There is no separate save step.
- **Add Product** opens a form: name, category, SKU, price, summary,
  description, unit, image URL, illustration, and the three flags.
- **Edit** opens the same form pre-filled.
- **Delete** asks for confirmation first, because it is permanent — the
  Hidden toggle is the non-destructive option and the dialog says so.
- **Log out** clears the token.

Hiding a product removes it from `GET /api/products`, so it disappears from
the grid, the home page, the sitemap and its own detail page (which 404s) on
the next request.

> **Note on the token store.** `localStorage` is the simpler of the two
> options in the spec and is fine for a single store-manager account, but a
> token there is readable by any script on the page, so an XSS bug would
> expose it. To harden: have `POST /api/admin/login` set an httpOnly, Secure,
> SameSite=Strict cookie and drop the `Authorization` header in
> `frontend/src/lib/adminApi.ts`.

---

## API reference

Base URL `http://localhost:4000`.

### Public

| Method | Path | Returns |
| --- | --- | --- |
| `GET` | `/api/health` | API + database status |
| `GET` | `/api/products` | `{ products: [...] }` — **only** `is_visible = 1`. Optional `?category=<id>` |
| `GET` | `/api/products/:slug` | `{ product: {...} }` — 404 if missing or hidden |

### Admin — all except login require `Authorization: Bearer <token>`

| Method | Path | Does |
| --- | --- | --- |
| `POST` | `/api/admin/login` | `{ username, password }` → `{ token, admin }` |
| `GET` | `/api/admin/me` | Validates a stored token |
| `GET` | `/api/admin/products` | Every product, visible or not |
| `POST` | `/api/admin/products` | Create. `name` required; `slug` auto-generated and de-duplicated |
| `PUT` | `/api/admin/products/:id` | Update any subset of fields (the toggles send one field) |
| `DELETE` | `/api/admin/products/:id` | Permanent delete |

Request bodies accept camelCase (`imageUrl`, `isVisible`, `inStock`,
`isFeatured`) or snake_case. Only whitelisted fields are written, so a client
cannot set `id` or `created_at`.

**→ [docs/api.md](docs/api.md)** is the full reference — request and response
shapes, every status code, the writable-field whitelist with its coercion
rules, the security properties, and copy-pasteable curl examples.

---

## Folder structure

```
.
├── package.json              Task runner only - no dependencies of its own
├── README.md                 You are here
├── docs/                     ────────── DOCUMENTATION ──────────
│   ├── handoff.md            Project state, decisions, what is left to do
│   ├── architecture.md       How the three parts fit together
│   ├── api.md                Full endpoint reference
│   ├── deployment.md         Go-live runbook
│   └── admin-guide.md        For the store manager (non-technical)
│
├── frontend/                 ────────── FRONTEND  (:3000) ──────────
│   ├── README.md
│   ├── package.json
│   ├── next.config.mjs
│   ├── .env.example          → copy to frontend/.env.local
│   ├── public/               Static assets (put real product photos here)
│   └── src/
│       ├── app/
│       │   ├── layout.tsx        Root shell: fonts, SEO, CartProvider
│       │   ├── globals.css       ★ BRAND COLOURS + base styles
│       │   ├── not-found.tsx     404
│       │   ├── sitemap.ts        Built from the live catalogue
│       │   ├── robots.ts
│       │   │
│       │   ├── (site)/           Public site (header/footer/cart chrome)
│       │   │   ├── page.tsx              Home
│       │   │   ├── products/page.tsx     Shop, filterable
│       │   │   ├── products/[slug]/page.tsx  Product detail
│       │   │   ├── cart/page.tsx         Inquiry list
│       │   │   ├── about/page.tsx
│       │   │   └── contact/page.tsx      Address, map, hours, channels
│       │   │
│       │   └── admin/            Admin panel (no public chrome, noindex)
│       │       ├── login/page.tsx        Username + password
│       │       └── products/page.tsx     Table, toggles, add/edit/delete
│       │
│       ├── config/site.ts    ★ WHATSAPP NUMBER, PHONE, ADDRESS, HOURS, STATS
│       ├── data/categories.ts    ★ Category list + artwork keys
│       ├── types/product.ts      The Product / AdminProduct shapes
│       ├── lib/
│       │   ├── api.ts        ★ Server-side catalogue fetching
│       │   ├── adminApi.ts   ★ Browser-side admin API client + JWT
│       │   └── whatsapp.ts   ★ Message builder + wa.me link builder
│       ├── context/CartContext.tsx   Cart state + localStorage
│       └── components/
│           ├── layout/       Header (top bar, nav, cart), Footer
│           ├── home/         Hero, TrustStats, CategoryGrid,
│           │                 FeaturedProducts, HowItWorks,
│           │                 Testimonials ★, ContactBand
│           ├── product/      ProductCard, ProductBrowser (filter + search),
│           │                 ProductArt ★ (placeholder SVGs),
│           │                 ProductInquiryPanel
│           ├── cart/         CartButton, CartDrawer, CartPageContent,
│           │                 AddToCartButton, QuantityStepper,
│           │                 SendInquiryButton ★, CartToast
│           ├── admin/        ProductFormModal
│           ├── contact/      WhatsAppComposer (backend-free contact form)
│           └── ui/           Button, Container, ContactCtas,
│                             FloatingActions, Icons
│
├── backend/                  ────────── BACKEND  (:4000) ──────────
│   ├── README.md
│   ├── package.json
│   ├── .env.example          → copy to backend/.env
│   └── src/
│       ├── index.js          Express app, CORS, error handling
│       ├── config.js         Every env var, in one place
│       ├── db.js             mysql2 connection pool
│       ├── migrate.js        npm run db:migrate  → reads ../database/schema/
│       ├── seed.js           npm run db:seed     → reads ../database/seed/
│       ├── serializers.js    DB rows ⇄ API JSON, field whitelist
│       ├── middleware/auth.js   JWT sign/verify + login throttle
│       └── routes/
│           ├── products.js   PUBLIC routes (visible products only)
│           └── admin.js      PROTECTED routes
│
└── database/                 ────────── DATABASE (:3306) ──────────
    ├── README.md
    ├── docker-compose.yml    The dev MySQL container
    ├── schema/
    │   └── 001_schema.sql    products + admins tables
    └── seed/
        └── products.js       ★ 24 SAMPLE PRODUCTS
```

★ = the files you are most likely to edit.

---

## Deploying

**→ [docs/deployment.md](docs/deployment.md)** is the runbook: content
blockers, secrets to rotate, the three pieces of infrastructure, and a
pre-launch checklist. Work through it in order.

The short version: frontend on Vercel, API on any Node host, MySQL managed.
Set `API_URL`, `NEXT_PUBLIC_API_URL` and `CORS_ORIGIN` to match, and serve both
over HTTPS.

> A fully static export (`output: "export"`) is not possible — the catalogue
> comes from a database, so the site needs a Node runtime.

> [!IMPORTANT]
> The home page currently claims an **ISO 13485 certification**, **25+ years in
> business** and **500+ hospitals served**, and shows testimonials from doctors
> who do not exist. These are layout placeholders. Replace or delete them
> before the site is public — see [deployment.md](docs/deployment.md) §1.

---

## Accessibility & SEO notes

- Per-page titles and meta descriptions, `MedicalEquipmentSupplier` JSON-LD,
  and a `sitemap.xml` generated from the live catalogue
- `/cart` and `/admin` are excluded from indexing
- Single consistent focus ring, skip-to-content link, `aria-label`s on every
  icon-only control
- Cart drawer is a labelled `role="dialog"` that closes on `Escape`; the delete
  dialog is a `role="alertdialog"`
- Toasts are `aria-live="polite"`
- `prefers-reduced-motion` disables animations and smooth scrolling
- Inputs are 16px so iOS Safari doesn't zoom on focus

---

## Sample data disclaimer

The 24 products, their specifications and prices, the testimonials, the trust
stats and the business details are **placeholders** written to make the site
look complete. They are marked with `SAMPLE DATA` comments and `[REPLACE_ME]`
markers. Replace them with the real catalogue and real business details before
going live — particularly any certification or compliance claims.
