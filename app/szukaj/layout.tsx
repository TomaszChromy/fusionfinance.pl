import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wyszukiwarka Artykułów",
  description: "Wyszukaj artykuły finansowe. Przeszukuj wiadomości o giełdzie, walutach, kryptowalutach i analizach rynkowych.",
  alternates: {
    canonical: "https://fusionfinance.pl/szukaj",
  },
};

export default function SzukajLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

