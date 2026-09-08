/**
 * Seeds the sample catalogue and the admin account.
 *
 *   npm run seed              insert products that are not already there
 *   npm run seed -- --fresh   wipe the products table first
 *
 * Safe to re-run: products are matched on `slug`, the admin on `username`.
 */
import bcrypt from "bcryptjs";
import { config } from "./config.js";
import { pool, query, assertConnection } from "./db.js";
import { seedProducts } from "../../database/seed/products.js";

const fresh = process.argv.includes("--fresh");

async function seedAdminAccount() {
  const { username, password } = config.seedAdmin;

  if (!password) {
    console.log(
      "! ADMIN_PASSWORD is not set in backend/.env - skipping admin account.",
    );
    return;
  }
  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  }

  const hash = await bcrypt.hash(password, 12);

  // Re-running the seed resets the password to whatever is in .env.
  await query(
    `INSERT INTO admins (username, password_hash) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    [username, hash],
  );

  console.log(`✓ admin account "${username}" ready`);
}

async function seedCatalogue() {
  if (fresh) {
    await query("DELETE FROM products");
    console.log("✓ cleared products table");
  }

  let inserted = 0;
  let skipped = 0;

  for (const product of seedProducts) {
    const existing = await query("SELECT id FROM products WHERE slug = ?", [
      product.slug,
    ]);

    if (existing.length > 0) {
      skipped += 1;
      continue;
    }

    await query(
      `INSERT INTO products
         (name, description, category, price, image_url, is_visible, in_stock,
          slug, sku, summary, unit, art, is_featured, specs, features)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.name,
        product.description,
        product.category,
        product.price,
        product.image_url,
        product.is_visible,
        product.in_stock,
        product.slug,
        product.sku,
        product.summary,
        product.unit,
        product.art,
        product.is_featured,
        JSON.stringify(product.specs ?? []),
        JSON.stringify(product.features ?? []),
      ],
    );
    inserted += 1;
  }

  console.log(
    `✓ catalogue seeded - ${inserted} inserted, ${skipped} already present`,
  );
}

async function main() {
  await assertConnection();
  await seedAdminAccount();
  await seedCatalogue();
  await pool.end();
  console.log("\nSeed complete. Start the API with: npm run dev");
}

main().catch(async (error) => {
  console.error("\n✗ Seed failed:", error.message);
  console.error(
    "\nHave you run `npm run migrate` first? Is MySQL running and reachable?",
  );
  await pool.end().catch(() => {});
  process.exit(1);
});
