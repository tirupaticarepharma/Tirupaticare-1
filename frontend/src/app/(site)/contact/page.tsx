import type { Metadata } from "next";
import { fullAddress, siteConfig } from "@/config/site";
import { generalInquiryMessage, whatsappLink } from "@/lib/whatsapp";
import { Container, Section } from "@/components/ui/Container";
import { WhatsAppComposer } from "@/components/contact/WhatsAppComposer";
import { ContactBand } from "@/components/home/ContactBand";
import {
  ClockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Contact",
  description: `Call, WhatsApp or visit ${siteConfig.name} in ${siteConfig.address.city}. Address, phone number, email and business hours.`,
};

/** The three ways to reach us, WhatsApp first. */
const channels = [
  {
    icon: WhatsAppIcon,
    label: "WhatsApp",
    value: siteConfig.phoneDisplay,
    hint: "Fastest reply, usually within the hour",
    href: whatsappLink(generalInquiryMessage),
    accent: true,
    external: true,
  },
  {
    icon: PhoneIcon,
    label: "Phone",
    value: siteConfig.phoneDisplay,
    hint: "During business hours",
    href: `tel:${siteConfig.phoneHref}`,
    accent: false,
    external: false,
  },
  {
    icon: MailIcon,
    label: "Email",
    value: siteConfig.email,
    hint: "For tenders, rate contracts and documentation",
    href: `mailto:${siteConfig.email}`,
    accent: false,
    external: false,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ---------------------------------------------------- page header */}
      <section className="border-b border-hairline bg-linear-to-b from-brand-50 to-white">
        <Container className="py-10 sm:py-14">
          <p className="text-xs font-bold tracking-wider text-brand-600 uppercase">
            Get in touch
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-ink-900 sm:text-4xl">
            Contact {siteConfig.name}
          </h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-500">
            WhatsApp is the quickest way to reach us &mdash; send a list, a
            photo or a catalogue number and we&rsquo;ll come straight back with
            pricing and availability.
          </p>
        </Container>
      </section>

      {/* -------------------------------------------------------- channels */}
      <Container className="py-10 sm:py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {channels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.external ? "_blank" : undefined}
              rel={channel.external ? "noopener noreferrer" : undefined}
              className={`group flex flex-col gap-3 rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                channel.accent
                  ? "border-whatsapp/30 bg-whatsapp/5 hover:border-whatsapp hover:shadow-whatsapp/10"
                  : "border-hairline bg-white hover:border-brand-200 hover:shadow-brand-900/8"
              }`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${
                  channel.accent
                    ? "bg-whatsapp text-white"
                    : "bg-brand-50 text-brand-700"
                }`}
              >
                <channel.icon />
              </span>
              <div>
                <p className="text-xs font-bold tracking-wide text-ink-500 uppercase">
                  {channel.label}
                </p>
                <p className="mt-1 text-lg font-bold break-words text-ink-900">
                  {channel.value}
                </p>
                <p className="mt-1 text-sm text-ink-500">{channel.hint}</p>
              </div>
            </a>
          ))}
        </div>

        {/* ------------------------------------------- details + composer */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col gap-6">
            {/* Address */}
            <div className="rounded-2xl border border-hairline bg-white p-5 sm:p-6">
              <h2 className="flex items-center gap-2.5 text-lg font-bold text-ink-900">
                <MapPinIcon className="text-brand-600" />
                Visit the shop
              </h2>
              <address className="mt-3 text-sm leading-relaxed whitespace-pre-line text-ink-700 not-italic">
                {siteConfig.address.line1}
                {"\n"}
                {siteConfig.address.line2}
                {"\n"}
                {siteConfig.address.city}, {siteConfig.address.state}{" "}
                {siteConfig.address.postalCode}
                {"\n"}
                {siteConfig.address.country}
              </address>
              <a
                href={siteConfig.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900"
              >
                Get directions on Google Maps &rarr;
              </a>
            </div>

            {/* Hours */}
            <div className="rounded-2xl border border-hairline bg-white p-5 sm:p-6">
              <h2 className="flex items-center gap-2.5 text-lg font-bold text-ink-900">
                <ClockIcon className="text-brand-600" />
                Business hours
              </h2>
              <dl className="mt-3 flex flex-col divide-y divide-hairline text-sm">
                {siteConfig.hours.map((entry) => (
                  <div
                    key={entry.days}
                    className="flex justify-between gap-4 py-2.5"
                  >
                    <dt className="font-medium text-ink-700">{entry.days}</dt>
                    <dd className="text-right text-ink-500">{entry.time}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-ink-500">
                Emergency and after-hours requirements: send a WhatsApp message
                and we&rsquo;ll respond as soon as we can.
              </p>
            </div>
          </div>

          <WhatsAppComposer />
        </div>
      </Container>

      {/* ------------------------------------------------------------- map */}
      <Section className="!pt-0 !pb-12">
        <Container>
          <div className="overflow-hidden rounded-2xl border border-hairline">
            <iframe
              /* [REPLACE_ME] Swap siteConfig.mapsEmbed for the real embed URL. */
              src={siteConfig.mapsEmbed}
              title={`Map showing the location of ${siteConfig.name}`}
              width="100%"
              height="420"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
              allowFullScreen
            />
          </div>
          <p className="mt-3 text-xs text-ink-300">{fullAddress}</p>
        </Container>
      </Section>

      <ContactBand
        title="Ready when you are"
        body="Send your requirement on WhatsApp and we'll reply with a written quote, stock status and delivery time."
      />
    </>
  );
}
