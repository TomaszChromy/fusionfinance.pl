import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rynki Finansowe - Indeksy, Surowce, ETF-y",
  description: "Najnowsze wiadomości z rynków finansowych. Śledź indeksy giełdowe, surowce, obligacje, ETF-y i fundusze inwestycyjne. Profesjonalne analizy rynkowe.",
  keywords: [
    "rynki finansowe", "indeksy giełdowe", "surowce", "obligacje", "ETF",
    "fundusze inwestycyjne", "inwestycje", "analizy rynkowe", "WIG20", "DAX",
    "S&P 500", "NASDAQ", "złoto", "ropa", "gaz"
  ],
  alternates: {
    canonical: "https://fusionfinance.pl/rynki",
  },
  openGraph: {
    title: "Rynki Finansowe - FusionFinance.pl",
    description: "Najnowsze wiadomości z rynków finansowych. Indeksy, surowce, obligacje, ETF-y i fundusze.",
    url: "https://fusionfinance.pl/rynki",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rynki Finansowe - FusionFinance.pl",
    description: "Najnowsze wiadomości z rynków finansowych.",
  },
};

export default function RynkiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

