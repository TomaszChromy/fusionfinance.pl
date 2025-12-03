import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  // Static export dla hostingu nazwa.pl
  ...(isStaticExport && { output: "export" }),

  // Trailing slash dla kompatybilności z tradycyjnym hostingiem
  trailingSlash: true,

  // Base path (puste dla domeny głównej fusionfinance.pl)
  basePath: "",

  // Asset prefix dla CDN (opcjonalnie)
  // assetPrefix: process.env.ASSET_PREFIX || "",

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

  // Generuj unikalne ID dla buildów
  generateBuildId: async () => {
    return `fusionfinance-${Date.now()}`;
  },

  // Optymalizacje produkcyjne
  compiler: {
    // Usuń console.log w produkcji
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  // Headers dla bezpieczeństwa (dla dev server)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
};

export default nextConfig;
