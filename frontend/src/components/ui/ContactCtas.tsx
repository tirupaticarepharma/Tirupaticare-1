import { siteConfig } from "@/config/site";
import { generalInquiryMessage, whatsappLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { InfoIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/**
 * The two primary engagement channels that appear beside every major call to action.
 * Both read numbers from src/config/site.ts.
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
      aria-label={`${label} with sales desk on ${siteConfig.phoneDisplay}`}
    >
      <WhatsAppIcon className="text-[1.2em]" />
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
      aria-label={`Call ${siteConfig.phoneDisplay}`}
    >
      <PhoneIcon className="text-[1.05em]" />
      {label ?? `Call ${siteConfig.phoneDisplay}`}
    </Button>
  );
}

/**
 * Institutional procurement note. Explains that the platform provides instant
 * catalogue quote generation without online payment checkout barriers.
 */
export function InquiryNote({
  className = "",
  tone = "muted",
}: {
  className?: string;
  tone?: "muted" | "light";
}) {
  return (
    <div
      className={`flex items-start gap-2 rounded-xl p-3 text-xs leading-relaxed ${
        tone === "light"
          ? "border border-white/15 bg-white/10 text-brand-100"
          : "border border-slate-200/80 bg-surface-muted/90 text-ink-500"
      } ${className}`}
    >
      <InfoIcon className="mt-0.5 shrink-0 text-sm text-brand-600" />
      <p>
        <span className="font-semibold text-ink-900">Zero online checkout friction:</span> Sending an inquiry opens WhatsApp with your item list pre-filled. We promptly verify warehouse availability, quote institutional rates, and coordinate delivery.
      </p>
    </div>
  );
}
