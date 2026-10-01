import Link from "next/link";

/**
 * Unified button system for Tirupati Surgicals.
 * Ensures consistent padding, typography, radius, focus states and micro-interactions
 * across public pages, checkout inquiry flow, and modals.
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
  "active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 " +
  "focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "bg-linear-to-b from-brand-600 to-brand-700 text-white shadow-sm shadow-brand-900/20 " +
    "hover:from-brand-500 hover:to-brand-600 hover:shadow-md hover:shadow-brand-900/25 " +
    "active:from-brand-700 active:to-brand-800 border border-brand-500/30",
  secondary:
    "bg-brand-50 text-brand-800 border border-brand-200/60 hover:bg-brand-100 hover:border-brand-300 " +
    "active:bg-brand-200/80",
  outline:
    "border border-hairline bg-white text-ink-900 shadow-xs " +
    "hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-900 " +
    "active:bg-brand-100/50",
  ghost:
    "text-brand-700 hover:bg-brand-50/80 hover:text-brand-900 active:bg-brand-100/80",
  whatsapp:
    "bg-linear-to-b from-whatsapp to-whatsapp-dark text-white shadow-sm shadow-whatsapp-dark/30 " +
    "hover:from-whatsapp-dark hover:to-whatsapp-deep hover:shadow-md hover:shadow-whatsapp-dark/40 " +
    "border border-white/20",
  call:
    "border border-white/25 bg-white/10 text-white backdrop-blur-md shadow-sm " +
    "hover:bg-white/20 hover:border-white/40 active:bg-white/30",
  light:
    "bg-white text-brand-900 shadow-sm border border-slate-200/80 hover:bg-brand-50/60 " +
    "hover:border-brand-200 hover:shadow-md active:bg-brand-100/60",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-xs sm:text-sm tracking-tight",
  md: "h-11 px-4 sm:px-5 text-sm sm:text-[0.9375rem] tracking-tight",
  lg: "h-12 px-5 sm:h-13 sm:px-6 text-sm sm:text-base tracking-tight font-bold",
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
