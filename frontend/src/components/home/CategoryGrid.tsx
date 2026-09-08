import Link from "next/link";
import { categories } from "@/data/categories";
import { countByCategory } from "@/lib/api";
import type { Product } from "@/types/product";
import { ProductArt } from "@/components/product/ProductArt";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/Icons";

export function CategoryGrid({ products }: { products: Product[] }) {
  return (
    <Section className="bg-surface-muted/50">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="What we stock"
            title="Shop by category"
            description="Six core ranges covering theatre, ward and OPD - with over 2,000 lines available to order."
          />
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900"
          >
            View all products
            <ArrowRightIcon className="text-[1.05em]" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group flex items-start gap-4 rounded-2xl border border-hairline bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/8"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-hairline">
                <ProductArt
                  product={{ name: category.name, art: category.art }}
                  size="thumb"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-ink-900 transition-colors group-hover:text-brand-700">
                    {category.name}
                  </h3>
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[0.6875rem] font-bold text-brand-700 tabular-nums">
                    {countByCategory(products, category.id)}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                  {category.blurb}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                  Browse range
                  <ArrowRightIcon className="text-[1.05em] transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
