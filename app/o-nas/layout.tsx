import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O Nas - Redakcja FusionFinance",
  description: "Poznaj zespół FusionFinance.pl. Luksusowy portal finansowy z pasją do rynków kapitałowych.",
  keywords: ["o nas", "FusionFinance", "redakcja", "zespół", "portal finansowy"],
  alternates: {
    canonical: "https://fusionfinance.pl/o-nas",
  },
  openGraph: {
    title: "O Nas - FusionFinance.pl",
    description: "Poznaj zespół FusionFinance.pl.",
    url: "https://fusionfinance.pl/o-nas",
    type: "website",
  },
};

export default function ONasLayout({ children }: { children: React.ReactNode }) {
  return children;
}

