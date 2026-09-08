import type { Metadata } from "next";
import { Suspense } from "react";
import { getCatalogue } from "@/lib/api";
import { ProductBrowser } from "@/components/product/ProductBrowser";
import { ContactBand } from "@/components/home/ContactBand";
import { Container } from "@/components/ui/Container";
import { CallCta, WhatsAppCta } from "@/components/ui/ContactCtas";

/** Rendered per request so admin changes appear on the site immediately. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse surgical instruments, disposables, diagnostic equipment, orthopedic implants, hospital furniture and PPE. Add items to your inquiry list and send it on WhatsApp.",
};

export default async function ProductsPage() {
  const { products, error } = await getCatalogue();

  return (
    <>
      {/* ---------------------------------------------------- page header */}
      <section className="border-b border-hairline bg-linear-to-b from-brand-50 to-white">
        <Container className="py-10 sm:py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-wider text-brand-600 uppercase">
                Catalogue
              </p>
              <h1 className="mt-2 text-3xl font-extrabold text-ink-900 sm:text-4xl">
                All Products
              </h1>
              <p className="mt-3 leading-relaxed text-ink-500">
                {products.length > 0
                  ? `${products.length} products listed below, with over 2,000 more available to order. `
                  : ""}
                Add what you need to your inquiry list &mdash; we&rsquo;ll
                confirm pricing and availability on WhatsApp.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <WhatsAppCta label="Ask for a quote" />
              <CallCta />
            </div>
          </div>
        </Container>
      </section>

      {/* useSearchParams needs a Suspense boundary during prerendering. */}
      <Suspense
        fallback={
          <Container className="py-16">
            <p className="text-sm text-ink-500">Loading products&hellip;</p>
          </Container>
        }
      >
        <ProductBrowser products={products} error={error} />
      </Suspense>

      <ContactBand
        title="Need a product that isn't listed?"
        body="Send us the item name, catalogue number or a photo of the packaging. If we don't stock it, we'll source it."
      />
    </>
  );
}
