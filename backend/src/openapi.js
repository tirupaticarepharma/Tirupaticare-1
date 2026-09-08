/**
 * OpenAPI 3.1 description of this API, served as interactive documentation at
 * /docs and as a raw spec at /docs/openapi.json.
 *
 * Hand-written rather than generated from annotations: the routes are few and
 * stable, and keeping the spec in one file makes it easy to read as a whole.
 * When you change a route, change it here too - nothing enforces that
 * automatically.
 */
import { config } from "./config.js";

const PRODUCT_EXAMPLE = {
  id: 1,
  slug: "adson-tissue-forceps",
  name: "Adson Tissue Forceps 12cm",
  sku: "SI-1001",
  category: "surgical-instruments",
  summary: "1x2 teeth, serrated grip, AISI 410 stainless steel.",
  description:
    "A precision tissue forceps for delicate handling of skin and subcutaneous tissue.",
  price: 450,
  imageUrl: null,
  unit: "Per piece",
  art: "forceps",
  specs: [{ label: "Length", value: "12 cm" }],
  features: ["Autoclavable to 134°C"],
  inStock: true,
  isFeatured: true,
};

/* ------------------------------------------------------------- schemas --- */

const publicProduct = {
  type: "object",
  description:
    "A product as the public site sees it. Note there is no `isVisible` field - the public serializer omits it entirely.",
  properties: {
    id: { type: "integer", example: 1 },
    slug: {
      type: "string",
      description: "URL segment. Falls back to the stringified id if NULL.",
      example: "adson-tissue-forceps",
    },
    name: { type: "string", example: "Adson Tissue Forceps 12cm" },
    sku: { type: ["string", "null"], example: "SI-1001" },
    category: { type: ["string", "null"], example: "surgical-instruments" },
    summary: {
      type: ["string", "null"],
      description: "One line, shown on the card in the grid.",
    },
    description: { type: ["string", "null"] },
    price: {
      type: ["number", "null"],
      description:
        "NULL means the site renders 'Price on request'. It is not 0.",
      example: 450,
    },
    imageUrl: { type: ["string", "null"] },
    unit: { type: ["string", "null"], example: "Per piece" },
    art: {
      type: ["string", "null"],
      description: "Key for the inline SVG drawing used when there is no photo.",
      example: "forceps",
    },
    specs: {
      type: "array",
      description: "Always an array, never null - falls back to [].",
      items: {
        type: "object",
        properties: {
          label: { type: "string", example: "Length" },
          value: { type: "string", example: "12 cm" },
        },
      },
    },
    features: {
      type: "array",
      description: "Always an array, never null - falls back to [].",
      items: { type: "string" },
    },
    inStock: { type: "boolean" },
    isFeatured: { type: "boolean" },
  },
  example: PRODUCT_EXAMPLE,
};

