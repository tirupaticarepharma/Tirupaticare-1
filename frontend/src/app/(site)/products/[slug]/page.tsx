import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCatalogue, getProduct, formatPrice, relatedProducts } from "@/lib/api";
import { getCategory } from "@/data/categories";
import { siteConfig } from "@/config/site";
import { Container, Section } from "@/components/ui/Container";
import { ProductArt } from "@/components/product/ProductArt";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductInquiryPanel } from "@/components/product/ProductInquiryPanel";
import { ContactBand } from "@/components/home/ContactBand";
import {
  CertificateIcon,
  CheckCircle2Icon,
  CheckIcon,
  FileTextIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@/components/ui/Icons";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: `${product.summary ?? ""} ${product.description ?? ""}`
      .trim()
      .slice(0, 160),
    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,
      description: product.summary ?? undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const category = getCategory(product.category);
  const price = formatPrice(product.price);
  const { products } = await getCatalogue();
  const related = relatedProducts(products, product, 4);

  return (
    <>
      {/* ------------------------------------------------------ breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-hairline bg-surface-muted/60"
      >
        <Container className="flex flex-wrap items-center gap-2 py-3 text-xs sm:text-sm text-ink-500">
          <Link href="/" className="transition-colors hover:text-brand-700">
            Home
          </Link>
          <span aria-hidden="true" className="text-slate-300">/</span>
          <Link
            href="/products"
            className="transition-colors hover:text-brand-700"
          >
            Products
          </Link>
          {category ? (
            <>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <Link
                href={`/products?category=${category.id}`}
                className="transition-colors hover:text-brand-700"
              >
                {category.name}
              </Link>
            </>
          ) : null}
          <span aria-hidden="true" className="text-slate-300">/</span>
          <span className="font-semibold text-ink-900 truncate max-w-[16rem]">
            {product.name}
          </span>
        </Container>
      </nav>

      {/* --------------------------------------------------------- product hero & details */}
      <Container className="py-8 sm:py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Artwork & Quality Highlights */}
          <div className="lg:col-span-6">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
              <div className={`h-full w-full ${product.inStock ? "" : "opacity-60 saturate-50"}`}>
                <ProductArt product={product} size="detail" />
              </div>

              {!product.inStock ? (
                <span className="absolute top-4 left-4 rounded-full bg-slate-900/85 px-3 py-1.5 text-xs font-bold tracking-wide text-white uppercase backdrop-blur-xs">
                  Out of Stock
                </span>
              ) : null}

              {product.sku ? (
                <span className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-2.5 py-1 font-mono text-xs font-bold text-ink-800 shadow-xs border border-slate-200/80 backdrop-blur-xs">
                  SKU: {product.sku}
                </span>
              ) : null}
            </div>

            {/* Quality credentials strip */}
            <ul className="mt-4 grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheckIcon, label: "Certified Medical Alloy" },
                { icon: TruckIcon, label: "Same-Day Dispatch" },
                { icon: CertificateIcon, label: "ISO 13485 Compliant" },
              ].map((item) => (
                <li
                  key={item.label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-3 text-center shadow-2xs"
                >
                  <item.icon className="text-xl text-brand-700" />
                  <span className="text-[0.6875rem] font-bold text-ink-700 leading-tight">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Spec info & Procurement Console */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {category ? (
                <Link
                  href={`/products?category=${category.id}`}
                  className="inline-block text-xs font-bold tracking-wider text-brand-600 uppercase transition-colors hover:text-brand-800"
                >
                  {category.name}
                </Link>
              ) : null}

              <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink-900 tracking-tight">
                {product.name}
              </h1>

              {/* Status and Pricing Banner */}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-surface-muted p-3.5 border border-hairline text-sm">
                <div>
                  <span className="block text-[0.6875rem] uppercase font-bold text-ink-400">
                    Estimated Institutional Rate
                  </span>
                  <span className="text-xl font-extrabold text-brand-900">
                    {price ? price : "Quotation on Request"}
                  </span>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  {product.inStock ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-ink-500">
                      Special Order
                    </span>
                  )}
                </div>
              </div>

              {product.summary ? (
                <p className="mt-4 text-base font-medium text-ink-700 leading-relaxed">
                  {product.summary}
                </p>
              ) : null}

              {product.description ? (
                <p className="mt-3 text-sm leading-relaxed text-ink-500">
                  {product.description}
                </p>
              ) : null}

              {/* Key Features */}
              {product.features?.length ? (
                <div className="mt-5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2.5">
                    Clinical Features
                  </h2>
                  <ul className="flex flex-col gap-2">
                    {product.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-2.5 text-xs sm:text-sm leading-relaxed text-ink-700"
                      >
                        <CheckCircle2Icon className="mt-0.5 shrink-0 text-base text-brand-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {/* Inquiry Console */}
            <div className="mt-8">
              <ProductInquiryPanel product={product} />
            </div>
          </div>
        </div>

        {/* Technical Specifications Sheet */}
        {product.specs?.length ? (
          <div className="mt-14 border-t border-hairline pt-10">
            <div className="flex items-center gap-2.5 mb-4">
              <FileTextIcon className="text-xl text-brand-700" />
              <h2 className="text-xl font-bold text-ink-900">
                Technical Specifications &amp; Metallurgy
              </h2>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
              <dl className="divide-y divide-hairline">
                {product.specs.map((spec, index) => (
                  <div
                    key={spec.label}
                    className={`grid grid-cols-[minmax(9rem,35%)_1fr] gap-4 px-5 py-3.5 text-xs sm:text-sm ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                    }`}
                  >
                    <dt className="font-bold text-ink-700">
                      {spec.label}
                    </dt>
                    <dd className="font-medium text-ink-900">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ) : null}
      </Container>

      {/* --------------------------------------------------------- related products */}
      {related.length ? (
        <Section className="border-t border-hairline bg-surface-muted/50 !py-12 sm:!py-16">
          <Container>
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  Complementary Instruments
                </span>
                <h2 className="mt-1 text-2xl font-bold text-ink-900">
                  Frequently Ordered in Same Theatre Set
                </h2>
              </div>
              <Link
                href="/products"
                className="text-sm font-bold text-brand-700 transition-colors hover:text-brand-900"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <ContactBand
        title={`Questions regarding ${product.name}?`}
        body="Send a direct message on WhatsApp with your required quantities or hospital tender specifications. We provide formal quotations with full documentation."
      />
    </>
  );
}
