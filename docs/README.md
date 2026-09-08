# Documentation

Start with the [root README](../README.md) if you just want to run the thing.

| Document | Read it when |
| --- | --- |
| **[handoff.md](handoff.md)** | You are picking the project up cold. State, decisions, what is missing, what was actually verified. **Start here.** |
| **[architecture.md](architecture.md)** | You need the cross-cutting picture — how the three parts talk, why the catalogue is server-rendered, where the boundaries are |
| **[api.md](api.md)** | You are calling or changing the API. Every endpoint, field, status code and coercion rule |
| **[hosting-comparison.md](hosting-comparison.md)** | You are deciding **where** to host. Cost, 3am failure modes, backups, reversibility |
| **[deployment.md](deployment.md)** | You have decided, and are putting it on the internet. Go-live runbook, in order |
| **[admin-guide.md](admin-guide.md)** | For the **store manager**. Non-technical: adding products, hide vs. out-of-stock, what customers see |

Each part of the codebase also documents its own internals, next to the code:

- [`frontend/README.md`](../frontend/README.md) — Next.js app, routes, the two fetch paths
- [`backend/README.md`](../backend/README.md) — Express API, file map, configuration
- [`database/README.md`](../database/README.md) — schema, migrations, seeding

---

### Where things are documented, once

Documentation rots when the same fact lives in two places. Each of these has
exactly one home — link to it rather than restating it:

| Fact | Lives in |
| --- | --- |
| How to run it locally | [root README](../README.md) |
| Endpoint shapes, status codes, validation | [api.md](api.md) |
| Why it is built this way | [architecture.md](architecture.md) + handoff §5 |
| Schema and columns | [database/README.md](../database/README.md) |
| What is unfinished | [handoff.md](handoff.md) §6 |
| Go-live steps | [deployment.md](deployment.md) |
