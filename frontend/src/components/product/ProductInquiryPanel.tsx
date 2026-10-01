"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { siteConfig } from "@/config/site";
import { productInquiryMessage, whatsappLink } from "@/lib/whatsapp";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Button } from "@/components/ui/Button";
import { InquiryNote } from "@/components/ui/ContactCtas";
import { PhoneIcon, WhatsAppIcon, ZapIcon } from "@/components/ui/Icons";

/**
 * Modern procurement console for product detail page.
 * Allows surgeons and hospital procurement managers to set quantities,
 * add to a multi-item inquiry list, or transmit a 1-tap WhatsApp RFQ.
 */
export function ProductInquiryPanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm shadow-slate-900/4">
      {/* Header availability row */}
      <div className="flex items-center justify-between border-b border-hairline pb-4 mb-4">
        <div>
          <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-ink-400">
            Procurement Desk
          </span>
          <p className="text-sm font-bold text-ink-900">
            {product.inStock ? "Ready for Institutional Supply" : "Surgical Special Order"}
          </p>
        </div>

        {product.inStock ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Same-Day Dispatch
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-500/20">
            Order-to-Spec
          </span>
        )}
      </div>

      {product.inStock ? (
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold tracking-wide text-ink-500 uppercase">
              Quantity ({product.unit ?? "Pieces"})
            </label>
            <QuantityStepper value={quantity} onChange={setQuantity} />
          </div>

          <div className="text-right">
            <p className="text-xs font-medium text-ink-500">Tiered Hospital Pricing</p>
            <p className="text-sm font-bold text-brand-700 flex items-center justify-end gap-1">
              <ZapIcon className="text-xs" />
              Volume discounts apply
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-4">
          <p className="text-sm font-bold text-amber-900">
            Currently Out of Immediate Stock
          </p>
          <p className="mt-1 text-xs leading-relaxed text-amber-800">
            Inquire via WhatsApp for exact replenishment timeline or to order certified equivalent AISI surgical instruments.
          </p>
        </div>
      )}

      {/* Primary CTAs */}
      <div className="mt-5 flex flex-col gap-2.5">
        <AddToCartButton
          product={product}
          quantity={quantity}
          size="lg"
          fullWidth
          openDrawer
          label="Add to Inquiry List"
        />

        <Button
          href={whatsappLink(
            productInquiryMessage(
              product.name,
              product.sku ?? undefined,
              quantity,
            ),
          )}
          variant="whatsapp"
          size="lg"
          fullWidth
        >
          <WhatsAppIcon className="text-[1.2em]" />
          {product.inStock
            ? `Inquire about ${quantity > 1 ? `${quantity}x ` : ""}on WhatsApp`
            : "Check Batch Availability on WhatsApp"}
        </Button>

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

      <div className="mt-5">
        <InquiryNote />
      </div>
    </div>
  );
}
