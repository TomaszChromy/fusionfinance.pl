import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alerty Cenowe - Powiadomienia o Cenach",
  description: "Ustaw alerty cenowe dla akcji, kryptowalut i walut. Otrzymuj powiadomienia gdy cena osiągnie wybrany poziom.",
  robots: { index: false, follow: false },
};

export default function AlertyLayout({ children }: { children: React.ReactNode }) {
  return children;
}

