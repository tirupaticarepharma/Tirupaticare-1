/** Shared layout primitives: page gutter, section rhythm and headings. */

export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>
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
    <section id={id} className={`py-14 sm:py-18 lg:py-24 ${className}`}>
      {children}
    </section>
  );
}

export function Eyebrow({
  children,
  tone = "brand",
}: {
  children: React.ReactNode;
  tone?: "brand" | "light";
}) {
  const toneClasses =
    tone === "light"
      ? "border-white/25 bg-white/10 text-brand-100"
      : "border-brand-100 bg-brand-50 text-brand-700";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase ${toneClasses}`}
    >
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
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment} ${className}`}>
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <h2
        className={`text-3xl font-bold sm:text-4xl ${
          tone === "light" ? "text-white" : "text-ink-900"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`text-base leading-relaxed sm:text-lg ${
            tone === "light" ? "text-brand-100" : "text-ink-500"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
