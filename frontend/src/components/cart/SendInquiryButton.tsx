"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { buildInquiryMessage, cartInquiryLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { CheckIcon, CopyIcon, WhatsAppIcon } from "@/components/ui/Icons";

/**
 * Primary conversion action: Formats the inquiry list into a WhatsApp RFQ
 * and hands it off directly to wa.me with pre-filled content.
 */
export function SendInquiryButton({
  size = "lg",
  fullWidth = true,
  label = "Send Inquiry via WhatsApp",
  onSent,
}: {
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  label?: string;
  onSent?: () => void;
}) {
  const { items, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <Button variant="whatsapp" size={size} fullWidth={fullWidth} disabled>
        <WhatsAppIcon className="text-[1.15em]" />
        {label}
      </Button>
    );
  }

  return (
    <Button
      href={cartInquiryLink(items)}
      variant="whatsapp"
      size={size}
      fullWidth={fullWidth}
      onClick={onSent}
      aria-label={`Send an inquiry for ${itemCount} item${itemCount === 1 ? "" : "s"} on WhatsApp`}
      className="shadow-md shadow-whatsapp-dark/25 font-bold"
    >
      <WhatsAppIcon className="text-[1.25em]" />
      {label}
    </Button>
  );
}

/**
 * Collapsible preview with 1-click copy-to-clipboard for email/PO paperwork.
 */
export function InquiryMessagePreview() {
  const { items } = useCart();
  const [copied, setCopied] = useState(false);

  if (items.length === 0) return null;

  const text = buildInquiryMessage(items);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }

  return (
    <details className="group rounded-xl border border-slate-200/90 bg-surface-muted/60 transition-colors">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-xs sm:text-sm font-semibold text-ink-700 select-none">
        <span>Preview Formatted RFQ Message</span>
        <span className="text-xs font-bold text-brand-700 transition-transform group-open:rotate-180">
          &#9662;
        </span>
      </summary>

      <div className="border-t border-hairline p-4">
        <div className="flex items-center justify-between pb-2">
          <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-ink-400">
            WhatsApp Transmission Preview
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-brand-700 border border-slate-200 shadow-2xs hover:bg-brand-50"
          >
            {copied ? (
              <>
                <CheckIcon className="text-emerald-600 text-xs" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <CopyIcon className="text-xs" />
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>

        <pre className="overflow-x-auto rounded-lg bg-white p-3 font-mono text-xs leading-relaxed text-ink-700 border border-hairline/80 whitespace-pre-wrap">
          {text}
        </pre>
      </div>
    </details>
  );
}
