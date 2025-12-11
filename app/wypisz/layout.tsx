import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wypisz się z Newslettera",
  description: "Wypisz się z newslettera FusionFinance.pl.",
  robots: { index: false, follow: false },
};

export default function WypiszLayout({ children }: { children: React.ReactNode }) {
  return children;
}

