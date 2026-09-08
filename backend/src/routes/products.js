import { Router } from "express";
import { query } from "../db.js";
import { toPublicProduct } from "../serializers.js";

/**
 * PUBLIC catalogue routes. These only ever return rows with is_visible = 1,
 * so hiding a product in the admin panel removes it from the website
 * immediately without deleting anything.
 */
export const publicRouter = Router();

const VISIBLE_COLUMNS = `id, slug, name, sku, category, summary, description,
  price, image_url, unit, art, specs, features, in_stock, is_featured`;

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
