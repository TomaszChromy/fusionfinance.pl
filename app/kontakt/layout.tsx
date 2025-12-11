import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Skontaktuj się z redakcją FusionFinance.pl. Pytania, współpraca, reklama.",
  keywords: ["kontakt", "FusionFinance", "redakcja", "współpraca"],
  alternates: {
    canonical: "https://fusionfinance.pl/kontakt",
  },
  openGraph: {
    title: "Kontakt - FusionFinance.pl",
    description: "Skontaktuj się z redakcją FusionFinance.pl.",
    url: "https://fusionfinance.pl/kontakt",
    type: "website",
  },
};

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return children;
}

