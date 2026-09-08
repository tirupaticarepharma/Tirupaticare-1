"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  AuthError,
  clearToken,
  deleteProduct,
  getToken,
  listProducts,
  updateProduct,
  verifySession,
} from "@/lib/adminApi";
import type { AdminProduct } from "@/types/product";
import { categoryName } from "@/data/categories";
import { formatPrice } from "@/lib/api";
import { siteConfig } from "@/config/site";
import { ProductArt } from "@/components/product/ProductArt";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { CloseIcon, LogoMark, PlusIcon, SearchIcon, TrashIcon } from "@/components/ui/Icons";

type Toast = { id: number; message: string; tone: "success" | "error" };

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<AdminProduct | null>(null);
  const [deleting, setDeleting] = useState(false);
  /** Ids whose toggle request is in flight, so the row can show it. */
  const [saving, setSaving] = useState<Set<number>>(new Set());

  const notify = useCallback((message: string, tone: Toast["tone"]) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(
      () => setToasts((current) => current.filter((toast) => toast.id !== id)),
      4000,
    );
  }, []);

  const signOut = useCallback(() => {
    clearToken();
    router.replace("/admin/login");
  }, [router]);

  /* ---------------------------------------------------- load + auth guard */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      // No token at all: straight to the login screen.
      if (!getToken()) {
        router.replace("/admin/login");
        return;
      }

      try {
        await verifySession();
        const rows = await listProducts();
        if (!cancelled) {
          setProducts(rows);
          setLoading(false);
        }
      } catch (error) {
        if (cancelled) return;
        if (error instanceof AuthError) {
          router.replace("/admin/login");
          return;
        }
        setLoadError(
          error instanceof Error ? error.message : "Could not load products.",
        );
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  /* -------------------------------------------------------------- toggles */

  /**
   * Optimistic toggle: flip the row immediately, send the request, and put it
   * back the way it was if the API rejects it.
   */
  async function toggle(
    product: AdminProduct,
    field: "isVisible" | "inStock",
  ) {
    const next = !product[field];

    setProducts((current) =>
      current.map((row) =>
        row.id === product.id ? { ...row, [field]: next } : row,
      ),
    );
    setSaving((current) => new Set(current).add(product.id));

    try {
      await updateProduct(product.id, { [field]: next });
      notify(
        field === "isVisible"
          ? `${product.name} is now ${next ? "visible on the site" : "hidden"}`
          : `${product.name} marked ${next ? "in stock" : "out of stock"}`,
        "success",
      );
    } catch (error) {
      // Roll back.
      setProducts((current) =>
        current.map((row) =>
          row.id === product.id ? { ...row, [field]: !next } : row,
        ),
      );
      if (error instanceof AuthError) return signOut();
      notify(
        error instanceof Error ? error.message : "Update failed.",
        "error",
      );
    } finally {
      setSaving((current) => {
        const copy = new Set(current);
        copy.delete(product.id);
        return copy;
      });
    }
  }

  /* --------------------------------------------------------------- delete */
  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);

    try {
      await deleteProduct(pendingDelete.id);
      setProducts((current) =>
        current.filter((row) => row.id !== pendingDelete.id),
      );
      notify(`Deleted ${pendingDelete.name}`, "success");
      setPendingDelete(null);
    } catch (error) {
      if (error instanceof AuthError) return signOut();
      notify(error instanceof Error ? error.message : "Delete failed.", "error");
    } finally {
      setDeleting(false);
    }
  }

  /* ---------------------------------------------------------------- view */
  const needle = query.trim().toLowerCase();
  const visibleRows = needle
    ? products.filter((row) =>
        [row.name, row.sku, row.category]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(needle)),
      )
    : products;

  const liveCount = products.filter((row) => row.isVisible).length;
  const outOfStockCount = products.filter((row) => !row.inStock).length;

  return (
    <>
      {/* ------------------------------------------------------------ bar */}
      <header className="border-b border-hairline bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <LogoMark className="text-[1.75rem] text-brand-700" />
            <div>
              <p className="text-sm leading-tight font-bold text-ink-900">
                {siteConfig.name}
              </p>
              <p className="text-xs text-ink-500">Product admin</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden h-9 items-center rounded-lg border border-hairline px-3 text-sm font-semibold text-ink-700 transition-colors hover:bg-surface-muted sm:flex"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="h-9 rounded-lg border border-hairline px-3 text-sm font-semibold text-ink-700 transition-colors hover:bg-surface-muted"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {/* ------------------------------------------------------- summary */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Products</h1>
            <p className="mt-1 text-sm text-ink-500">
              {loading
                ? "Loading…"
                : `${products.length} total · ${liveCount} live on the site · ${outOfStockCount} out of stock`}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-base text-ink-300" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, SKU, category"
                aria-label="Search products"
                className="h-10 w-full rounded-lg border border-hairline bg-white pr-3 pl-9 text-sm outline-none transition-colors focus:border-brand-400 sm:w-64"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
              className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-brand-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
            >
              <PlusIcon className="text-base" />
              Add Product
            </button>
          </div>
        </div>

        {/* --------------------------------------------------------- table */}
        <div className="mt-5 overflow-hidden rounded-xl border border-hairline bg-white">
          {loading ? (
            <div className="flex flex-col divide-y divide-hairline">
              {[0, 1, 2, 3, 4].map((row) => (
                <div key={row} className="flex animate-pulse items-center gap-4 p-4">
                  <div className="h-12 w-12 rounded-lg bg-surface-muted" />
                  <div className="h-4 w-1/3 rounded bg-surface-muted" />
                  <div className="ml-auto h-8 w-40 rounded bg-surface-muted" />
                </div>
              ))}
            </div>
          ) : loadError ? (
            <div className="p-8 text-center">
              <p className="font-semibold text-ink-900">
                Could not load the catalogue
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
                {loadError}
              </p>
            </div>
          ) : visibleRows.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-semibold text-ink-900">
                {products.length === 0
                  ? "No products yet"
                  : "Nothing matches that search"}
              </p>
              <p className="mt-2 text-sm text-ink-500">
                {products.length === 0
                  ? 'Use "Add Product" to create the first one, or run the seed script.'
                  : "Try a different name, SKU or category."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-4xl border-collapse text-sm">
                <thead>
                  <tr className="border-b border-hairline bg-surface-muted/60 text-left">
                    <th className="px-4 py-3 font-semibold text-ink-700">
                      Product
                    </th>
                    <th className="px-4 py-3 font-semibold text-ink-700">
                      Category
                    </th>
                    <th className="px-4 py-3 font-semibold text-ink-700">
                      Price
                    </th>
                    <th className="px-4 py-3 font-semibold text-ink-700">
                      Visibility
                    </th>
                    <th className="px-4 py-3 font-semibold text-ink-700">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-ink-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-hairline">
                  {visibleRows.map((row) => {
                    const busy = saving.has(row.id);

                    return (
                      <tr
                        key={row.id}
                        className={`transition-colors hover:bg-surface-muted/40 ${
                          busy ? "opacity-60" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-hairline">
                              <ProductArt product={row} size="thumb" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-ink-900">
                                {row.name}
                              </p>
                              <p className="text-xs text-ink-500">
                                {row.sku ? `SKU ${row.sku}` : `#${row.id}`}
                                {row.isFeatured ? " · Featured" : ""}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap text-ink-700">
                          {categoryName(row.category)}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap text-ink-700">
                          {formatPrice(row.price) ?? (
                            <span className="text-ink-300">On request</span>
                          )}
                        </td>

                        {/* Visible / Hidden */}
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => toggle(row, "isVisible")}
                            disabled={busy}
                            aria-pressed={row.isVisible}
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                              row.isVisible
                                ? "border-brand-200 bg-brand-50 text-brand-800 hover:bg-brand-100"
                                : "border-hairline bg-surface-muted text-ink-500 hover:bg-hairline/50"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                row.isVisible ? "bg-brand-600" : "bg-ink-300"
                              }`}
                            />
                            {row.isVisible ? "Visible" : "Hidden"}
                          </button>
                        </td>

                        {/* In stock / Out of stock */}
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => toggle(row, "inStock")}
                            disabled={busy}
                            aria-pressed={row.inStock}
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
                              row.inStock
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                                : "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                row.inStock ? "bg-emerald-500" : "bg-amber-500"
                              }`}
                            />
                            {row.inStock ? "In stock" : "Out of stock"}
                          </button>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditing(row);
                                setShowForm(true);
                              }}
                              className="h-8 rounded-lg border border-hairline px-3 text-xs font-semibold text-ink-700 transition-colors hover:bg-surface-muted"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDelete(row)}
                              aria-label={`Delete ${row.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline text-ink-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              <TrashIcon className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-ink-300">
          Hiding a product removes it from the website immediately but keeps the
          record. Deleting is permanent and cannot be undone.
        </p>
      </main>

      {/* ---------------------------------------------------- add / edit */}
      {showForm ? (
        <ProductFormModal
          product={editing}
          onClose={() => setShowForm(false)}
          onError={(message) => notify(message, "error")}
          onSaved={(saved, created) => {
            setProducts((current) =>
              created
                ? [...current, saved]
                : current.map((row) => (row.id === saved.id ? saved : row)),
            );
            setShowForm(false);
            notify(
              created ? `Added ${saved.name}` : `Saved ${saved.name}`,
              "success",
            );
          }}
        />
      ) : null}

      {/* ------------------------------------------------- delete confirm */}
      {pendingDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-[2px]">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2 id="delete-title" className="text-lg font-bold text-ink-900">
              Delete this product?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              <span className="font-semibold text-ink-700">
                {pendingDelete.name}
              </span>{" "}
              will be removed from the database permanently. This cannot be
              undone &mdash; if you only want it off the website, use the
              Hidden toggle instead.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="h-10 rounded-lg border border-hairline px-4 text-sm font-semibold text-ink-700 transition-colors hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="h-10 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ---------------------------------------------------------- toasts */}
      <div
        aria-live="polite"
        className="fixed right-4 bottom-4 z-60 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-toast-in flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${
              toast.tone === "success"
                ? "border-hairline bg-white text-ink-900"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            <span className="flex-1">{toast.message}</span>
            <button
              type="button"
              onClick={() =>
                setToasts((current) =>
                  current.filter((entry) => entry.id !== toast.id),
                )
              }
              aria-label="Dismiss"
              className="shrink-0 opacity-50 transition-opacity hover:opacity-100"
            >
              <CloseIcon className="text-sm" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
