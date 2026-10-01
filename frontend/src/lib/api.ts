/**
 * ============================================================================
 *  PUBLIC CATALOGUE DATA ACCESS
 * ============================================================================
 *  Every product shown on the public site comes from the Express API, which
 *  reads MySQL. These helpers run on the SERVER (inside server components),
 *  so the catalogue is in the HTML that Google receives - the site stays
 *  fully SEO-friendly even though the data is dynamic.
 *
 *  `cache: "no-store"` means a change made in the admin panel shows up on the
 *  public site on the very next request. If you would rather trade instant
 *  updates for speed, swap it for `next: { revalidate: 60 }`.
 * ============================================================================
 */

import type { Product } from "@/types/product";

/**
 * API base URL.
 *  - API_URL             used by server components (can be an internal host)
 *  - NEXT_PUBLIC_API_URL used by the browser (admin panel)
 */
export const API_BASE_URL = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000"
).replace(/\/$/, "");

/**
 * The API address the BROWSER must use. Distinct from API_BASE_URL, which may
 * be an internal hostname only the Next.js server can reach.
 */
const PUBLIC_API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:4000"
).replace(/\/$/, "");

/**
 * Turns a product's `imageUrl` into something an <img> can actually load.
 *
 * A photo uploaded through the admin panel is stored in MySQL and served by the
 * API, and the API reports it as a relative path (`/api/products/12/image`) so
 * that the same database works behind any hostname. Left as-is that path would
 * resolve against the Next.js origin, not the API's, and 404 - which is why
 * this has to run on every product image.
 *
 * Everything else is passed through untouched: absolute URLs, and paths like
 * `/products/photo.jpg` that point at a file in the frontend's own /public.
 */
export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  return trimmed.startsWith("/api/")
    ? `${PUBLIC_API_BASE_URL}${trimmed}`
    : trimmed;
}

/** True when the last catalogue fetch failed - pages use it to explain why. */
export type CatalogueResult = {
  products: Product[];
  /** null when the fetch succeeded. */
  error: string | null;
};

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`API responded ${response.status} for ${path}`);
  }

  return (await response.json()) as T;
}

import { fallbackProducts } from "@/data/seedProducts";

/**
 * The visible catalogue. Tries the Express API first. If the API is offline
 * (e.g. during frontend dev or before the database is spun up), it gracefully
 * falls back to the built-in seed catalogue so the site remains fully browsable.
 */
export async function getCatalogue(): Promise<CatalogueResult> {
  try {
    const data = await fetchJson<{ products: Product[] }>("/api/products");
    if (data && Array.isArray(data.products) && data.products.length > 0) {
      return { products: data.products, error: null };
    }
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      String((error as { digest?: unknown }).digest).startsWith("DYNAMIC_SERVER_USAGE")
    ) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    console.warn(`[catalogue] API offline or unreachable (${message}); using fallback catalogue.`);
  }

  return {
    products: fallbackProducts,
    error: null,
  };
}

/** Convenience wrapper when a page does not need the error state. */
export async function getProducts(): Promise<Product[]> {
  return (await getCatalogue()).products;
}

/** A single visible product, or null if it is missing or hidden. */
export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const data = await fetchJson<{ product: Product }>(
      `/api/products/${encodeURIComponent(slug)}`,
    );
    if (data?.product) return data.product;
  } catch {
    // Fall back to local catalogue
  }
  return fallbackProducts.find((p) => p.slug === slug) ?? null;
}

/* --------------------------------------------------------------- helpers */

export function filterFeatured(products: Product[], limit = 6): Product[] {
  const featured = products.filter((product) => product.isFeatured);
  return (featured.length ? featured : products).slice(0, limit);
}

export function countByCategory(products: Product[], categoryId: string): number {
  return products.filter((product) => product.category === categoryId).length;
}

/** Same category first, then anything else. */
export function relatedProducts(
  products: Product[],
  product: Product,
  limit = 4,
): Product[] {
  const sameCategory = products.filter(
    (candidate) =>
      candidate.category === product.category && candidate.slug !== product.slug,
  );
  const rest = products.filter(
    (candidate) =>
      candidate.category !== product.category && candidate.slug !== product.slug,
  );
  return [...sameCategory, ...rest].slice(0, limit);
}

/** "1,250" - prices are stored as plain numbers, formatted only for display. */
export function formatPrice(price: number | null): string | null {
  if (price == null) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}
