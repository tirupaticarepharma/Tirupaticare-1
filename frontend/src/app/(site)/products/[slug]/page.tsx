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
import { CheckIcon, ShieldCheckIcon, TruckIcon } from "@/components/ui/Icons";

type PageProps = { params: Promise<{ slug: string }> };

/**
 * Rendered on demand rather than at build time, because the catalogue lives
 * in MySQL: hiding or deleting a product in the admin panel takes effect on
 * the very next request.
 */
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

  // Covers "never existed", "deleted" and "hidden in the admin panel".
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
        className="border-b border-hairline bg-surface-muted/50"
      >
        <Container className="flex flex-wrap items-center gap-2 py-3 text-sm text-ink-500">
          <Link href="/" className="transition-colors hover:text-brand-700">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/products"
            className="transition-colors hover:text-brand-700"
          >
            Products
          </Link>
          {category ? (
            <>
              <span aria-hidden="true">/</span>
              <Link
                href={`/products?category=${category.id}`}
                className="transition-colors hover:text-brand-700"
              >
                {category.name}
              </Link>
            </>
          ) : null}
          <span aria-hidden="true">/</span>
          <span className="font-medium text-ink-900">{product.name}</span>
        </Container>
      </nav>

      {/* --------------------------------------------------------- product */}
      <Container className="py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Artwork */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-hairline">
              <div className={product.inStock ? "" : "opacity-55 saturate-50"}>
                <ProductArt product={product} size="detail" />
              </div>

              {!product.inStock ? (
                <span className="absolute top-4 left-4 rounded-full bg-ink-900/85 px-3 py-1.5 text-xs font-bold tracking-wide text-white uppercase">
                  Out of stock
                </span>
              ) : null}
            </div>

            <ul className="mt-4 grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheckIcon, label: "Certified quality" },
                { icon: TruckIcon, label: "Fast dispatch" },
                { icon: CheckIcon, label: "Bulk pricing" },
              ].map((item) => (
                <li
                  key={item.label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-hairline bg-white px-2 py-3 text-center"
                >
                  <item.icon className="text-lg text-brand-600" />
                  <span className="text-[0.6875rem] leading-tight font-medium text-ink-700">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Details */}
          <div>
            {category ? (
              <Link
                href={`/products?category=${category.id}`}
                className="text-xs font-bold tracking-wider text-brand-600 uppercase transition-colors hover:text-brand-800"
              >
                {category.name}
              </Link>
            ) : null}

            <h1 className="mt-2 text-3xl font-extrabold text-ink-900 sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-ink-500">
              {product.sku ? (
                <>
                  <span>
                    SKU{" "}
                    <span className="font-semibold text-ink-700">
                      {product.sku}
                    </span>
                  </span>
                  <span aria-hidden="true">&middot;</span>
                </>
              ) : null}

              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 font-medium text-brand-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                  In stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-medium text-ink-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-ink-300" />
                  Out of stock
                </span>
              )}

              <span aria-hidden="true">&middot;</span>
              <span>
                {price ? (
                  <span className="font-bold text-ink-900">{price}</span>
                ) : (
                  "Price on request"
                )}
              </span>
            </div>

            {product.description ? (
              <p className="mt-5 leading-relaxed text-ink-700">
                {product.description}
              </p>
            ) : null}

            {product.features?.length ? (
              <ul className="mt-5 flex flex-col gap-2.5">
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-2.5 text-sm leading-relaxed text-ink-700"
                  >
                    <CheckIcon className="mt-0.5 shrink-0 text-base text-brand-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-7">
              <ProductInquiryPanel product={product} />
            </div>

            {/* Specifications */}
            {product.specs?.length ? (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-ink-900">
                  Specifications
                </h2>
                <dl className="mt-3 overflow-hidden rounded-xl border border-hairline">
                  {product.specs.map((spec, index) => (
                    <div
                      key={spec.label}
                      className={`grid grid-cols-[minmax(7.5rem,40%)_1fr] gap-4 px-4 py-3 text-sm ${
                        index % 2 === 0 ? "bg-white" : "bg-surface-muted/60"
                      }`}
                    >
                      <dt className="font-semibold text-ink-700">
                        {spec.label}
                      </dt>
                      <dd className="text-ink-500">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>
        </div>
      </Container>

      {/* --------------------------------------------------------- related */}
      {related.length ? (
        <Section className="border-t border-hairline bg-surface-muted/40 !py-12 sm:!py-16">
          <Container>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-bold text-ink-900">
                You may also need
              </h2>
              <Link
                href="/products"
                className="text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900"
              >
                View all
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <ContactBand
        title="Questions about this product?"
        body="Send us a message and we'll come back with pricing, alternatives and delivery time. Bulk and institutional rates on request."
      />
    </>
  );
}
