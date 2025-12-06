import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kursy Walut NBP - Tabela Kursów",
  description: "Pełna tabela kursów walut NBP. Aktualne kursy średnie wszystkich walut. EUR, USD, GBP, CHF i wiele innych.",
  keywords: [
    "kursy walut", "NBP", "tabela kursów", "kurs średni",
    "EUR", "USD", "GBP", "CHF", "przelicznik walut"
  ],
  alternates: {
    canonical: "https://fusionfinance.pl/kursy-walut",
  },
  openGraph: {
    title: "Kursy Walut NBP - FusionFinance.pl",
    description: "Pełna tabela kursów walut NBP. Aktualne kursy średnie.",
    url: "https://fusionfinance.pl/kursy-walut",
    type: "website",
  },
};

export default function KursyWalutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

