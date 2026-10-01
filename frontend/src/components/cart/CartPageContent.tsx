"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductArt } from "@/components/product/ProductArt";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import {
  InquiryMessagePreview,
  SendInquiryButton,
} from "@/components/cart/SendInquiryButton";
import {
  ArrowRightIcon,
  CartIcon,
  FileTextIcon,
  PhoneIcon,
  ShieldCheckIcon,
  TrashIcon,
  ZapIcon,
} from "@/components/ui/Icons";

export function CartPageContent() {
  const { items, itemCount, hydrated, setQuantity, removeItem, clearCart } =
    useCart();

  /* Client hydration skeleton */
  if (!hydrated) {
    return (
      <Container className="py-8 sm:py-12">
        <span className="sr-only">Loading procurement list</span>
        <div
          aria-hidden="true"
          className="grid animate-pulse gap-8 lg:grid-cols-[1fr_22rem] lg:gap-10"
        >
          <div className="flex flex-col gap-5">
            {[0, 1].map((row) => (
              <div key={row} className="flex gap-4 p-4 rounded-2xl border border-hairline bg-white">
                <div className="h-24 w-24 shrink-0 rounded-xl bg-slate-100 sm:h-28 sm:w-28" />
                <div className="flex flex-1 flex-col gap-2.5 py-1">
                  <div className="h-4 w-2/3 rounded bg-slate-100" />
                  <div className="h-3 w-1/3 rounded bg-slate-100" />
                  <div className="mt-auto h-10 w-32 rounded-xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-72 rounded-2xl bg-slate-100" />
        </div>
      </Container>
    );
  }

  /* Empty state */
  if (items.length === 0) {
    return (
      <Container className="py-16 sm:py-24">
        <div className="mx-auto flex max-w-md flex-col items-center gap-5 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-50 text-3xl text-brand-700 shadow-xs">
            <CartIcon />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight">
              Your inquiry list is empty
            </h1>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-ink-500 font-normal">
              Select surgical instruments, implants, or hospital supplies from our catalogue to generate a formal WhatsApp quotation.
            </p>
          </div>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button href="/products" size="lg">
              Browse Catalogue
              <ArrowRightIcon className="text-base" />
            </Button>
            <Button href={`tel:${siteConfig.phoneHref}`} variant="outline" size="lg">
              <PhoneIcon className="text-[1.05em]" />
              Call Sales Desk
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-hairline">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Procurement Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight">
            Surgical Inquiry Sheet
          </h1>
        </div>

        <p className="text-xs sm:text-sm text-ink-500">
          <span className="font-bold text-ink-900">{itemCount}</span> items &bull;{" "}
          <span className="font-bold text-ink-900">{items.length}</span> unique products
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start lg:gap-10">
        {/* ------------------------------------------------------ line items */}
        <div>
          <div className="flex items-center justify-between gap-4 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-400">
              Selected Instruments &amp; Supplies
            </span>
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-semibold text-ink-400 transition-colors hover:text-red-600"
            >
              Clear entire list
            </button>
          </div>

          <ul className="flex flex-col gap-3">
            {items.map((line) => {
              return (
                <li
                  key={line.slug}
                  className="flex gap-4 p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-colors hover:border-brand-200"
                >
                  <Link
                    href={`/products/${line.slug}`}
                    className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-surface-muted"
                  >
                    <ProductArt
                      product={{
                        name: line.name,
                        art: line.art,
                        imageUrl: line.imageUrl,
                      }}
                      size="thumb"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-2.5">
                    <div>
                      <Link
                        href={`/products/${line.slug}`}
                        className="font-bold text-ink-900 text-sm sm:text-base transition-colors hover:text-brand-700 leading-snug"
                      >
                        {line.name}
                      </Link>
                      <div className="mt-1 flex items-center gap-2 text-xs text-ink-500">
                        {line.sku ? (
                          <span className="font-mono font-semibold text-brand-700">
                            {line.sku}
                          </span>
                        ) : null}
                        {line.sku && line.unit ? <span>&bull;</span> : null}
                        <span>{line.unit ?? "Per piece"}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-hairline/60">
                      <QuantityStepper
                        size="sm"
                        value={line.quantity}
                        onChange={(next) => setQuantity(line.slug, next)}
                        label={`Quantity for ${line.name}`}
                      />

                      <button
                        type="button"
                        onClick={() => removeItem(line.slug)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <TrashIcon className="text-sm" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 transition-colors hover:text-brand-900"
            >
              <span>&larr; Add more products from catalogue</span>
            </Link>
          </div>
        </div>

        {/* --------------------------------------------------------- summary sidebar */}
        <aside className="lg:sticky lg:top-32">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-hairline">
              <FileTextIcon className="text-lg text-brand-700" />
              <h2 className="text-base font-bold text-ink-900">
                Procurement Summary
              </h2>
            </div>

            <dl className="mt-4 flex flex-col gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500 font-medium">Distinct Products</dt>
                <dd className="font-bold text-ink-900 tabular-nums">
                  {items.length}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500 font-medium">Total Quantity</dt>
                <dd className="font-bold text-ink-900 tabular-nums">
                  {itemCount} units
                </dd>
              </div>
              <div className="flex justify-between gap-4 pt-2 border-t border-hairline">
                <dt className="text-ink-500 font-medium">Pricing Status</dt>
                <dd className="font-bold text-brand-800">Verified via WhatsApp</dd>
              </div>
            </dl>

            <div className="mt-4 rounded-xl bg-brand-50/80 p-3 text-xs leading-relaxed text-brand-800 border border-brand-200/60">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <ShieldCheckIcon className="text-sm text-brand-600" />
                <span>Institutional Quotation Process</span>
              </div>
              No payment is processed online. When you send this RFQ, our sales desk verifies warehouse stock, applies institutional rate tiers, and replies with an official quotation.
            </div>

            <div className="mt-5 flex flex-col gap-2.5">
              <SendInquiryButton size="lg" />
              <Button
                href={`tel:${siteConfig.phoneHref}`}
                variant="outline"
                size="lg"
                fullWidth
              >
                <PhoneIcon className="text-[1.05em]" />
                Call Sales Desk ({siteConfig.phoneDisplay})
              </Button>
            </div>

            <div className="mt-4">
              <InquiryMessagePreview />
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}
