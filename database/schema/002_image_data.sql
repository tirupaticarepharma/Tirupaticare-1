-- ===========================================================================
--  Product photo uploads
--
--  The binary lives in the products row itself and is served by
--  GET /api/products/:id/image, so there is no upload directory or object
--  store to provision. `image_url` stays for photos hosted elsewhere; a row
--  uses one or the other, never both (see backend/src/routes/admin.js).
--
--  Written to be safe to re-run: `npm run migrate` applies every file in this
--  directory on every run, and MySQL has no ADD COLUMN IF NOT EXISTS.
-- ===========================================================================

SET @add_image_data := IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'products'
       AND COLUMN_NAME  = 'image_data') = 0,
  'ALTER TABLE products ADD COLUMN image_data LONGBLOB NULL',
  'DO 0');
PREPARE apply_image_data FROM @add_image_data;
EXECUTE apply_image_data;
DEALLOCATE PREPARE apply_image_data;

SET @add_image_mime := IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'products'
       AND COLUMN_NAME  = 'image_mime_type') = 0,
  'ALTER TABLE products ADD COLUMN image_mime_type VARCHAR(50) NULL',
  'DO 0');
PREPARE apply_image_mime FROM @add_image_mime;
EXECUTE apply_image_mime;
DEALLOCATE PREPARE apply_image_mime;

-- The API derives the image endpoint from `image_data`, so an earlier build
-- that also wrote the endpoint into `image_url` left the two disagreeing about
-- which photo is current. Clear the copy.
UPDATE products
   SET image_url = NULL
 WHERE image_data IS NOT NULL
   AND image_url LIKE '/api/products/%/image';
