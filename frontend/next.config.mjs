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
};

export default nextConfig;
