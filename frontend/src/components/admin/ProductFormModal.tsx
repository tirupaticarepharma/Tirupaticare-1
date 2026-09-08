"use client";

import { useEffect, useRef, useState } from "react";
import { categories } from "@/data/categories";
import { artKeys } from "@/components/product/ProductArt";
import { resolveImageUrl } from "@/lib/api";
import {
  createProduct,
  updateProduct,
  type ProductPayload,
} from "@/lib/adminApi";
import type { AdminProduct } from "@/types/product";
import { CloseIcon } from "@/components/ui/Icons";

/** Kept in step with MAX_IMAGE_BYTES in backend/src/images.js. */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/**
 * Add / Edit product dialog for the admin panel.
 * Pass `product` to edit an existing row, or nothing to create a new one.
 */
export function ProductFormModal({
  product,
  onClose,
  onSaved,
  onError,
}: {
  product: AdminProduct | null;
  onClose: () => void;
  onSaved: (product: AdminProduct, created: boolean) => void;
  onError: (message: string) => void;
}) {
  const editing = product !== null;

  const [form, setForm] = useState({
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    category: product?.category ?? categories[0].id,
    price: product?.price == null ? "" : String(product.price),
    unit: product?.unit ?? "",
    summary: product?.summary ?? "",
    description: product?.description ?? "",
    // When the photo was uploaded, `imageUrl` is the API's own endpoint - an
    // internal path with no business being in a box the manager edits.
    imageUrl: product?.hasUploadedImage ? "" : (product?.imageUrl ?? ""),
    art: product?.art ?? "",
    isVisible: product?.isVisible ?? true,
    inStock: product?.inStock ?? true,
    isFeatured: product?.isFeatured ?? false,
  });

  /**
   * What to do with the stored photo on save.
   *   undefined  leave it alone      (editing anything else must not wipe it)
   *   string     upload this data URL
   *   null       remove it
   */
  const [imageChange, setImageChange] = useState<string | null | undefined>(
    undefined,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  /* Escape closes the dialog. */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    // Cancelling the file picker clears the selection but must not be read as
    // "remove the existing photo".
    if (!file) {
      setImageChange(undefined);
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      onError(
        `That image is ${Math.round(file.size / (1024 * 1024))}MB. Please use one under ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))}MB.`,
      );
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImageChange(reader.result);
    };
    reader.onerror = () => {
      onError("That file could not be read. Please try another image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageChange(null);
    set("imageUrl", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;

    const name = form.name.trim();
    if (!name) {
      onError("A product name is required.");
      return;
    }

    const payload: ProductPayload = {
      name,
      sku: form.sku.trim() || null,
      category: form.category || null,
      price: form.price === "" ? null : Number(form.price),
      unit: form.unit.trim() || null,
      summary: form.summary.trim() || null,
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      art: form.art || null,
      isVisible: form.isVisible,
      inStock: form.inStock,
      isFeatured: form.isFeatured,
      // Absent unless the manager actually touched the photo - the API reads a
      // missing key as "leave the stored one alone".
      ...(imageChange !== undefined ? { imageBase64: imageChange } : {}),
    };

    setBusy(true);
    try {
      const saved = editing
        ? await updateProduct(product.id, payload)
        : await createProduct(payload);
      onSaved(saved, !editing);
    } catch (saveError) {
      onError(
        saveError instanceof Error ? saveError.message : "Could not save.",
      );
      setBusy(false);
    }
  }

  const field =
    "h-10 rounded-lg border border-hairline bg-white px-3 text-sm outline-none transition-colors focus:border-brand-400";
  const labelText =
    "text-xs font-bold uppercase tracking-wide text-ink-500";

  /*
   * The photo this product will show once saved, matching the API's precedence:
   * a file just picked wins, then a typed URL, then whatever is already stored.
   */
  const typedImage = resolveImageUrl(form.imageUrl);
  const storedImage = product?.hasUploadedImage
    ? resolveImageUrl(product.imageUrl)
    : null;

  let preview: string | null;
  if (typeof imageChange === "string") preview = imageChange;
  else if (imageChange === null) preview = typedImage;
  else preview = typedImage ?? storedImage;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-900/50 p-4 backdrop-blur-[2px] sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={editing ? "Edit product" : "Add product"}
        className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-4">
          <h2 className="text-lg font-bold text-ink-900">
            {editing ? `Edit ${product.name}` : "Add product"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-surface-muted hover:text-ink-900"
          >
            <CloseIcon className="text-lg" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
          <label className="flex flex-col gap-1.5">
            <span className={labelText}>Name *</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => set("name", event.target.value)}
              required
              autoFocus
              className={field}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className={labelText}>Category</span>
              <select
                value={form.category}
                onChange={(event) => set("category", event.target.value)}
                className={field}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelText}>SKU</span>
              <input
                type="text"
                value={form.sku}
                onChange={(event) => set("sku", event.target.value)}
                placeholder="SI-1001"
                className={field}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelText}>Price</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) => set("price", event.target.value)}
                placeholder="Leave blank for 'on request'"
                className={field}
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className={labelText}>Summary (one line, shown on cards)</span>
            <input
              type="text"
              value={form.summary}
              onChange={(event) => set("summary", event.target.value)}
              maxLength={500}
              className={field}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelText}>Description</span>
            <textarea
              value={form.description}
              onChange={(event) => set("description", event.target.value)}
              rows={4}
              className="resize-y rounded-lg border border-hairline bg-white px-3 py-2.5 text-sm leading-relaxed outline-none transition-colors focus:border-brand-400"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className={labelText}>Unit</span>
              <input
                type="text"
                value={form.unit}
                onChange={(event) => set("unit", event.target.value)}
                placeholder="Per piece"
                className={field}
              />
            </label>
          </div>

          {/* ---------------------------------------------------- photo */}
          <fieldset className="flex flex-col gap-3 rounded-xl border border-hairline p-4">
            <legend className={`px-1 ${labelText}`}>Photo</legend>

            <div className="flex items-start gap-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-hairline bg-surface-muted">
                {preview ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={preview}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-center text-[0.625rem] leading-tight font-semibold text-ink-300">
                    No photo
                  </span>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                  onChange={handleImageUpload}
                  aria-label="Upload a photo"
                  className="w-full text-sm text-ink-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
                />
                <p className="text-xs leading-relaxed text-ink-300">
                  PNG, JPEG, WebP, GIF or AVIF, up to{" "}
                  {Math.round(MAX_IMAGE_BYTES / (1024 * 1024))}MB. Stored in the
                  database. Square images look best.
                </p>

                {preview ? (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="self-start text-xs font-semibold text-red-600 transition-colors hover:text-red-700"
                  >
                    Remove photo
                  </button>
                ) : null}
              </div>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className={labelText}>
                Or link one hosted elsewhere
              </span>
              <input
                type="text"
                value={form.imageUrl}
                onChange={(event) => {
                  set("imageUrl", event.target.value);
                  // Typing a URL replaces the stored file, so drop a pending
                  // upload rather than sending both and hoping.
                  if (typeof imageChange === "string") {
                    setImageChange(undefined);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }
                }}
                placeholder="/products/photo.jpg or https://..."
                className={field}
              />
              <span className="text-xs text-ink-300">
                An uploaded photo wins over this. Saving a URL removes the
                uploaded one.
              </span>
            </label>
          </fieldset>

          <label className="flex flex-col gap-1.5">
            <span className={labelText}>
              Placeholder illustration (used when there is no image)
            </span>
            <select
              value={form.art}
              onChange={(event) => set("art", event.target.value)}
              className={field}
            >
              <option value="">None (generic box)</option>
              {artKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap gap-5 rounded-xl bg-surface-muted px-4 py-3">
            {(
              [
                ["isVisible", "Visible on the website"],
                ["inStock", "In stock"],
                ["isFeatured", "Featured on the home page"],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-700"
              >
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(event) => set(key, event.target.checked)}
                  className="h-4 w-4 accent-brand-700"
                />
                {label}
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2 border-t border-hairline pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border border-hairline px-4 text-sm font-semibold text-ink-700 transition-colors hover:bg-surface-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="h-10 rounded-lg bg-brand-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-60"
            >
              {busy ? "Saving…" : editing ? "Save changes" : "Add product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
