import Link from "next/link";
import type { Product } from "@/types/product";
import { getCategory } from "@/data/categories";
import { formatPrice } from "@/lib/api";
import { productInquiryMessage, whatsappLink } from "@/lib/whatsapp";
import { ProductArt } from "@/components/product/ProductArt";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { WhatsAppIcon } from "@/components/ui/Icons";

/**
 * Modern clinical product card used on the shop grid, home page, and related products.
 * Structured for scannability, institutional trust, and 1-tap WhatsApp consultation.
 */
export function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.category);
  const price = formatPrice(product.price);

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-950/6">
      <div>
        {/* ------------------------------------------------------- artwork container */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-4/3 overflow-hidden bg-surface-muted"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div
            className={`h-full w-full transition-transform duration-500 ease-out group-hover:scale-105 ${
              product.inStock ? "" : "opacity-55 saturate-50"
            }`}
          >
            <ProductArt product={product} size="card" />
          </div>

          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {!product.inStock ? (
              <span className="rounded-full bg-slate-900/85 px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide text-white uppercase backdrop-blur-xs">
                Out of Stock
              </span>
            ) : product.isFeatured ? (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide text-amber-700 uppercase ring-1 ring-amber-500/25 shadow-2xs backdrop-blur-xs">
                Popular
              </span>
            ) : null}
          </div>

          {/* Quick SKU tag */}
          {product.sku ? (
            <span className="absolute bottom-2.5 right-2.5 rounded-md bg-white/90 px-2 py-0.5 font-mono text-[0.6875rem] font-bold text-ink-700 shadow-2xs backdrop-blur-xs border border-slate-200/60">
              {product.sku}
            </span>
          ) : null}
        </Link>

        {/* --------------------------------------------------------- body */}
        <div className="flex flex-col p-4 sm:p-5">
          {category ? (
            <Link
              href={`/products?category=${category.id}`}
              className="text-[0.6875rem] font-bold tracking-wider text-brand-600 uppercase transition-colors hover:text-brand-800"
            >
              {category.name}
            </Link>
          ) : null}

          <h3 className="mt-1 text-sm sm:text-base font-bold leading-snug text-ink-900 line-clamp-1">
            <Link
              href={`/products/${product.slug}`}
              className="transition-colors hover:text-brand-700"
            >
              {product.name}
            </Link>
          </h3>

          {product.summary ? (
            <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-ink-500 min-h-[2.5rem]">
              {product.summary}
            </p>
          ) : (
            <div className="mt-1.5 min-h-[2.5rem]" />
          )}

          {/* Unit & stock info */}
          <div className="mt-3 flex items-center justify-between text-xs text-ink-500 pt-2 border-t border-hairline/70">
            <span className="font-medium text-ink-600">
              {product.unit ?? "Standard Pack"}
            </span>

            {product.inStock ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 text-[0.6875rem]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                In Stock
              </span>
            ) : (
              <span className="font-semibold text-ink-400 text-[0.6875rem]">
                Made to order
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------ footer & actions */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
        <div className="flex items-center justify-between gap-2 pb-3">
          <div>
            <span className="block text-[0.6875rem] uppercase font-bold text-ink-400">
              Estimated Rate
            </span>
            <span className="text-sm font-extrabold text-ink-900">
              {price ? price : "On Request"}
            </span>
          </div>

          <span className="text-[0.6875rem] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/50">
            Verified Stock
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <AddToCartButton product={product} size="sm" fullWidth />
          </div>

          <a
            href={whatsappLink(
              productInquiryMessage(product.name, product.sku ?? undefined),
            )}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Inquire about ${product.name} on WhatsApp`}
            title="Direct WhatsApp Quote"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-b from-whatsapp to-whatsapp-dark text-white shadow-2xs transition-all duration-200 hover:from-whatsapp-dark hover:to-whatsapp-deep hover:scale-105 active:scale-95"
          >
            <WhatsAppIcon className="text-lg" />
          </a>
        </div>
      </div>
    </article>
  );
}
