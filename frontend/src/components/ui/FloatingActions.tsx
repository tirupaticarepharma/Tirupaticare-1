"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { generalInquiryMessage, whatsappLink } from "@/lib/whatsapp";
import { PhoneIcon, WhatsAppIcon, ZapIcon } from "@/components/ui/Icons";

/**
 * Floating medical concierge stack, fixed bottom-right on EVERY page:
 *   - Quick Call button (clinical teal)
 *   - Direct WhatsApp button (high-contrast WhatsApp green with subtle pulse)
 *   - Live availability badge
 */
export function FloatingActions() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <aside
      aria-label="Quick contact shortcuts"
      className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2.5 sm:right-6 sm:bottom-6"
    >
      {/* Live availability pill badge (desktop only) */}
      <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-white/95 px-3 py-1 shadow-md shadow-ink-900/5 backdrop-blur-md sm:flex">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[0.6875rem] font-bold tracking-tight text-ink-700">
          WhatsApp Desk Online
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Direct Call Button */}
        <a
          href={`tel:${siteConfig.phoneHref}`}
          aria-label={`Call us directly at ${siteConfig.phoneDisplay}`}
          title={`Call ${siteConfig.phoneDisplay}`}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-800 text-white shadow-lg shadow-brand-950/20 ring-1 ring-white/20 transition-all duration-200 hover:scale-105 hover:bg-brand-700 active:scale-95"
        >
          <PhoneIcon className="text-xl" />
        </a>

        {/* Primary WhatsApp Action */}
        <a
          href={whatsappLink(generalInquiryMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Direct WhatsApp inquiry with surgical desk"
          title="Direct WhatsApp inquiry"
          className="group relative flex h-13 items-center gap-2 overflow-hidden rounded-full bg-linear-to-r from-whatsapp to-whatsapp-dark px-3.5 text-white shadow-xl shadow-whatsapp-dark/35 ring-1 ring-white/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-whatsapp-dark/45 active:scale-95 sm:px-4"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <WhatsAppIcon className="text-xl" />
          </span>
          <div className="flex flex-col text-left leading-tight pr-1">
            <span className="text-[0.6875rem] font-medium text-emerald-100 flex items-center gap-1">
              <ZapIcon className="text-[0.8em]" />
              Fast Reply
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-tight">
              Inquire on WhatsApp
            </span>
          </div>
        </a>
      </div>
    </aside>
  );
}
