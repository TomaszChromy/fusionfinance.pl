"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddToWatchlistButton from "./AddToWatchlistButton";
import CreateAlertButton from "./CreateAlertButton";

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number | string;
  volume24h: number | string;
  image?: string;
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
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 97450.32, change24h: 2.45, marketCap: 1.92e12, volume24h: 48.2e9 },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 3654.18, change24h: -1.23, marketCap: 439e9, volume24h: 21.5e9 },
  { id: "bnb", symbol: "BNB", name: "BNB", price: 642.55, change24h: 0.87, marketCap: 96e9, volume24h: 2.1e9 },
  { id: "xrp", symbol: "XRP", name: "XRP", price: 2.34, change24h: 5.67, marketCap: 134e9, volume24h: 8.9e9 },
  { id: "solana", symbol: "SOL", name: "Solana", price: 228.45, change24h: -3.21, marketCap: 108e9, volume24h: 5.4e9 },
  { id: "cardano", symbol: "ADA", name: "Cardano", price: 1.12, change24h: 1.45, marketCap: 39e9, volume24h: 1.2e9 },
];

interface CryptoPriceProps {
  cryptoId?: string;
  data?: CryptoData;
  variant?: "default" | "compact" | "card" | "ticker";
  showDetails?: boolean;
  className?: string;
}

