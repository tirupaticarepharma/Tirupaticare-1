import { siteConfig } from "@/config/site";
import { generalInquiryMessage, whatsappLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/**
 * The two engagement channels that appear beside every major call to action
 * on the site. Both read their number from src/config/site.ts.
 */

export function WhatsAppCta({
  label = "Chat on WhatsApp",
  message = generalInquiryMessage,
  size = "md",
  fullWidth = false,
  className = "",
}: {
  label?: string;
  message?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}) {
  return (
    <Button
      href={whatsappLink(message)}
      variant="whatsapp"
      size={size}
      fullWidth={fullWidth}
      className={className}
      aria-label={`${label} on ${siteConfig.phoneDisplay}`}
    >
      <WhatsAppIcon className="text-[1.15em]" />
      {label}
    </Button>
  );
}

export function CallCta({
  label,
  variant = "outline",
  size = "md",
  fullWidth = false,
  className = "",
}: {
  label?: string;
  variant?: "outline" | "call" | "secondary" | "light" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}) {
  return (
    <Button
      href={`tel:${siteConfig.phoneHref}`}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      className={className}
    >
      <PhoneIcon className="text-[1.05em]" />
      {label ?? `Call ${siteConfig.phoneDisplay}`}
    </Button>
  );
}

/**
 * The "this is not an order" clarification. Shown next to every inquiry
 * button so nobody expects a checkout or a payment screen.
 */
export function InquiryNote({
  className = "",
  tone = "muted",
}: {
  className?: string;
  tone?: "muted" | "light";
}) {
  return (
    <p
      className={`text-xs leading-relaxed ${
        tone === "light" ? "text-brand-100/80" : "text-ink-500"
      } ${className}`}
    >
      No payment is taken on this site. Sending an inquiry opens WhatsApp with
      your list ready to send &mdash; we&rsquo;ll confirm pricing &amp;
      availability from there.
    </p>
  );
}
