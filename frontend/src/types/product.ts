/**
 * The product shape returned by the API (see backend/src/serializers.js).
 * The database is the source of truth for the catalogue - edit products in
 * the admin panel at /admin/products, not in code.
 */

export type ProductSpec = { label: string; value: string };

export type Product = {
  id: number;
  /** Public URL segment: /products/<slug> */
  slug: string;
  name: string;
  sku: string | null;
  /** Matches a `Category.id` from src/data/categories.ts */
  category: string | null;
  summary: string | null;
  description: string | null;
  /** null means "price on request" */
  price: number | null;
  /**
   * An absolute URL, a path in the frontend's /public, or a path on the API
   * (`/api/products/12/image`) for a photo uploaded through the admin panel.
   * Always pass it through `resolveImageUrl` before putting it in an <img>.
   */
  imageUrl: string | null;
  unit: string | null;
  /** Placeholder illustration key - see components/product/ProductArt.tsx */
  art: string | null;
  specs: ProductSpec[];
  features: string[];
  inStock: boolean;
  isFeatured: boolean;
};

/** Everything above plus the fields only the admin panel sees. */
export type AdminProduct = Product & {
  isVisible: boolean;
  /**
   * True when `imageUrl` is the API's own image endpoint rather than an address
   * the manager typed. The edit form uses it to keep the Image URL box empty
   * instead of showing an internal path.
   */
  hasUploadedImage?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
