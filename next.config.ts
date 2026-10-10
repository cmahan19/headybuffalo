import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Old numeric product URLs from the previous site. Their products are unpublished drafts, so send
      // visitors to the shop. When a product is verified, point its old id at its slug with permanent: true.
      { source: "/products/:id(\\d+)", destination: "/shop", permanent: false },
      // The concept showcase was replaced by made-to-order listings in the shop.
      { source: "/ideas", destination: "/shop", permanent: false },
      // Retired placeholder pages.
      { source: "/best-sellers", destination: "/shop", permanent: true },
      { source: "/trending", destination: "/shop", permanent: true },
      { source: "/sales", destination: "/shop", permanent: true },
      { source: "/customer-support", destination: "/contact", permanent: true },
      { source: "/orders-returns", destination: "/shipping-returns", permanent: true },
      { source: "/checkout", destination: "/cart", permanent: false },
      // Categories that had no real products.
      {
        source: "/categories/:slug(clothing|local-makers|home-kitchen|eco-small-spaces|food)",
        destination: "/shop",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
