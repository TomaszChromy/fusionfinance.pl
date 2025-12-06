import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Historia Przeglądania",
  description: "Historia ostatnio przeglądanych artykułów finansowych.",
  alternates: {
    canonical: "https://fusionfinance.pl/historia",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function HistoriaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

