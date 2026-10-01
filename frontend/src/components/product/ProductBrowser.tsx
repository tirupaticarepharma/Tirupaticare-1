"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { categories } from "@/data/categories";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { Container } from "@/components/ui/Container";
import { WhatsAppCta, CallCta } from "@/components/ui/ContactCtas";
import { CloseIcon, PackageIcon, SearchIcon, ZapIcon } from "@/components/ui/Icons";

type Filter = string;

const validCategoryIds = new Set(categories.map((category) => category.id));

const categoryAliases: Record<string, string> = {
  surgical: "surgical-instruments",
  surgicals: "surgical-instruments",
  instruments: "surgical-instruments",
  "surgical-instrument": "surgical-instruments",
  disposable: "disposables",
  consumables: "disposables",
  diagnostic: "diagnostic-equipment",
  diagnostics: "diagnostic-equipment",
  equipment: "diagnostic-equipment",
  orthopedic: "orthopedic-implants",
  ortho: "orthopedic-implants",
  implants: "orthopedic-implants",
  furniture: "hospital-furniture",
  hospital: "hospital-furniture",
  safety: "ppe",
  masks: "ppe",
};

function resolveCategory(param: string | null): string {
  if (!param) return "all";
  const cleaned = param.trim().toLowerCase();
  if (validCategoryIds.has(cleaned)) return cleaned;
  if (categoryAliases[cleaned]) return categoryAliases[cleaned];
  return "all";
}

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
  const initialFilter: Filter = resolveCategory(categoryParam);

  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [query, setQuery] = useState("");

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
    { id: "all", label: "All Instruments & Equipment", count: products.length },
    ...categories.map((category) => ({
      id: category.id,
      label: category.name,
      count: products.filter((product) => product.category === category.id).length,
    })),
  ];

  /* Error state */
  if (error) {
    return (
      <Container className="py-12 sm:py-16">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-surface-muted/60 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <PackageIcon className="text-2xl" />
          </div>
          <h2 className="text-lg font-bold text-ink-900">
            Catalogue Synchronization in Progress
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-ink-500">
            Our live inventory database is currently syncing. You can reach our sales desk directly via WhatsApp or phone for immediate stock checks and quotations.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <WhatsAppCta label="Check Inventory on WhatsApp" />
            <CallCta label="Call Sales Desk" />
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      {/* ------------------------------------------------------- header filter bar */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between pb-6 border-b border-hairline">
        {/* Categories strip */}
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0 lg:pb-0">
          {filters.map((entry) => {
            const active = filter === entry.id;
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => selectCategory(entry.id)}
                aria-pressed={active}
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 select-none active:scale-95 ${
                  active
                    ? "border-brand-700 bg-brand-700 text-white shadow-xs"
                    : "border-slate-200/90 bg-white text-ink-700 hover:border-brand-300 hover:bg-brand-50/50"
                }`}
              >
                <span>{entry.label}</span>
                <span
                  className={`rounded-md px-1.5 py-0.2 text-[0.6875rem] font-bold tabular-nums ${
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-ink-500"
                  }`}
                >
                  {entry.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative shrink-0 lg:w-80">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-base text-ink-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search instruments, SKU, implants..."
            aria-label="Search products"
            className="h-11 w-full rounded-xl border border-slate-200/90 bg-white pr-10 pl-10 text-sm outline-none transition-all placeholder:text-ink-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-2xs"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-400 transition-colors hover:text-ink-800"
            >
              <CloseIcon className="text-base" />
            </button>
          ) : null}
        </div>
      </div>

      {/* ---------------------------------------------------------- active stats count */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs sm:text-sm text-ink-500">
          Showing{" "}
          <span className="font-bold text-ink-900">
            {visibleProducts.length}
          </span>{" "}
          of {products.length} products
          {filter !== "all"
            ? ` in ${categories.find((c) => c.id === filter)?.name}`
            : ""}
        </p>

        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-brand-700 font-semibold bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200/50">
          <ZapIcon className="text-xs" />
          Instant WhatsApp RFQ Available
        </span>
      </div>

      {/* ----------------------------------------------------------- product grid */}
      {visibleProducts.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-surface-muted/60 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <PackageIcon className="text-2xl" />
          </div>
          <h2 className="text-lg font-bold text-ink-900">
            {products.length === 0
              ? "No products currently listed"
              : "No products match that search"}
          </h2>
          <p className="max-w-md text-sm text-ink-500 leading-relaxed">
            We stock over 2,000 reference surgical lines and can source specialized instruments to order. Transmit your required product name or specification directly to our desk on WhatsApp.
          </p>
          <WhatsAppCta label="Inquire on WhatsApp" />
        </div>
      )}
    </Container>
  );
}
