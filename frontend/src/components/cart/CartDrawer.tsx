"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";
import { ProductArt } from "@/components/product/ProductArt";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { SendInquiryButton } from "@/components/cart/SendInquiryButton";
import { Button } from "@/components/ui/Button";
import {
  ArrowRightIcon,
  CartIcon,
  CloseIcon,
  PhoneIcon,
  TrashIcon,
} from "@/components/ui/Icons";

/** Slide-out inquiry list. Mounted once in the root layout. */
export function CartDrawer() {
  const {
    items,
    itemCount,
    isDrawerOpen,
    closeDrawer,
    setQuantity,
    removeItem,
    clearCart,
  } = useCart();

  /* Escape closes the drawer. */
  useEffect(() => {
    if (!isDrawerOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeDrawer();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  return (
    <div
      className={`fixed inset-0 z-50 ${isDrawerOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isDrawerOpen}
    >
      {/* Scrim */}
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 bg-ink-900/45 backdrop-blur-[2px] transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your inquiry list"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ------------------------------------------------------- header */}
        <header className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
              <CartIcon className="text-brand-700" />
              Your Inquiry List
            </h2>
            <p className="mt-0.5 text-xs text-ink-500">
              {itemCount === 0
                ? "No items yet"
                : `${itemCount} item${itemCount === 1 ? "" : "s"} · ${items.length} product${items.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close inquiry list"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-surface-muted hover:text-ink-900"
          >
            <CloseIcon className="text-lg" />
          </button>
        </header>

        {/* -------------------------------------------------------- items */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-2xl text-brand-600">
                <CartIcon />
              </div>
              <div>
                <p className="font-semibold text-ink-900">
                  Your inquiry list is empty
                </p>
                <p className="mt-1 text-sm text-ink-500">
                  Add products and we&rsquo;ll turn them into a WhatsApp message
                  for you.
                </p>
              </div>
              <Button href="/products" variant="primary" onClick={closeDrawer}>
                Browse Products
                <ArrowRightIcon className="text-[1.05em]" />
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-hairline">
              {items.map((line) => {
                return (
                  <li key={line.slug} className="flex gap-3 py-4 first:pt-0">
                    <Link
                      href={`/products/${line.slug}`}
                      onClick={closeDrawer}
                      className="h-18 w-18 shrink-0 overflow-hidden rounded-lg border border-hairline"
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

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${line.slug}`}
                        onClick={closeDrawer}
                        className="line-clamp-2 text-sm leading-snug font-semibold text-ink-900 hover:text-brand-700"
                      >
                        {line.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {line.sku ? `SKU ${line.sku}` : null}
                        {line.sku && line.unit ? " · " : null}
                        {line.unit}
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <QuantityStepper
                          size="sm"
                          value={line.quantity}
                          onChange={(next) => setQuantity(line.slug, next)}
                          label={`Quantity for ${line.name}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(line.slug)}
                          aria-label={`Remove ${line.name} from inquiry list`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-300 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <TrashIcon className="text-base" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ------------------------------------------------------- footer */}
        {items.length > 0 ? (
          <footer className="border-t border-hairline bg-surface-muted/60 px-5 py-4">
            <p className="mb-3 text-xs leading-relaxed text-ink-500">
              This is an inquiry, not an order &mdash; no payment is taken here.
              We&rsquo;ll confirm pricing &amp; availability on WhatsApp.
            </p>

            <SendInquiryButton onSent={closeDrawer} />

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                href={`tel:${siteConfig.phoneHref}`}
                variant="outline"
                size="sm"
              >
                <PhoneIcon className="text-[1.05em]" />
                Call instead
              </Button>
              <Button
                href="/cart"
                variant="outline"
                size="sm"
                onClick={closeDrawer}
              >
                View full list
              </Button>
            </div>

            <button
              type="button"
              onClick={clearCart}
              className="mt-3 w-full text-center text-xs font-medium text-ink-300 transition-colors hover:text-red-600"
            >
              Clear list
            </button>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
