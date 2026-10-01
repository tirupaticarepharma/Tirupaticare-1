import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { categories } from "@/data/categories";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { ContactBand } from "@/components/home/ContactBand";
import { TrustStats } from "@/components/home/TrustStats";
import { CallCta, WhatsAppCta } from "@/components/ui/ContactCtas";
import {
  BadgeIcon,
  CertificateIcon,
  CheckCircle2Icon,
  HeadsetIcon,
  HospitalIcon,
  ShieldCheckIcon,
  TruckIcon,
  ZapIcon,
} from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${siteConfig.name} - surgical instruments and medical equipment supplier serving hospitals, clinics, nursing homes, and surgeons since 1999.`,
};

const values = [
  {
    icon: ShieldCheckIcon,
    title: "100% Genuine Certified Stock",
    body: "We procure exclusively from accredited manufacturers and authorized primary distributors. Every surgical instrument and implant lot is batch-traceable with test certificates.",
  },
  {
    icon: TruckIcon,
    title: "Emergency & Same-Day Dispatch",
    body: "Standard theatre lines leave our warehouse the same working day. Urgent hospital deliveries within the city are coordinated in hours to prevent OT schedule disruptions.",
  },
  {
    icon: HeadsetIcon,
    title: "Direct Specialist Coordination",
    body: "You interact with experienced surgical supply executives via WhatsApp or direct phone. No automated chatbots, no delayed ticketing queues &mdash; immediate clinical answers.",
  },
  {
    icon: BadgeIcon,
    title: "Institutional Rate Contracts",
    body: "We support annual rate contracts, tender documentation, consolidated monthly hospital billing, and bulk volume discount pricing for healthcare networks.",
  },
];

const customers = [
  "Multispeciality Hospitals",
  "Surgical Daycare Centres",
  "Specialist Polyclinics",
  "Private Nursing Homes",
  "Consultant Surgeons",
  "Medical & Research Colleges",
  "Trauma & Ortho Clinics",
  "Diagnostic Laboratories",
];

export default function AboutPage() {
  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-brand-950 via-[#072c40] to-brand-900"
        />
        <div aria-hidden="true" className="bg-dot-grid absolute inset-0 opacity-40" />

        <Container className="relative py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-900/60 px-3.5 py-1 text-xs font-semibold text-brand-200 backdrop-blur-xs mb-4">
              <CertificateIcon className="text-sm text-brand-300" />
              <span>Two Decades of Clinical Excellence</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-white leading-tight">
              Supplying the surgical teams who care for everyone else.
            </h1>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-brand-100/90 font-normal">
              {siteConfig.name} has supplied certified surgical instruments, implants, and hospital furniture to healthcare institutions for over 25 years. We combine deep metallurgical knowledge with fast WhatsApp coordination and dependable same-day dispatch.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <WhatsAppCta size="lg" label="Contact Surgical Desk" />
              <CallCta variant="call" size="lg" label="Call Management Office" />
            </div>
          </div>
        </Container>
      </section>

      <TrustStats />

      {/* ---------------------------------------------------------- story & institutional scope */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 items-start">
            <div className="lg:col-span-7">
              <SectionHeading
                eyebrow="Our Operational Philosophy"
                title="Digital Catalogue Clarity, Direct Human Quotation"
                description="Modern hospital procurement is nuanced. Factors like custom alloys, specific handle knurlings, sterilization autoclave cycles, and tender volume discounts cannot be handled by a generic e-commerce checkout."
              />

              <div className="mt-6 flex flex-col gap-4 text-sm sm:text-base leading-relaxed text-ink-700">
                <p>
                  Our digital platform gives you instant access to our comprehensive 2,000+ item catalogue. You select your exact lines, configure quantities, and with one tap transmit a formatted specification directly to our surgical sales desk.
                </p>
                <p>
                  Within minutes, our team verifies warehouse availability, applies applicable institutional rate tiers, and replies with a formal quotation. No hidden fees, no premature credit card charges &mdash; complete institutional transparency.
                </p>
              </div>

              <ul className="mt-6 flex flex-col gap-3">
                {[
                  "No registration or login required to build an inquiry",
                  "Zero payment collected online &mdash; official GST invoicing upon delivery",
                  "Immediate quotation with batch certification documentation",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex gap-2.5 text-sm font-semibold text-ink-800"
                  >
                    <CheckCircle2Icon className="mt-0.5 shrink-0 text-base text-brand-600" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who we supply panel */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200/90 bg-surface-muted/60 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2">
                <HospitalIcon className="text-xl text-brand-700" />
                <h3 className="text-lg font-bold text-ink-900">
                  Institutions We Serve
                </h3>
              </div>

              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {customers.map((customer) => (
                  <li
                    key={customer}
                    className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-ink-700 border border-slate-200/60 shadow-2xs"
                  >
                    <CheckCircle2Icon className="shrink-0 text-emerald-500 text-xs" />
                    <span>{customer}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-ink-400">
                Major Product Divisions
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-brand-800 shadow-2xs"
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------- core values */}
      <Section className="bg-surface-muted/60 border-t border-hairline">
        <Container>
          <SectionHeading
            eyebrow="Quality Commitment"
            title="Four Pillars of Clinical Reliability"
            description="Every surgical tool and medical consumable that leaves our facility adheres to strict quality benchmarks."
            align="center"
            className="text-center"
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs transition-all duration-300 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-950/5 hover:-translate-y-0.5"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-2xl text-brand-700">
                  <value.icon />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-ink-900">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-500">
                    {value.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <ContactBand
        title="Establish an Institutional Rate Contract"
        body="Hospitals and surgical centres can apply for dedicated account management, credit terms, and consolidated monthly billing. Message us on WhatsApp to initiate onboarding."
      />
    </>
  );
}