export default function CryptoPrice({
  cryptoId = "bitcoin",
  data,
  variant = "default",
  showDetails = false,
  className = "",
}: CryptoPriceProps) {
  const crypto = data || MOCK_CRYPTO.find((c) => c.id === cryptoId) || MOCK_CRYPTO[0];
  const tickerCoins = data ? [data] : MOCK_CRYPTO;

  const change = Number.isFinite(crypto.change24h) ? crypto.change24h : 0;
  const isPositive = change >= 0;
  const formatMoney = (value: number | string) => {
    if (typeof value === "string") return value;
    if (!Number.isFinite(value)) return "-";
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    return value.toLocaleString();
  };

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-lg">{CRYPTO_ICONS[crypto.symbol] || "●"}</span>
        <span className="text-xs font-medium text-[#f4f4f5]">{crypto.symbol}</span>
        <span className="text-xs text-[#a1a1aa]">${crypto.price.toLocaleString()}</span>
        <span className={`text-xs font-medium ${isPositive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
          {isPositive ? "+" : ""}{change.toFixed(2)}%
        </span>
      </div>
    );
  }

  if (variant === "ticker") {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        {tickerCoins.slice(0, 5).map((c) => {
          const delta = Number.isFinite(c.change24h) ? c.change24h : 0;
          const positive = delta >= 0;
          return (
            <div key={c.id} className="flex items-center gap-2">
              <span className="text-sm">{CRYPTO_ICONS[c.symbol] || "●"}</span>
              <span className="text-xs text-[#a1a1aa]">{c.symbol}</span>
              <span className={`text-xs font-medium ${positive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                {positive ? "+" : ""}{delta.toFixed(2)}%
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
        className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 hover:border-[#c9a962]/20 transition-colors group ${className}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {crypto.image ? (
              <div className="w-10 h-10 rounded-full bg-white/5 overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={crypto.image} alt={crypto.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#c9a962]/10 flex items-center justify-center text-xl text-[#c9a962]">
                {CRYPTO_ICONS[crypto.symbol] || "●"}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-[#f4f4f5]">{crypto.name}</p>
              <p className="text-xs text-[#71717a]">{crypto.symbol}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-lg ${isPositive ? "bg-[#4ade80]/10" : "bg-[#f87171]/10"}`}>
            <span className={`text-xs font-medium ${isPositive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
              {isPositive ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
            </span>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={crypto.price}
            initial={{ opacity: 0, y: isPositive ? 10 : -10 }}
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
              <p className="text-[#a1a1aa] font-medium">${formatMoney(crypto.marketCap)}</p>
            </div>
            <div>
              <span className="text-[#52525b]">Volume 24h</span>
              <p className="text-[#a1a1aa] font-medium">${formatMoney(crypto.volume24h)}</p>
            </div>
          </div>
        )}
        {/* Action buttons - visible on hover */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <AddToWatchlistButton symbol={crypto.symbol} name={crypto.name} type="crypto" variant="compact" />
          <CreateAlertButton symbol={crypto.symbol} currentPrice={crypto.price} variant="icon" />
          <span className="text-[10px] text-[#52525b] ml-auto">Obserwuj / Alert</span>
        </div>
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
          {isPositive ? "+" : ""}{change.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}

// Crypto Grid - display multiple cryptocurrencies
export function CryptoGrid({
  limit = 6,
  className = "",
  variant = "grid"
}: {
  limit?: number;
  className?: string;
  variant?: "grid" | "sidebar" | "list";
}) {
  const [coins, setCoins] = useState<CryptoData[]>(MOCK_CRYPTO.slice(0, limit));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/crypto?limit=${limit}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Błąd pobierania");
        const data = await res.json();
        const items = Array.isArray(data?.items) ? data.items : [];
        if (!mounted) return;
        setCoins(items.length ? items : MOCK_CRYPTO.slice(0, limit));
        setError(items.length ? null : "Brak danych z API, pokazujemy dane przykładowe.");
      } catch {
        if (!mounted) return;
        setCoins(MOCK_CRYPTO.slice(0, limit));
        setError("Nie udało się pobrać kursów, pokazujemy dane przykładowe.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [limit]);

  const visibleCoins = useMemo(() => coins.slice(0, limit), [coins, limit]);

  const renderError = () =>
    error ? (
      <div className="col-span-2 md:col-span-3 text-[12px] text-[#f97316] mb-1">
        {error}
      </div>
    ) : null;

  // Sidebar variant - compact 2-column grid optimized for narrow sidebars
  if (variant === "sidebar") {
    return (
      <div className={`grid grid-cols-2 gap-2 ${className}`}>
        {renderError()}
        {visibleCoins.map((crypto) => {
          const delta = Number.isFinite(crypto.change24h) ? crypto.change24h : 0;
          const isPositive = delta >= 0;
          return (
            <div
              key={crypto.id}
              className="bg-[#0c0d10] border border-white/5 rounded-lg p-3 hover:border-[#c9a962]/20 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-[#c9a962]/10 flex items-center justify-center text-sm text-[#c9a962]">
                  {CRYPTO_ICONS[crypto.symbol] || "●"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#c9a962] truncate">{crypto.name}</p>
                  <p className="text-[10px] text-[#71717a]">{crypto.symbol}</p>
                </div>
              </div>
              <p className="text-base font-bold text-[#f4f4f5] mb-1">
                ${crypto.price.toLocaleString()}
              </p>
              <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                isPositive ? "bg-[#4ade80]/10 text-[#4ade80]" : "bg-[#f87171]/10 text-[#f87171]"
              }`}>
                {isPositive ? "▲" : "▼"} {Math.abs(delta).toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // List variant - vertical list for narrow spaces
  if (variant === "list") {
    return (
      <div className={`space-y-2 ${className}`}>
        {renderError()}
        {visibleCoins.map((crypto) => (
          <CryptoPrice key={crypto.id} data={crypto} cryptoId={crypto.id} variant="default" />
        ))}
      </div>
    );
  }

  // Default grid variant
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${className}`}>
      {renderError()}
      {visibleCoins.map((crypto) => (
        <CryptoPrice key={crypto.id} data={crypto} cryptoId={crypto.id} variant="card" showDetails />
      ))}
      {loading && !visibleCoins.length && (
        <div className="col-span-2 md:col-span-3 text-[12px] text-[#71717a]">
          Ładuję aktualne kursy...
        </div>
      )}
    </div>
  );
}