const adminProduct = {
  allOf: [
    { $ref: "#/components/schemas/PublicProduct" },
    {
      type: "object",
      properties: {
        isVisible: {
          type: "boolean",
          description:
            "Only ever present on admin responses. false hides the product from the whole public site.",
        },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
  ],
};

const productInput = {
  type: "object",
  description:
    "Every field is optional except `name` on create. Keys may be camelCase or snake_case (`imageUrl` or `image_url`). Anything not listed here is silently ignored, so `id`, `createdAt` and `updatedAt` cannot be set by a client.",
  properties: {
    name: { type: "string", maxLength: 255 },
    description: { type: "string" },
    category: { type: "string", maxLength: 100 },
    price: {
      type: ["number", "null"],
      minimum: 0,
      description:
        "null or \"\" stores SQL NULL, which displays as 'Price on request'. It does not store 0.",
    },
    imageUrl: { type: ["string", "null"], maxLength: 500 },
    isVisible: {
      type: "boolean",
      description:
        "Loose coercion: true, \"true\", 1 and \"1\" are truthy. Everything else - including \"yes\" - stores 0.",
    },
    inStock: { type: "boolean" },
    slug: {
      type: "string",
      maxLength: 255,
      description:
        "Optional. Generated from `name` when omitted, and de-duplicated with a -2, -3 suffix.",
    },
    sku: { type: ["string", "null"], maxLength: 64 },
    summary: { type: ["string", "null"], maxLength: 500 },
    unit: { type: ["string", "null"], maxLength: 100 },
    art: { type: ["string", "null"], maxLength: 64 },
    isFeatured: { type: "boolean" },
    specs: {
      type: "array",
      description: "Must be an array. A string or object is a 400.",
      items: {
        type: "object",
        properties: { label: { type: "string" }, value: { type: "string" } },
      },
    },
    features: { type: "array", items: { type: "string" } },
  },
  example: {
    name: "Mayo Dissecting Scissors, Curved 17cm",
    category: "surgical-instruments",
    sku: "SI-1002",
    price: 620,
    summary: "Curved blades, satin finish, AISI 420 stainless steel.",
    unit: "Per piece",
    isVisible: true,
    inStock: true,
  },
};

const errorSchema = {
  type: "object",
  description:
    "Every error uses this shape. The message is written to be shown to the store manager as-is.",
  properties: { error: { type: "string" } },
  example: { error: "Product not found." },
};

/* --------------------------------------------------------- the document --- */

export const openapiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Surgical Store API",
    version: "1.0.0",
    description: [
      "Catalogue and admin API for the surgical equipment store.",
      "",
      "**There is no payment gateway and no order endpoint.** Customers build an",
      "inquiry list in the browser and send it over WhatsApp; nothing about a",
      "cart ever reaches this API.",
      "",
      "### The one rule that shapes everything",
      "",
      "`GET /api/products` hardcodes `WHERE is_visible = 1`. `GET /api/admin/products`",
      "does not filter. Flipping that one boolean removes a product from the shop",
      "grid, the home page and `sitemap.xml`, and 404s its detail page - while the",
      "manager still sees it. Hiding is reversible; deleting is not.",
      "",
      "### Trying the admin routes here",
      "",
      "Call `POST /api/admin/login`, copy the `token` from the response, then press",
      "**Authorize** at the top of this page and paste it. Every padlocked endpoint",
      "will then work from the *Try it out* buttons.",
      "",
      "Longer prose version of this reference: `docs/api.md` in the repo.",
    ].join("\n"),
  },
  servers: [
    { url: "/", description: "This server" },
  ],
  tags: [
    {
      name: "Health",
      description: "Check this first when the site looks empty.",
    },
    {
      name: "Catalogue",
      description:
        "Public. No authentication. Only ever returns rows with is_visible = 1.",
    },
    { name: "Admin auth", description: "Sign in and token validation." },
    {
      name: "Admin products",
      description:
        "Full CRUD, including products hidden from the public site. Requires a bearer token.",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "The token from POST /api/admin/login. Expires after 8h by default.",
      },
    },
    schemas: {
      PublicProduct: publicProduct,
      AdminProduct: adminProduct,
      ProductInput: productInput,
      Error: errorSchema,
    },
    responses: {
      Unauthorized: {
        description:
          "Missing, invalid or expired token. Expiry adds `expired: true` so the panel can redirect to login instead of showing an error.",
        content: {
          "application/json": {
            schema: {
              allOf: [
                { $ref: "#/components/schemas/Error" },
                {
                  type: "object",
                  properties: { expired: { type: "boolean" } },
                },
              ],
            },
            example: { error: "Session expired. Please sign in again.", expired: true },
          },
        },
      },
      NotFound: {
        description: "No product with that id or slug.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
      },
      ValidationError: {
        description:
          "A field failed validation. Multiple failures are joined with '; ' into one message.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
            example: { error: "sku must be 64 characters or fewer; price must be a positive number" },
          },
        },
      },
    },
  },

  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "API and database status",
        description:
          "The API stays up when MySQL is unreachable - it reports 503 here rather than exiting.",
        security: [],
        responses: {
          200: {
            description: "Both the API and the database are reachable.",
            content: {
              "application/json": {
                example: { status: "ok", database: "connected" },
              },
            },
          },
          503: {
            description: "The API is running but cannot reach MySQL.",
            content: {
              "application/json": {
                example: { status: "degraded", database: "connect ECONNREFUSED 127.0.0.1:3306" },
              },
            },
          },
        },
      },
    },

    "/api/products": {
      get: {
        tags: ["Catalogue"],
        summary: "The visible catalogue",
        description:
          "Unfiltered results are ordered by id. Filtered results are ordered by is_featured DESC, id ASC, so featured products lead a category page.",
        security: [],
        parameters: [
          {
            name: "category",
            in: "query",
            required: false,
            schema: { type: "string" },
            example: "surgical-instruments",
            description: "Exact match on the category column.",
          },
        ],
        responses: {
          200: {
            description: "Visible products only.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    products: {
                      type: "array",
                      items: { $ref: "#/components/schemas/PublicProduct" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/products/{slug}": {
      get: {
        tags: ["Catalogue"],
        summary: "One product by slug or id",
        description:
          "Accepts either form - /api/products/adson-tissue-forceps and /api/products/1 both work. A hidden product 404s here, which is what makes its detail page 404.",
        security: [],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "adson-tissue-forceps",
          },
        ],
        responses: {
          200: {
            description: "The product.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { product: { $ref: "#/components/schemas/PublicProduct" } },
                },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },

    "/api/admin/login": {
      post: {
        tags: ["Admin auth"],
        summary: "Sign in and get a token",
        description:
          "Rate limited to 10 attempts per IP per 10 minutes; a successful login clears the counter. A missing user is still compared against a dummy bcrypt hash, so a wrong username and a wrong password take the same time - which is why the 401 never says which was wrong.",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "password"],
                properties: {
                  username: { type: "string" },
                  password: { type: "string", format: "password" },
                },
              },
              example: { username: "admin", password: "devpassword123" },
            },
          },
        },
        responses: {
          200: {
            description: "Signed in.",
            content: {
              "application/json": {
                example: {
                  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  admin: { id: 1, username: "admin" },
                },
              },
            },
          },
          400: {
            description: "Username or password missing.",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
          401: {
            description: "Wrong username or password - deliberately not saying which.",
            content: {
              "application/json": { example: { error: "Incorrect username or password." } },
            },
          },
          429: {
            description:
              "Too many attempts from this IP. Carries a Retry-After header, in seconds.",
            content: {
              "application/json": {
                example: { error: "Too many sign-in attempts. Try again in 480s." },
              },
            },
          },
        },
      },
    },

    "/api/admin/me": {
      get: {
        tags: ["Admin auth"],
        summary: "Check a stored token is still valid",
        description:
          "The panel calls this on load, rather than waiting for the first real request to fail.",
        responses: {
          200: {
            description: "The token is valid.",
            content: {
              "application/json": { example: { admin: { id: 1, username: "admin" } } },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },

    "/api/admin/products": {
      get: {
        tags: ["Admin products"],
        summary: "Every product, hidden ones included",
        description:
          "The only place hidden products are visible. That asymmetry with GET /api/products is the whole hide mechanism.",
        responses: {
          200: {
            description: "All products.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    products: {
                      type: "array",
                      items: { $ref: "#/components/schemas/AdminProduct" },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
      post: {
        tags: ["Admin products"],
        summary: "Create a product",
        description:
          "`name` is the only required field. The slug is generated from it when omitted, and de-duplicated with a numeric suffix - so you never get a 409 from a duplicate slug here.",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ProductInput" } },
          },
        },
        responses: {
          201: {
            description: "Created.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { product: { $ref: "#/components/schemas/AdminProduct" } },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },

    "/api/admin/products/{id}": {
      put: {
        tags: ["Admin products"],
        summary: "Update any subset of fields",
        description:
          "A partial update, despite being a PUT. The Visible and In Stock toggles in the panel are just this endpoint with a one-field body, e.g. { \"isVisible\": false }. Changing the slug re-runs the uniqueness check while excluding this row, so re-saving without touching it does not append -2.",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductInput" },
              example: { isVisible: false },
            },
          },
        },
        responses: {
          200: {
            description: "Updated.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { product: { $ref: "#/components/schemas/AdminProduct" } },
                },
              },
            },
          },
          400: {
            description:
              "Invalid id, a validation failure, or no updatable fields in the body.",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Admin products"],
        summary: "Delete a product permanently",
        description:
          "There is no soft delete and no undo. For 'take it off the site but keep the record', use PUT { \"isVisible\": false } instead - that is what the panel's hide toggle does, and it is reversible.",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } },
        ],
        responses: {
          200: {
            description: "Deleted.",
            content: { "application/json": { example: { deleted: 12 } } },
          },
          400: {
            description: "Invalid id.",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
  },

  security: [{ bearerAuth: [] }],
};

/** Swagger UI options - kept here so index.js stays about routing. */
export const swaggerUiOptions = {
  customSiteTitle: "Surgical Store API docs",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: "list",
    tryItOutEnabled: true,
  },
};

/** Docs are on in development, off in production unless explicitly enabled. */
export const docsEnabled = config.docs.enabled;
