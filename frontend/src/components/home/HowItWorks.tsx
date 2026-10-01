import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { WhatsAppCta, CallCta, InquiryNote } from "@/components/ui/ContactCtas";
import { CartIcon, HeadsetIcon, WhatsAppIcon, ZapIcon, ShieldCheckIcon } from "@/components/ui/Icons";

const steps = [
  {
    step: "01",
    icon: CartIcon,
    title: "Compile Requirements",
    body: "Browse surgical categories and add required instruments, consumables, or hospital equipment. Set quantities with no minimum order constraints and zero checkout friction.",
    badge: "No account required",
  },
  {
    step: "02",
    icon: WhatsAppIcon,
    title: "One-Tap WhatsApp RFQ",
    body: "A single click formats your selected list into a clean specification message sent straight to our sales desk on WhatsApp. Review and transmit in seconds.",
    badge: "Direct sales channel",
  },
  {
    step: "03",
    icon: HeadsetIcon,
    title: "Quotation & Same-Day Dispatch",
    body: "Receive official institutional pricing, batch certificate documentation, and delivery timeline. Upon confirmation, stocked lines are dispatched immediately.",
    badge: "GST invoice included",
  },
];

export function HowItWorks() {
  return (
    <Section className="bg-surface-muted/60 border-b border-hairline">
      <Container>
        <SectionHeading
          eyebrow="Streamlined Procurement"
          title="Designed for Hospital Procurement Speed"
          description="We eliminate complex web checkouts. Medical procurement demands real-time stock verification, batch traceability, and rapid human coordination &mdash; delivered through WhatsApp."
          align="center"
          className="text-center"
        />

        <div className="relative mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.title}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-950/5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-200 group-hover:bg-brand-600 group-hover:text-white">
                    <item.icon className="text-xl" />
                  </div>

                  <span className="font-display text-2xl font-black tracking-tight text-slate-200 group-hover:text-brand-200 transition-colors">
                    {item.step}
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="text-lg font-bold text-ink-900 group-hover:text-brand-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {item.body}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-between text-xs font-semibold text-brand-700">
                <span>{item.badge}</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <ZapIcon className="text-xs" />
                  Speed-optimized
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <WhatsAppCta size="lg" label="Start Quotation on WhatsApp" />
            <CallCta size="lg" label="Speak to Medical Representative" />
          </div>
          <InquiryNote className="max-w-xl text-center" />
        </div>
      </Container>
    </Section>
  );
}
