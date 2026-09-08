# database/ — the data layer

MySQL 8. Two tables, no foreign keys. This directory holds the **definitions**;
the code that connects to MySQL lives in [`../backend`](../backend).

```
database/
├── docker-compose.yml   the local dev container
├── schema/
│   └── 001_schema.sql   applied in filename order by `npm run db:migrate`
└── seed/
    └── products.js      the 24 sample products (first-run data only)
```

## Running it

```bash
npm run db:up
```

Then, once, to create the tables and load the sample catalogue:

```bash
npm run db:migrate && npm run db:seed
```

Check it is alive at any time:

```bash
curl http://localhost:4000/api/health
```

## Schema

**`products`** — the catalogue. The originally-specified columns
(`name`, `description`, `category`, `price`, `image_url`, `is_visible`,
`in_stock`) plus additive **nullable** ones (`slug`, `sku`, `summary`, `unit`,
`art`, `is_featured`, `specs`, `features`) that make the product pages richer.
Everything renders with those NULL, so they are safe to drop.

Two indexes matter: `idx_products_visible` and `idx_products_category` — every
public query filters on `is_visible = 1`, optionally narrowed by `category`.

`specs` and `features` are **JSON** columns (`[{label, value}]` and `[string]`).
They come back parsed from MySQL 8, but `backend/src/serializers.js` handles
them defensively in case they are ever stored as text.

**`admins`** — one row. `username` + bcrypt `password_hash`. No self-service
password change; the password is reset by editing `backend/.env` and re-running
the seed.

## Things to know

- **The database is authoritative for products, not `seed/products.js`.** The
  seed is first-run data. Once the store manager edits the catalogue through
  the admin panel, this file is only history. Re-running the seed matches on
  `slug` and will not clobber their edits — but `npm run db:seed -- --fresh`
  wipes the products table first.
- **`npm run db:seed` resets the admin password** to whatever `ADMIN_PASSWORD`
  is in `backend/.env` (`ON DUPLICATE KEY UPDATE`).
- **Migrations are apply-only.** `001_schema.sql` is `CREATE TABLE IF NOT
  EXISTS`; there is no down-migration and no version tracking. Add
  `002_*.sql`, `003_*.sql` and so on — they run in filename order every time,
  so each must be re-runnable.
- **Connection settings live in `backend/.env`**, not here — `DB_HOST`,
  `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

## Migrating off the old hand-made container

Earlier this project used a bare `docker run` with **no restart policy**, which
is why the database kept vanishing after reboots. If that container is still
around, swap it for the compose one — this **deletes the old data**, so re-seed
afterwards:

```bash
docker rm -f surgical-mysql && npm run db:up && npm run db:migrate && npm run db:seed
```
