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
      { source: "/en/list/:path*", headers: noIndexHeader }
    ];
  }
};

export default withNextIntl(nextConfig);
