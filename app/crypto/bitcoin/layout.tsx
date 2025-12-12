import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bitcoin (BTC) - Aktualny kurs, wykres, analiza | FusionFinance.pl",
  description: "Aktualny kurs Bitcoina w PLN i USD. Sprawdź wykres, analizę i najważniejsze informacje o największej kryptowalucie świata.",
  keywords: ["bitcoin", "BTC", "kurs bitcoin", "bitcoin kurs", "bitcoin cena", "kryptowaluty", "crypto"],
  openGraph: {
    title: "Bitcoin (BTC) | FusionFinance.pl",
    description: "Aktualny kurs Bitcoina, wykres i analiza.",
  },
  alternates: { canonical: "https://fusionfinance.pl/crypto/bitcoin/" },
};

export default function BitcoinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

