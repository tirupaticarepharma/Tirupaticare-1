"use client";

import { MinusIcon, PlusIcon } from "@/components/ui/Icons";

/** Minus / numeric value / plus stepper control used on product pages and in the cart. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 999,
  size = "md",
  label = "Quantity",
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}) {
  const dimensions =
    size === "sm"
      ? { button: "h-8 w-8", field: "w-10 text-xs sm:text-sm", icon: "text-xs" }
      : { button: "h-10 w-10 sm:h-11 sm:w-11", field: "w-12 text-sm sm:text-base", icon: "text-sm" };

  function clamp(next: number) {
    if (Number.isNaN(next)) return min;
    return Math.min(max, Math.max(min, next));
  }

  return (
    <div
      className="inline-flex items-center rounded-xl border border-slate-200/90 bg-white shadow-2xs"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`${dimensions.button} flex items-center justify-center rounded-l-xl text-ink-700 transition-colors hover:bg-brand-50 active:bg-brand-100 disabled:opacity-30 disabled:hover:bg-transparent`}
      >
        <MinusIcon className={dimensions.icon} />
      </button>

      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        aria-label={label}
        onChange={(event) => onChange(clamp(parseInt(event.target.value, 10)))}
        className={`${dimensions.field} [appearance:textfield] border-x border-slate-200/90 bg-slate-50/50 py-1 text-center font-bold tabular-nums text-ink-900 outline-none focus:bg-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
      />

      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`${dimensions.button} flex items-center justify-center rounded-r-xl text-ink-700 transition-colors hover:bg-brand-50 active:bg-brand-100 disabled:opacity-30 disabled:hover:bg-transparent`}
      >
        <PlusIcon className={dimensions.icon} />
      </button>
    </div>
  );
}
