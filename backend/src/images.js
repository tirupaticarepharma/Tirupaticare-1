/**
 * ============================================================================
 *  PRODUCT PHOTO UPLOADS
 * ============================================================================
 *  A photo arrives as a base64 data URL inside the ordinary JSON body of
 *  POST/PUT /api/admin/products, and is stored in the products row. That keeps
 *  deployment to "a Node process and a MySQL" - no upload directory to make
 *  writable, no bucket credentials, and a database backup contains the images.
 *
 *  The trade-off is size: keep uploads small (MAX_IMAGE_BYTES below) and let
 *  MySQL, not the filesystem, be the thing you scale.
 * ============================================================================
 */

/**
 * Largest photo we accept, measured after decoding.
 *
 * Raising this means raising two other numbers with it: the JSON body limit in
 * index.js (base64 inflates by ~4/3, so allow at least this plus a third) and
 * MySQL's `max_allowed_packet`, which is 64MB on MySQL 8 but only 4MB on 5.7.
 */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/**
 * Formats we are willing to store, identified by their leading bytes rather
 * than by the type the client claims.
 *
 * SVG is deliberately absent. It is a document, not a bitmap: it can carry
 * <script>, and these files are served back from the API's own origin.
 */
const SIGNATURES = [
  {
    mimeType: "image/png",
    matches: (bytes) =>
      bytes.length > 8 &&
      bytes.subarray(0, 8).equals(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      ),
  },
  {
    mimeType: "image/jpeg",
    matches: (bytes) =>
      bytes.length > 3 &&
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff,
  },
  {
    mimeType: "image/gif",
    matches: (bytes) => {
      const magic = bytes.subarray(0, 6).toString("latin1");
      return magic === "GIF87a" || magic === "GIF89a";
    },
  },
  {
    mimeType: "image/webp",
    matches: (bytes) =>
      bytes.length > 12 &&
      bytes.subarray(0, 4).toString("latin1") === "RIFF" &&
      bytes.subarray(8, 12).toString("latin1") === "WEBP",
  },
  {
    mimeType: "image/avif",
    matches: (bytes) =>
      bytes.length > 12 &&
      bytes.subarray(4, 8).toString("latin1") === "ftyp" &&
      ["avif", "avis"].includes(bytes.subarray(8, 12).toString("latin1")),
  },
];

/** The only Content-Types the image endpoint will ever send. */
export const ALLOWED_IMAGE_MIME_TYPES = SIGNATURES.map(
  (signature) => signature.mimeType,
);

/** Thrown for anything the store manager can fix by picking a different file. */
export class InvalidImageError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidImageError";
  }
}

/** The real type of these bytes, or null if it is not an image we serve. */
export function sniffImageMimeType(bytes) {
  if (!Buffer.isBuffer(bytes) || bytes.length === 0) return null;
  return SIGNATURES.find((signature) => signature.matches(bytes))?.mimeType ?? null;
}

const megabytes = (bytes) => `${Math.round(bytes / (1024 * 1024))}MB`;

/**
 * "data:image/png;base64,iVBOR..." -> { buffer, mimeType }
 *
 * Throws InvalidImageError with a message meant to be shown to the store
 * manager as-is. The returned mimeType comes from the file's own bytes, not
 * from the data URL header, because that header is attacker-controlled and is
 * what the image endpoint later echoes back as Content-Type.
 */
export function decodeImageDataUrl(value) {
  if (typeof value !== "string" || !value.startsWith("data:")) {
    throw new InvalidImageError(
      "The image must be a base64 data URL, e.g. data:image/png;base64,...",
    );
  }

  const comma = value.indexOf(",");
  const header = comma === -1 ? "" : value.slice("data:".length, comma);

  if (comma === -1 || !header.split(";").includes("base64")) {
    throw new InvalidImageError("The image must be base64 encoded.");
  }

  const base64 = value.slice(comma + 1).trim();

  // Buffer.from() silently drops anything that is not base64, so a corrupt
  // payload would otherwise decode to plausible-looking garbage.
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) {
    throw new InvalidImageError("The image data is not valid base64.");
  }

  // 4 base64 characters carry 3 bytes. Checking the encoded length first means
  // an oversized upload is rejected without allocating a buffer for it.
  if ((base64.length / 4) * 3 > MAX_IMAGE_BYTES + 3) {
    throw new InvalidImageError(
      `Images must be ${megabytes(MAX_IMAGE_BYTES)} or smaller.`,
    );
  }

  const buffer = Buffer.from(base64, "base64");

  if (buffer.length === 0) {
    throw new InvalidImageError("That image file is empty.");
  }
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new InvalidImageError(
      `Images must be ${megabytes(MAX_IMAGE_BYTES)} or smaller.`,
    );
  }

  const mimeType = sniffImageMimeType(buffer);
  if (!mimeType) {
    throw new InvalidImageError(
      `That file is not a supported image. Use ${ALLOWED_IMAGE_MIME_TYPES.map(
        (type) => type.replace("image/", "").toUpperCase(),
      ).join(", ")}.`,
    );
  }

  return { buffer, mimeType };
}
