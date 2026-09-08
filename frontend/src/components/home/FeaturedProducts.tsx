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
    <Section>
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Best sellers"
            title="Popular with our customers"
            description="The lines hospitals and clinics reorder most often. Add them to your inquiry list and send it over in one tap."
          />
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900"
          >
            See all products
            <ArrowRightIcon className="text-[1.05em]" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
