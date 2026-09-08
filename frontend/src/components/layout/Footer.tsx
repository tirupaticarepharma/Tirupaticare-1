import Link from "next/link";
import { fullAddress, siteConfig } from "@/config/site";
import { generalInquiryMessage, whatsappLink } from "@/lib/whatsapp";
import { categories } from "@/data/categories";
import { Container } from "@/components/ui/Container";
import {
  ClockIcon,
  LogoMark,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";

const companyLinks = [
  { href: "/products", label: "All Products" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/cart", label: "Your Inquiry List" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-brand-100">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* ------------------------------------------------------ brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <LogoMark className="text-[2.25rem] text-brand-600" />
              <span className="font-display text-lg font-bold text-white">
                {siteConfig.name}
              </span>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-200/90">
              {siteConfig.description}
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
              <a
                href={whatsappLink(generalInquiryMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-whatsapp px-5 text-sm font-semibold text-white transition-colors hover:bg-whatsapp-dark"
              >
                <WhatsAppIcon className="text-lg" />
                Chat on WhatsApp
              </a>
              <a
                href={`tel:${siteConfig.phoneHref}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/20 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <PhoneIcon className="text-base" />
                Call Now
              </a>
            </div>
          </div>

          {/* -------------------------------------------------- categories */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold tracking-wide text-white uppercase">
              Categories
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/products?category=${category.id}`}
                    className="text-brand-200/90 transition-colors hover:text-white"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ----------------------------------------------------- company */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold tracking-wide text-white uppercase">
              Company
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-200/90 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ----------------------------------------------------- contact */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold tracking-wide text-white uppercase">
              Get in touch
            </h3>
            <ul className="mt-4 flex flex-col gap-3.5 text-sm">
              <li className="flex gap-3">
                <MapPinIcon className="mt-0.5 shrink-0 text-base text-brand-400" />
                <address className="not-italic text-brand-200/90">
                  {fullAddress}
                </address>
              </li>
              <li className="flex gap-3">
                <PhoneIcon className="mt-0.5 shrink-0 text-base text-brand-400" />
                <a
                  href={`tel:${siteConfig.phoneHref}`}
                  className="font-semibold text-white transition-colors hover:text-brand-200"
                >
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <MailIcon className="mt-0.5 shrink-0 text-base text-brand-400" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-brand-200/90 transition-colors hover:text-white"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex gap-3">
                <ClockIcon className="mt-0.5 shrink-0 text-base text-brand-400" />
                <div className="text-brand-200/90">
                  {siteConfig.hours.map((entry) => (
                    <p key={entry.days}>
                      <span className="text-white">{entry.days}:</span>{" "}
                      {entry.time}
                    </p>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ---------------------------------------------------- bottom bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-brand-200/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <p>
            This site is a product catalogue &mdash; no payments are collected
            online. All orders are confirmed over WhatsApp or phone.
          </p>
        </div>
      </Container>
    </footer>
  );
}
