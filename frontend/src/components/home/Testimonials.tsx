import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { QuoteIcon, StarIcon } from "@/components/ui/Icons";

/**
 * SAMPLE TESTIMONIALS - replace with real, attributable quotes before launch.
 * Names, roles and institutions below are placeholders.
 */
const testimonials = [
  {
    quote:
      "We send our monthly consumables list over WhatsApp and it is confirmed within the hour. It has taken a whole layer of paperwork out of our procurement.",
    name: "[REPLACE_ME] Dr. A. Sharma",
    role: "Medical Superintendent",
    org: "[REPLACE_ME] City Multispeciality Hospital",
  },
  {
    quote:
      "Instrument quality is consistent, and when something is out of stock they tell you straight away instead of leaving you waiting. That matters more than the price.",
    name: "[REPLACE_ME] S. Menon",
    role: "OT In-charge",
    org: "[REPLACE_ME] Sunrise Nursing Home",
  },
  {
    quote:
      "As a solo practitioner I order small quantities and still get treated properly. Same-day delivery within the city has never failed us.",
    name: "[REPLACE_ME] Dr. R. Iyer",
    role: "Consultant Surgeon",
    org: "[REPLACE_ME] Iyer Clinic",
  },
];

export function Testimonials() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Customer feedback"
          title="Trusted by the people who use it daily"
          description="Hospitals, nursing homes, clinics and individual practitioners across the region."
          align="center"
          className="text-center"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex flex-col gap-4 rounded-2xl border border-hairline bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex gap-0.5 text-accent-500"
                  aria-label="Rated 5 out of 5"
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon key={index} className="text-sm" />
                  ))}
                </div>
                <QuoteIcon className="text-2xl text-brand-100" />
              </div>

              <blockquote className="flex-1 text-sm leading-relaxed text-ink-700">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <figcaption className="border-t border-hairline pt-4">
                <p className="text-sm font-bold text-ink-900">
                  {testimonial.name}
                </p>
                <p className="text-xs text-ink-500">
                  {testimonial.role} &middot; {testimonial.org}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}
