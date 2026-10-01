"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { generalInquiryMessage, whatsappLink } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { CartButton } from "@/components/cart/CartButton";
import {
  CloseIcon,
  LogoMark,
  MailIcon,
  MenuIcon,
  PhoneIcon,
  WhatsAppIcon,
  ZapIcon,
} from "@/components/ui/Icons";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-30">
      {/* ------------------------------------------------------- top notice strip */}
      <div className="bg-brand-950 text-brand-100 border-b border-white/5">
        <Container className="flex h-9 items-center justify-between gap-4 text-xs">
          <div className="hidden items-center gap-2 truncate sm:flex">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="truncate text-brand-200">
              Direct supplier to hospitals &amp; clinics &mdash;{" "}
              <span className="font-semibold text-white">
                Same-day dispatch on stocked instruments
              </span>
            </p>
          </div>

          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
            <a
              href={`tel:${siteConfig.phoneHref}`}
              className="flex items-center gap-1.5 font-semibold text-white transition-colors hover:text-brand-200"
            >
              <PhoneIcon className="text-[0.95em] text-brand-300" />
              <span>{siteConfig.phoneDisplay}</span>
            </a>

            <span className="hidden text-brand-800 sm:inline" aria-hidden="true">|</span>

            <a
              href={`mailto:${siteConfig.email}`}
              className="hidden items-center gap-1.5 text-brand-200 transition-colors hover:text-white md:flex"
            >
              <MailIcon className="text-[0.95em] text-brand-300" />
              <span>{siteConfig.email}</span>
            </a>

            <span className="text-brand-800" aria-hidden="true">|</span>

            <a
              href={whatsappLink(generalInquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-semibold text-whatsapp transition-colors hover:text-white"
            >
              <WhatsAppIcon className="text-[1.1em]" />
              <span>WhatsApp Desk</span>
            </a>
          </div>
        </Container>
      </div>

      {/* ------------------------------------------------------- main nav bar */}
      <div
        className={`border-b border-hairline bg-white/92 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "shadow-sm shadow-ink-900/5 bg-white/98" : ""
        }`}
      >
        <Container className="flex h-16 sm:h-18 items-center justify-between gap-4">
          {/* Logo brand */}
          <Link href="/" className="group flex shrink-0 items-center gap-3">
            <div className="transition-transform duration-200 group-hover:scale-105">
              <LogoMark className="text-[2.25rem] text-brand-700" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-ink-900 group-hover:text-brand-800 transition-colors">
                {siteConfig.name}
              </span>
              <span className="mt-1 hidden text-[0.6875rem] font-bold tracking-wider text-brand-600 uppercase sm:block">
                {siteConfig.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-brand-50 text-brand-800 shadow-2xs font-bold border border-brand-200/60"
                      : "text-ink-700 hover:bg-surface-muted hover:text-ink-900 border border-transparent"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 -bottom-[15px] h-[2px] rounded-full bg-brand-600 block"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <a
              href={whatsappLink(generalInquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 sm:h-11 items-center gap-2 rounded-xl bg-linear-to-b from-whatsapp to-whatsapp-dark px-3.5 sm:px-4 text-xs sm:text-sm font-bold text-white shadow-xs shadow-whatsapp-dark/25 transition-all duration-200 hover:shadow-md hover:from-whatsapp-dark hover:to-whatsapp-deep active:scale-95 md:flex"
            >
              <WhatsAppIcon className="text-base sm:text-lg" />
              <span>Quick Quote</span>
            </a>

            <CartButton />

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-hairline text-ink-900 transition-colors hover:bg-surface-muted lg:hidden active:scale-95"
            >
              {menuOpen ? (
                <CloseIcon className="text-xl" />
              ) : (
                <MenuIcon className="text-xl" />
              )}
            </button>
          </div>
        </Container>
      </div>

      {/* ---------------------------------------------------- mobile menu */}
      <div
        className={`overflow-hidden border-b border-hairline bg-white/98 backdrop-blur-lg transition-all duration-300 lg:hidden ${
          menuOpen ? "max-h-[26rem] opacity-100 shadow-xl" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <Container className="flex flex-col gap-1 py-4">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-brand-50 text-brand-800 font-bold border border-brand-200/60"
                    : "text-ink-700 hover:bg-surface-muted border border-transparent"
                }`}
              >
                <span>{link.label}</span>
                {active && (
                  <span className="h-2 w-2 rounded-full bg-brand-600" />
                )}
              </Link>
            );
          })}

          <Link
            href="/cart"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              isActive("/cart")
                ? "bg-brand-50 text-brand-800 font-bold border border-brand-200/60"
                : "text-ink-700 hover:bg-surface-muted border border-transparent"
            }`}
          >
            <span>Inquiry Cart</span>
            <span className="text-xs font-semibold text-brand-700">View &rarr;</span>
          </Link>

          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-hairline pt-3">
            <a
              href={whatsappLink(generalInquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-whatsapp text-sm font-bold text-white shadow-xs transition-colors hover:bg-whatsapp-dark"
            >
              <WhatsAppIcon className="text-lg" />
              WhatsApp
            </a>
            <a
              href={`tel:${siteConfig.phoneHref}`}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-hairline text-sm font-semibold text-ink-900 transition-colors hover:bg-surface-muted"
            >
              <PhoneIcon className="text-base text-brand-700" />
              Call Now
            </a>
          </div>
        </Container>
      </div>
    </header>
  );
}
