import "dotenv/config";

/**
 * Every environment variable the API reads, in one place, with sane dev
 * defaults. See backend/.env.example for what each one does.
 */
function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(
      `Missing required environment variable ${name}. Copy backend/.env.example to backend/.env and fill it in.`,
    );
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 4000),

  corsOrigins: (process.env.CORS_ORIGIN ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),

  db: {
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    name: process.env.DB_NAME ?? "surgical_store",
  },

  jwt: {
    // Deliberately has no default - an unset secret must stop the server.
    secret: required("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
  },

  docs: {
    /**
     * The /docs page lists every admin endpoint, so it is on in development
     * and off in production unless you opt in with ENABLE_API_DOCS=true.
     */
    enabled: (() => {
      // An empty value counts as unset - "ENABLE_API_DOCS=" in a .env file
      // should mean "use the default", not "off".
      const flag = (process.env.ENABLE_API_DOCS ?? "").trim();
      if (flag === "") return process.env.NODE_ENV !== "production";
      return flag.toLowerCase() === "true";
    })(),
  },

  seedAdmin: {
    username: process.env.ADMIN_USERNAME ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "",
  },
};
