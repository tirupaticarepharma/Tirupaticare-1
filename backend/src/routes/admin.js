import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db.js";
import {
  clearLoginAttempts,
  loginRateLimit,
  requireAdmin,
  signAdminToken,
} from "../middleware/auth.js";
import {
  mapBodyToColumns,
  slugify,
  toAdminProduct,
} from "../serializers.js";

export const adminRouter = Router();

const ALL_COLUMNS = `id, slug, name, sku, category, summary, description,
  price, image_url, unit, art, specs, features, is_visible, in_stock,
  is_featured, created_at, updated_at`;

/* ---------------------------------------------------------------- auth --- */

/** POST /api/admin/login */
adminRouter.post("/login", loginRateLimit, async (req, res, next) => {
  try {
    const username = String(req.body?.username ?? "").trim();
    const password = String(req.body?.password ?? "");

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    const rows = await query(
      "SELECT id, username, password_hash FROM admins WHERE username = ? LIMIT 1",
      [username],
    );

    const admin = rows[0];

    // Compare against a dummy hash when the user does not exist so that a
    // wrong username and a wrong password take the same amount of time.
    const hash =
      admin?.password_hash ??
      "$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY.zzz";

    const ok = await bcrypt.compare(password, hash);

    if (!admin || !ok) {
      return res.status(401).json({ error: "Incorrect username or password." });
    }

    clearLoginAttempts(req);

    res.json({
      token: signAdminToken(admin),
      admin: { id: admin.id, username: admin.username },
    });
  } catch (error) {
    next(error);
  }
});

/** GET /api/admin/me - lets the panel check a stored token is still valid. */
adminRouter.get("/me", requireAdmin, (req, res) => {
  res.json({ admin: { id: req.admin.sub, username: req.admin.username } });
});

/* ------------------------------------------------------------ products --- */

/** GET /api/admin/products - everything, visible or not. */
adminRouter.get("/products", requireAdmin, async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT ${ALL_COLUMNS} FROM products ORDER BY id ASC`,
    );
    res.json({ products: rows.map(toAdminProduct) });
  } catch (error) {
    next(error);
  }
});

/** Ensures the slug is unique, appending -2, -3 ... when it is not. */
async function uniqueSlug(base, excludeId = null) {
  const root = slugify(base) || `product-${Date.now()}`;
  let candidate = root;
  let suffix = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const clash = await query(
      "SELECT id FROM products WHERE slug = ? AND id <> ? LIMIT 1",
      [candidate, excludeId ?? 0],
    );
    if (clash.length === 0) return candidate;
    suffix += 1;
    candidate = `${root}-${suffix}`;
  }
}

/** POST /api/admin/products - create. */
adminRouter.post("/products", requireAdmin, async (req, res, next) => {
  try {
    const name = String(req.body?.name ?? "").trim();
    if (!name) {
      return res.status(400).json({ error: "A product name is required." });
    }

    const { columns, values, errors } = mapBodyToColumns(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join("; ") });
    }

    // Always store a slug, generated from the name when none was supplied.
    const slugIndex = columns.indexOf("slug");
    const requestedSlug =
      slugIndex >= 0 && values[slugIndex] ? values[slugIndex] : name;
    const slug = await uniqueSlug(requestedSlug);

    if (slugIndex >= 0) {
      values[slugIndex] = slug;
    } else {
      columns.push("slug");
      values.push(slug);
    }

    const placeholders = columns.map(() => "?").join(", ");
    const result = await query(
      `INSERT INTO products (${columns.join(", ")}) VALUES (${placeholders})`,
      values,
    );

    const rows = await query(
      `SELECT ${ALL_COLUMNS} FROM products WHERE id = ?`,
      [result.insertId],
    );

    res.status(201).json({ product: toAdminProduct(rows[0]) });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/products/:id - update any subset of fields.
 * The Visible and In Stock toggles in the panel are just this endpoint with a
 * one-field body, e.g. { "isVisible": false }.
 */
adminRouter.put("/products/:id", requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: "Invalid product id." });
    }

    const existing = await query("SELECT id FROM products WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    const { columns, values, errors } = mapBodyToColumns(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join("; ") });
    }
    if (columns.length === 0) {
      return res.status(400).json({ error: "No updatable fields supplied." });
    }

    const slugIndex = columns.indexOf("slug");
    if (slugIndex >= 0) {
      values[slugIndex] = await uniqueSlug(values[slugIndex] ?? "", id);
    }

    const assignments = columns.map((column) => `${column} = ?`).join(", ");
    await query(`UPDATE products SET ${assignments} WHERE id = ?`, [
      ...values,
      id,
    ]);

    const rows = await query(
      `SELECT ${ALL_COLUMNS} FROM products WHERE id = ?`,
      [id],
    );

    res.json({ product: toAdminProduct(rows[0]) });
  } catch (error) {
    next(error);
  }
});

/** DELETE /api/admin/products/:id - permanent. */
adminRouter.delete("/products/:id", requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: "Invalid product id." });
    }

    const result = await query("DELETE FROM products WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json({ deleted: id });
  } catch (error) {
    next(error);
  }
});
