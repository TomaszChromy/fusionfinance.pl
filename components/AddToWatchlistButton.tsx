"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AddToWatchlistButtonProps {
  symbol: string;
  name?: string;
  type: "stock" | "crypto" | "currency" | "index";
  variant?: "icon" | "button" | "compact";
  className?: string;
}

export default function AddToWatchlistButton({
  symbol,
  name,
  type,
  variant = "icon",
  className = "",
}: AddToWatchlistButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleAdd = async () => {
    if (!session?.user) {
      router.push("/logowanie");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, name, type }),
      });

      if (res.ok) {
        setIsAdded(true);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
      } else {
        const data = await res.json();
        if (data.error === "Already in watchlist") {
          setIsAdded(true);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleAdd}
        disabled={loading || isAdded}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
          isAdded
            ? "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30"
            : "bg-white/[0.05] text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-white/[0.08] border border-white/10"
        } ${className}`}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Dodawanie...
          </span>
        ) : isAdded ? (
          <span className="flex items-center gap-2">✓ Na liście</span>
        ) : (
          <span className="flex items-center gap-2">+ Obserwuj</span>
        )}
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={handleAdd}
        disabled={loading || isAdded}
        className={`text-xs ${isAdded ? "text-[#22c55e]" : "text-[#71717a] hover:text-[#c9a962]"} transition-colors ${className}`}
      >
        {isAdded ? "✓" : "+"}
      </button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleAdd}
        disabled={loading || isAdded}
        onMouseEnter={() => !isAdded && setShowTooltip(true)}
        onMouseLeave={() => !isAdded && setShowTooltip(false)}
        className={`p-2 rounded-lg transition-all ${
          isAdded
            ? "text-[#22c55e] bg-[#22c55e]/10"
            : "text-[#71717a] hover:text-[#c9a962] hover:bg-white/[0.05]"
        }`}
      >
        {loading ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : isAdded ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#0c0d10] border border-white/10 rounded text-[10px] text-[#f4f4f5] whitespace-nowrap z-10"
          >
            {isAdded ? "Dodano do watchlist" : "Dodaj do watchlist"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

