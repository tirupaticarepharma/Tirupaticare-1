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
import { decodeImageDataUrl, InvalidImageError } from "../images.js";

export const adminRouter = Router();

/*
 * image_data is never selected: the panel only needs to know *whether* there is
 * a photo, and pulling the blob into every list response would cost megabytes.
 */
const ALL_COLUMNS = `id, slug, name, sku, category, summary, description,
  price, image_url, unit, art, specs, features, is_visible, in_stock,
  is_featured, created_at, updated_at,
  image_mime_type IS NOT NULL AS has_image`;

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

/** Overwrites the column if mapBodyToColumns already produced it, else adds it. */
function setColumn(columns, values, column, value) {
  const index = columns.indexOf(column);
  if (index >= 0) {
    values[index] = value;
    return;
  }
  columns.push(column);
  values.push(value);
}

/**
 * Folds the image half of a request body into the column/value lists.
 *
 * A product has an uploaded photo *or* an externally hosted one, never both,
 * so whichever the manager just supplied clears the other. That is what keeps
 * `image_url` and `image_data` from disagreeing about which photo is current,
 * and stops a replaced upload sitting in the table forever.
 *
 *   imageBase64: "data:image/png;base64,..."   replace the upload, drop the URL
 *   imageBase64: null                          remove the upload
 *   imageBase64 absent                         leave the upload alone
 *   imageUrl: "https://..."                    use the URL, drop the upload
 *
 * "Leave it alone" is the case that matters most: the panel's Visible and In
 * Stock toggles send a one-field body, and they must not wipe a photo.
 *
 * Throws InvalidImageError for a file the manager should replace.
 */
function applyImageColumns(body, columns, values) {
  const upload = body?.imageBase64;

  if (typeof upload === "string" && upload !== "") {
    const { buffer, mimeType } = decodeImageDataUrl(upload);
    setColumn(columns, values, "image_data", buffer);
    setColumn(columns, values, "image_mime_type", mimeType);
    setColumn(columns, values, "image_url", null);
    return;
  }

  // Explicit null is the panel's "Remove image" button.
  if (body != null && "imageBase64" in body && upload == null) {
    setColumn(columns, values, "image_data", null);
    setColumn(columns, values, "image_mime_type", null);
    return;
  }

  const urlIndex = columns.indexOf("image_url");
  if (urlIndex >= 0 && values[urlIndex] !== null) {
    setColumn(columns, values, "image_data", null);
    setColumn(columns, values, "image_mime_type", null);
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

    try {
      applyImageColumns(req.body, columns, values);
    } catch (imageError) {
      if (imageError instanceof InvalidImageError) {
        return res.status(400).json({ error: imageError.message });
      }
      throw imageError;
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

    try {
      applyImageColumns(req.body, columns, values);
    } catch (imageError) {
      if (imageError instanceof InvalidImageError) {
        return res.status(400).json({ error: imageError.message });
      }
      throw imageError;
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
