-- ===========================================================================
--  Surgical store - database schema
--  Applied by:  npm run migrate   (from the server/ directory)
-- ===========================================================================

CREATE TABLE IF NOT EXISTS products (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  description   TEXT,
  category      VARCHAR(100),
  price         DECIMAL(10,2),
  image_url     VARCHAR(500),
  is_visible    BOOLEAN DEFAULT TRUE,
  in_stock      BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- ---------------------------------------------------------------------
  -- Additive columns. All nullable - the site renders fine without them,
  -- they simply make the product pages richer. Drop any you do not want.
  -- ---------------------------------------------------------------------
  slug          VARCHAR(255) UNIQUE,   -- public URL: /products/<slug>
  sku           VARCHAR(64),           -- shown on cards + in the WhatsApp message
  summary       VARCHAR(500),          -- one-line description used on cards
  unit          VARCHAR(100),          -- "Per piece", "Box of 100"
  art           VARCHAR(64),           -- placeholder illustration key
  is_featured   BOOLEAN DEFAULT FALSE, -- shows in the home page "Popular" row
  specs         JSON,                  -- [{ "label": "...", "value": "..." }]
  features      JSON,                  -- ["...", "..."]

  INDEX idx_products_visible  (is_visible),
  INDEX idx_products_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admins (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  username       VARCHAR(100) UNIQUE NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
