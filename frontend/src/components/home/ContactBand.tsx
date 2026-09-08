import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { CallCta, WhatsAppCta } from "@/components/ui/ContactCtas";
import { ClockIcon, MapPinIcon } from "@/components/ui/Icons";

/**
 * Full-width WhatsApp / call band. Repeated near the end of the home page and
 * reused on the product, cart and about pages so a contact channel is never
 * more than a screen away.
 */
export function ContactBand({
  title = "Can't find what you need?",
  body = "We stock over 2,000 lines and can source most items to order. Send us a list, a photo or a catalogue number - whatever you have.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-900">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-brand-950 to-brand-800"
      />
      <div aria-hidden="true" className="bg-dot-grid absolute inset-0 opacity-50" />

      <Container className="relative py-14 sm:py-16">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
            <p className="mt-3 leading-relaxed text-brand-100">{body}</p>

            <div className="mt-5 flex flex-col gap-2 text-sm text-brand-200 sm:flex-row sm:gap-6">
              <span className="flex items-center gap-2">
                <ClockIcon className="text-base text-brand-400" />
                {siteConfig.hours[0].days}: {siteConfig.hours[0].time}
              </span>
              <span className="flex items-center gap-2">
                <MapPinIcon className="text-base text-brand-400" />
                {siteConfig.address.city}, {siteConfig.address.state}
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0">
            <WhatsAppCta size="lg" label="Chat on WhatsApp" />
            <CallCta variant="call" size="lg" />
          </div>
        </div>
      </Container>
    </section>
  );
}
