import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artykuł",
  description: "Czytaj najnowsze artykuły i analizy rynkowe na FusionFinance.pl.",
  openGraph: {
    type: "article",
    siteName: "FusionFinance.pl",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function ArtykulLayout({ children }: { children: React.ReactNode }) {
  return children;
}

