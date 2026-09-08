"use client";

/**
 * ============================================================================
 *  CART CONTEXT
 * ============================================================================
 *  The "cart" here is an INQUIRY LIST, not a checkout basket. It holds
 *  product names, SKUs and quantities only - there are no prices, no totals
 *  and no payment step anywhere in this project.
 *
 *  State lives in React context and is mirrored into localStorage so the list
 *  survives a page refresh. See src/lib/whatsapp.ts for how the list is
 *  turned into the pre-filled WhatsApp message.
 * ============================================================================
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import type { Product } from "@/types/product";

/** Bump the version suffix if the shape of CartItem ever changes. */
const STORAGE_KEY = "surgical-store-cart-v1";

/** Guard rails so a stray input cannot produce a nonsense quantity. */
const MIN_QTY = 1;
const MAX_QTY = 999;

export type CartItem = {
  /** Product slug - the unique key for a line item. */
  slug: string;
  name: string;
  sku?: string | null;
  quantity: number;
  /** e.g. "Box of 100" - carried through so the message reads sensibly. */
  unit?: string | null;
  /**
   * Artwork is copied onto the line so the cart can draw a thumbnail without
   * re-fetching the catalogue (and still works if the product is later
   * hidden or deleted in the admin panel).
   */
  art?: string | null;
  imageUrl?: string | null;
};

type CartAction =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; item: CartItem }
  | { type: "remove"; slug: string }
  | { type: "setQuantity"; slug: string; quantity: number }
  | { type: "clear" };

function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return MIN_QTY;
  return Math.min(MAX_QTY, Math.max(MIN_QTY, Math.round(value)));
}

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "hydrate":
      return action.items;

    case "add": {
      const existing = state.find((line) => line.slug === action.item.slug);
      if (existing) {
        // Adding an item already in the list tops up its quantity.
        return state.map((line) =>
          line.slug === action.item.slug
            ? { ...line, quantity: clampQuantity(line.quantity + action.item.quantity) }
            : line,
        );
      }
      return [...state, { ...action.item, quantity: clampQuantity(action.item.quantity) }];
    }

    case "remove":
      return state.filter((line) => line.slug !== action.slug);

    case "setQuantity": {
      // Dropping to zero removes the line entirely.
      if (action.quantity < MIN_QTY) {
        return state.filter((line) => line.slug !== action.slug);
      }
      return state.map((line) =>
        line.slug === action.slug
          ? { ...line, quantity: clampQuantity(action.quantity) }
          : line,
      );
    }

    case "clear":
      return [];

    default:
      return state;
  }
}

/** Defensive parse - localStorage can hold anything a user (or an old build) put there. */
function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (entry): entry is CartItem =>
          !!entry &&
          typeof entry === "object" &&
          typeof (entry as CartItem).slug === "string" &&
          typeof (entry as CartItem).name === "string" &&
          typeof (entry as CartItem).quantity === "number",
      )
      .map((entry) => ({ ...entry, quantity: clampQuantity(entry.quantity) }));
  } catch {
    return [];
  }
}

type CartContextValue = {
  items: CartItem[];
  /** Total quantity across all lines - the number in the header badge. */
  itemCount: number;
  /** Number of distinct products in the list. */
  lineCount: number;
  /** False during the first render pass, before localStorage has been read. */
  hydrated: boolean;
  /** Slide-out drawer state. */
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  /** Slug of the most recently added product - drives the "Added" toast. */
  lastAdded: string | null;
  addItem: (product: Product, quantity?: number, openDrawer?: boolean) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  increment: (slug: string) => void;
  decrement: (slug: string) => void;
  clearCart: () => void;
  isInCart: (slug: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [hydrated, setHydrated] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Read the saved cart once, on mount (never during SSR). */
  useEffect(() => {
    try {
      dispatch({ type: "hydrate", items: parseStoredCart(window.localStorage.getItem(STORAGE_KEY)) });
    } catch {
      /* Private mode / storage disabled - carry on with an empty cart. */
    }
    setHydrated(true);
  }, []);

  /* Mirror every change back to localStorage (but not the initial empty state). */
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* Storage full or blocked - the cart still works for this session. */
    }
  }, [items, hydrated]);

  /* Keep the cart in sync if the site is open in two tabs. */
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY) return;
      dispatch({ type: "hydrate", items: parseStoredCart(event.newValue) });
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* Lock body scroll while the drawer is open. */
  useEffect(() => {
    if (!isDrawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const addItem = useCallback(
    (product: Product, quantity = 1, openDrawer = false) => {
      dispatch({
        type: "add",
        item: {
          slug: product.slug,
          name: product.name,
          sku: product.sku,
          unit: product.unit,
          art: product.art,
          imageUrl: product.imageUrl,
          quantity,
        },
      });

      setLastAdded(product.slug);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setLastAdded(null), 2600);

      if (openDrawer) setDrawerOpen(true);
    },
    [],
  );

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      itemCount: items.reduce((total, line) => total + line.quantity, 0),
      lineCount: items.length,
      hydrated,
      isDrawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      lastAdded,
      addItem,
      removeItem: (slug) => dispatch({ type: "remove", slug }),
      setQuantity: (slug, quantity) => dispatch({ type: "setQuantity", slug, quantity }),
      increment: (slug) => {
        const line = items.find((entry) => entry.slug === slug);
        dispatch({ type: "setQuantity", slug, quantity: (line?.quantity ?? 0) + 1 });
      },
      decrement: (slug) => {
        const line = items.find((entry) => entry.slug === slug);
        dispatch({ type: "setQuantity", slug, quantity: (line?.quantity ?? 1) - 1 });
      },
      clearCart: () => dispatch({ type: "clear" }),
      isInCart: (slug) => items.some((entry) => entry.slug === slug),
    };
  }, [items, hydrated, isDrawerOpen, lastAdded, addItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a <CartProvider>. Check src/app/layout.tsx.");
  }
  return context;
}
