"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface CreateAlertButtonProps {
  symbol: string;
  currentPrice?: number;
  variant?: "icon" | "button";
  className?: string;
}

export default function CreateAlertButton({
  symbol,
  currentPrice,
  variant = "icon",
  className = "",
}: CreateAlertButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [price, setPrice] = useState(currentPrice?.toString() || "");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      router.push("/logowanie");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, price: parseFloat(price), condition }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setShowForm(false);
          setSuccess(false);
        }, 1500);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openForm = () => {
    if (!session?.user) {
      router.push("/logowanie");
      return;
    }
    setShowForm(true);
  };

  return (
    <div className={`relative ${className}`}>
      {variant === "button" ? (
        <button
          type="button"
          onClick={openForm}
          className="px-4 py-2 text-sm font-medium text-[#a1a1aa] hover:text-[#f4f4f5] bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-lg transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Ustaw alert
        </button>
      ) : (
        <button
          type="button"
          onClick={openForm}
          className="p-2 text-[#71717a] hover:text-[#c9a962] hover:bg-white/[0.05] rounded-lg transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      )}

      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.form
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onSubmit={handleSubmit}
              className="absolute right-0 top-full mt-2 w-64 bg-[#0c0d10] border border-white/10 rounded-xl p-4 shadow-2xl z-50"
            >
              {success ? (
                <div className="text-center py-4">
                  <span className="text-2xl">✅</span>
                  <p className="text-sm text-[#22c55e] mt-2">Alert utworzony!</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[#f4f4f5]">Alert dla {symbol}</span>
                    <button type="button" onClick={() => setShowForm(false)} className="text-[#52525b] hover:text-[#f4f4f5]">✕</button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setCondition("above")} className={`flex-1 py-2 text-xs rounded-lg transition-colors ${condition === "above" ? "bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30" : "bg-white/[0.03] text-[#71717a] border border-white/10"}`}>
                        ▲ Powyżej
                      </button>
                      <button type="button" onClick={() => setCondition("below")} className={`flex-1 py-2 text-xs rounded-lg transition-colors ${condition === "below" ? "bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30" : "bg-white/[0.03] text-[#71717a] border border-white/10"}`}>
                        ▼ Poniżej
                      </button>
                    </div>
                    <input type="number" step="any" placeholder="Cena docelowa" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-[#f4f4f5] placeholder-[#52525b]" required />
                    <button type="submit" disabled={loading} className="w-full py-2 bg-[#c9a962] text-[#08090c] text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50">
                      {loading ? "Tworzę..." : "Utwórz alert"}
                    </button>
                  </div>
                </>
              )}
            </motion.form>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

