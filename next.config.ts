import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const noIndexHeader = [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }];

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  serverExternalPackages: ["pdfkit"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "siconart.com"
      }
    ]
  },
  async headers() {
    return [
      { source: "/list", headers: noIndexHeader },
      { source: "/list/:path*", headers: noIndexHeader },
      { source: "/en/list", headers: noIndexHeader },
      { source: "/en/list/:path*", headers: noIndexHeader },
      { source: "/cart", headers: noIndexHeader },
      { source: "/cart/:path*", headers: noIndexHeader },
      { source: "/checkout", headers: noIndexHeader },
      { source: "/checkout/:path*", headers: noIndexHeader },
      { source: "/admin", headers: noIndexHeader },
      { source: "/admin/:path*", headers: noIndexHeader },
      { source: "/en/cart", headers: noIndexHeader },
      { source: "/en/checkout", headers: noIndexHeader },
      { source: "/en/checkout/:path*", headers: noIndexHeader },
      { source: "/en/admin", headers: noIndexHeader },
      { source: "/en/admin/:path*", headers: noIndexHeader },
      { source: "/home-v2", headers: noIndexHeader },
      { source: "/home-v2/:path*", headers: noIndexHeader },
      { source: "/en/home-v2", headers: noIndexHeader },
      { source: "/en/home-v2/:path*", headers: noIndexHeader },
      { source: "/en/cart/:path*", headers: noIndexHeader }
    ];
  }
};

export default withNextIntl(nextConfig);
