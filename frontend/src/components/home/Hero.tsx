import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CallCta, WhatsAppCta } from "@/components/ui/ContactCtas";
import {
  ArrowRightIcon,
  CheckIcon,
  ShieldCheckIcon,
  TruckIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";
import { ProductArt } from "@/components/product/ProductArt";
import { filterFeatured } from "@/lib/api";
import type { Product } from "@/types/product";

const assurances = [
  { icon: ShieldCheckIcon, label: "Genuine, certified stock" },
  { icon: TruckIcon, label: "Same-day dispatch" },
  { icon: CheckIcon, label: "Bulk & institutional rates" },
];

export function Hero({ products }: { products: Product[] }) {
  // The three products shown in the mock inquiry list on the right.
  const preview = filterFeatured(products, 3);

  return (
    <section className="relative overflow-hidden bg-brand-900">
      {/* Background wash */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-br from-brand-950 via-brand-900 to-brand-800"
      />
      <div aria-hidden="true" className="bg-dot-grid absolute inset-0 opacity-60" />
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-32 aspect-square w-[36rem] rounded-full bg-brand-500/20 blur-3xl"
      />

      <Container className="relative py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ------------------------------------------------------- copy */}
          {/* min-w-0 stops a wide grid item from pushing the track past the
              viewport on small screens. */}
          <div className="animate-fade-up min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-brand-100 backdrop-blur-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-whatsapp" />
              Serving {siteConfig.stats[1].value.replace("+", "")}+ hospitals
              &amp; clinics
            </span>

            <h1 className="mt-5 text-4xl leading-[1.1] font-extrabold text-balance text-white sm:text-5xl lg:text-[3.4rem]">
              Surgical instruments &amp; medical equipment,{" "}
              <span className="text-brand-300">supplied fast.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-100 sm:text-lg">
              Browse our catalogue, build an inquiry list, and send it straight
              to us on WhatsApp. We reply with pricing and availability &mdash;
              usually within the hour.
            </p>

            {/* CTAs: browse, WhatsApp, call - all three above the fold. */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/products" variant="light" size="lg">
                Browse Products
                <ArrowRightIcon className="text-[1.1em]" />
              </Button>
              <WhatsAppCta size="lg" />
              <CallCta variant="call" size="lg" label="Call Now" />
            </div>

            <p className="mt-4 text-xs text-brand-200/80">
              No online payment &mdash; every order is confirmed personally over
              WhatsApp or phone.
            </p>

            {/* Assurance strip */}
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6">
              {assurances.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2 text-sm font-medium text-brand-100"
                >
                  <item.icon className="text-base text-brand-300" />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* --------------------------------------------- inquiry preview */}
          <div className="animate-fade-up relative min-w-0 [animation-delay:120ms]">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2rem] bg-white/5 backdrop-blur-[1px]"
            />

            <div className="relative rounded-2xl bg-white p-5 shadow-2xl shadow-brand-950/40 sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-hairline pb-4">
                <div>
                  <p className="text-sm font-bold text-ink-900">
                    Your Inquiry List
                  </p>
                  <p className="text-xs text-ink-500">
                    {preview.length} products &middot; no payment needed
                  </p>
                </div>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[0.6875rem] font-bold text-brand-700 uppercase">
                  Preview
                </span>
              </div>

              <ul className="flex flex-col divide-y divide-hairline">
                {preview.map((product, index) => (
                  <li key={product.slug} className="flex items-center gap-3 py-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-hairline">
                      <ProductArt product={product} size="thumb" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-ink-500">
                        {product.sku ? `SKU ${product.sku}` : product.unit}
                      </p>
                    </div>
                    <span className="rounded-md bg-surface-muted px-2 py-1 text-xs font-bold text-ink-700 tabular-nums">
                      x {index + 1}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp text-sm font-bold text-white">
                <WhatsAppIcon className="text-lg" />
                Send Inquiry via WhatsApp
              </div>

              <p className="mt-3 text-center text-[0.6875rem] text-ink-300">
                Opens WhatsApp with your list ready to send
              </p>
            </div>

            <Link
              href="/products"
              className="relative mt-5 flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-100 transition-colors hover:text-white"
            >
              See how it works
              <ArrowRightIcon className="text-[1.05em]" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
