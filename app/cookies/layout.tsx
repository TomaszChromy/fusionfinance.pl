import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polityka Cookies",
  description: "Informacje o plikach cookies używanych na portalu FusionFinance.pl. Typy cookies, cele wykorzystania i ustawienia.",
  alternates: {
    canonical: "https://fusionfinance.pl/cookies",
  },
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

