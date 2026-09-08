"use client";

import { useCart } from "@/context/CartContext";
import { CheckIcon } from "@/components/ui/Icons";

/**
 * Brief "added to your inquiry list" confirmation. Sits above the floating
 * WhatsApp button and disappears on its own after a couple of seconds.
 */
export function CartToast() {
  const { items, lastAdded, openDrawer, isDrawerOpen } = useCart();

  if (!lastAdded || isDrawerOpen) return null;

  const line = items.find((entry) => entry.slug === lastAdded);

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-toast-in fixed bottom-24 left-1/2 z-40 w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-hairline bg-white p-3 shadow-xl shadow-ink-900/10 sm:bottom-6 sm:left-6 sm:translate-x-0"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <CheckIcon className="text-base" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink-900">
            Added to your inquiry list
          </p>
          <p className="truncate text-xs text-ink-500">
            {line?.name ?? "Product"}
          </p>
        </div>
        <button
          type="button"
          onClick={openDrawer}
          className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50"
        >
          View
        </button>
      </div>
    </div>
  );
}
