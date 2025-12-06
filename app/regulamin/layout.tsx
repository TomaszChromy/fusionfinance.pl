import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regulamin",
  description: "Regulamin korzystania z portalu FusionFinance.pl. Warunki użytkowania, prawa i obowiązki użytkowników.",
  alternates: {
    canonical: "https://fusionfinance.pl/regulamin",
  },
};

export default function RegulaminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

