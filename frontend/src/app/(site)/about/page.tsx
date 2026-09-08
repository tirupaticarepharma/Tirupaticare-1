import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { categories } from "@/data/categories";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { ContactBand } from "@/components/home/ContactBand";
import { TrustStats } from "@/components/home/TrustStats";
import { CallCta, WhatsAppCta } from "@/components/ui/ContactCtas";
import {
  BadgeIcon,
  CheckIcon,
  HeadsetIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${siteConfig.name} - a surgical instruments and medical equipment supplier serving hospitals, clinics, nursing homes and individual practitioners.`,
};

/* SAMPLE COPY - replace with the real company story. */
const values = [
  {
    icon: ShieldCheckIcon,
    title: "Genuine stock, every time",
    body: "We buy direct from manufacturers and authorised distributors. Every implant and instrument is lot traceable, and documentation comes with the delivery.",
  },
  {
    icon: TruckIcon,
    title: "Dispatch that keeps up",
    body: "Stocked lines leave the same working day. Local deliveries are usually with you within hours, because a theatre list will not wait.",
  },
  {
    icon: HeadsetIcon,
    title: "A person, not a portal",
    body: "You deal with the same small team on WhatsApp or the phone. No ticket numbers, no chatbots, no waiting for a callback that never comes.",
  },
  {
    icon: BadgeIcon,
    title: "Priced for institutions",
    body: "Annual rate contracts, tender documentation and consolidated monthly billing for hospitals and nursing homes on request.",
  },
];

const customers = [
  "Multispeciality hospitals",
  "Private clinics & polyclinics",
  "Nursing homes",
  "Individual practitioners",
  "Medical & nursing students",
  "Diagnostic centres",
  "Veterinary practices",
  "Home care attendants",
];

export default function AboutPage() {
  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden bg-brand-900">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-br from-brand-950 via-brand-900 to-brand-800"
        />
        <div
          aria-hidden="true"
          className="bg-dot-grid absolute inset-0 opacity-50"
        />

        <Container className="relative py-14 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold tracking-wider text-brand-300 uppercase">
              About us
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-balance text-white sm:text-5xl">
              Supplying the people who look after everyone else.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-brand-100 sm:text-lg">
              {/* [REPLACE_ME] Company story */}
              {siteConfig.name} has supplied surgical instruments, consumables
              and equipment to hospitals, clinics and practitioners for over two
              decades. We started as a single counter opposite a district
              hospital, and the way we work has not really changed since: know
              the stock, answer the phone, deliver on time.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <WhatsAppCta size="lg" />
              <CallCta variant="call" size="lg" />
            </div>
          </div>
        </Container>
      </section>

      <TrustStats />

      {/* ---------------------------------------------------------- story */}
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Our approach"
                title="Catalogue online, conversation on WhatsApp"
                description="We deliberately do not run a checkout. Medical procurement has variables a shopping cart cannot handle - substitutes, pack sizes, rate contracts, urgency."
              />

              <div className="mt-6 flex flex-col gap-4 leading-relaxed text-ink-700">
                <p>
                  So the site does the part it is good at: showing you what we
                  carry, letting you gather what you need, and handing that list
                  to a human being who can quote it properly.
                </p>
                <p>
                  You get a written quote back on the same chat, with stock
                  status and delivery time. Nothing is charged, and nothing is
                  dispatched, until you confirm.
                </p>
              </div>

              <ul className="mt-6 flex flex-col gap-2.5">
                {[
                  "No account required to send an inquiry",
                  "No payment details taken on this website",
                  "Written quotes you can forward to purchasing",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex gap-2.5 text-sm font-medium text-ink-700"
                  >
                    <CheckIcon className="mt-0.5 shrink-0 text-base text-brand-600" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Who we supply */}
            <div className="rounded-2xl border border-hairline bg-surface-muted/60 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-ink-900">Who we supply</h3>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {customers.map((customer) => (
                  <li
                    key={customer}
                    className="flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-2.5 text-sm font-medium text-ink-700"
                  >
                    <CheckIcon className="shrink-0 text-base text-brand-600" />
                    {customer}
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 text-lg font-bold text-ink-900">
                What we carry
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="rounded-full border border-hairline bg-white px-3.5 py-1.5 text-sm font-medium text-ink-700"
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------- values */}
      <Section className="bg-surface-muted/50">
        <Container>
          <SectionHeading
            eyebrow="Why buy from us"
            title="Four things we do not compromise on"
            align="center"
            className="text-center"
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="flex gap-4 rounded-2xl border border-hairline bg-white p-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-2xl text-brand-700">
                  <value.icon />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-ink-900">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {value.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <ContactBand
        title="Want to set up an account?"
        body="Hospitals and nursing homes can request a rate contract, credit terms and consolidated monthly billing. Message us and we'll send the paperwork."
      />
    </>
  );
}
