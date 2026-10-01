import type { Metadata } from "next";
import { fullAddress, siteConfig } from "@/config/site";
import { generalInquiryMessage, whatsappLink } from "@/lib/whatsapp";
import { Container, Section } from "@/components/ui/Container";
import { WhatsAppComposer } from "@/components/contact/WhatsAppComposer";
import { ContactBand } from "@/components/home/ContactBand";
import {
  ClockIcon,
  ExternalLinkIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
  ZapIcon,
} from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${siteConfig.name} in ${siteConfig.address.city}. Surgical equipment quotations, WhatsApp desk, phone, email, and shop warehouse location.`,
};

const channels = [
  {
    icon: WhatsAppIcon,
    label: "WhatsApp Quick Quote Desk",
    value: siteConfig.phoneDisplay,
    hint: "Fastest response &bull; Typically within 15–30 mins",
    href: whatsappLink(generalInquiryMessage),
    accent: true,
    external: true,
    action: "Open Chat",
  },
  {
    icon: PhoneIcon,
    label: "Direct Phone Desk",
    value: siteConfig.phoneDisplay,
    hint: "Operating hours &bull; Immediate verbal stock consult",
    href: `tel:${siteConfig.phoneHref}`,
    accent: false,
    external: false,
    action: "Call Desk",
  },
  {
    icon: MailIcon,
    label: "Institutional Tenders & Orders",
    value: siteConfig.email,
    hint: "For hospital tenders, POs, and rate contract contracts",
    href: `mailto:${siteConfig.email}`,
    accent: false,
    external: false,
    action: "Send Email",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ---------------------------------------------------- page header */}
      <section className="border-b border-hairline bg-surface-muted/60">
        <Container className="py-12 sm:py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 mb-3 shadow-2xs">
            <ZapIcon className="text-xs" />
            <span>Dedicated Procurement Support</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink-900">
            Contact Tirupati Surgicals
          </h1>

          <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-ink-500">
            WhatsApp is our fastest communication channel. Transmit an instrument list, manufacturer catalogue number, or photograph &mdash; our surgical specialists verify warehouse inventory and quote institutional pricing immediately.
          </p>
        </Container>
      </section>

      {/* -------------------------------------------------------- channels */}
      <Container className="py-10 sm:py-14">
        <div className="grid gap-5 sm:grid-cols-3">
          {channels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.external ? "_blank" : undefined}
              rel={channel.external ? "noopener noreferrer" : undefined}
              className={`group flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                channel.accent
                  ? "border-emerald-500/30 bg-emerald-50/30 hover:border-emerald-500 hover:shadow-emerald-500/10"
                  : "border-slate-200/90 bg-white hover:border-brand-300 hover:shadow-brand-950/5"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl shadow-2xs ${
                      channel.accent
                        ? "bg-linear-to-b from-whatsapp to-whatsapp-dark text-white"
                        : "bg-brand-50 text-brand-700"
                    }`}
                  >
                    <channel.icon />
                  </span>

                  <span className="text-xs font-bold text-brand-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    {channel.action} &rarr;
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-bold tracking-wider text-ink-400 uppercase">
                    {channel.label}
                  </p>
                  <p className="mt-1 text-lg font-bold break-words text-ink-900">
                    {channel.value}
                  </p>
                  <p
                    className="mt-1 text-xs text-ink-500 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: channel.hint }}
                  />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* ------------------------------------------- details + composer */}
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Address */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <MapPinIcon className="text-lg" />
                </div>
                <h2 className="text-base font-bold text-ink-900">
                  Sales Office &amp; Warehouse
                </h2>
              </div>

              <address className="mt-4 text-sm leading-relaxed whitespace-pre-line text-ink-700 not-italic font-normal">
                {siteConfig.address.line1}
                {"\n"}
                {siteConfig.address.line2}
                {"\n"}
                {siteConfig.address.city}, {siteConfig.address.state}{" "}
                {siteConfig.address.postalCode}
                {"\n"}
                {siteConfig.address.country}
              </address>

              <div className="mt-4 pt-3 border-t border-hairline">
                <a
                  href={siteConfig.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 transition-colors hover:text-brand-900"
                >
                  <span>Open Directions on Google Maps</span>
                  <ExternalLinkIcon className="text-xs" />
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <ClockIcon className="text-lg" />
                  </div>
                  <h2 className="text-base font-bold text-ink-900">
                    Operating Schedule
                  </h2>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[0.6875rem] font-bold text-emerald-700 border border-emerald-200/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Desk Active
                </span>
              </div>

              <dl className="mt-4 flex flex-col divide-y divide-hairline text-xs sm:text-sm">
                {siteConfig.hours.map((entry) => (
                  <div
                    key={entry.days}
                    className="flex justify-between gap-4 py-2.5"
                  >
                    <dt className="font-semibold text-ink-700">{entry.days}</dt>
                    <dd className="text-right text-ink-500">{entry.time}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-4 text-xs leading-relaxed text-ink-400 bg-surface-muted p-2.5 rounded-xl border border-hairline/60">
                Emergency theatre supply: transmit message on WhatsApp outside office hours for priority dispatch handling.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <WhatsAppComposer />
          </div>
        </div>
      </Container>

      {/* ------------------------------------------------------------- map */}
      <Section className="!pt-0 !pb-14">
        <Container>
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 shadow-xs">
            <iframe
              src={siteConfig.mapsEmbed}
              title={`Map displaying location of ${siteConfig.name}`}
              width="100%"
              height="400"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
              allowFullScreen
            />
          </div>
          <p className="mt-3 text-xs text-ink-400">{fullAddress}</p>
        </Container>
      </Section>

      <ContactBand
        title="Need an Emergency Dispatch Quote?"
        body="Message our on-duty surgical coordinator with your product SKU or instrument photograph for immediate confirmation."
      />
    </>
  );
}
