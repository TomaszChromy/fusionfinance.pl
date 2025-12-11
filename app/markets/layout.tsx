import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markets - Przegląd Rynków Finansowych",
  description: "Kompleksowy przegląd wszystkich rynków finansowych. Akcje, waluty, kryptowaluty, surowce w jednym miejscu.",
  keywords: ["rynki", "markets", "przegląd rynków", "akcje", "waluty", "kryptowaluty", "surowce"],
  alternates: {
    canonical: "https://fusionfinance.pl/markets",
  },
  openGraph: {
    title: "Markets - Przegląd Rynków | FusionFinance.pl",
    description: "Kompleksowy przegląd rynków finansowych.",
    url: "https://fusionfinance.pl/markets",
    type: "website",
  },
};

export default function MarketsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

