import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mój Profil",
  description: "Twój profil użytkownika FusionFinance.pl. Zarządzaj kontem i ustawieniami.",
  robots: { index: false, follow: false },
};

export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  return children;
}

