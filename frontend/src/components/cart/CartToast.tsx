"use client";

import { useCart } from "@/context/CartContext";
import { CheckCircle2Icon } from "@/components/ui/Icons";

/**
 * Toast confirmation notification when an instrument or product is added to the inquiry list.
 * Appears bottom-left, auto-fades after a few seconds.
 */
export function CartToast() {
  const { items, lastAdded, openDrawer, isDrawerOpen } = useCart();

  if (!lastAdded || isDrawerOpen) return null;

  const line = items.find((entry) => entry.slug === lastAdded);

  return (
    <aside
      role="status"
      aria-live="polite"
      className="animate-toast-in fixed bottom-20 left-4 z-40 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-xl shadow-ink-900/10 backdrop-blur-md sm:bottom-6 sm:left-6"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <CheckCircle2Icon className="text-xl" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-ink-900 leading-tight">
            Added to Inquiry Sheet
          </p>
          <p className="truncate text-xs text-ink-500 font-medium">
            {line?.name ?? "Product"}
          </p>
        </div>
        <button
          type="button"
          onClick={openDrawer}
          className="shrink-0 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-100 hover:text-brand-900 active:scale-95"
        >
          View Sheet
        </button>
      </div>
    </aside>
  );
}
