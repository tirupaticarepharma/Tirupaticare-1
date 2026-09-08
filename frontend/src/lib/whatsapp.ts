/**
 * ============================================================================
 *  WHATSAPP HELPERS  —  the core conversion flow of this site
 * ============================================================================
 *  Every WhatsApp link on the site is built here from a single number:
 *  `siteConfig.whatsappNumber` (see src/config/site.ts).
 *
 *  There is no payment gateway and no checkout anywhere in this project.
 *  The cart is an INQUIRY LIST: it is turned into a plain-text message and
 *  handed to WhatsApp with the text pre-filled.
 * ============================================================================
 */

import { siteConfig } from "@/config/site";
import type { CartItem } from "@/context/CartContext";

/** Strip everything that is not a digit — wa.me only accepts bare digits. */
function normalizeNumber(raw: string): string {
  return raw.replace(/\D/g, "");
}

/**
 * Build a `https://wa.me/<number>?text=<encoded message>` link.
 * Passing no message opens a plain chat with the store.
 */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${normalizeNumber(siteConfig.whatsappNumber)}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/**
 * Turn the cart into the inquiry message that gets pre-filled in WhatsApp:
 *
 *   Hello, I'm interested in the following products:
 *
 *   1. Adson Tissue Forceps (SKU: SI-1001) x 2
 *   2. Mayo Scissors, Curved (SKU: SI-1002) x 1
 *
 *   Please share pricing and availability.
 */
export function buildInquiryMessage(items: CartItem[]): string {
  const lines = items.map(
    (item, index) =>
      `${index + 1}. ${item.name}${item.sku ? ` (SKU: ${item.sku})` : ""} x ${item.quantity}`,
  );

  return [
    "Hello, I'm interested in the following products:",
    "",
    ...lines,
    "",
    "Please share pricing and availability.",
  ].join("\n");
}

/** Ready-to-use wa.me link for a whole cart. */
export function cartInquiryLink(items: CartItem[]): string {
  return whatsappLink(buildInquiryMessage(items));
}

/** Message used by "Enquire on WhatsApp" buttons on a single product. */
export function productInquiryMessage(
  name: string,
  sku?: string,
  quantity = 1,
): string {
  return [
    "Hello, I'm interested in the following product:",
    "",
    `1. ${name}${sku ? ` (SKU: ${sku})` : ""} x ${quantity}`,
    "",
    "Please share pricing and availability.",
  ].join("\n");
}

/** Generic opener used by the floating button and hero CTAs. */
export const generalInquiryMessage = `Hello ${siteConfig.name}, I'd like to know more about your products.`;

/**
 * Open WhatsApp in a new tab. Kept in one place so every caller gets the
 * same `noopener` treatment.
 */
export function openWhatsApp(message?: string): void {
  if (typeof window === "undefined") return;
  window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
}
