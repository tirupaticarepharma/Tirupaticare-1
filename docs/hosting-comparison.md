# Choosing where to host this

Written 2026-09-07, to decide between managed hosting and a single VPS.

**Verify every price before committing.** Hosting rates and free tiers change
constantly, and the numbers below are ranges from memory, not quotes. The
*structure* of the costs is the durable part; the digits are not.

### Assumptions I made

Correct me where these are wrong — some conclusions change if they are.

- **Traffic is low.** A local surgical supplier: roughly 500–5,000 visits a
  month, with real spikes only if you run ads. Every option here is
  comfortable at that level; none of this is a scaling problem.
- **This is a commercial site for a real business.** That matters more than it
  sounds — see the Vercel note below.
- **Inquiries arrive on WhatsApp, not the site.** So downtime costs you SEO
  and some visitors, not orders in flight. That makes an hour of downtime
  annoying rather than catastrophic, which genuinely widens your options.
- **You are comfortable on a Linux box.** You have been hands-on throughout
  this project. If that is wrong, Option A or C is the answer and the rest of
  this document is academic.

---

## The constraint that eliminates most "just use X" advice

**This app needs MySQL specifically.** Not "a database" — MySQL. It uses
`mysql2`, JSON columns, and `ON DUPLICATE KEY UPDATE`. That rules out a
surprising number of defaults:

- **Render's managed database is PostgreSQL only.** "Deploy the API on Render
  with its database" does not work here. You would need Render for the API and
  someone else for MySQL.
- **Supabase and Neon are Postgres.** Same problem.
- MySQL-compatible managed options include **Railway**, **Aiven**,
  **DigitalOcean**, **AWS RDS**, and **PlanetScale** (whose free tier is gone).

Porting to Postgres is not huge — the JSON columns and the upsert are the only
real work — but it is a code change, not a hosting choice. Don't let a host
push you into it by accident.

**And the API must be always-on.** The catalogue routes are `force-dynamic`, so
a sleeping API means a broken shop page, and Googlebot crawling during a cold
start can deindex your products. Free tiers that sleep are disqualified for the
API — though they are fine for the frontend.

---

## The three real options

### A — Vercel + Node host + managed MySQL

The default advice, and the most expensive.

**The catch nobody mentions:** Vercel's Hobby (free) tier **prohibits
commercial use**. A business selling surgical instruments is commercial. Doing
this properly means Vercel Pro, per seat, per month — which is likely to be the
single biggest line on your bill, for a site that gets a few thousand visits.

You are paying for Vercel's edge network and preview deployments. At your
traffic, on a catalogue that is `force-dynamic` and therefore **cannot be
edge-cached anyway**, you would be buying very little of what makes Vercel
worth it.

**Rough shape:** Vercel Pro + always-on API instance + managed MySQL.
Three vendors, three bills, three dashboards.

### B — One VPS, everything on it

Nginx in front, Next.js and Express behind it, MySQL on the same box.

At your traffic a **2 GB** VPS is comfortable (1 GB is too tight once MySQL and
two Node processes are resident). Hetzner, DigitalOcean, Contabo, Hostinger —
all fine. Roughly the price of a coffee or two a month, an order of magnitude
under Option A.

**Two real advantages beyond cost:**

- **CORS disappears entirely.** The frontend calls the API over localhost;
  nothing is cross-origin. One of the three traps in this project stops
  existing.
- **One box to reason about.** No wondering which of three vendors is having
  the incident.

**The cost is real though**, and it is not the server — it is that *you* are
the on-call engineer, and you must solve backups yourself. See below.

### C — One Node host for both + managed MySQL ← the one I would look at first

The option that usually gets skipped, and I think it is the sweet spot here.

Both halves of this app are plain Node processes. Since the site **cannot be
statically exported anyway**, there is no technical reason the frontend must
live on Vercel. Run both on the same platform (Railway, Fly, a small App
Platform), point them at a **managed** MySQL, and you get:

- No VPS to patch, no nginx, no certbot — TLS and restarts are the platform's
  problem
- **Managed database backups**, which is the argument that actually matters
- No Vercel commercial-tier question
- Two vendors instead of three, and meaningfully cheaper than A

You give up Vercel's preview-deployment-per-PR, which is a genuine loss if you
iterate a lot, and worth little if you deploy occasionally.

---

