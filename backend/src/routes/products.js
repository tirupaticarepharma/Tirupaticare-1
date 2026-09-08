import { Router } from "express";
import { query } from "../db.js";
import { toPublicProduct } from "../serializers.js";
import { ALLOWED_IMAGE_MIME_TYPES } from "../images.js";

/**
 * PUBLIC catalogue routes. These only ever return rows with is_visible = 1,
 * so hiding a product in the admin panel removes it from the website
 * immediately without deleting anything.
 */
export const publicRouter = Router();

/*
 * `image_mime_type IS NOT NULL AS has_image` and `updated_at` are what the
 * serializer needs to build the URL of an uploaded photo. Note that image_data
 * itself is never selected here - a blob per row would make every catalogue
 * response megabytes long.
 */
const VISIBLE_COLUMNS = `id, slug, name, sku, category, summary, description,
  price, image_url, unit, art, specs, features, in_stock, is_featured,
  updated_at, image_mime_type IS NOT NULL AS has_image`;

/** GET /api/products - the whole visible catalogue. */
publicRouter.get("/products", async (req, res, next) => {
  try {
    const { category } = req.query;

    const rows = category
      ? await query(
          `SELECT ${VISIBLE_COLUMNS} FROM products
           WHERE is_visible = 1 AND category = ?
           ORDER BY is_featured DESC, id ASC`,
          [String(category)],
        )
      : await query(
          `SELECT ${VISIBLE_COLUMNS} FROM products
           WHERE is_visible = 1
           ORDER BY id ASC`,
        );

    res.json({ products: rows.map(toPublicProduct) });
  } catch (error) {
    next(error);
  }
});

/** GET /api/products/:slug - one product for the detail page. */
publicRouter.get("/products/:slug", async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT ${VISIBLE_COLUMNS} FROM products
       WHERE is_visible = 1 AND (slug = ? OR id = ?)
       LIMIT 1`,
      [req.params.slug, Number(req.params.slug) || 0],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product: toPublicProduct(rows[0]) });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/products/:id/image - the photo uploaded for a product, straight out
 * of the products row.
 *
 * The serializer points `imageUrl` here with a `?v=<updated_at>` cache buster,
 * which is what makes the long Cache-Control below safe: re-uploading a photo
 * changes the URL, so nobody is served the old one.
 *
 * Unlike every other route in this file it does NOT filter on is_visible. The
 * admin panel renders its thumbnails with a plain <img>, which cannot carry a
 * bearer token, so hidden products have to be served here too. A hidden
 * product is still absent from the catalogue, the home page, the sitemap and
 * its own detail page; only its photo stays fetchable by whoever can guess the
 * row id.
 */
publicRouter.get("/products/:id/image", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: "Invalid product id." });
    }

    const rows = await query(
      `SELECT image_data, image_mime_type, updated_at FROM products
       WHERE id = ?`,
      [id],
    );

    const row = rows[0];
    if (!row?.image_data) {
      return res.status(404).json({ error: "Image not found." });
    }

    /*
     * Never echo back a stored type we would not accept today. Uploads are
     * sniffed from the file's own bytes before being stored, so this only
     * matters for rows written by an older build - and an image the browser
     * refuses to render is a much better outcome than one it decides to
     * execute.
     */
    const mimeType = ALLOWED_IMAGE_MIME_TYPES.includes(row.image_mime_type)
      ? row.image_mime_type
      : "application/octet-stream";

    res.set({
      "Content-Type": mimeType,
      "Content-Length": row.image_data.length,
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
      // Without the cache buster the URL is not versioned, so only cache it
      // briefly - long enough to survive one page's worth of requests.
      "Cache-Control": req.query.v
        ? "public, max-age=31536000, immutable"
        : "public, max-age=300",
    });

    if (row.updated_at) {
      res.set("Last-Modified", new Date(row.updated_at).toUTCString());
    }

    res.send(row.image_data);
  } catch (error) {
    next(error);
  }
});
