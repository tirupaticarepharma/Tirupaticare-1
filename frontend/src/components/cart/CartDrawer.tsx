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
  FileTextIcon,
  PhoneIcon,
  ShieldCheckIcon,
  TrashIcon,
} from "@/components/ui/Icons";

/** Slide-out inquiry list drawer. Mounted in site layout. */
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
      {/* Frosted Backdrop */}
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 bg-ink-950/50 backdrop-blur-xs transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Slide-out Aside Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your surgical inquiry list"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ------------------------------------------------------- header */}
        <header className="flex items-center justify-between border-b border-hairline px-5 py-4 bg-surface-muted/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <FileTextIcon className="text-lg" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink-900 leading-tight">
                Surgical Inquiry Sheet
              </h2>
              <p className="text-xs text-ink-500">
                {itemCount === 0
                  ? "No instruments selected"
                  : `${itemCount} total unit${itemCount === 1 ? "" : "s"} (${items.length} line${items.length === 1 ? "" : "s"})`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close inquiry sheet"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-500 transition-colors hover:bg-slate-200/60 hover:text-ink-900 active:scale-95"
          >
            <CloseIcon className="text-lg" />
          </button>
        </header>

        {/* -------------------------------------------------------- items */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-3xl text-brand-700">
                <CartIcon />
              </div>
              <div className="max-w-xs">
                <p className="font-bold text-ink-900 text-base">
                  Your inquiry list is empty
                </p>
                <p className="mt-1.5 text-xs sm:text-sm text-ink-500 leading-relaxed">
                  Browse products and click &ldquo;Add to Inquiry List&rdquo; to build your quote sheet.
                </p>
              </div>
              <Button href="/products" variant="primary" onClick={closeDrawer} className="mt-2">
                <span>Browse Products</span>
                <ArrowRightIcon className="text-base" />
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
                      className="h-18 w-18 shrink-0 overflow-hidden rounded-xl border border-slate-200/90 bg-surface-muted"
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
                        className="line-clamp-2 text-sm leading-snug font-bold text-ink-900 hover:text-brand-700 transition-colors"
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

                      <div className="mt-2.5 flex items-center justify-between gap-2">
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
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-red-50 hover:text-red-600 active:scale-95"
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
          <footer className="border-t border-hairline bg-surface-muted/80 p-5">
            <div className="mb-3.5 flex items-center gap-2 rounded-lg bg-brand-50/80 p-2.5 text-xs text-brand-800">
              <ShieldCheckIcon className="text-base text-brand-600 shrink-0" />
              <span>Zero payment taken online &bull; Pricing verified on WhatsApp</span>
            </div>

            <SendInquiryButton onSent={closeDrawer} />

            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <Button
                href={`tel:${siteConfig.phoneHref}`}
                variant="outline"
                size="sm"
              >
                <PhoneIcon className="text-[1.05em]" />
                Call Instead
              </Button>
              <Button
                href="/cart"
                variant="outline"
                size="sm"
                onClick={closeDrawer}
              >
                Full Summary
              </Button>
            </div>

            <button
              type="button"
              onClick={clearCart}
              className="mt-3 w-full text-center text-xs font-semibold text-ink-400 transition-colors hover:text-red-600"
            >
              Clear entire list
            </button>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
