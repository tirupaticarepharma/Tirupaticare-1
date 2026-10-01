"use client";

import { useCart } from "@/context/CartContext";
import { CartIcon } from "@/components/ui/Icons";

/** Header inquiry cart trigger with reactive counter badge and tactile hover state. */
export function CartButton({ className = "" }: { className?: string }) {
  const { itemCount, openDrawer, hydrated } = useCart();
  const hasItems = hydrated && itemCount > 0;

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={
        hasItems
          ? `Open inquiry list, ${itemCount} item${itemCount === 1 ? "" : "s"}`
          : "Open inquiry list"
      }
      className={`group relative flex h-10 sm:h-11 items-center gap-2 rounded-xl border px-3 sm:px-4 text-xs sm:text-sm font-semibold transition-all duration-200 select-none active:scale-95 ${
        hasItems
          ? "border-brand-300 bg-brand-50/80 text-brand-900 shadow-xs hover:bg-brand-100 hover:border-brand-400"
          : "border-hairline bg-white text-ink-800 hover:border-brand-300 hover:bg-surface-muted"
      } ${className}`}
    >
      <CartIcon className={`text-base sm:text-lg transition-transform duration-200 group-hover:scale-110 ${
        hasItems ? "text-brand-700" : "text-ink-500"
      }`} />
      <span className="hidden sm:inline">Inquiry List</span>

      {hasItems ? (
        <span
          aria-hidden="true"
          className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-700 px-1.5 text-[0.6875rem] font-bold text-white tabular-nums ring-2 ring-white shadow-xs animate-fade-in"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </button>
  );
}
