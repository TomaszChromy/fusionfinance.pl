import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polityka Prywatności",
  description: "Polityka prywatności portalu FusionFinance.pl. Informacje o przetwarzaniu danych osobowych, cookies i prawach użytkowników.",
  alternates: {
    canonical: "https://fusionfinance.pl/polityka-prywatnosci",
  },
};

export default function PolitykaPrywatnosciLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

