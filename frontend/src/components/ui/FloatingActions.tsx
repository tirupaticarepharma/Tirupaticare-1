"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { generalInquiryMessage, whatsappLink } from "@/lib/whatsapp";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/**
 * Floating contact stack, fixed bottom-right on EVERY page:
 *   - phone (brand teal)
 *   - WhatsApp (the standard green, always the largest target)
 *
 * On pointer devices the WhatsApp button expands to show a label on hover;
 * on touch devices it stays a compact circle so it never covers content.
 */
export function FloatingActions() {
  const [mounted, setMounted] = useState(false);

  // Fade in after mount so the buttons never flash in during hydration.
  useEffect(() => setMounted(true), []);

  return (
    <div
      className={`fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 transition-opacity duration-500 sm:right-6 sm:bottom-6 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <a
        href={`tel:${siteConfig.phoneHref}`}
        aria-label={`Call us on ${siteConfig.phoneDisplay}`}
        title={`Call ${siteConfig.phoneDisplay}`}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-800 text-white shadow-lg shadow-brand-950/25 ring-1 ring-white/15 transition-transform duration-200 hover:scale-105 hover:bg-brand-900 active:scale-95"
      >
        <PhoneIcon className="text-xl" />
      </a>

      <a
        href={whatsappLink(generalInquiryMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat on WhatsApp"
        className="group relative flex h-14 items-center gap-0 overflow-hidden rounded-full bg-whatsapp pl-[0.9375rem] text-white shadow-xl shadow-whatsapp-dark/30 ring-1 ring-black/5 transition-all duration-300 hover:bg-whatsapp-dark active:scale-95 sm:hover:gap-2.5"
      >
        {/* Soft pulse to draw the eye without being loud about it. */}
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp/40 [animation-duration:2.8s]" />
        <WhatsAppIcon className="shrink-0 text-2xl" />
        <span className="max-w-0 overflow-hidden text-[0.9375rem] font-semibold whitespace-nowrap opacity-0 transition-all duration-300 sm:group-hover:max-w-40 sm:group-hover:pr-5 sm:group-hover:opacity-100">
          Chat on WhatsApp
        </span>
        <span className="w-[0.9375rem] shrink-0 sm:group-hover:w-0" />
      </a>
    </div>
  );
}
