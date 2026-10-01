import Link from "next/link";
import { categories } from "@/data/categories";
import { countByCategory } from "@/lib/api";
import type { Product } from "@/types/product";
import { ProductArt } from "@/components/product/ProductArt";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/Icons";

export function CategoryGrid({ products }: { products: Product[] }) {
  return (
    <Section className="bg-surface-muted/60 border-b border-hairline">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Specialized Inventory"
            title="Browse by Medical Category"
            description="Six core clinical divisions supporting operating theatres, surgical wards, and outpatient clinics with over 2,000 reference lines."
          />
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-hairline bg-white px-4 py-2.5 text-sm font-bold text-brand-700 shadow-2xs transition-all duration-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-900 active:scale-95"
          >
            <span>View All Products</span>
            <ArrowRightIcon className="text-base" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const count = countByCategory(products, category.id);

            return (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-950/6"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-brand-50/50 p-1.5 transition-transform duration-300 group-hover:scale-105">
                      <ProductArt
                        product={{ name: category.name, art: category.art }}
                        size="thumb"
                      />
                    </div>

                    <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 tabular-nums border border-brand-200/50">
                      {count > 0 ? `${count} items` : "Available"}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-ink-900 transition-colors group-hover:text-brand-700">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">
                      {category.blurb}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-hairline/80 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-700 group-hover:text-brand-800 transition-colors">
                    Explore range
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-all duration-200 group-hover:bg-brand-600 group-hover:text-white group-hover:translate-x-0.5">
                    <ArrowRightIcon className="text-xs" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
