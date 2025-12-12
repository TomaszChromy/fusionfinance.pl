import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zastrzeżenie prawne - Disclaimer | FusionFinance.pl",
  description: "Ważne informacje prawne dotyczące korzystania z serwisu FusionFinance.pl. Ostrzeżenie o ryzyku inwestycyjnym, źródła danych i brak rekomendacji.",
  openGraph: {
    title: "Zastrzeżenie prawne | FusionFinance.pl",
    description: "Informacje o ryzyku inwestycyjnym i źródłach danych.",
  },
};

export default function DisclaimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

