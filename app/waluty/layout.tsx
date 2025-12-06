import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Waluty - Kursy Walut, FOREX, NBP",
  description: "Aktualne kursy walut NBP. EUR/PLN, USD/PLN, GBP/PLN, CHF/PLN. Wiadomości FOREX, analizy walutowe i prognozy kursów.",
  keywords: [
    "waluty", "kursy walut", "FOREX", "NBP", "EUR/PLN", "USD/PLN",
    "GBP/PLN", "CHF/PLN", "euro", "dolar", "frank", "funt",
    "przelicznik walut", "kantor", "wymiana walut"
  ],
  alternates: {
    canonical: "https://fusionfinance.pl/waluty",
  },
  openGraph: {
    title: "Waluty - Kursy NBP, FOREX - FusionFinance.pl",
    description: "Aktualne kursy walut NBP. EUR/PLN, USD/PLN. Wiadomości FOREX.",
    url: "https://fusionfinance.pl/waluty",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Waluty - Kursy NBP - FusionFinance.pl",
    description: "Aktualne kursy walut NBP, FOREX.",
  },
};

export default function WalutyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

