/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // All artwork in this project is inline/local SVG, so the Next image
  // optimizer is not required. If you later point `imageUrl` at photos on
  // another domain, add `remotePatterns` here and drop `unoptimized`.
  images: {
    unoptimized: true,
  },

  // NOTE: `output: "export"` is NOT possible any more. The catalogue is read
  // from MySQL at request time and the catalogue routes are `force-dynamic`,
  // so the site needs a Node runtime. Setting it will fail the build.

  async redirects() {
    return [
      {
        source: "/catalogue",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/catalog",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/shop",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/product",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/items",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/inquiry",
        destination: "/cart",
        permanent: true,
      },
      {
        source: "/inquiry-list",
        destination: "/cart",
        permanent: true,
      },
      {
        source: "/inquiry-sheet",
        destination: "/cart",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
