import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { CheckCircle2Icon, QuoteIcon, StarIcon } from "@/components/ui/Icons";

const testimonials = [
  {
    quote:
      "We transmit our monthly surgical consumables and instrument list directly over WhatsApp. Pricing and dispatch confirmation arrive in under an hour. It has completely eliminated procurement delays for our OT.",
    name: "Dr. A. Sharma",
    initials: "AS",
    role: "Medical Superintendent",
    org: "City Multispeciality Hospital",
    city: "Pune",
  },
  {
    quote:
      "Instrument metallurgy and blade sharpness are exceptionally consistent across repeated autoclave cycles. When a specialized item is out of stock, they provide immediate certified alternatives.",
    name: "S. Menon",
    initials: "SM",
    role: "Operation Theatre In-Charge",
    org: "Sunrise Surgical Nursing Home",
    city: "Maharashtra",
  },
  {
    quote:
      "Even for specialized individual surgeon sets and lower unit counts, we receive institutional-tier attention and prompt same-day local dispatch. Their reliability is unmatched.",
    name: "Dr. R. Iyer",
    initials: "RI",
    role: "Consultant Orthopedic Surgeon",
    org: "Iyer Ortho Clinic & Trauma Care",
    city: "Pune",
  },
];

export function Testimonials() {
  return (
    <Section className="border-b border-hairline">
      <Container>
        <SectionHeading
          eyebrow="Clinical Endorsements"
          title="Trusted by Surgeons, OTs &amp; Hospital Administrators"
          description="Supplying over 500 healthcare facilities, private surgical suites, and individual practitioners across the region."
          align="center"
          className="text-center"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs transition-all duration-300 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-950/5 hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between">
                  {/* Star rating */}
                  <div
                    className="flex gap-1 text-amber-400"
                    aria-label="Rated 5 out of 5 stars"
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarIcon key={index} className="text-sm" />
                    ))}
                  </div>

                  <QuoteIcon className="text-2xl text-brand-200/80" />
                </div>

                <blockquote className="mt-4 text-sm sm:text-[0.9375rem] leading-relaxed text-ink-700 font-normal">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
              </div>

              <figcaption className="mt-6 border-t border-hairline pt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-sm font-bold text-brand-800">
                  {testimonial.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-bold text-ink-900">
                      {testimonial.name}
                    </p>
                    <CheckCircle2Icon className="text-emerald-500 text-xs shrink-0" />
                  </div>
                  <p className="truncate text-xs text-ink-500">
                    {testimonial.role} &bull; {testimonial.org}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}
