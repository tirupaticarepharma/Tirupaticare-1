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
  PhoneIcon,
  TrashIcon,
} from "@/components/ui/Icons";

export function CartPageContent() {
  const { items, itemCount, hydrated, setQuantity, removeItem, clearCart } =
    useCart();

  /* Nothing is rendered from localStorage until it has been read on the
     client, so the server and first client render always agree. */
  if (!hydrated) {
    return (
      <Container className="py-8 sm:py-12">
        <span className="sr-only">Loading your inquiry list</span>
        <div
          aria-hidden="true"
          className="grid animate-pulse gap-8 lg:grid-cols-[1fr_22rem] lg:gap-10"
        >
          <div className="flex flex-col gap-5">
            {[0, 1].map((row) => (
              <div key={row} className="flex gap-4">
                <div className="h-24 w-24 shrink-0 rounded-xl bg-surface-muted sm:h-28 sm:w-28" />
                <div className="flex flex-1 flex-col gap-2.5 py-1">
                  <div className="h-4 w-2/3 rounded bg-surface-muted" />
                  <div className="h-3 w-1/3 rounded bg-surface-muted" />
                  <div className="mt-auto h-10 w-32 rounded-xl bg-surface-muted" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-72 rounded-2xl bg-surface-muted" />
        </div>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-16 sm:py-24">
        <div className="mx-auto flex max-w-md flex-col items-center gap-5 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-3xl text-brand-600">
            <CartIcon />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink-900">
              Your inquiry list is empty
            </h1>
            <p className="mt-2 leading-relaxed text-ink-500">
              Add the products you need and we&rsquo;ll turn the list into a
              WhatsApp message, ready for you to send.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/products" size="lg">
              Browse Products
              <ArrowRightIcon className="text-[1.1em]" />
            </Button>
            <Button href={`tel:${siteConfig.phoneHref}`} variant="outline" size="lg">
              <PhoneIcon className="text-[1.05em]" />
              Call Now
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-10">
        {/* ------------------------------------------------------ line items */}
        <div>
          <div className="flex items-center justify-between gap-4 border-b border-hairline pb-4">
            <p className="text-sm text-ink-500">
              <span className="font-semibold text-ink-900">{itemCount}</span>{" "}
              item{itemCount === 1 ? "" : "s"} across{" "}
              <span className="font-semibold text-ink-900">{items.length}</span>{" "}
              product{items.length === 1 ? "" : "s"}
            </p>
            <button
              type="button"
              onClick={clearCart}
              className="text-sm font-medium text-ink-300 transition-colors hover:text-red-600"
            >
              Clear list
            </button>
          </div>

          <ul className="flex flex-col divide-y divide-hairline">
            {items.map((line) => {
              return (
                <li key={line.slug} className="flex gap-4 py-5">
                  <Link
                    href={`/products/${line.slug}`}
                    className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-hairline sm:h-28 sm:w-28"
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

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                    <div>
                      <Link
                        href={`/products/${line.slug}`}
                        className="font-bold text-ink-900 transition-colors hover:text-brand-700"
                      >
                        {line.name}
                      </Link>
                      <p className="mt-1 text-sm text-ink-500">
                        {line.sku ? `SKU ${line.sku}` : null}
                        {line.sku && line.unit ? " · " : null}
                        {line.unit}
                      </p>
                      <p className="mt-1 text-xs text-ink-300">
                        Price on request
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <QuantityStepper
                        value={line.quantity}
                        onChange={(next) => setQuantity(line.slug, next)}
                        label={`Quantity for ${line.name}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(line.slug)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <TrashIcon className="text-base" />
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="pt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900"
            >
              Continue browsing
              <ArrowRightIcon className="text-[1.05em]" />
            </Link>
          </div>
        </div>

        {/* --------------------------------------------------------- summary */}
        <aside className="lg:sticky lg:top-32">
          <div className="rounded-2xl border border-hairline bg-surface-muted/60 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-ink-900">Inquiry summary</h2>

            <dl className="mt-4 flex flex-col gap-2.5 border-y border-hairline py-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Products</dt>
                <dd className="font-semibold text-ink-900 tabular-nums">
                  {items.length}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Total quantity</dt>
                <dd className="font-semibold text-ink-900 tabular-nums">
                  {itemCount}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Pricing</dt>
                <dd className="font-semibold text-ink-900">On request</dd>
              </div>
            </dl>

            <p className="mt-4 text-xs leading-relaxed text-ink-500">
              This is an inquiry, not an order. There is no payment step on this
              site &mdash; we&rsquo;ll confirm pricing &amp; availability over
              WhatsApp before anything is dispatched.
            </p>

            <div className="mt-4 flex flex-col gap-2.5">
              <SendInquiryButton />
              <Button
                href={`tel:${siteConfig.phoneHref}`}
                variant="outline"
                size="lg"
                fullWidth
              >
                <PhoneIcon className="text-[1.05em]" />
                Call {siteConfig.phoneDisplay}
              </Button>
            </div>

            <div className="mt-4">
              <InquiryMessagePreview />
            </div>
          </div>

          <p className="mt-4 px-1 text-xs leading-relaxed text-ink-300">
            Your list is saved in this browser only. It is not sent anywhere
            until you press the WhatsApp button.
          </p>
        </aside>
      </div>
    </Container>
  );
}
