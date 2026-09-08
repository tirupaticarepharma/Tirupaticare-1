/**
 * ============================================================================
 *  CATEGORIES
 * ============================================================================
 *  Products live in the database; the category list lives here because it
 *  drives navigation, filters and artwork. A product's `category` column
 *  stores one of the `id` values below.
 *
 *  To add a category: add an entry here and give it an illustration key in
 *  `categoryArt`. It then appears in the shop filters, the home page grid,
 *  the footer and the admin panel's category dropdown automatically.
 * ============================================================================
 */

export type Category = {
  id: string;
  name: string;
  /** Short line shown on the home page category cards. */
  blurb: string;
  /** Placeholder illustration key - see components/product/ProductArt.tsx */
  art: string;
};

export const categories: Category[] = [
  {
    id: "surgical-instruments",
    name: "Surgical Instruments",
    blurb:
      "Forceps, scissors, scalpels, needle holders and retractors in surgical-grade stainless steel.",
    art: "scissors",
  },
  {
    id: "disposables",
    name: "Disposables & Consumables",
    blurb:
      "Syringes, sutures, gauze, gloves and IV consumables supplied in bulk packs.",
    art: "syringe",
  },
  {
    id: "diagnostic-equipment",
    name: "Diagnostic Equipment",
    blurb:
      "Stethoscopes, BP monitors, pulse oximeters and thermometers for OPD and ward.",
    art: "stethoscope",
  },
  {
    id: "orthopedic-implants",
    name: "Orthopedic Implants",
    blurb:
      "Titanium and stainless steel plates, screws and nails, fully lot traceable.",
    art: "plate",
  },
  {
    id: "hospital-furniture",
    name: "Hospital Furniture",
    blurb: "Ward beds, instrument trolleys, wheelchairs and theatre furniture.",
    art: "bed",
  },
  {
    id: "ppe",
    name: "PPE & Safety",
    blurb:
      "Masks, respirators, gowns and protective wear for theatre and ward staff.",
    art: "mask",
  },
];

export function getCategory(id: string | null | undefined): Category | undefined {
  if (!id) return undefined;
  return categories.find((category) => category.id === id);
}

/** Display name for a category id, falling back to the raw value. */
export function categoryName(id: string | null | undefined): string {
  return getCategory(id)?.name ?? id ?? "Uncategorised";
}
