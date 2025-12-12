import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kurs dolara (USD/PLN) - Aktualny kurs, wykres, analiza | FusionFinance.pl",
  description: "Aktualny kurs dolara do złotego (USD/PLN) z NBP. Sprawdź wykres, analizę i czynniki wpływające na kurs dolara amerykańskiego.",
  keywords: ["kurs dolara", "USD PLN", "dolar do złotego", "kurs NBP", "ile kosztuje dolar", "dolar dzisiaj"],
  openGraph: {
    title: "Kurs dolara (USD/PLN) | FusionFinance.pl",
    description: "Aktualny kurs dolara do złotego, wykres historyczny i analiza.",
  },
  alternates: { canonical: "https://fusionfinance.pl/waluty/usd-pln/" },
};

export default function UsdPlnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

