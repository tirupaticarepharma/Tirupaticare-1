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
  ShieldCheckIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";

const companyLinks = [
  { href: "/products", label: "Full Surgical Catalogue" },
  { href: "/about", label: "About Our Company" },
  { href: "/contact", label: "Contact & Location" },
  { href: "/cart", label: "View Inquiry Sheet" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-brand-950 text-brand-100">
      <Container className="py-14 sm:py-18">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* ------------------------------------------------------ brand & about */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <LogoMark className="text-[2.25rem] text-brand-500" />
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold tracking-tight text-white">
                  {siteConfig.name}
                </span>
                <span className="mt-1 text-[0.6875rem] font-bold tracking-wider text-brand-300 uppercase">
                  {siteConfig.tagline}
                </span>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-200/90 font-normal">
              {siteConfig.description}
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-brand-300 font-medium">
              <ShieldCheckIcon className="text-emerald-400 text-base" />
              <span>ISO 13485:2016 Certified Healthcare Supplier</span>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
              <a
                href={whatsappLink(generalInquiryMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-b from-whatsapp to-whatsapp-dark px-4 text-xs sm:text-sm font-bold text-white shadow-sm transition-all duration-200 hover:from-whatsapp-dark hover:to-whatsapp-deep active:scale-95"
              >
                <WhatsAppIcon className="text-lg" />
                <span>WhatsApp Desk</span>
              </a>
              <a
                href={`tel:${siteConfig.phoneHref}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 text-xs sm:text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 active:scale-95"
              >
                <PhoneIcon className="text-base text-brand-300" />
                <span>Call Sales Office</span>
              </a>
            </div>
          </div>

          {/* -------------------------------------------------- categories */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold tracking-widest text-white uppercase">
              Surgical Categories
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/products?category=${category.id}`}
                    className="text-brand-200/90 transition-colors hover:text-white hover:underline underline-offset-4"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ----------------------------------------------------- company */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold tracking-widest text-white uppercase">
              Company
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-200/90 transition-colors hover:text-white hover:underline underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ----------------------------------------------------- contact details */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold tracking-widest text-white uppercase">
              Sales Office &amp; Warehouse
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li className="flex gap-3">
                <MapPinIcon className="mt-0.5 shrink-0 text-base text-brand-400" />
                <address className="not-italic text-brand-200/90 leading-snug">
                  {fullAddress}
                </address>
              </li>
              <li className="flex gap-3">
                <PhoneIcon className="mt-0.5 shrink-0 text-base text-brand-400" />
                <a
                  href={`tel:${siteConfig.phoneHref}`}
                  className="font-semibold text-white transition-colors hover:text-brand-300"
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
                <div className="text-brand-200/90 text-xs leading-relaxed">
                  {siteConfig.hours.map((entry) => (
                    <p key={entry.days}>
                      <span className="text-white font-medium">{entry.days}:</span>{" "}
                      {entry.time}
                    </p>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ---------------------------------------------------- bottom disclaimer */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-brand-300/80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <p className="max-w-md sm:text-right">
            Online catalogue and RFQ builder. All orders and wholesale hospital pricing are finalized directly via WhatsApp or official quotation.
          </p>
        </div>
      </Container>
    </footer>
  );
}
