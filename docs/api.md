# API reference

Express + MySQL, REST/JSON, no version prefix. Everything lives under `/api`.
Source: [`backend/src/routes/`](../backend/src/routes/).

**Base URL:** `http://localhost:4000` in development.

> **There is a runnable version of this page.** <http://localhost:4000/docs>
> serves Swagger UI from the same spec — press **Authorize**, paste a login
> token, and every endpoint below becomes executable in the browser. The raw
> OpenAPI 3.1 document is at `/docs/openapi.json`.
>
> It is generated from [`backend/src/openapi.js`](../backend/src/openapi.js),
> which is hand-maintained — **changing a route does not update it
> automatically.** Change both.

---

## Conventions

- **Responses are always envelopes**, never bare arrays: `{ "products": [...] }`,
  `{ "product": {...} }`. Adding a field later cannot break clients.
- **JSON is camelCase; the database is snake_case.** The translation happens in
  exactly one file, [`serializers.js`](../backend/src/serializers.js) — a column
  rename only has to be handled there.
- **Request bodies accept either case** — `imageUrl` or `image_url` both work.
- **Errors are always `{ "error": "<human-readable sentence>" }`**, written to be
  shown to the store manager as-is.
- Request bodies are capped at **1mb**.

### CORS is not authentication

`CORS_ORIGIN` is an allow-list checked against the browser's `Origin` header.
Requests with **no** `Origin` — curl, Postman, the Next.js server-side fetch —
are allowed through deliberately, because that is how the public site renders.
CORS restricts *other websites' browsers*, nothing else. The JWT is what
actually protects the admin routes.

---

## Public endpoints

No authentication. These only ever return rows with `is_visible = 1`.

### `GET /api/health`

The first thing to check when the site looks empty.

```json
{ "status": "ok", "database": "connected" }
```

Returns **503** with `{ "status": "degraded", "database": "<reason>" }` when
MySQL is unreachable. The API itself stays up — it does not exit when the
database goes away.

### `GET /api/products`

| Query | Type | Notes |
| --- | --- | --- |
| `category` | string | Optional. Exact match on the `category` column |

Unfiltered results are ordered by `id`. **Filtered** results are ordered by
`is_featured DESC, id ASC`, so featured products lead a category page.

```json
{
  "products": [
    {
      "id": 1,
      "slug": "adson-tissue-forceps",
      "name": "Adson Tissue Forceps 12cm",
      "sku": "SI-1001",
      "category": "surgical-instruments",
      "summary": "1x2 teeth, serrated grip, AISI 410 stainless steel.",
      "description": "A precision tissue forceps for...",
      "price": 450,
      "imageUrl": null,
      "unit": "Per piece",
      "art": "forceps",
      "specs": [{ "label": "Length", "value": "12 cm" }],
      "features": ["Autoclavable to 134C"],
      "inStock": true,
      "isFeatured": true
    }
  ]
}
```

Notes on the shape:

- **`isVisible` is never present.** The public serializer omits it entirely —
  the field does not exist on this side of the API.
- `price` is a **number or `null`**. Null means the site renders "Price on
  request". It is not `0`.
- `specs` and `features` are always **arrays**, never null — they fall back to
  `[]` even if the column is NULL or holds unparseable text.
- `slug` falls back to the stringified `id` if the column is NULL.

### `GET /api/products/:slug`

Accepts a slug **or** a numeric id — `/api/products/adson-tissue-forceps` and
`/api/products/1` both work.

Returns `{ "product": {...} }`, or **404** `{ "error": "Product not found" }`.
A hidden product returns 404 here, which is what makes its detail page 404 the
moment the manager hides it.

---

## Admin endpoints

All under `/api/admin`. Everything except `/login` requires
`Authorization: Bearer <token>`.

### `POST /api/admin/login`

```json
{ "username": "admin", "password": "..." }
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": { "id": 1, "username": "admin" }
}
```

| Code | When |
| --- | --- |
| 400 | Username or password missing |
| 401 | Either one wrong — the message never says which |
| 429 | Rate limited (see below) |

Two security details worth not undoing:

- **A missing user is still compared against a dummy bcrypt hash**, so a wrong
  username and a wrong password take the same amount of time. Skipping the
  compare would leak which usernames exist.
- **The 401 message is deliberately vague** ("Incorrect username or password")
  for the same reason.

**Rate limiting:** 10 attempts per IP per 10 minutes. Exceeding it returns 429
with a `Retry-After` header in seconds. A successful login clears the counter,
so an admin who mistyped a few times is not locked out.

> The limiter is **in-memory** ([`auth.js`](../backend/src/middleware/auth.js)) —
> it resets when the process restarts and does not work across multiple
> instances. Put a real limiter or a WAF rule in front of it before scaling out.

### `GET /api/admin/me`

Returns `{ "admin": { "id": ..., "username": "..." } }`. The panel calls this on
load to check a stored token is still valid, rather than waiting for the first
real request to fail.

### `GET /api/admin/products`

Every product, **visible or not**, plus the fields the public shape omits:

```json
{
  "products": [
    {
      "...": "all public fields, plus:",
      "isVisible": false,
      "createdAt": "2026-09-07T01:12:44.000Z",
      "updatedAt": "2026-09-07T01:30:02.000Z"
    }
  ]
}
```

