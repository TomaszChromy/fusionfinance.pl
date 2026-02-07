"use client";

import { useState } from "react";

interface Asset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  change7d: number;
  change30d: number;
  marketCap?: number;
  volume?: number;
  type: string;
}

const ASSETS_DATA: Asset[] = [
  { symbol: "BTC", name: "Bitcoin", price: 42567, change24h: 2.5, change7d: 8.2, change30d: 15.3, marketCap: 834000000000, volume: 28000000000, type: "crypto" },
  { symbol: "ETH", name: "Ethereum", price: 2245, change24h: 1.8, change7d: 5.4, change30d: 12.1, marketCap: 270000000000, volume: 12000000000, type: "crypto" },
  { symbol: "EUR/PLN", name: "Euro", price: 4.28, change24h: -0.12, change7d: 0.45, change30d: -0.8, type: "currency" },
  { symbol: "USD/PLN", name: "Dolar", price: 3.95, change24h: 0.08, change7d: 0.22, change30d: -1.2, type: "currency" },
  { symbol: "WIG20", name: "WIG20", price: 2345, change24h: 0.5, change7d: 1.2, change30d: 3.5, type: "index" },
  { symbol: "PKO", name: "PKO BP", price: 45.8, change24h: 1.2, change7d: 2.8, change30d: 5.4, type: "stock" },
];

interface CompareAssetsProps {
  className?: string;
}

export default function CompareAssets({ className = "" }: CompareAssetsProps) {
  const [selected, setSelected] = useState<string[]>(["BTC", "ETH"]);

  const toggleAsset = (symbol: string) => {
    if (selected.includes(symbol)) {
      if (selected.length > 1) {
        setSelected(selected.filter((s) => s !== symbol));
      }
    } else if (selected.length < 4) {
      setSelected([...selected, symbol]);
    }
  };

  const selectedAssets = ASSETS_DATA.filter((a) => selected.includes(a.symbol));

  const formatValue = (value: number | undefined, type: string) => {
    if (value === undefined) return "—";
    if (type === "currency" || value < 1000) return value.toLocaleString("pl-PL", { maximumFractionDigits: 4 });
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    return value.toLocaleString("pl-PL");
  };

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <h3 className="text-sm font-medium text-[#f4f4f5] flex items-center gap-2">
          <span>⚖️</span>
          Porównaj aktywa
        </h3>
        <p className="text-xs text-[#52525b] mt-1">Wybierz 2-4 aktywa do porównania</p>
      </div>

      {/* Asset selector */}
      <div className="p-4 border-b border-white/5 flex flex-wrap gap-2">
        {ASSETS_DATA.map((asset) => (
          <button
            key={asset.symbol}
            onClick={() => toggleAsset(asset.symbol)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selected.includes(asset.symbol)
                ? "bg-[#c9a962] text-[#08090c]"
                : "bg-white/5 text-[#a1a1aa] hover:bg-white/10"
            }`}
          >
            {asset.symbol}
          </button>
        ))}
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-4 py-3 text-left text-xs text-[#52525b] font-medium">Wskaźnik</th>
              {selectedAssets.map((asset) => (
                <th key={asset.symbol} className="px-4 py-3 text-right text-xs font-medium text-[#c9a962]">
                  {asset.symbol}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="px-4 py-3 text-[#71717a]">Cena</td>
              {selectedAssets.map((asset) => (
                <td key={asset.symbol} className="px-4 py-3 text-right font-medium text-[#f4f4f5]">
                  {formatValue(asset.price, asset.type)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 text-[#71717a]">Zmiana 24h</td>
              {selectedAssets.map((asset) => (
                <td key={asset.symbol} className={`px-4 py-3 text-right font-medium ${asset.change24h >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                  {asset.change24h >= 0 ? "+" : ""}{asset.change24h.toFixed(2)}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 text-[#71717a]">Zmiana 7d</td>
              {selectedAssets.map((asset) => (
                <td key={asset.symbol} className={`px-4 py-3 text-right font-medium ${asset.change7d >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                  {asset.change7d >= 0 ? "+" : ""}{asset.change7d.toFixed(2)}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 text-[#71717a]">Zmiana 30d</td>
              {selectedAssets.map((asset) => (
                <td key={asset.symbol} className={`px-4 py-3 text-right font-medium ${asset.change30d >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                  {asset.change30d >= 0 ? "+" : ""}{asset.change30d.toFixed(2)}%
                </td>
              ))}
            </tr>
            {selectedAssets.some((a) => a.marketCap) && (
              <tr>
                <td className="px-4 py-3 text-[#71717a]">Kapitalizacja</td>
                {selectedAssets.map((asset) => (
                  <td key={asset.symbol} className="px-4 py-3 text-right text-[#a1a1aa]">
                    ${formatValue(asset.marketCap, asset.type)}
                  </td>
                ))}
              </tr>
            )}
            {selectedAssets.some((a) => a.volume) && (
              <tr>
                <td className="px-4 py-3 text-[#71717a]">Wolumen 24h</td>
                {selectedAssets.map((asset) => (
                  <td key={asset.symbol} className="px-4 py-3 text-right text-[#a1a1aa]">
                    ${formatValue(asset.volume, asset.type)}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
