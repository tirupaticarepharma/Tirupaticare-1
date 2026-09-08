"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { siteConfig } from "@/config/site";
import { productInquiryMessage, whatsappLink } from "@/lib/whatsapp";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Button } from "@/components/ui/Button";
import { InquiryNote } from "@/components/ui/ContactCtas";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/**
 * Quantity + the three ways to act on a product: add to the inquiry list,
 * ask about this one item on WhatsApp, or call. The WhatsApp message carries
 * the quantity chosen here.
 */
export function ProductInquiryPanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="rounded-2xl border border-hairline bg-surface-muted/50 p-5 sm:p-6">
      {product.inStock ? (
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold tracking-wide text-ink-500 uppercase">
              Quantity
            </label>
            <QuantityStepper value={quantity} onChange={setQuantity} />
          </div>

          {product.unit ? (
            <div className="pt-5">
              <p className="text-sm font-medium text-ink-700">{product.unit}</p>
              <p className="text-xs text-ink-500">Bulk rates available</p>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-xl border border-hairline bg-white px-4 py-3">
          <p className="text-sm font-bold text-ink-900">
            Currently out of stock
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink-500">
            Message us on WhatsApp and we&rsquo;ll tell you when it lands
            &mdash; or suggest an equivalent we hold now.
          </p>
        </div>
      )}

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
          <WhatsAppIcon className="text-[1.15em]" />
          {product.inStock
            ? "Ask about this on WhatsApp"
            : "Check availability on WhatsApp"}
        </Button>

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

      <InquiryNote className="mt-4" />
    </div>
  );
}
