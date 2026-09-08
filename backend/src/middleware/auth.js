import jwt from "jsonwebtoken";
import { config } from "../config.js";

/**
 * Issues the admin token. Deliberately carries the bare minimum: who it is,
 * and that it is an admin token.
 */
export function signAdminToken(admin) {
  return jwt.sign(
    { sub: String(admin.id), username: admin.username, role: "admin" },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn },
  );
}

/**
 * Guards every /api/admin route except login. Reads the token from the
 * `Authorization: Bearer <token>` header.
 */
export function requireAdmin(req, res, next) {
  const header = req.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ error: "Missing bearer token. Sign in at /admin/login." });
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret);
    if (payload.role !== "admin") {
      return res.status(403).json({ error: "Not an admin token." });
    }
    req.admin = payload;
    return next();
  } catch (error) {
    const expired = error.name === "TokenExpiredError";
    return res.status(401).json({
      error: expired ? "Session expired. Please sign in again." : "Invalid token.",
      expired,
    });
  }
}

/**
 * Very small in-memory throttle on the login route so the single admin
 * password cannot be brute forced from one host. Resets on restart; put a
 * real rate limiter (or fail2ban / WAF rule) in front of this in production.
 */
const attempts = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 10;

export function loginRateLimit(req, res, next) {
  const key = req.ip ?? "unknown";
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now - record.first > WINDOW_MS) {
    attempts.set(key, { count: 1, first: now });
    return next();
  }

  record.count += 1;

  if (record.count > MAX_ATTEMPTS) {
    const retryIn = Math.ceil((WINDOW_MS - (now - record.first)) / 1000);
    res.set("Retry-After", String(retryIn));
    return res
      .status(429)
      .json({ error: `Too many sign-in attempts. Try again in ${retryIn}s.` });
  }

  return next();
}

/** Called after a successful login so a legitimate admin is not locked out. */
export function clearLoginAttempts(req) {
  attempts.delete(req.ip ?? "unknown");
}
