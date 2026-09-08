/**
 * Translation layer between the MySQL rows (snake_case) and the JSON the
 * frontend consumes (camelCase). Keeping it in one file means a column rename
 * only has to be handled here.
 */

/** JSON columns come back parsed on MySQL 5.7+, but tolerate a string too. */
function parseJson(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/** Shape sent to the public site. Never includes is_visible. */
export function toPublicProduct(row) {
  return {
    id: row.id,
    slug: row.slug ?? String(row.id),
    name: row.name,
    sku: row.sku ?? null,
    category: row.category ?? null,
    summary: row.summary ?? null,
    description: row.description ?? null,
    price: row.price == null ? null : Number(row.price),
    imageUrl: row.image_url ?? null,
    unit: row.unit ?? null,
    art: row.art ?? null,
    specs: parseJson(row.specs, []),
    features: parseJson(row.features, []),
    inStock: Boolean(row.in_stock),
    isFeatured: Boolean(row.is_featured),
  };
}

/** Shape sent to the admin panel - adds visibility and timestamps. */
export function toAdminProduct(row) {
  return {
    ...toPublicProduct(row),
    isVisible: Boolean(row.is_visible),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** "Adson Forceps 12cm" -> "adson-forceps-12cm" */
export function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

/**
 * Maps an incoming request body onto database columns.
 *
 * Only whitelisted fields are accepted, so a client cannot set `id` or
 * `created_at`. Accepts camelCase (imageUrl) or snake_case (image_url).
 * Returns { columns, values, errors }.
 */
const FIELDS = [
  { column: "name", keys: ["name"], type: "string", maxLength: 255 },
  { column: "description", keys: ["description"], type: "string" },
  { column: "category", keys: ["category"], type: "string", maxLength: 100 },
  { column: "price", keys: ["price"], type: "decimal" },
  { column: "image_url", keys: ["imageUrl", "image_url"], type: "string", maxLength: 500 },
  { column: "is_visible", keys: ["isVisible", "is_visible"], type: "boolean" },
  { column: "in_stock", keys: ["inStock", "in_stock"], type: "boolean" },
  { column: "slug", keys: ["slug"], type: "string", maxLength: 255 },
  { column: "sku", keys: ["sku"], type: "string", maxLength: 64 },
  { column: "summary", keys: ["summary"], type: "string", maxLength: 500 },
  { column: "unit", keys: ["unit"], type: "string", maxLength: 100 },
  { column: "art", keys: ["art"], type: "string", maxLength: 64 },
  { column: "is_featured", keys: ["isFeatured", "is_featured"], type: "boolean" },
  { column: "specs", keys: ["specs"], type: "json" },
  { column: "features", keys: ["features"], type: "json" },
];

export function mapBodyToColumns(body = {}) {
  const columns = [];
  const values = [];
  const errors = [];

  for (const field of FIELDS) {
    const key = field.keys.find((candidate) => candidate in body);
    if (key === undefined) continue;

    const raw = body[key];

    if (raw === null || raw === "") {
      columns.push(field.column);
      values.push(null);
      continue;
    }

    switch (field.type) {
      case "string": {
        const text = String(raw).trim();
        if (field.maxLength && text.length > field.maxLength) {
          errors.push(`${key} must be ${field.maxLength} characters or fewer`);
          break;
        }
        columns.push(field.column);
        values.push(text);
        break;
      }
      case "decimal": {
        const amount = Number(raw);
        if (!Number.isFinite(amount) || amount < 0) {
          errors.push(`${key} must be a positive number`);
          break;
        }
        columns.push(field.column);
        values.push(amount);
        break;
      }
      case "boolean": {
        columns.push(field.column);
        values.push(raw === true || raw === "true" || raw === 1 || raw === "1" ? 1 : 0);
        break;
      }
      case "json": {
        if (!Array.isArray(raw)) {
          errors.push(`${key} must be an array`);
          break;
        }
        columns.push(field.column);
        values.push(JSON.stringify(raw));
        break;
      }
      default:
        break;
    }
  }

  return { columns, values, errors };
}
