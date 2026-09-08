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

/**
 * The visible catalogue. Never throws: if the API or the database is down the
 * page still renders, with `error` set so it can say so instead of pretending
 * the shop is empty.
 */
export async function getCatalogue(): Promise<CatalogueResult> {
  try {
    const data = await fetchJson<{ products: Product[] }>("/api/products");
    return { products: data.products ?? [], error: null };
  } catch (error) {
    // Next.js signals "this route must be dynamic" by throwing. That is
    // control flow, not a failure - let it through untouched.
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      String((error as { digest?: unknown }).digest).startsWith("DYNAMIC_SERVER_USAGE")
    ) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[catalogue] ${message}`);
    return {
      products: [],
      error:
        "The product catalogue could not be loaded. Check that the API server is running.",
    };
  }
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
    return data.product ?? null;
  } catch {
    return null;
  }
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
