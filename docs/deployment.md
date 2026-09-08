# Going live

A runbook for the first deploy. Work top to bottom — the content section comes
first on purpose.

Current status is tracked in [handoff.md](handoff.md) §6. Nothing here has been
done yet.

---

## 1. Content that must not ship as written

**This is the only blocker that is not a config value.** Everything else on
this page is a setting; this is a set of claims about the business that are not
true, written as placeholder text to fill out the layout.

### The trust stats

`frontend/src/config/site.ts` → `stats`:

| Currently claims | Reality |
| --- | --- |
| **"ISO 13485 — Quality certified"** | A medical-device quality certification the business does not hold |
| **"25+ Years in business"** | Invented |
| **"500+ Hospitals & clinics served"** | Invented |
| **"2,000+ Products in catalogue"** | There are 24, all of them samples |

Publishing an ISO certification you do not hold is not a placeholder problem —
for a medical supplier it is a false quality claim, and in most markets a
regulatory one. **Replace each with something true, or delete the stat.** The
home page section handles a shorter list, and removing `TrustStats` from
`app/(site)/page.tsx` removes the band entirely.

### The testimonials

`frontend/src/components/home/Testimonials.tsx` contains three reviews
attributed to **doctors who do not exist, at hospitals that do not exist**.
Publishing them is publishing fabricated reviews.

Replace with real quotes you have permission to use, or delete the section.

### The catalogue

All 24 products are invented, and so are their specifications — steel grades,
sterilisation temperatures, filtration ratings, prices. Fine as a demo; not
fine as a live medical catalogue where a customer may rely on a spec.

Replace via the admin panel, or by rewriting `database/seed/products.js` and
re-seeding.

---

## 2. Secrets

**Rotate everything.** The current values were generated in a chat transcript,
so treat all of them as public.

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

- [ ] New `JWT_SECRET` (invalidates all existing sessions — expected)
- [ ] New `ADMIN_PASSWORD`, then re-run `npm run db:seed` to apply the hash
- [ ] New MySQL password, not `devpassword`
- [ ] Confirm `.env` files are not in the repo — `git status` should never list
      `backend/.env` or `frontend/.env.local`

---

## 3. Business details

All in `frontend/src/config/site.ts`. Find every remaining one:

```bash
grep -rn "REPLACE_ME" frontend/src/
```

- [ ] `url` — **currently `https://www.example.com`**. Until this is the real
      domain, canonical tags, `sitemap.xml`, `robots.txt` and OG/social preview
      cards are all wrong
- [ ] `name`, `legalName`, `description`
- [ ] `email` — currently `sales@example.com`
- [ ] `address` — currently a generic Pune placeholder
- [ ] `mapsLink` and the Google Maps `mapsEmbed`
- [ ] Business hours
- [ ] `social` — set any you do not have to `""` and the link disappears

Already real and correct: the **WhatsApp number** (`919370212516`) and the
**phone number**. Verify them once more anyway — the WhatsApp number is the
site's single most important field, since every inquiry goes there.

---

## 4. Infrastructure

Three pieces, deployable separately.

### Database

Use a **managed MySQL 8** (PlanetScale, RDS, DigitalOcean, Railway). The
`docker-compose.yml` in `database/` is for local development only.

Then, once, pointed at the managed instance:

```bash
npm run db:migrate && npm run db:seed
```

- [ ] Backups enabled. There is no soft delete in the admin panel — a deleted
      product is gone, and backups are the only recovery
- [ ] Not reachable from the public internet, or firewalled to the API host

### Backend

Any Node host — Railway, Render, Fly, a VPS behind nginx.

- [ ] Set every var from `backend/.env.example`
- [ ] `DB_*` → the managed MySQL
- [ ] `CORS_ORIGIN` → the frontend's real public origin, **not** `localhost`
- [ ] Start with `npm start` (not `npm run dev` — that runs `node --watch`)
- [ ] Point the host's health check at `/api/health`
- [ ] Leave `/docs` disabled, or decide deliberately. It is off automatically
      when `NODE_ENV=production`; `ENABLE_API_DOCS=true` turns it back on. The
      page documents every admin endpoint, so publishing it hands an attacker a
      map — it is not a vulnerability by itself, but there is no reason to
      expose it unless you want public API docs

### Frontend

Vercel detects Next.js automatically.

- [ ] `API_URL` → the deployed API (may be internal/private)
- [ ] `NEXT_PUBLIC_API_URL` → the deployed API, **publicly reachable**, and
      listed in the backend's `CORS_ORIGIN`

> A fully static export is **not** possible — the catalogue comes from a
> database, so the site needs a Node runtime. See
> [architecture.md](architecture.md).

### HTTPS

- [ ] Both origins over HTTPS. The admin JWT is sent in a header on every
      request; over plain HTTP it is readable in transit

---

## 5. Before announcing it

- [ ] `/api/health` returns `{"status":"ok","database":"connected"}`
- [ ] The shop page shows products **with JavaScript disabled** — proves
      server-rendering works, which is the whole SEO argument
- [ ] `/sitemap.xml` lists real URLs on the real domain, and **no hidden
      products**
- [ ] `/robots.txt` is correct, and `/admin` is not indexable
- [ ] Add a product to the inquiry list and press Send — **on a real phone**.
      Confirm WhatsApp opens, addressed to the right number, with the list
      written out
- [ ] Sign in to `/admin/login` with the **new** password
- [ ] Hide a product, confirm it leaves the shop page and its direct URL 404s,
      then put it back
- [ ] Check the site on a phone — the header, the cart drawer, the grid

---

## Known gaps you are shipping with

None of these block a launch, but decide about them consciously:

- **No image upload.** The admin form takes an image URL only. This is the
  first thing the store manager will ask for
- **In-memory login rate limiting.** Resets on restart, and does not work
  across multiple instances. If you run more than one, put a real limiter or a
  WAF rule in front
- **No automated tests.** Everything has been verified by hand
- **No pagination.** Fine at 24 products; needs attention in the hundreds
- **No audit log.** You cannot see who changed what, or undo a bad edit
- **JWT in `localStorage`** — an XSS bug would leak the session. See
  [architecture.md](architecture.md) for the httpOnly-cookie fix
