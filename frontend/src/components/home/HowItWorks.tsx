import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { WhatsAppCta, CallCta, InquiryNote } from "@/components/ui/ContactCtas";
import { CartIcon, HeadsetIcon, WhatsAppIcon } from "@/components/ui/Icons";

const steps = [
  {
    icon: CartIcon,
    title: "Build your list",
    body: "Add the instruments, consumables or equipment you need. Quantities are yours to set - there is no minimum and no payment step.",
  },
  {
    icon: WhatsAppIcon,
    title: "Send it on WhatsApp",
    body: "One tap turns your list into a message, already written and addressed to us. Review it, hit send, and it is with our sales desk.",
  },
  {
    icon: HeadsetIcon,
    title: "We confirm and dispatch",
    body: "You get pricing, stock status and delivery time back on the same chat. Approve it and stocked items go out the same day.",
  },
];

export function HowItWorks() {
  return (
    <Section className="bg-surface-muted/50">
      <Container>
        <SectionHeading
          eyebrow="How ordering works"
          title="No checkout. Just a conversation."
          description="This is a catalogue, not a payment portal. You choose what you need, we quote it properly - the way institutional supply has always worked, only faster."
          align="center"
          className="text-center"
        />

        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative flex flex-col gap-4 rounded-2xl border border-hairline bg-white p-6"
            >
              <span className="absolute top-6 right-6 font-display text-4xl font-extrabold text-brand-50">
                {index + 1}
              </span>

              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl text-brand-700">
                <step.icon />
              </span>

              <div>
                <h3 className="text-lg font-bold text-ink-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <WhatsAppCta size="lg" label="Start on WhatsApp" />
            <CallCta size="lg" />
          </div>
          <InquiryNote className="max-w-md text-center" />
        </div>
      </Container>
    </Section>
  );
}
