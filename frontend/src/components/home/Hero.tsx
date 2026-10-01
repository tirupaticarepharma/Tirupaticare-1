import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CallCta, WhatsAppCta } from "@/components/ui/ContactCtas";
import {
  ArrowRightIcon,
  CertificateIcon,
  CheckCircle2Icon,
  FileTextIcon,
  ShieldCheckIcon,
  TruckIcon,
  WhatsAppIcon,
  ZapIcon,
} from "@/components/ui/Icons";
import { ProductArt } from "@/components/product/ProductArt";
import { filterFeatured } from "@/lib/api";
import type { Product } from "@/types/product";

const assurances = [
  { icon: ShieldCheckIcon, label: "Certified Medical-Grade Stock" },
  { icon: TruckIcon, label: "Same-Day Hospital Dispatch" },
  { icon: FileTextIcon, label: "Institutional GST Invoicing" },
];

export function Hero({ products }: { products: Product[] }) {
  // Products shown in the mock inquiry console preview on the right
  const preview = filterFeatured(products, 3);

  return (
    <section className="relative overflow-hidden bg-brand-950 text-white">
      {/* Dynamic ambient backgrounds */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-brand-950 via-[#072c40] to-brand-900"
      />
      <div aria-hidden="true" className="bg-dot-grid absolute inset-0 opacity-40" />

      {/* Subtle radial medical glows */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/3 -right-24 h-[30rem] w-[30rem] rounded-full bg-brand-400/10 blur-3xl pointer-events-none"
      />

      <Container className="relative py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* ------------------------------------------------- left copy */}
          <div className="animate-fade-up min-w-0 lg:col-span-7">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-brand-400/25 bg-brand-900/60 px-3.5 py-1.5 text-xs font-semibold text-brand-100 backdrop-blur-md shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Serving 500+ Hospitals, Clinics &amp; Surgeons</span>
              <span className="text-brand-400">&bull;</span>
              <span className="text-brand-300 font-medium">ISO 13485 Certified</span>
            </div>

            <h1 className="mt-5 text-3xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.12] text-balance">
              Precision surgical supplies,{" "}
              <span className="bg-linear-to-r from-brand-300 via-brand-200 to-white bg-clip-text text-transparent">
                delivered with clinical speed.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-brand-100/90 font-normal">
              Direct supplier of premium surgical instruments, disposables, and hospital equipment. Build your procurement list and get an official quotation on WhatsApp &mdash; typically within 30 minutes.
            </p>

            {/* CTAs group */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
              <Button href="/products" variant="light" size="lg" className="shadow-md">
                Browse Catalogue
                <ArrowRightIcon className="text-lg text-brand-700" />
              </Button>
              <WhatsAppCta size="lg" label="Fast WhatsApp Quote" />
              <CallCta variant="call" size="lg" label="Call Sales Desk" />
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-brand-200/80">
              <CheckCircle2Icon className="text-emerald-400 text-sm shrink-0" />
              <span>No online payment gateway needed &mdash; verified institutional invoicing on confirmation.</span>
            </div>

            {/* Core guarantees strip */}
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/10 pt-6">
              {assurances.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-brand-100"
                >
                  <item.icon className="text-base text-brand-300 shrink-0" />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ------------------------------------------- right console card */}
          <div className="animate-fade-up relative min-w-0 lg:col-span-5 [animation-delay:150ms]">
            {/* Ambient backdrop glow */}
            <div
              aria-hidden="true"
              className="absolute -inset-2 rounded-3xl bg-linear-to-r from-brand-500/20 to-teal-500/20 blur-xl opacity-75"
            />

            {/* Interactive console card */}
            <div className="relative rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-2xl shadow-brand-950/60 text-ink-900">
              {/* Card top banner */}
              <div className="flex items-center justify-between border-b border-hairline pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <FileTextIcon className="text-lg" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-ink-900">
                      Procurement Inquiry Sheet
                    </h2>
                    <p className="text-[0.6875rem] text-ink-500">
                      Sample order ready for instant hospital quote
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[0.6875rem] font-bold text-emerald-700 ring-1 ring-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live RFQ
                </span>
              </div>

              {/* Sample list rows */}
              <ul className="mt-3 flex flex-col divide-y divide-hairline">
                {preview.map((product, index) => (
                  <li key={product.slug} className="flex items-center gap-3 py-3 first:pt-1">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-hairline bg-surface-muted">
                      <ProductArt product={product} size="thumb" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-ink-500 flex items-center gap-1.5">
                        <span className="font-mono text-[0.6875rem] font-semibold text-brand-700">
                          {product.sku ?? "CERT-REF"}
                        </span>
                        <span>&bull;</span>
                        <span className="truncate">{product.unit ?? "Pack"}</span>
                      </p>
                    </div>
                    <span className="rounded-lg bg-surface-muted px-2.5 py-1 text-xs font-bold text-ink-700 tabular-nums border border-hairline">
                      x {(index + 1) * 2}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Send CTA */}
              <div className="mt-4 pt-3 border-t border-hairline">
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                    "Hello Tirupati Surgicals, please provide pricing and availability for your featured surgical catalogue items."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-b from-whatsapp to-whatsapp-dark text-sm font-bold text-white shadow-md shadow-whatsapp-dark/25 transition-all duration-200 hover:from-whatsapp-dark hover:to-whatsapp-deep active:scale-98"
                >
                  <WhatsAppIcon className="text-lg" />
                  <span>Send Sample Inquiry on WhatsApp</span>
                </a>

                <div className="mt-3 flex items-center justify-between text-[0.6875rem] text-ink-400">
                  <span className="flex items-center gap-1">
                    <ZapIcon className="text-brand-600 text-xs" />
                    Average quote time: 18 mins
                  </span>
                  <span>Direct Sales Desk</span>
                </div>
              </div>

              {/* Trust pill overlay */}
              <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-brand-50/60 p-2 text-center text-[0.6875rem] font-medium text-brand-800">
                <CertificateIcon className="text-sm text-brand-600 shrink-0" />
                <span>Standard surgical items dispatched same day</span>
              </div>
            </div>

            {/* Quick guide link */}
            <div className="mt-4 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-200 transition-colors hover:text-white"
              >
                <span>View all catalogue categories &amp; products</span>
                <ArrowRightIcon className="text-[1.05em]" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
