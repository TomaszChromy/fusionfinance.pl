import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watchlist - Obserwowane Aktywa",
  description: "Twoja lista obserwowanych aktywów. Śledź akcje, kryptowaluty i waluty w jednym miejscu.",
  robots: { index: false, follow: false },
};

export default function WatchlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}

