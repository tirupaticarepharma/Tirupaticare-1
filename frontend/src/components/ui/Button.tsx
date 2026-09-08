import Link from "next/link";

/**
 * One button component for the whole site so spacing, radius and focus rings
 * stay identical everywhere.
 *
 * Renders a <button>, a next/link <Link> (internal href) or a plain <a>
 * (external / tel: / mailto:) depending on what it is given.
 *
 * The `whatsapp` variant is the ONLY place the WhatsApp green is used.
 */

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "whatsapp"
  | "call"
  | "light";

type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold " +
  "transition-all duration-200 select-none whitespace-nowrap " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-700 text-white shadow-sm shadow-brand-900/20 hover:bg-brand-800 active:bg-brand-900",
  secondary:
    "bg-brand-50 text-brand-800 hover:bg-brand-100 active:bg-brand-200",
  outline:
    "border border-hairline bg-white text-ink-900 hover:border-brand-300 hover:bg-brand-50/60 active:bg-brand-100/60",
  ghost: "text-brand-700 hover:bg-brand-50 active:bg-brand-100",
  whatsapp:
    "bg-whatsapp text-white shadow-sm shadow-whatsapp-dark/30 hover:bg-whatsapp-dark active:bg-whatsapp-deep",
  call:
    "border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 active:bg-white/25",
  light:
    "bg-white text-brand-800 shadow-sm hover:bg-brand-50 active:bg-brand-100",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-6 text-base sm:h-14 sm:px-7 sm:text-[1.0625rem]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
};

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type AnchorProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & {
    href: string;
  };

export function Button(props: ButtonProps | AnchorProps) {
  const {
    variant = "primary",
    size = "md",
    className = "",
    fullWidth = false,
    children,
    ...rest
  } = props;

  const classes = [
    base,
    variants[variant],
    sizes[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (typeof props.href === "string") {
    const { href, ...anchorRest } = rest as AnchorProps;
    const isInternal = href.startsWith("/") || href.startsWith("#");

    if (isInternal) {
      return (
        <Link href={href} className={classes} {...anchorRest}>
          {children}
        </Link>
      );
    }

    // External links (wa.me, tel:, mailto:, maps) open safely in a new tab
    // where that makes sense; tel:/mailto: stay in the same context.
    const isProtocolLink = href.startsWith("tel:") || href.startsWith("mailto:");
    return (
      <a
        href={href}
        className={classes}
        target={isProtocolLink ? undefined : "_blank"}
        rel={isProtocolLink ? undefined : "noopener noreferrer"}
        {...anchorRest}
      >
        {children}
      </a>
    );
  }

  const buttonRest = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={buttonRest.type ?? "button"} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
