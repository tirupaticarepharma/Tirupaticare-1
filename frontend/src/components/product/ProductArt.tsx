import type { Product } from "@/types/product";
import { resolveImageUrl } from "@/lib/api";

/**
 * ============================================================================
 *  PLACEHOLDER PRODUCT ARTWORK
 * ============================================================================
 *  Clean line illustrations drawn inline as SVG - no photo files, no external
 *  requests, no layout shift, and they stay sharp at any size.
 *
 *  TO USE REAL PHOTOS INSTEAD: upload one on the product in the admin panel
 *  (stored in MySQL, served by the API), or set its Image URL to an absolute
 *  address or a path like /products/my-photo.jpg pointing at a file in
 *  /public. Either way the photo is rendered here instead of the glyph.
 * ============================================================================
 */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const glyphs: Record<string, React.ReactNode> = {
  /* ---------------------------------------------- surgical instruments */
  forceps: (
    <g {...stroke}>
      <path d="M46 16h8" />
      <path d="M50 16C46 36 42 60 37 86" />
      <path d="M50 16c4 20 8 44 13 70" />
      <path d="M41 46h3M56 46h3M39 60h4M57 60h4" opacity={0.45} />
      <path d="M34 84h6M60 84h6" />
    </g>
  ),
  scissors: (
    <g {...stroke}>
      <circle cx="35" cy="78" r="9" />
      <circle cx="65" cy="78" r="9" />
      <path d="M41 71 68 22" />
      <path d="M59 71 32 22" />
      <circle cx="50" cy="50" r="2.4" fill="currentColor" stroke="none" />
    </g>
  ),
  scalpel: (
    <g {...stroke}>
      <rect x="36" y="46" width="14" height="44" rx="6" />
      <path d="M40 58h6M40 66h6M40 74h6" opacity={0.45} />
      <path d="M50 54V24c0-5 6-7 10-3l12 14c2 3 1 6-3 7l-19 6" />
    </g>
  ),
  "needle-holder": (
    <g {...stroke}>
      <circle cx="35" cy="80" r="8.5" />
      <circle cx="65" cy="80" r="8.5" />
      <path d="M41 74 50 56M59 74 50 56" />
      <path d="M46 56V20a4 4 0 0 1 8 0v36" />
      <path d="M46 30h8M46 38h8" opacity={0.45} />
      <path d="M42 70h-7M58 70h7" opacity={0.55} />
    </g>
  ),
  retractor: (
    <g {...stroke}>
      <path d="M26 50h48" />
      <path d="M26 50 13 40M26 50 13 60" />
      <path d="M74 50c9 0 13-6 13-13" />
      <path d="M80 33h13" />
      <path d="M40 46v8M60 46v8" opacity={0.4} />
    </g>
  ),
  tray: (
    <g {...stroke}>
      <rect x="16" y="32" width="68" height="40" rx="7" />
      <path d="M16 42h68" opacity={0.45} />
      <path d="M12 46h4M84 46h4" />
      <g fill="currentColor" stroke="none" opacity={0.35}>
        <circle cx="28" cy="53" r="2.2" />
        <circle cx="39" cy="53" r="2.2" />
        <circle cx="50" cy="53" r="2.2" />
        <circle cx="61" cy="53" r="2.2" />
        <circle cx="72" cy="53" r="2.2" />
        <circle cx="28" cy="63" r="2.2" />
        <circle cx="39" cy="63" r="2.2" />
        <circle cx="50" cy="63" r="2.2" />
        <circle cx="61" cy="63" r="2.2" />
        <circle cx="72" cy="63" r="2.2" />
      </g>
    </g>
  ),

  /* ------------------------------------------------------- disposables */
  syringe: (
    <g {...stroke}>
      <rect x="26" y="40" width="42" height="20" rx="4" />
      <path d="M26 34v32" />
      <path d="M26 50H14M14 42v16" />
      <path d="M36 40v6M44 40v6M52 40v6M60 40v6" opacity={0.45} />
      <path d="M68 44v12M68 50h6" />
      <path d="M74 50h16" strokeWidth={1.8} />
    </g>
  ),
  glove: (
    <g {...stroke}>
      <rect x="22" y="50" width="56" height="36" rx="6" />
      <path d="M32 50c0-6 8-10 18-10s18 4 18 10" opacity={0.45} />
      <path d="M44 50c-2-10 0-18 6-22 4-3 8 0 7 4-1 5-4 7-3 11" />
      <path d="M30 68h20" opacity={0.45} />
    </g>
  ),
  gauze: (
    <g {...stroke}>
      <rect x="32" y="22" width="44" height="44" rx="5" opacity={0.4} />
      <rect x="22" y="32" width="44" height="44" rx="5" />
      <path d="M22 47h44M22 61h44M37 32v44M51 32v44" opacity={0.35} />
    </g>
  ),
  suture: (
    <g {...stroke}>
      <path d="M30 72a26 26 0 0 1 40-22" />
      <path d="M70 50l7-5" />
      <path d="M30 72c-9 5-16 2-20-5" />
      <circle cx="30" cy="72" r="2.4" fill="currentColor" stroke="none" />
    </g>
  ),
  iv: (
    <g {...stroke}>
      <path d="M14 50h20" />
      <rect x="34" y="43" width="30" height="14" rx="6" />
      <path d="M64 50h24" strokeWidth={1.8} />
      <path d="M36 44c-6-6-14-7-20-3M36 56c-6 6-14 7-20 3" opacity={0.6} />
      <path d="M48 43V34a3.5 3.5 0 0 1 7 0v9" />
    </g>
  ),

  /* ---------------------------------------------- diagnostic equipment */
  stethoscope: (
    <g {...stroke}>
      <circle cx="32" cy="18" r="3.6" />
      <circle cx="68" cy="18" r="3.6" />
      <path d="M32 22v16c0 11 8 18 18 18s18-7 18-18V22" />
      <path d="M50 56v6c0 8 5 13 11 14" />
      <circle cx="68" cy="77" r="11" />
      <circle cx="68" cy="77" r="5.5" opacity={0.4} />
    </g>
  ),
  "bp-monitor": (
    <g {...stroke}>
      <circle cx="36" cy="32" r="17" />
      <path d="M36 32 45 23" />
      <circle cx="36" cy="32" r="2.2" fill="currentColor" stroke="none" />
      <rect x="22" y="58" width="48" height="26" rx="6" />
      <path d="M32 66h28" opacity={0.45} />
      <circle cx="82" cy="42" r="8" />
      <path d="M53 44c10 2 18 0 22-2" opacity={0.7} />
    </g>
  ),
  oximeter: (
    <g {...stroke}>
      <rect x="16" y="30" width="46" height="40" rx="10" />
      <rect x="24" y="38" width="30" height="17" rx="3" opacity={0.4} />
      <path d="M27 47h4l3-6 4 12 3-6h6" strokeWidth={2.2} />
      <path d="M62 40h10a6 6 0 0 1 0 12H62" />
      <path d="M28 62h18" opacity={0.4} />
    </g>
  ),
  thermometer: (
    <g {...stroke}>
      <rect x="18" y="32" width="44" height="26" rx="7" />
      <rect x="26" y="39" width="20" height="11" rx="2.5" opacity={0.4} />
      <path d="M30 58 24 78h12l6-20" />
      <path d="M62 38h14v14H62" />
      <path d="M82 36l6-4M82 45h8M82 54l6 4" opacity={0.6} />
    </g>
  ),

  /* ---------------------------------------------- orthopedic implants */
  plate: (
    <g {...stroke}>
      <rect x="12" y="41" width="76" height="18" rx="9" />
      <circle cx="27" cy="50" r="4.6" />
      <circle cx="42" cy="50" r="4.6" />
      <circle cx="58" cy="50" r="4.6" />
      <circle cx="73" cy="50" r="4.6" />
    </g>
  ),
  screw: (
    <g {...stroke}>
      <rect x="35" y="20" width="30" height="12" rx="4" />
      <path d="M44 26h12" opacity={0.6} />
      <path d="M43 32v36l7 14 7-14V32" />
      <path d="M43 42h14M43 51h14M43 60h14M45 69h10" opacity={0.5} />
    </g>
  ),
  nail: (
    <g {...stroke} transform="rotate(10 50 50)">
      <path d="M50 12c5 0 8 4 8 9v58c0 6-3 10-8 10s-8-4-8-10V21c0-5 3-9 8-9z" />
      <circle cx="50" cy="26" r="3.2" />
      <circle cx="50" cy="74" r="3.2" />
      <path d="M42 46h16" opacity={0.35} />
    </g>
  ),

  /* ---------------------------------------------- hospital furniture */
  bed: (
    <g {...stroke}>
      <path d="M14 56h68a5 5 0 0 1 5 5v5H9v-5a5 5 0 0 1 5-5z" />
      <path d="M18 56l4-13a4 4 0 0 1 4-3h9" opacity={0.75} />
      <path d="M9 66v8M87 66v8" />
      <path d="M13 74h70" />
      <circle cx="22" cy="80" r="4.6" />
      <circle cx="76" cy="80" r="4.6" />
      <path d="M87 60V40M87 45h-9" />
    </g>
  ),
  trolley: (
    <g {...stroke}>
      <path d="M18 28h64" />
      <path d="M20 28v6M80 28v6" />
      <rect x="18" y="36" width="64" height="6" rx="3" />
      <rect x="18" y="58" width="64" height="6" rx="3" />
      <path d="M25 42v32M75 42v32" />
      <circle cx="27" cy="79" r="4.6" />
      <circle cx="73" cy="79" r="4.6" />
    </g>
  ),
  wheelchair: (
    <g {...stroke}>
      <circle cx="42" cy="64" r="20" />
      <circle cx="42" cy="64" r="12.5" opacity={0.35} />
      <circle cx="74" cy="76" r="6.5" />
      <path d="M32 46h27" />
      <path d="M32 46 27 22M27 22h-6" />
      <path d="M59 46v13h14" />
      <path d="M34 24h14" opacity={0.5} />
    </g>
  ),

  /* --------------------------------------------------------------- PPE */
  mask: (
    <g {...stroke}>
      <path d="M18 38c10-7 54-7 64 0v15c0 11-14 19-32 19s-32-8-32-19z" />
      <path d="M18 46h64M18 55h64" opacity={0.4} />
      <path d="M18 40C7 43 5 55 11 60" />
      <path d="M82 40c11 3 13 15 7 20" />
    </g>
  ),
  n95: (
    <g {...stroke}>
      <path d="M23 45c8-13 46-13 54 0 4 8 2 20-6 26-10 8-32 8-42 0-8-6-10-18-6-26z" />
      <path d="M27 46h46" opacity={0.4} />
      <path d="M23 41 9 31M77 41l14-10M24 63 10 73M76 63l14 10" opacity={0.65} />
    </g>
  ),
  gown: (
    <g {...stroke}>
      <path d="M39 22h22l17 11-6 13-8-5v41a4 4 0 0 1-4 4H40a4 4 0 0 1-4-4V41l-8 5-6-13z" />
      <path d="M45 22l5 7 5-7" opacity={0.6} />
      <path d="M50 48v34" opacity={0.35} />
    </g>
  ),
};

