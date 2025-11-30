import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export dla hostingu nazwa.pl
  output: "export",

  // Trailing slash dla kompatybilności z tradycyjnym hostingiem
  trailingSlash: true,

  // Base path (puste dla domeny głównej)
  basePath: "",

  // Wyłącz optymalizację obrazów (nie działa na static export)
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  // Wyłącz generowanie source maps w produkcji
  productionBrowserSourceMaps: false,
};

export default nextConfig;
