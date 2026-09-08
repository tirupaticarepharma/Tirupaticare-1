"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { categories } from "@/data/categories";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { Container } from "@/components/ui/Container";
import { WhatsAppCta, CallCta } from "@/components/ui/ContactCtas";
import { CloseIcon, SearchIcon } from "@/components/ui/Icons";

type Filter = string;

const validCategoryIds = new Set(categories.map((category) => category.id));

/**
 * Shop grid with category filtering and a text search.
 *
 * Products are fetched on the server (so they are in the HTML for SEO) and
 * handed to this client component, which only filters what it is given.
 *
 * The active category is mirrored into the URL (`/products?category=ppe`) so
 * category links from the home page and footer land on the right filter and
 * the page stays shareable.
 */
export function ProductBrowser({
  products,
  error = null,
}: {
  products: Product[];
  error?: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category");
  const initialFilter: Filter =
    categoryParam && validCategoryIds.has(categoryParam) ? categoryParam : "all";

  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [query, setQuery] = useState("");

  /* Follow along if the URL changes underneath us (footer links, back button). */
  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  function selectCategory(next: Filter) {
    setFilter(next);
    const url = next === "all" ? pathname : `${pathname}?category=${next}`;
    router.replace(url, { scroll: false });
  }

  const visibleProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return products.filter((product) => {
      if (filter !== "all" && product.category !== filter) return false;
      if (!needle) return true;

      return [product.name, product.summary, product.sku, product.description]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(needle));
    });
  }, [products, filter, query]);

  const filters = [
    { id: "all", label: "All Products", count: products.length },
    ...categories.map((category) => ({
      id: category.id,
      label: category.name,
      count: products.filter((product) => product.category === category.id).length,
    })),
  ];

  /* ------------------------------------------------- API / database down */
  if (error) {
    return (
      <Container className="py-12 sm:py-16">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-hairline bg-surface-muted/60 px-6 py-16 text-center">
          <h2 className="text-lg font-bold text-ink-900">
            The catalogue is temporarily unavailable
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-ink-500">
            We couldn&rsquo;t load the product list just now. Message or call us
            and we&rsquo;ll check stock for you directly.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <WhatsAppCta label="Ask us on WhatsApp" />
            <CallCta />
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-12">
      {/* ------------------------------------------------------- controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0 lg:pb-0">
          {filters.map((entry) => {
            const active = filter === entry.id;
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => selectCategory(entry.id)}
                aria-pressed={active}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "border-brand-700 bg-brand-700 text-white"
                    : "border-hairline bg-white text-ink-700 hover:border-brand-300 hover:bg-brand-50"
                }`}
              >
                {entry.label}
                <span
                  className={`text-xs tabular-nums ${
                    active ? "text-brand-100" : "text-ink-300"
                  }`}
                >
                  {entry.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative shrink-0 lg:w-72">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-base text-ink-300" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products or SKU..."
            aria-label="Search products"
            className="h-11 w-full rounded-xl border border-hairline bg-white pr-10 pl-10 text-sm outline-none transition-colors placeholder:text-ink-300 focus:border-brand-400"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-300 transition-colors hover:text-ink-700"
            >
              <CloseIcon className="text-base" />
            </button>
          ) : null}
        </div>
      </div>

      {/* ---------------------------------------------------------- count */}
      <p className="mt-6 text-sm text-ink-500">
        Showing{" "}
        <span className="font-semibold text-ink-900">
          {visibleProducts.length}
        </span>{" "}
        of {products.length} products
        {filter !== "all"
          ? ` in ${categories.find((c) => c.id === filter)?.name}`
          : ""}
      </p>

      {/* ----------------------------------------------------------- grid */}
      {visibleProducts.length > 0 ? (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-hairline bg-surface-muted/60 px-6 py-16 text-center">
          <h2 className="text-lg font-bold text-ink-900">
            {products.length === 0
              ? "No products published yet"
              : "No products match that search"}
          </h2>
          <p className="max-w-md text-sm text-ink-500">
            We stock over 2,000 lines and only a selection is listed here. Send
            us the item you need on WhatsApp and we&rsquo;ll check availability
            for you.
          </p>
          <WhatsAppCta label="Ask us on WhatsApp" />
        </div>
      )}
    </Container>
  );
}
