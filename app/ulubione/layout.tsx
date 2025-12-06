import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ulubione Artykuły",
  description: "Twoje zapisane artykuły finansowe. Zarządzaj listą ulubionych wiadomości.",
  alternates: {
    canonical: "https://fusionfinance.pl/ulubione",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function UlubioneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

