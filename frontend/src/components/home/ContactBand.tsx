import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { CallCta, WhatsAppCta } from "@/components/ui/ContactCtas";
import { ClockIcon, MapPinIcon, ZapIcon } from "@/components/ui/Icons";

export function ContactBand({
  title = "Looking for a Specific Surgical Instrument or Custom Set?",
  body = "We stock over 2,000 reference lines and source rare implants and theatre equipment directly to order. Transmit an instrument list, manufacturer part number, or photograph on WhatsApp.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-950 text-white">
      {/* Background gradients and medical grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-brand-950 via-[#0a384f] to-brand-900"
      />
      <div aria-hidden="true" className="bg-dot-grid absolute inset-0 opacity-40" />

      {/* Ambient radial glow */}
      <div
        aria-hidden="true"
        className="absolute -right-20 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-brand-400/10 blur-3xl pointer-events-none"
      />

      <Container className="relative py-14 sm:py-18">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-900/60 px-3 py-1 text-xs font-semibold text-brand-200 backdrop-blur-xs mb-3">
              <ZapIcon className="text-emerald-400 text-xs" />
              <span>Fast Track Surgical Desk</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {title}
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-brand-100/90 font-normal">
              {body}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-brand-200">
              <span className="flex items-center gap-2">
                <ClockIcon className="text-base text-brand-400" />
                <span>{siteConfig.hours[0].days}: {siteConfig.hours[0].time}</span>
              </span>
              <span className="flex items-center gap-2">
                <MapPinIcon className="text-base text-brand-400" />
                <span>{siteConfig.address.city}, {siteConfig.address.state}</span>
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0">
            <WhatsAppCta size="lg" label="Inquire on WhatsApp" />
            <CallCta variant="call" size="lg" label="Call Sales Representative" />
          </div>
        </div>
      </Container>
    </section>
  );
}
