import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rejestracja - Załóż Konto",
  description: "Załóż darmowe konto na FusionFinance.pl. Alerty cenowe, watchlist, ulubione artykuły i newsletter.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://fusionfinance.pl/rejestracja",
  },
};

export default function RejestracjaLayout({ children }: { children: React.ReactNode }) {
  return children;
}

