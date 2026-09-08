# frontend/ — the website

Next.js 15 (App Router) + React 19 + Tailwind v4 + TypeScript. Serves the
public catalogue **and** the admin panel on **:3000**.

```bash
npm run dev:frontend     # from the repo root
```

```
frontend/src/
├── app/
│   ├── (site)/       PUBLIC. Route group carrying the header, footer,
│   │                 cart drawer and floating WhatsApp button
│   ├── admin/        Sits OUTSIDE (site) - inherits none of that chrome
│   ├── layout.tsx    root: fonts, SEO, CartProvider only
│   ├── sitemap.ts    built from the live catalogue
│   └── robots.ts
├── components/       ui/ · layout/ · home/ · product/ · cart/ · admin/
├── config/site.ts    business details, WhatsApp number, stats  <- edit here
├── data/categories.ts
├── context/CartContext.tsx    the inquiry list, persisted to localStorage
├── lib/
│   ├── api.ts        SERVER-side catalogue fetches (cache: "no-store")
│   ├── adminApi.ts   BROWSER-side admin fetches, attaches the JWT
│   └── whatsapp.ts   buildInquiryMessage() - the only place it is built
└── types/product.ts
```

## Two different ways data is fetched

- **Public pages fetch on the server.** `lib/api.ts` runs inside server
  components, so products are in the HTML Google receives. Catalogue routes are
  `dynamic = "force-dynamic"`, so admin edits appear immediately.
- **The admin panel fetches from the browser** via `lib/adminApi.ts` with a
  Bearer JWT. This is the only client-side API traffic, and the only reason
  `NEXT_PUBLIC_API_URL` exists.

## Configuration

Copy `.env.example` to `.env.local`:

- `API_URL` — used by server components. Can be internal (`http://api:4000`).
- `NEXT_PUBLIC_API_URL` — used by the browser. Must be publicly reachable and
  listed in the backend's `CORS_ORIGIN`.

## Do not "fix" these

- **The Send Inquiry button is a real `<a href>`, not `window.open()`** — that
  is what makes mobile hand off to the installed WhatsApp app and keeps desktop
  popup blockers from eating the click.
- **Green is reserved for WhatsApp actions.** Nothing else on the site uses it,
  which is what makes "chat with us" instantly recognisable.
- **Grid items need `min-w-0`** or a wide child pushes the track past the
  viewport on mobile.
- **`getCatalogue()` deliberately re-throws Next's `DYNAMIC_SERVER_USAGE`
  error** — that is control flow, not a failure.
