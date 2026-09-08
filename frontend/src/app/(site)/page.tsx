import { getCatalogue } from "@/lib/api";

/** Rendered per request so admin changes appear on the site immediately. */
export const dynamic = "force-dynamic";

import { Hero } from "@/components/home/Hero";
import { TrustStats } from "@/components/home/TrustStats";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { ContactBand } from "@/components/home/ContactBand";

export default async function HomePage() {
  // Fetched once on the server and shared by the sections below, so the home
  // page makes a single API call and ships the catalogue in its HTML.
  const { products } = await getCatalogue();

  return (
    <>
      <Hero products={products} />
      <TrustStats />
      <CategoryGrid products={products} />
      <FeaturedProducts products={products} />
      <HowItWorks />
      <Testimonials />
      <ContactBand />
    </>
  );
}