/** Every available illustration key - used by the admin panel's dropdown. */
export const artKeys = Object.keys(glyphs).sort();

/** Fallback used if a product has an unknown or missing `art` key. */
const fallbackGlyph = (
  <g {...stroke}>
    <path d="M20 34a6 6 0 0 1 6-6h48a6 6 0 0 1 6 6v32a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6z" />
    <path d="M50 40v20M40 50h20" />
  </g>
);

type ArtSubject = {
  name: string;
  art?: string | null;
  imageUrl?: string | null;
};

export function ProductArt({
  product,
  size = "card",
  className = "",
}: {
  product: ArtSubject;
  size?: "card" | "detail" | "thumb";
  className?: string;
}) {
  // Real photo supplied? Use it and skip the illustration entirely. An uploaded
  // photo comes back as a path on the API, so it has to be resolved first.
  const photo = resolveImageUrl(product.imageUrl);

  if (photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt={product.name}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  const glyph = (product.art && glyphs[product.art]) || fallbackGlyph;

  const glyphSize = {
    thumb: "h-3/5 w-3/5",
    card: "h-[62%] w-[62%]",
    detail: "h-[58%] w-[58%]",
  }[size];

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100/70 ${className}`}
      role="img"
      aria-label={product.name}
    >
      {/* Soft halo so the illustration sits on something, not floating. */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-[2px]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-8 -bottom-10 aspect-square w-2/5 rounded-full bg-brand-200/40 blur-xl"
      />
      <svg
        viewBox="0 0 100 100"
        className={`relative text-brand-700/90 ${glyphSize}`}
        aria-hidden="true"
      >
        {glyph}
      </svg>
    </div>
  );
}
