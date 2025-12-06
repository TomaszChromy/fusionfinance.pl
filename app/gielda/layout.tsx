import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giełda - GPW, WIG20, Notowania Spółek",
  description: "Notowania spółek GPW, WIG20, mWIG40, sWIG80. Dywidendy, IPO, debiuty giełdowe. Aktualne kursy akcji i analizy techniczne.",
  keywords: [
    "giełda", "GPW", "WIG20", "mWIG40", "sWIG80", "akcje", "notowania",
    "dywidendy", "IPO", "debiuty giełdowe", "analiza techniczna",
    "PKO", "PKN Orlen", "PZU", "CD Projekt", "KGHM", "Allegro"
  ],
  alternates: {
    canonical: "https://fusionfinance.pl/gielda",
  },
  openGraph: {
    title: "Giełda GPW - Notowania, WIG20, Spółki",
    description: "Notowania spółek GPW, WIG20, mWIG40. Dywidendy, IPO i analizy giełdowe.",
    url: "https://fusionfinance.pl/gielda",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giełda GPW - FusionFinance.pl",
    description: "Notowania spółek GPW, WIG20, mWIG40.",
  },
};

export default function GieldaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

