"use client";

import { useCart } from "@/context/CartContext";
import { CartIcon } from "@/components/ui/Icons";

/** Header cart trigger. The badge updates the instant an item is added. */
export function CartButton({ className = "" }: { className?: string }) {
  const { itemCount, openDrawer, hydrated } = useCart();

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={
        itemCount > 0
          ? `Open inquiry list, ${itemCount} item${itemCount === 1 ? "" : "s"}`
          : "Open inquiry list"
      }
      className={`relative flex h-11 items-center gap-2 rounded-xl border border-hairline bg-white px-3.5 text-sm font-semibold text-ink-900 transition-colors hover:border-brand-300 hover:bg-brand-50 sm:px-4 ${className}`}
    >
      <CartIcon className="text-lg text-brand-700" />
      <span className="hidden sm:inline">Inquiry List</span>

      {/* Rendered only after hydration so server and client markup match. */}
      {hydrated && itemCount > 0 ? (
        <span
          aria-hidden="true"
          className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-700 px-1.5 text-[0.6875rem] font-bold text-white tabular-nums ring-2 ring-white"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </button>
  );
}
