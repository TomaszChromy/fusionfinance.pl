import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ustawienia",
  description: "Ustawienia konta FusionFinance.pl. Powiadomienia i preferencje.",
  robots: { index: false, follow: false },
};

export default function UstawieniaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