This is the *only* place hidden products are visible. That asymmetry with
`GET /api/products` is the whole mechanism behind the hide toggle.

### `POST /api/admin/products`

`name` is the only required field. Returns **201** with the created product.

**The slug is generated for you** — from the supplied `slug` if there is one,
otherwise from `name`. Collisions get a numeric suffix, so a second
"Adson Tissue Forceps" becomes `adson-tissue-forceps-2`, then `-3`. You never
get a 409 from a duplicate slug on this route.

### `PUT /api/admin/products/:id`

Updates **any subset** of fields — a partial update, despite being a PUT.

The Visible and In Stock toggles in the panel are just this endpoint with a
one-field body:

```json
{ "isVisible": false }
```

| Code | When |
| --- | --- |
| 400 | Invalid id, a validation failure, or no updatable fields in the body |
| 404 | No product with that id |

Changing `slug` re-runs the uniqueness check while excluding the row being
edited — so re-saving a product without touching its slug does not append `-2`.

### `DELETE /api/admin/products/:id`

Permanent. There is no soft delete and no undo. Returns `{ "deleted": 12 }`, or
**404** if the id does not exist.

> For "take it off the site but keep the record", use
> `PUT { "isVisible": false }` instead. That is what the panel's hide toggle
> does, and it is reversible.

---

## Writable fields

The whitelist is `FIELDS` in
[`serializers.js`](../backend/src/serializers.js). **Anything not on this list
is silently ignored** — a client cannot set `id`, `created_at` or `updated_at`
by including them in the body.

| Field (camelCase or snake_case) | Type | Limit |
| --- | --- | --- |
| `name` | string | 255 |
| `description` | string | — |
| `category` | string | 100 |
| `price` | decimal | finite number, >= 0 |
| `imageUrl` | string | 500 |
| `isVisible` | boolean | |
| `inStock` | boolean | |
| `slug` | string | 255 |
| `sku` | string | 64 |
| `summary` | string | 500 |
| `unit` | string | 100 |
| `art` | string | 64 |
| `isFeatured` | boolean | |
| `specs` | array | `[{ "label": "...", "value": "..." }]` |
| `features` | array | `["..."]` |

Coercion rules that will surprise you otherwise:

- **`null` and `""` both store SQL NULL.** Clearing a price makes it "Price on
  request" — it does not store `0`.
- **Booleans are loose.** `true`, `"true"`, `1` and `"1"` are truthy; everything
  else, *including `"yes"`*, is stored as `0`.
- **`specs` and `features` must be arrays.** A string or an object is a 400, not
  a silent coercion.
- **Strings are trimmed** before the length check.
- Multiple validation failures are joined with `; ` into one `error` string.

---

## Status codes

| Code | Meaning |
| --- | --- |
| 200 | OK |
| 201 | Created (POST products only) |
| 400 | Validation — the message names the offending field |
| 401 | Missing, invalid or expired token. Expiry adds `"expired": true` so the panel can redirect to login instead of showing an error |
| 403 | A valid JWT whose `role` is not `admin` |
| 404 | No such route, or no such product |
| 409 | A UNIQUE constraint was violated (`ER_DUP_ENTRY`) |
| 429 | Login rate limit — carries `Retry-After` |
| 503 | MySQL unreachable |
| 500 | Anything else. The detail is logged server-side; the client gets "Something went wrong." |

Unhandled throws land in the error handler at the bottom of
[`index.js`](../backend/src/index.js), which maps known MySQL error codes and
returns a safe body for everything else. Stack traces are never sent to the
client.

---

## Security properties

Worth knowing before changing any of it:

- **Every query is parameterised.** `db.js` uses `pool.execute()` with bound
  values throughout — no string interpolation anywhere, so there is no SQL
  injection surface. The only interpolated fragments are column *names*, and
  those come from the hardcoded `FIELDS` whitelist, never from user input.
- **Mass assignment is impossible.** Only whitelisted fields are written, so a
  client cannot set `id`, `created_at` or `updated_at` by putting them in the
  body.
- **`is_visible` cannot leak.** The public serializer builds a fresh object
  rather than deleting keys from the row, so a new column is private by default
  until someone explicitly adds it to `toPublicProduct()`.
- **Passwords are bcrypt at cost 12.**
- **`JWT_SECRET` has no default.** `config.js` throws on startup if it is
  unset — the server cannot accidentally run with a predictable signing key.
  Every other variable has a dev default, so this is the one that stops boot.
- **Stack traces are never returned.** The error handler logs the detail and
  responds with a generic message.

Known weaknesses, both documented in
[architecture.md](architecture.md): the JWT lives in `localStorage`, and the
login rate limiter is in-memory.

---

## Trying it by hand

```bash
curl -s http://localhost:4000/api/health
```

Log in and list everything, hidden products included:

```bash
TOKEN=$(curl -s -X POST http://localhost:4000/api/admin/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"devpassword123\"}" | node -pe "JSON.parse(require('fs').readFileSync(0)).token")
curl -s http://localhost:4000/api/admin/products -H "Authorization: Bearer $TOKEN"
```

Hide a product, then watch it disappear from the public route:

```bash
curl -s -X PUT http://localhost:4000/api/admin/products/1 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "{\"isVisible\":false}"
curl -s http://localhost:4000/api/products | grep -c adson-tissue-forceps
```
