import Link from "next/link";
import { filterFeatured } from "@/lib/api";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/Icons";

export function FeaturedProducts({ products }: { products: Product[] }) {
  const featured = filterFeatured(products, 4);

  if (featured.length === 0) return null;

  return (
    <Section className="border-b border-hairline">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="High-Demand Lines"
            title="Hospital &amp; Clinical Best Sellers"
            description="Our most requested surgical instruments and daily ward consumables. Add directly to your procurement list for bulk institutional quotations."
          />
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-hairline bg-white px-4 py-2.5 text-sm font-bold text-brand-700 shadow-2xs transition-all duration-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-900 active:scale-95"
          >
            <span>Explore All 2,000+ Lines</span>
            <ArrowRightIcon className="text-base" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
