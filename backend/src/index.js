import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { config } from "./config.js";
import { assertConnection } from "./db.js";
import { publicRouter } from "./routes/products.js";
import { adminRouter } from "./routes/admin.js";
import { openapiSpec, swaggerUiOptions } from "./openapi.js";
import { MAX_IMAGE_BYTES } from "./images.js";

const app = express();

app.disable("x-powered-by");

/*
 * Two body limits rather than one.
 *
 * A product photo is posted as base64 inside the JSON body, which inflates it
 * by 4/3, so the create/update routes need room for a MAX_IMAGE_BYTES image
 * plus the rest of the form. Every other route - including the unauthenticated
 * login endpoint - keeps the small limit, so nobody can make the API buffer
 * megabytes without signing in first.
 */
const parseSmallJson = express.json({ limit: "1mb" });
const parseUploadJson = express.json({
  limit: Math.ceil((MAX_IMAGE_BYTES * 4) / 3) + 64 * 1024,
});

app.use((req, res, next) => {
  const isProductWrite =
    (req.method === "POST" || req.method === "PUT") &&
    req.path.startsWith("/api/admin/products");

  return isProductWrite
    ? parseUploadJson(req, res, next)
    : parseSmallJson(req, res, next);
});

/* Only the configured site origins may call this API from a browser. */
app.use(
  cors({
    origin(origin, callback) {
      // Same-origin / curl / server-side fetch send no Origin header.
      if (!origin || config.corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
  }),
);

/* ------------------------------------------------------------- routes --- */

app.get("/api/health", async (_req, res) => {
  try {
    await assertConnection();
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(503).json({ status: "degraded", database: error.message });
  }
});

/** Root index, so hitting the API host tells you where to go. */
app.get("/", (_req, res) => {
  res.json({
    name: "Surgical Store API",
    docs: config.docs.enabled ? "/docs" : "disabled",
    health: "/api/health",
    catalogue: "/api/products",
  });
});

app.use("/api", publicRouter);
app.use("/api/admin", adminRouter);

/* ---------------------------------------------------------------- docs --- */

/**
 * Interactive API documentation at /docs, and the raw spec at
 * /docs/openapi.json for Postman, codegen or a diff in review.
 *
 * Same origin as the API, so the "Try it out" buttons work without CORS.
 * Off in production by default - the page lists every admin endpoint.
 */
if (config.docs.enabled) {
  app.get("/docs/openapi.json", (_req, res) => res.json(openapiSpec));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec, swaggerUiOptions));
} else {
  app.use("/docs", (_req, res) =>
    res.status(404).json({
      error: "API documentation is disabled. Set ENABLE_API_DOCS=true to turn it on.",
    }),
  );
}

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

/* Anything thrown in a route lands here. Log the detail, return a safe body. */
app.use((error, _req, res, _next) => {
  console.error("[api]", error);

  if (error?.code === "ER_DUP_ENTRY") {
    return res
      .status(409)
      .json({ error: "That value is already used by another product." });
  }
  if (error?.code === "ECONNREFUSED" || error?.code === "ER_ACCESS_DENIED_ERROR") {
    return res
      .status(503)
      .json({ error: "Database unavailable. Check MySQL and backend/.env." });
  }

  /* Thrown by express.json() before any route sees the request. Without these
   * two, an oversized photo or a malformed body reads as "Something went
   * wrong", which sends you looking in the wrong place. */
  if (error?.type === "entity.too.large") {
    return res.status(413).json({
      error: `That request is too large. Product photos must be ${Math.round(
        MAX_IMAGE_BYTES / (1024 * 1024),
      )}MB or smaller.`,
    });
  }
  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({ error: "The request body is not valid JSON." });
  }

  /* MySQL refuses a write bigger than max_allowed_packet - 4MB on MySQL 5.7,
   * which a large photo can exceed even though this API accepted it. */
  if (
    error?.code === "ER_NET_PACKET_TOO_LARGE" ||
    error?.code === "ER_TOO_LONG_STRING" ||
    /max_allowed_packet/i.test(error?.message ?? "")
  ) {
    return res.status(413).json({
      error:
        "The database rejected that image for being too large. Use a smaller file, or raise MySQL's max_allowed_packet.",
    });
  }

  res.status(500).json({ error: "Something went wrong." });
});

/* -------------------------------------------------------------- start --- */

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
  console.log(`Allowed origins: ${config.corsOrigins.join(", ")}`);
  if (config.docs.enabled) {
    console.log(`API docs at http://localhost:${config.port}/docs`);
  }

  assertConnection()
    .then(() => console.log(`Connected to MySQL database "${config.db.name}"`))
    .catch((error) => {
      console.warn("\n! Could not reach MySQL:", error.message);
      console.warn(
        "  The API is up but every query will fail until the database is reachable.",
      );
      console.warn("  Check backend/.env, then run: npm run migrate && npm run seed\n");
    });
});
