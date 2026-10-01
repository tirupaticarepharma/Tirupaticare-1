/** Shared layout primitives: page container, section rhythm, and modern medical headings. */

export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  className = "",
  id,
  children,
}: {
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`py-14 sm:py-20 lg:py-24 ${className}`}>
      {children}
    </section>
  );
}

export function Eyebrow({
  children,
  tone = "brand",
}: {
  children: React.ReactNode;
  tone?: "brand" | "light" | "success";
}) {
  const toneClasses = {
    brand: "border-brand-200/80 bg-brand-50/90 text-brand-700 shadow-xs",
    light: "border-white/20 bg-white/10 text-brand-100 backdrop-blur-md",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  }[tone];

  const dotClasses = {
    brand: "bg-brand-500",
    light: "bg-brand-300",
    success: "bg-emerald-500",
  }[tone];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-bold tracking-wider uppercase transition-colors ${toneClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotClasses} animate-pulse`} />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "brand",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "brand" | "light";
  className?: string;
}) {
  const alignment =
    align === "center" ? "text-center items-center mx-auto" : "text-left items-start";

  return (
    <div className={`flex max-w-2xl flex-col gap-3.5 ${alignment} ${className}`}>
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <h2
        className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${
          tone === "light" ? "text-white" : "text-ink-900"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`text-sm sm:text-base leading-relaxed ${
            tone === "light" ? "text-brand-100/90" : "text-ink-500"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
