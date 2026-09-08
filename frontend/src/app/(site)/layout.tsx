import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartToast } from "@/components/cart/CartToast";
import { FloatingActions } from "@/components/ui/FloatingActions";

/**
 * Chrome for the PUBLIC site: header, footer, the cart drawer and the
 * always-on WhatsApp / call buttons.
 *
 * The admin panel lives outside this route group (src/app/admin) so it does
 * not inherit any of it.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <Header />

      <main id="main" className="flex-1">
        {children}
      </main>

      <Footer />

      {/* Cart UI + always-on contact channels, on every public page. */}
      <CartDrawer />
      <CartToast />
      <FloatingActions />
    </>
  );
}
