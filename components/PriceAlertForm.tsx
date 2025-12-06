"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface PriceAlertFormProps {
  onSubmit?: (alert: { asset: string; condition: "above" | "below"; price: number }) => void;
  className?: string;
}

const ASSETS = [
  { id: "btc", name: "Bitcoin (BTC)", price: 101500 },
  { id: "eth", name: "Ethereum (ETH)", price: 3850 },
  { id: "eur", name: "EUR/PLN", price: 4.28 },
  { id: "usd", name: "USD/PLN", price: 4.02 },
  { id: "wig20", name: "WIG20", price: 2450 },
  { id: "gold", name: "Złoto (XAU/USD)", price: 2050 },
];

export default function PriceAlertForm({ onSubmit, className = "" }: PriceAlertFormProps) {
  const [asset, setAsset] = useState(ASSETS[0].id);
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [price, setPrice] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedAsset = ASSETS.find((a) => a.id === asset);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!price) return;

    onSubmit?.({ asset, condition, price: parseFloat(price) });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setPrice("");
    }, 2000);
  };

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 ${className}`}>
      <h3 className="text-sm font-medium text-[#f4f4f5] mb-4 flex items-center gap-2">
        <span>🔔</span>
        Utwórz alert cenowy
      </h3>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-6"
          >
            <span className="text-4xl mb-2 block">✅</span>
            <p className="text-sm text-[#4ade80]">Alert utworzony!</p>
            <p className="text-xs text-[#71717a] mt-1">
              Powiadomimy Cię gdy {selectedAsset?.name} {condition === "above" ? "wzrośnie powyżej" : "spadnie poniżej"} {price}
            </p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
            {/* Asset select */}
            <div>
              <label className="text-xs text-[#71717a] mb-1.5 block">Aktywo</label>
              <select
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f4f4f5] focus:outline-none focus:border-[#c9a962] transition-colors"
              >
                {ASSETS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              {selectedAsset && (
                <p className="text-[10px] text-[#52525b] mt-1">
                  Aktualnie: {selectedAsset.price.toLocaleString("pl-PL")}
                </p>
              )}
            </div>

            {/* Condition */}
            <div>
              <label className="text-xs text-[#71717a] mb-1.5 block">Warunek</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCondition("above")}
                  className={`px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-all ${
                    condition === "above"
                      ? "bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30"
                      : "bg-white/5 text-[#71717a] border border-white/5 hover:border-white/10"
                  }`}
                >
                  ↑ Wzrośnie powyżej
                </button>
                <button
                  type="button"
                  onClick={() => setCondition("below")}
                  className={`px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-all ${
                    condition === "below"
                      ? "bg-[#f87171]/20 text-[#f87171] border border-[#f87171]/30"
                      : "bg-white/5 text-[#71717a] border border-white/5 hover:border-white/10"
                  }`}
                >
                  ↓ Spadnie poniżej
                </button>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="text-xs text-[#71717a] mb-1.5 block">Cena progowa</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={selectedAsset?.price.toString()}
                step="any"
                className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f4f4f5] placeholder:text-[#52525b] focus:outline-none focus:border-[#c9a962] transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!price}
              className="w-full py-2.5 bg-gradient-to-r from-[#c9a962] to-[#b8963f] text-[#08090c] text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Utwórz alert
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

