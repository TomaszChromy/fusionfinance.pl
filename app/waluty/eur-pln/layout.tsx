import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kurs euro (EUR/PLN) - Aktualny kurs, wykres, analiza | FusionFinance.pl",
  description: "Aktualny kurs euro do złotego (EUR/PLN) z NBP. Sprawdź wykres, analizę techniczną i czynniki wpływające na kurs euro. Aktualizacja codzienna.",
  keywords: ["kurs euro", "EUR PLN", "euro do złotego", "kurs NBP", "ile kosztuje euro", "euro dzisiaj"],
  openGraph: {
    title: "Kurs euro (EUR/PLN) | FusionFinance.pl",
    description: "Aktualny kurs euro do złotego, wykres historyczny i analiza rynku walutowego.",
    type: "article",
  },
  alternates: {
    canonical: "https://fusionfinance.pl/waluty/eur-pln/",
  },
};

export default function EurPlnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

