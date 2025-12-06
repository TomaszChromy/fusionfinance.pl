import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analizy Rynkowe - Techniczna i Fundamentalna",
  description: "Profesjonalne analizy rynkowe. Analiza techniczna i fundamentalna. Prognozy, rekomendacje i strategie inwestycyjne.",
  keywords: [
    "analizy rynkowe", "analiza techniczna", "analiza fundamentalna",
    "prognozy", "rekomendacje", "strategie inwestycyjne", "trading",
    "inwestowanie", "portfel inwestycyjny", "zarządzanie ryzykiem"
  ],
  alternates: {
    canonical: "https://fusionfinance.pl/analizy",
  },
  openGraph: {
    title: "Analizy Rynkowe - FusionFinance.pl",
    description: "Profesjonalne analizy rynkowe. Analiza techniczna i fundamentalna.",
    url: "https://fusionfinance.pl/analizy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Analizy Rynkowe - FusionFinance.pl",
    description: "Profesjonalne analizy techniczne i fundamentalne.",
  },
};

export default function AnalizyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

