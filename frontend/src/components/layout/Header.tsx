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

  /* Subtle shadow once the page moves, so the header separates from content. */
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close the mobile menu whenever the route changes. */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-30">
      {/* ------------------------------------------------------- top bar */}
      <div className="bg-brand-900 text-brand-100">
        <Container className="flex h-9 items-center justify-between gap-4 text-xs sm:text-[0.8125rem]">
          <p className="hidden truncate sm:block">
            Trusted supplier to hospitals, clinics &amp; doctors &mdash;{" "}
            <span className="text-white">
              same-day dispatch on stocked items
            </span>
          </p>

          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
            <a
              href={`tel:${siteConfig.phoneHref}`}
              className="flex items-center gap-1.5 font-semibold text-white transition-colors hover:text-brand-200"
            >
              <PhoneIcon className="text-[0.95em]" />
              {siteConfig.phoneDisplay}
            </a>

            <a
              href={`mailto:${siteConfig.email}`}
              className="hidden items-center gap-1.5 transition-colors hover:text-white md:flex"
            >
              <MailIcon className="text-[0.95em]" />
              {siteConfig.email}
            </a>

            <a
              href={whatsappLink(generalInquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-semibold text-whatsapp transition-colors hover:text-white"
            >
              <WhatsAppIcon className="text-[1.05em]" />
              WhatsApp
            </a>
          </div>
        </Container>
      </div>

      {/* ------------------------------------------------------- main bar */}
      <div
        className={`border-b border-hairline bg-white/95 backdrop-blur transition-shadow duration-300 ${
          scrolled ? "shadow-sm shadow-ink-900/5" : ""
        }`}
      >
        <Container className="flex h-16 items-center justify-between gap-4 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <LogoMark className="text-[2.25rem] text-brand-700" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[1.0625rem] font-bold tracking-tight text-ink-900 sm:text-lg">
                {siteConfig.name}
              </span>
              <span className="mt-1 hidden text-[0.6875rem] font-medium tracking-wide text-ink-500 uppercase sm:block">
                {siteConfig.tagline}
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3.5 py-2 text-[0.9375rem] font-semibold transition-colors ${
                  isActive(link.href)
                    ? "bg-brand-50 text-brand-800"
                    : "text-ink-700 hover:bg-surface-muted hover:text-ink-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href={whatsappLink(generalInquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-11 items-center gap-2 rounded-xl bg-whatsapp px-4 text-sm font-semibold text-white shadow-sm shadow-whatsapp-dark/30 transition-colors hover:bg-whatsapp-dark md:flex"
            >
              <WhatsAppIcon className="text-lg" />
              WhatsApp
            </a>

            <CartButton />

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-hairline text-ink-900 transition-colors hover:bg-surface-muted lg:hidden"
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
        className={`overflow-hidden border-b border-hairline bg-white transition-[max-height,opacity] duration-300 lg:hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Container className="flex flex-col gap-1 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2.5 font-semibold transition-colors ${
                isActive(link.href)
                  ? "bg-brand-50 text-brand-800"
                  : "text-ink-700 hover:bg-surface-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-hairline pt-3">
            <a
              href={whatsappLink(generalInquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-whatsapp text-sm font-semibold text-white"
            >
              <WhatsAppIcon className="text-lg" />
              WhatsApp
            </a>
            <a
              href={`tel:${siteConfig.phoneHref}`}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-hairline text-sm font-semibold text-ink-900"
            >
              <PhoneIcon className="text-base" />
              Call Now
            </a>
          </div>
        </Container>
      </div>
    </header>
  );
}
