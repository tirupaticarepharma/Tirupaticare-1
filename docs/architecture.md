# Architecture

How the three parts fit together, and why. For the internals of any one part,
see its own README: [frontend](../frontend/README.md) ·
[backend](../backend/README.md) · [database](../database/README.md).

---

## The shape of it

```
                     ┌──────────────────────────────────────┐
                     │  Browser                             │
                     └───────┬───────────────────┬──────────┘
                             │                   │
              public pages   │                   │  admin panel
              (HTML only)    │                   │  (fetch + Bearer JWT)
                             ▼                   │
                 ┌───────────────────────┐       │
                 │  Next.js  :3000       │       │
                 │  server components    │       │
                 └───────────┬───────────┘       │
                             │                   │
                             │  lib/api.ts       │  lib/adminApi.ts
                             │  cache: no-store  │
                             ▼                   ▼
                 ┌──────────────────────────────────────┐
                 │  Express  :4000                      │
                 │  /api/products    /api/admin/*       │
                 └───────────────────┬──────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │  MySQL  :3306   │
                            └─────────────────┘
```

**The public site never talks to the API from the browser.** Its only
client-side JavaScript is the cart, which is pure `localStorage`. The admin
panel is the sole exception, and the only reason `NEXT_PUBLIC_API_URL` has to
be publicly reachable at all.

---

## Why the catalogue is fetched server-side

This is the decision the whole frontend is built around.

A surgical supplier lives or dies on being found in search results for
"Adson tissue forceps Pune". If the catalogue were fetched in the browser,
Google would receive an empty grid and a spinner. So
[`lib/api.ts`](../frontend/src/lib/api.ts) runs **inside server components**,
and the products are in the HTML before it ever reaches the client.

Four routes are marked `export const dynamic = "force-dynamic"`:

| Route | Why it must be dynamic |
| --- | --- |
| `/` | Featured products change when the manager edits them |
| `/products` | The catalogue itself |
| `/products/[slug]` | Must 404 the moment a product is hidden |
| `/sitemap.xml` | Must not advertise hidden products to Google |

Combined with `cache: "no-store"`, an admin change is live on the **very next
request** — no rebuild, no revalidation delay, no cache purge.

**The trade-off:** every page view hits MySQL, and a fully static export
(`output: "export"`) is no longer possible — the site needs a Node runtime. If
you would rather have caching than instant updates, change `cache: "no-store"`
to `next: { revalidate: 60 }` in `lib/api.ts`. That is the single switch.

---

## How a page renders, step by step

A visitor opens `/products`:

1. Next.js runs the server component. There is no cached HTML — the route is
   `force-dynamic`.
2. `getCatalogue()` fetches `http://localhost:4000/api/products` **server to
   server**, using `API_URL`. This never touches the visitor's network, so it
   can be an internal address like `http://api:4000`.
3. Express runs `SELECT ... WHERE is_visible = 1`, maps each row through
   `toPublicProduct()`, and returns camelCase JSON.
4. Next.js renders the grid to HTML and streams it. The visitor — and Google —
   receive a complete, populated page.
5. React hydrates. From here on the only client-side state is the cart.

### When the API is down

`getCatalogue()` **never throws**. It returns
`{ products: [], error: "..." }`, and the page renders a "catalogue temporarily
unavailable" message with the WhatsApp and phone CTAs still working. A dead
database degrades the site; it does not take it offline.

The one exception is deliberate: Next signals "this route must be dynamic" by
throwing an error whose `digest` starts with `DYNAMIC_SERVER_USAGE`.
`getCatalogue()` re-throws that untouched. **Swallowing it breaks
static/dynamic detection at build time** — which is why the catch block checks
for it before handling anything else.

---

## The visibility mechanism

Worth understanding on its own, because one line of SQL drives four behaviours.

`backend/src/routes/products.js` hardcodes `WHERE is_visible = 1` in **every**
public query. `routes/admin.js` does not filter at all.

Flipping one boolean therefore, with no other code involved:

- removes the product from `/products`
- removes it from the featured row on the home page
- drops it from `sitemap.xml`
- makes its detail page return 404

...while the manager still sees it in their table, greyed out, ready to be put
back. **Hiding is not deleting**, and it is fully reversible — which is why the
panel's delete button asks for confirmation and hide does not.

---

## The cart is not a cart

There is **no payment gateway anywhere in this project**, and no order table.

What looks like a cart is an *inquiry list*:

1. `CartContext` keeps items in React state, persisted to `localStorage` under
   `surgical-store-cart-v1`. It survives reloads; it never reaches the server.
2. `buildInquiryMessage()` in [`lib/whatsapp.ts`](../frontend/src/lib/whatsapp.ts)
   formats the list as plain text — names, SKUs, quantities.
3. The Send Inquiry button is a real `<a href="https://wa.me/...">`.

**Deliberately price-free.** The message is an inquiry, not a quote — the shop
replies with pricing and availability. Prices still render on the site when set,
falling back to "Price on request" when NULL.

> **Do not "improve" the button into an `onClick` handler.** Being a real anchor
> is what makes mobile hand off to the installed WhatsApp app, and what stops
> desktop popup blockers eating the click.

---

## Auth

One admin account. No roles, no registration, no password reset.

1. `POST /api/admin/login` verifies a bcrypt hash and returns a JWT
   (`role: "admin"`, 8h default).
2. `lib/adminApi.ts` stores it in `localStorage` under
   `surgical-store-admin-token` and sends it as `Authorization: Bearer`.
3. `requireAdmin` verifies it on every `/api/admin/*` route except login.
4. On a 401 with `expired: true`, the panel redirects to `/admin/login` rather
   than showing an error.

**The known weakness:** a JWT in `localStorage` is readable by any script on
the page, so an XSS bug would leak it. This was accepted for a single
store-manager account. To harden it, have the login route set an httpOnly,
Secure, SameSite=Strict cookie and drop the `Authorization` header from
`adminApi.ts`.

See [api.md](api.md) for the endpoint-level detail, including the timing-attack
defence on login and the in-memory rate limiter's limitations.

---

## Where the boundaries actually are

| Concern | Owner | Notes |
| --- | --- | --- |
| Product data | **MySQL** | Authoritative. `database/seed/products.js` is first-run data only |
| What the public may see | **`routes/products.js`** | The `is_visible = 1` filter |
| DB column ⇄ JSON field | **`serializers.js`** | Both directions. A rename is handled here alone |
| Business details, WhatsApp number | **`frontend/src/config/site.ts`** | Not env vars, not the database |
| Categories | **`frontend/src/data/categories.ts`** | The `category` column is a plain string; this file gives it a label and artwork |
| Cart contents | **The visitor's browser** | Never sent to the server |
| Inquiry message wording | **`lib/whatsapp.ts`** | The only place it is built |

### Two npm packages, three directories

`frontend/` and `backend/` each have their own `package.json` and install
separately, so they deploy to different hosts. The root `package.json` is a
task runner with no dependencies.

`database/` is not a package — just SQL, seed data and a compose file. The one
cross-directory dependency in the repo is `backend/src/migrate.js` and
`seed.js` reaching into `../database/`. The **running** server does not have
it, so `backend/` still deploys on its own.
