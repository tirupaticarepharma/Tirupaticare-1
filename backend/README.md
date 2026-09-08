# backend/ — the API

Express + MySQL, plain JavaScript ESM, no build step. Listens on **:4000**.
Its own `package.json` and `node_modules` — it installs and deploys
independently of [`../frontend`](../frontend).

```bash
npm run dev:backend      # from the repo root
```

```
backend/src/
├── index.js          express app, CORS, health check, error handling
├── config.js         reads and validates .env (throws on missing required vars)
├── db.js             the mysql2 connection pool + query() helper
├── serializers.js    DB row -> API shape. The field whitelist lives here
├── migrate.js        applies ../database/schema/*.sql
├── seed.js           loads ../database/seed/products.js + the admin account
├── middleware/auth.js  JWT verify + the in-memory login rate limiter
└── routes/
    ├── products.js   PUBLIC. Only ever returns is_visible = 1
    └── admin.js      login + full CRUD, all behind the JWT
```

## The one rule that shapes the public site

`routes/products.js` filters `is_visible = 1` in **every** query. Hiding a
product in the admin panel therefore removes it from the grid, the home page
and `sitemap.xml`, and 404s its detail page — from that single filter.

## Endpoints

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/api/health` | — |
| GET | `/api/products` | — |
| GET | `/api/products/:slug` | — |
| POST | `/api/admin/login` | — (rate limited) |
| GET | `/api/admin/me` | Bearer JWT |
| GET/POST/PUT/DELETE | `/api/admin/products…` | Bearer JWT |

**→ <http://localhost:4000/docs>** is the interactive version, generated from
[`openapi.js`](src/openapi.js). Press **Authorize**, paste a token from
`POST /api/admin/login`, and every endpoint becomes runnable from the page.
The raw spec is at `/docs/openapi.json` — import it into Postman, or diff it in
review.

Docs are **on in development and off when `NODE_ENV=production`**, since the
page lists every admin endpoint. Override with `ENABLE_API_DOCS=true`.

**→ [docs/api.md](../docs/api.md)** is the prose version: the same reference
plus the reasoning, the coercion rules that will surprise you, and the security
properties.

## Configuration

Copy `.env.example` to `.env`. Required: `DB_PASSWORD`, `JWT_SECRET`,
`ADMIN_PASSWORD`. `config.js` throws a readable error naming any that are
missing, rather than failing later at query time.

`migrate.js` and `seed.js` reach up into `../database/` for the schema and seed
data. That is the one place the backend depends on a sibling directory — the
running server (`npm start`) does not, so it still deploys on its own.
