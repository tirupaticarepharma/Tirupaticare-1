import Link from "next/link";
import type { Product } from "@/types/product";
import { getCategory } from "@/data/categories";
import { formatPrice } from "@/lib/api";
import { productInquiryMessage, whatsappLink } from "@/lib/whatsapp";
import { ProductArt } from "@/components/product/ProductArt";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { WhatsAppIcon } from "@/components/ui/Icons";

/** Product tile used on the shop grid, the home page and related products. */
export function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.category);
  const price = formatPrice(product.price);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/8">
      {/* ------------------------------------------------------- artwork */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-4/3 overflow-hidden"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div
          className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.04] ${
            product.inStock ? "" : "opacity-55 saturate-50"
          }`}
        >
          <ProductArt product={product} size="card" />
        </div>

        {!product.inStock ? (
          <span className="absolute top-3 left-3 rounded-full bg-ink-900/85 px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide text-white uppercase">
            Out of stock
          </span>
        ) : product.isFeatured ? (
          <span className="absolute top-3 left-3 rounded-full bg-accent-50 px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide text-accent-500 uppercase ring-1 ring-accent-500/20">
            Popular
          </span>
        ) : null}
      </Link>

      {/* --------------------------------------------------------- body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {category ? (
          <Link
            href={`/products?category=${category.id}`}
            className="text-[0.6875rem] font-bold tracking-wider text-brand-600 uppercase transition-colors hover:text-brand-800"
          >
            {category.name}
          </Link>
        ) : null}

        <h3 className="mt-1.5 text-[0.9375rem] leading-snug font-bold text-ink-900 sm:text-base">
          <Link
            href={`/products/${product.slug}`}
            className="transition-colors hover:text-brand-700"
          >
            {product.name}
          </Link>
        </h3>

        {product.summary ? (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-500">
            {product.summary}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-300">
          {product.sku ? <span className="font-medium">SKU {product.sku}</span> : null}
          {product.sku && product.unit ? <span aria-hidden="true">&middot;</span> : null}
          {product.unit ? <span>{product.unit}</span> : null}
        </div>

        {/* ------------------------------------------------------ actions */}
        <div className="mt-4 flex items-center gap-2 pt-1">
          <div className="flex-1">
            <AddToCartButton product={product} size="sm" fullWidth />
          </div>

          <a
            href={whatsappLink(
              productInquiryMessage(product.name, product.sku ?? undefined),
            )}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ask about ${product.name} on WhatsApp`}
            title="Ask on WhatsApp"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-whatsapp text-white transition-colors hover:bg-whatsapp-dark"
          >
            <WhatsAppIcon className="text-lg" />
          </a>
        </div>

        <p className="mt-2.5 text-[0.6875rem] text-ink-300">
          {price ? (
            <>
              <span className="font-bold text-ink-700">{price}</span> &mdash;
              confirmed over WhatsApp
            </>
          ) : (
            <>Price on request &mdash; confirmed over WhatsApp</>
          )}
        </p>
      </div>
    </article>
  );
}
