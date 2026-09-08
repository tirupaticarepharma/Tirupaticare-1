import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CallCta, WhatsAppCta } from "@/components/ui/ContactCtas";
import { ArrowRightIcon } from "@/components/ui/Icons";

/**
 * Root 404. It sits outside the (site) route group - which is where the
 * header and footer normally come from - so it renders them itself.
 */
export default function NotFound() {
  return (
    <>
      <Header />

      <main className="flex-1">
        <Container className="flex flex-col items-center gap-6 py-24 text-center sm:py-32">
          <p className="font-display text-6xl font-extrabold text-brand-100">
            404
          </p>

          <div className="max-w-md">
            <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">
              We couldn&rsquo;t find that page
            </h1>
            <p className="mt-3 leading-relaxed text-ink-500">
              The product may have been renamed, taken off the site or sold out.
              Try the full product list, or just ask us directly &mdash; we
              stock plenty that isn&rsquo;t listed online.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/products" size="lg">
              Browse Products
              <ArrowRightIcon className="text-[1.1em]" />
            </Button>
            <WhatsAppCta size="lg" />
            <CallCta size="lg" label="Call Now" />
          </div>
        </Container>
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
