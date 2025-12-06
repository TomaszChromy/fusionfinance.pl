import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kryptowaluty - Bitcoin, Ethereum, Altcoiny",
  description: "Najnowsze wiadomości o kryptowalutach. Bitcoin, Ethereum, altcoiny, DeFi, NFT, blockchain. Analizy i prognozy rynku crypto.",
  keywords: [
    "kryptowaluty", "bitcoin", "BTC", "ethereum", "ETH", "altcoiny",
    "DeFi", "NFT", "blockchain", "Web3", "crypto", "stablecoiny",
    "USDT", "Solana", "Cardano", "Ripple", "XRP", "trading crypto"
  ],
  alternates: {
    canonical: "https://fusionfinance.pl/crypto",
  },
  openGraph: {
    title: "Kryptowaluty - Bitcoin, Ethereum - FusionFinance.pl",
    description: "Bitcoin, Ethereum, altcoiny, DeFi, NFT. Najnowsze wiadomości i analizy crypto.",
    url: "https://fusionfinance.pl/crypto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kryptowaluty - FusionFinance.pl",
    description: "Bitcoin, Ethereum, altcoiny, DeFi, NFT.",
  },
};

export default function CryptoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

