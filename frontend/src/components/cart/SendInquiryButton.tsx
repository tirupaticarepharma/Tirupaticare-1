"use client";

import { useCart } from "@/context/CartContext";
import { buildInquiryMessage, cartInquiryLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icons";

/**
 * ============================================================================
 *  SEND INQUIRY VIA WHATSAPP  -  the site's primary conversion action
 * ============================================================================
 *  Takes the cart, builds the plain-text message, URL-encodes it and hands it
 *  to `https://wa.me/<number>?text=<message>` in a new tab.
 *
 *  This is rendered as a real <a> (not a scripted window.open) so that mobile
 *  browsers hand off to the installed WhatsApp app directly and desktop popup
 *  blockers never swallow the click.
 * ============================================================================
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
  /** Called after the link is followed - used to close the cart drawer. */
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
    >
      <WhatsAppIcon className="text-[1.15em]" />
      {label}
    </Button>
  );
}

/**
 * Collapsible preview of the exact text that will be pre-filled in WhatsApp.
 * Handy when testing, and it reassures buyers that nothing is sent silently.
 */
export function InquiryMessagePreview() {
  const { items } = useCart();
  if (items.length === 0) return null;

  return (
    <details className="group rounded-xl border border-hairline bg-surface-muted/70">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-ink-700 select-none">
        Preview the WhatsApp message
        <span className="text-xs font-medium text-ink-500 transition-transform group-open:rotate-180">
          &#9662;
        </span>
      </summary>
      <pre className="overflow-x-auto border-t border-hairline px-4 py-3 font-sans text-[0.8125rem] leading-relaxed whitespace-pre-wrap text-ink-700">
        {buildInquiryMessage(items)}
      </pre>
    </details>
  );
}
