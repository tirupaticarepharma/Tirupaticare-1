/**
 * Creates the database if it does not exist, then applies every .sql file in
 * database/schema/ in filename order.
 *
 *   npm run migrate
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import { config } from "./config.js";

const sqlDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "database", "schema");

async function main() {
  // Connect without selecting a database so we can CREATE DATABASE.
  const root = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    multipleStatements: true,
  });

  await root.query(
    `CREATE DATABASE IF NOT EXISTS \`${config.db.name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  console.log(`✓ database "${config.db.name}" ready`);

  await root.changeUser({ database: config.db.name });

  const files = fs
    .readdirSync(sqlDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(sqlDir, file), "utf8");
    await root.query(sql);
    console.log(`✓ applied ${file}`);
  }

  await root.end();
  console.log("\nMigrations complete. Next: npm run seed");
}

main().catch((error) => {
  console.error("\n✗ Migration failed:", error.message);
  console.error(
    "\nCheck that MySQL is running and that DB_HOST / DB_USER / DB_PASSWORD in backend/.env are correct.",
  );
  process.exit(1);
});