## What breaks at 3am, and who fixes it

| | **A / C (managed)** | **B (VPS)** |
| --- | --- | --- |
| Process crashes | Platform restarts it | PM2 restarts it — set this up, or you are down until you notice |
| Machine dies | Platform reschedules | You rebuild. Have you tested that? |
| Disk fills with logs | Not your problem | **The most common way a small VPS dies.** Configure logrotate on day one |
| MySQL OOM | Not your problem | Real risk on 1 GB; fine on 2 GB at this traffic |
| TLS cert expires | Handled | certbot auto-renews — until the renewal hook silently fails |
| Platform-wide incident | **You can only wait.** No amount of skill helps | Does not apply |
| Who is paged? | Their on-call, for infra | **Nobody.** You find out when a customer mentions it |

The honest asymmetry: managed hosting removes the failures you *can* fix and
adds one you *cannot*. A VPS gives you total control over a larger set of
things that can go wrong.

For this site specifically — a catalogue whose inquiries arrive by WhatsApp —
neither profile is dangerous. If it were taking payments, I would not be so
relaxed.

---

## Backups, which is where self-hosting actually fails

**This deserves more weight than cost.** Two facts about this app:

1. **The admin panel has a permanent delete and no undo.** No soft delete, no
   audit log, no "recently deleted".
2. **A non-technical store manager will be using it.**

So the realistic disaster is not the server exploding. It is someone deleting
the wrong product on a Tuesday and nobody noticing for a week.

| | **A / C (managed MySQL)** | **B (VPS)** |
| --- | --- | --- |
| Automated backups | Included | **You build it.** `mysqldump` on cron |
| Point-in-time restore | Usually included | Only between your dumps |
| Where backups live | Separate infrastructure | **On the same box, unless you deliberately ship them off** |
| Tested restore | Their job | Yours — and untested backups are not backups |

That third row is where self-hosting genuinely fails in practice. A `mysqldump`
cron writing to `/var/backups` on the same VPS is worth nothing the moment the
VPS is the thing that died. Off-box — S3, B2, another provider — or it does not
count.

**If you choose B, treat off-box automated backups as part of the deploy, not a
follow-up.** The database is 24 rows today and trivially re-seedable; it will
not stay that way once it holds the real catalogue someone typed in by hand.

---

## Effort to change later

**Low, in every direction — this is genuinely good news.** The app is already
configured entirely through environment variables, the two halves install and
deploy independently, and nothing is tied to a platform primitive. There is no
vendor lock-in to speak of.

Moving between any of these is roughly a day, and the work is the same each
time: point DNS, set env vars, run `db:migrate` once, restore the data.

Two things that will bite you during any migration:

- **`NEXT_PUBLIC_API_URL` is baked in at build time.** Changing the API's
  address means a **rebuild**, not a restart.
- **`npm run db:migrate` needs the whole repo**, because `migrate.js` reaches
  into `../database/`. If you deploy only `backend/`, run migrations from your
  laptop with `DB_*` pointed at production.

So you can start cheap and move if it hurts. **Do not agonise over this
decision** — it is reversible, and much less sticky than it feels.

---

## My recommendation

**Option C**, unless you actively want to run a server.

The reasoning is entirely about backups, not cost or uptime. Given a permanent
delete button, a non-technical user, and a catalogue that will represent real
hours of data entry, a managed database earns its price on the day someone
deletes the wrong thing. Options A and C both give you that; B makes it
homework you will probably defer.

**Choose B instead if** you enjoy running Linux and will genuinely set up
off-box backups in the first week. It is a legitimate, much cheaper answer, and
at this traffic the technical risk is low. Just be honest about whether the
backup cron will actually get written.

**Choose A only if** preview-deployments-per-PR are worth the Pro tier to you.
At this traffic, on a `force-dynamic` site, you are paying for a CDN you cannot
use.

---

## Not a hosting decision, but blocking launch

Two items still sit between this and a public site, both tracked in
[deployment.md](deployment.md):

- **Secrets to rotate.** `JWT_SECRET`, `ADMIN_PASSWORD` and the MySQL password
  all appeared in a chat transcript — treat them as public. (§2)
- **The fabricated trust signals** — ISO 13485, 25+ years, 500+ hospitals, and
  three invented doctors. Deliberately deferred for now; still true that they
  become public claims the moment the site is reachable. (§1)
