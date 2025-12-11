import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logowanie",
  description: "Zaloguj się do FusionFinance.pl. Dostęp do alertów cenowych, watchlist i spersonalizowanych ustawień.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://fusionfinance.pl/logowanie",
  },
};

export default function LogowanieLayout({ children }: { children: React.ReactNode }) {
  return children;
}

