"use client";

/**
 * ============================================================================
 *  ADMIN API CLIENT  (browser only)
 * ============================================================================
 *  Talks to the protected /api/admin/* endpoints from the admin panel.
 *
 *  The JWT is kept in localStorage. That is the simpler of the two options in
 *  the spec and is fine for a single store-manager account, but note the
 *  trade-off: a token in localStorage is readable by any script running on
 *  the page, so an XSS bug would expose it. For a hardened deployment, switch
 *  the login route to set an httpOnly, Secure, SameSite=Strict cookie and
 *  drop the Authorization header below.
 * ============================================================================
 */

import type { AdminProduct } from "@/types/product";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
).replace(/\/$/, "");

const TOKEN_KEY = "surgical-store-admin-token";

/* --------------------------------------------------------------- token */

export function getToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* storage blocked - the session lasts until the tab is closed */
  }
}

export function clearToken(): void {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* nothing to do */
  }
}

/** Thrown when the token is missing, invalid or expired. */
export class AuthError extends Error {
  constructor(message = "Your session has expired. Please sign in again.") {
    super(message);
    this.name = "AuthError";
  }
}

/* ---------------------------------------------------------------- fetch */

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(init.headers ?? {}),
      },
    });
  } catch {
    throw new Error(
      `Could not reach the API at ${API_BASE_URL}. Is the server running?`,
    );
  }

  if (response.status === 401) {
    clearToken();
    const body = await response.json().catch(() => ({}));
    throw new AuthError(body.error);
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error ?? `Request failed (${response.status})`);
  }

  return body as T;
}

/* ----------------------------------------------------------- endpoints */

export async function login(
  username: string,
  password: string,
): Promise<{ token: string; admin: { id: number; username: string } }> {
  const result = await request<{
    token: string;
    admin: { id: number; username: string };
  }>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  setToken(result.token);
  return result;
}

/** Cheap check that a stored token is still valid, used on page load. */
export async function verifySession(): Promise<{ username: string }> {
  const result = await request<{ admin: { username: string } }>("/api/admin/me");
  return result.admin;
}

export async function listProducts(): Promise<AdminProduct[]> {
  const result = await request<{ products: AdminProduct[] }>(
    "/api/admin/products",
  );
  return result.products;
}

export type ProductPayload = Partial<
  Pick<
    AdminProduct,
    | "name"
    | "description"
    | "category"
    | "price"
    | "imageUrl"
    | "isVisible"
    | "inStock"
    | "isFeatured"
    | "sku"
    | "summary"
    | "unit"
    | "art"
    | "slug"
    | "specs"
    | "features"
  > & {
    /**
     * A photo to store in the database, as a base64 data URL from FileReader.
     *
     *   string    replace the stored photo (and clear any Image URL)
     *   null      remove the stored photo
     *   omitted   leave the stored photo alone
     *
     * Omitting it matters: the list view's Visible and In Stock toggles send a
     * one-field payload and must not wipe a product's photo.
     */
    imageBase64?: string | null;
  }
>;

export async function createProduct(
  payload: ProductPayload,
): Promise<AdminProduct> {
  const result = await request<{ product: AdminProduct }>(
    "/api/admin/products",
    { method: "POST", body: JSON.stringify(payload) },
  );
  return result.product;
}

export async function updateProduct(
  id: number,
  payload: ProductPayload,
): Promise<AdminProduct> {
  const result = await request<{ product: AdminProduct }>(
    `/api/admin/products/${id}`,
    { method: "PUT", body: JSON.stringify(payload) },
  );
  return result.product;
}

export async function deleteProduct(id: number): Promise<void> {
  await request(`/api/admin/products/${id}`, { method: "DELETE" });
}
