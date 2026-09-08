import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart/CartPageContent";
import { ContactBand } from "@/components/home/ContactBand";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Your Inquiry List",
  description:
    "Review the products you have selected and send the list to us on WhatsApp for pricing and availability. No payment is taken online.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <section className="border-b border-hairline bg-linear-to-b from-brand-50 to-white">
        <Container className="py-8 sm:py-12">
          <p className="text-xs font-bold tracking-wider text-brand-600 uppercase">
            Step 1 of 2
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-ink-900 sm:text-4xl">
            Your Inquiry List
          </h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-500">
            Check the quantities below, then send the list to us on WhatsApp.
            It opens with the message already written &mdash; you just press
            send.
          </p>
        </Container>
      </section>

      <CartPageContent />

      <ContactBand
        title="Prefer to talk it through?"
        body="Call us during business hours and we'll take your requirement over the phone, or send a photo of your existing order list on WhatsApp."
      />
    </>
  );
}
