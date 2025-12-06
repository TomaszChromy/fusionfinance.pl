"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: string;
  volume24h: string;
  icon?: string;
}

const CRYPTO_ICONS: Record<string, string> = {
  BTC: "₿",
  ETH: "Ξ",
  BNB: "◆",
  XRP: "✕",
  ADA: "₳",
  SOL: "◎",
  DOGE: "Ð",
  DOT: "●",
};

// Mock crypto data
const MOCK_CRYPTO: CryptoData[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 97450.32, change24h: 2.45, marketCap: "$1.92T", volume24h: "$48.2B" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 3654.18, change24h: -1.23, marketCap: "$439B", volume24h: "$21.5B" },
  { id: "bnb", symbol: "BNB", name: "BNB", price: 642.55, change24h: 0.87, marketCap: "$96B", volume24h: "$2.1B" },
  { id: "xrp", symbol: "XRP", name: "XRP", price: 2.34, change24h: 5.67, marketCap: "$134B", volume24h: "$8.9B" },
  { id: "solana", symbol: "SOL", name: "Solana", price: 228.45, change24h: -3.21, marketCap: "$108B", volume24h: "$5.4B" },
  { id: "cardano", symbol: "ADA", name: "Cardano", price: 1.12, change24h: 1.45, marketCap: "$39B", volume24h: "$1.2B" },
];

interface CryptoPriceProps {
  cryptoId?: string;
  variant?: "default" | "compact" | "card" | "ticker";
  showDetails?: boolean;
  className?: string;
}

export default function CryptoPrice({
  cryptoId = "bitcoin",
  variant = "default",
  showDetails = false,
  className = "",
}: CryptoPriceProps) {
  const [crypto, setCrypto] = useState<CryptoData | null>(null);
  const [prevPrice, setPrevPrice] = useState<number>(0);

  useEffect(() => {
    const data = MOCK_CRYPTO.find((c) => c.id === cryptoId) || MOCK_CRYPTO[0];
    setPrevPrice(crypto?.price || data.price);
    setCrypto(data);
  }, [cryptoId, crypto?.price]);

  if (!crypto) return null;

  const isPositive = crypto.change24h >= 0;
  const priceChanged = prevPrice !== crypto.price;
  const priceUp = crypto.price > prevPrice;

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-lg">{CRYPTO_ICONS[crypto.symbol] || "●"}</span>
        <span className="text-xs font-medium text-[#f4f4f5]">{crypto.symbol}</span>
        <span className="text-xs text-[#a1a1aa]">${crypto.price.toLocaleString()}</span>
        <span className={`text-xs font-medium ${isPositive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
          {isPositive ? "+" : ""}{crypto.change24h.toFixed(2)}%
        </span>
      </div>
    );
  }

  if (variant === "ticker") {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        {MOCK_CRYPTO.slice(0, 5).map((c) => {
          const positive = c.change24h >= 0;
          return (
            <div key={c.id} className="flex items-center gap-2">
              <span className="text-sm">{CRYPTO_ICONS[c.symbol] || "●"}</span>
              <span className="text-xs text-[#a1a1aa]">{c.symbol}</span>
              <span className={`text-xs font-medium ${positive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                {positive ? "+" : ""}{c.change24h.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 hover:border-[#c9a962]/20 transition-colors ${className}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#c9a962]/10 flex items-center justify-center text-xl text-[#c9a962]">
              {CRYPTO_ICONS[crypto.symbol] || "●"}
            </div>
            <div>
              <p className="text-sm font-medium text-[#f4f4f5]">{crypto.name}</p>
              <p className="text-xs text-[#71717a]">{crypto.symbol}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-lg ${isPositive ? "bg-[#4ade80]/10" : "bg-[#f87171]/10"}`}>
            <span className={`text-xs font-medium ${isPositive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
              {isPositive ? "▲" : "▼"} {Math.abs(crypto.change24h).toFixed(2)}%
            </span>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={crypto.price}
            initial={{ opacity: 0, y: priceUp ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-[#f4f4f5]"
          >
            ${crypto.price.toLocaleString()}
          </motion.p>
        </AnimatePresence>
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[#52525b]">Market Cap</span>
              <p className="text-[#a1a1aa] font-medium">{crypto.marketCap}</p>
            </div>
            <div>
              <span className="text-[#52525b]">Volume 24h</span>
              <p className="text-[#a1a1aa] font-medium">{crypto.volume24h}</p>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // Default variant
  return (
    <div className={`flex items-center justify-between p-3 bg-[#0c0d10] border border-white/5 rounded-lg ${className}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl text-[#c9a962]">{CRYPTO_ICONS[crypto.symbol] || "●"}</span>
        <div>
          <p className="text-sm font-medium text-[#f4f4f5]">{crypto.name}</p>
          <p className="text-xs text-[#71717a]">{crypto.symbol}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-[#f4f4f5]">${crypto.price.toLocaleString()}</p>
        <p className={`text-xs font-medium ${isPositive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
          {isPositive ? "+" : ""}{crypto.change24h.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}

// Crypto Grid - display multiple cryptocurrencies
export function CryptoGrid({ limit = 6, className = "" }: { limit?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${className}`}>
      {MOCK_CRYPTO.slice(0, limit).map((crypto) => (
        <CryptoPrice key={crypto.id} cryptoId={crypto.id} variant="card" />
      ))}
    </div>
  );
}

