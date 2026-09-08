/**
 * ============================================================================
 *  SITE CONFIGURATION  —  EDIT THIS FILE FIRST
 * ============================================================================
 *  Every phone number, WhatsApp number, address and brand string used across
 *  the site is read from this one file. Replace every value marked
 *  [REPLACE_ME] with the real business details before going live.
 * ============================================================================
 */

export const siteConfig = {
  /* ---------------------------------------------------------------- brand */

  /** [REPLACE_ME] Business / trading name shown in the header, footer + title. */
  name: "Tirupati Surgicals",
  /** [REPLACE_ME] Short descriptor shown under the logo and in search results. */
  tagline: "Surgical Instruments & Medical Equipment",
  /** [REPLACE_ME] Registered legal name, shown in the footer copyright line. */
  legalName: "Tirupati Surgicals & Medical Supplies",
  /** [REPLACE_ME] One-line description used for SEO meta description + About. */
  description:
    "Supplier of surgical instruments, disposables, diagnostic equipment and hospital furniture to hospitals, clinics and doctors. Request pricing on WhatsApp.",

  /** [REPLACE_ME] Public site URL — used for SEO canonical tags and sitemap. */
  url: "https://www.example.com",

  /* -------------------------------------------------- contact / WhatsApp */

  /**
   * WhatsApp number in FULL INTERNATIONAL FORMAT, DIGITS ONLY.
   * No "+", no spaces, no dashes. Country code first.
   *   India   : 91XXXXXXXXXX
   *   USA     : 1XXXXXXXXXX
   *   UK      : 44XXXXXXXXXX
   * This single constant powers every WhatsApp link on the site, including
   * the cart inquiry.
   */
  whatsappNumber: "919370212516",

  /** Phone number as it should be DISPLAYED to visitors. */
  phoneDisplay: "+91 93702 12516",
  /** Same number formatted for `tel:` links (digits and + only). */
  phoneHref: "+919370212516",

  /** [REPLACE_ME] Public email address. */
  email: "sales@example.com",

  /** [REPLACE_ME] Street address of the shop / warehouse. */
  address: {
    line1: "Shop No. 12, Medicare Complex",
    line2: "Near City Hospital, MG Road",
    city: "Pune",
    state: "Maharashtra",
    postalCode: "411001",
    country: "India",
  },

  /**
   * [REPLACE_ME] Google Maps links.
   *  - `mapsLink`  : opens Google Maps in a new tab ("Get directions").
   *  - `mapsEmbed` : the `src` of a Google Maps <iframe>. To get it, open
   *    Google Maps → Share → Embed a map → copy the URL inside src="...".
   */
  mapsLink: "https://www.google.com/maps/search/?api=1&query=Pune+Maharashtra",
  mapsEmbed:
    "https://www.google.com/maps?q=Pune,Maharashtra,India&output=embed",

  /** [REPLACE_ME] Business hours, rendered as a list on Contact + Footer. */
  hours: [
    { days: "Monday – Friday", time: "9:30 AM – 8:00 PM" },
    { days: "Saturday", time: "9:30 AM – 6:00 PM" },
    { days: "Sunday", time: "Closed (WhatsApp orders accepted)" },
  ],

  /** [REPLACE_ME] Trust stats shown on the home page. */
  stats: [
    { value: "25+", label: "Years in business" },
    { value: "500+", label: "Hospitals & clinics served" },
    { value: "2,000+", label: "Products in catalogue" },
    { value: "ISO 13485", label: "Quality certified" },
  ],

  /** [REPLACE_ME] Optional social links — set to "" to hide a link. */
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Address rendered as a single comma-separated line. */
export const fullAddress = [
  siteConfig.address.line1,
  siteConfig.address.line2,
  `${siteConfig.address.city}, ${siteConfig.address.state} ${siteConfig.address.postalCode}`,
  siteConfig.address.country,
].join(", ");
