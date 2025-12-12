import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O Redakcji - Polityka redakcyjna | FusionFinance.pl",
  description: "Poznaj zespół FusionFinance.pl, naszą politykę redakcyjną i źródła informacji. Transparentność i wiarygodność to nasze priorytety.",
  openGraph: {
    title: "O Redakcji | FusionFinance.pl",
    description: "Zespół redakcyjny i polityka redakcyjna FusionFinance.pl",
  },
};

export default function ORedakcjiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

