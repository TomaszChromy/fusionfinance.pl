"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Market {
  id: string;
  name: string;
  shortName: string;
  timezone: string;
  openHour: number;
  openMinute: number;
  closeHour: number;
  closeMinute: number;
  weekendClosed: boolean;
}

const MARKETS: Market[] = [
  { id: "gpw", name: "Giełda Papierów Wartościowych", shortName: "GPW", timezone: "Europe/Warsaw", openHour: 9, openMinute: 0, closeHour: 17, closeMinute: 0, weekendClosed: true },
  { id: "nyse", name: "New York Stock Exchange", shortName: "NYSE", timezone: "America/New_York", openHour: 9, openMinute: 30, closeHour: 16, closeMinute: 0, weekendClosed: true },
  { id: "nasdaq", name: "NASDAQ", shortName: "NASDAQ", timezone: "America/New_York", openHour: 9, openMinute: 30, closeHour: 16, closeMinute: 0, weekendClosed: true },
  { id: "lse", name: "London Stock Exchange", shortName: "LSE", timezone: "Europe/London", openHour: 8, openMinute: 0, closeHour: 16, closeMinute: 30, weekendClosed: true },
  { id: "tse", name: "Tokyo Stock Exchange", shortName: "TSE", timezone: "Asia/Tokyo", openHour: 9, openMinute: 0, closeHour: 15, closeMinute: 0, weekendClosed: true },
  { id: "crypto", name: "Kryptowaluty", shortName: "CRYPTO", timezone: "UTC", openHour: 0, openMinute: 0, closeHour: 23, closeMinute: 59, weekendClosed: false },
];

function getMarketStatus(market: Market): { isOpen: boolean; timeUntil: string; nextEvent: "open" | "close" } {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: market.timezone,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    weekday: "short",
  });
  
  const parts = formatter.formatToParts(now);
  const hour = parseInt(parts.find(p => p.type === "hour")?.value || "0");
  const minute = parseInt(parts.find(p => p.type === "minute")?.value || "0");
  const weekday = parts.find(p => p.type === "weekday")?.value || "";
  
  const isWeekend = weekday === "Sat" || weekday === "Sun";
  
  if (market.weekendClosed && isWeekend) {
    return { isOpen: false, timeUntil: "Pon.", nextEvent: "open" };
  }
  
  const currentMinutes = hour * 60 + minute;
  const openMinutes = market.openHour * 60 + market.openMinute;
  const closeMinutes = market.closeHour * 60 + market.closeMinute;
  
  const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  
  let minutesUntil: number;
  let nextEvent: "open" | "close";
  
  if (isOpen) {
    minutesUntil = closeMinutes - currentMinutes;
    nextEvent = "close";
  } else if (currentMinutes < openMinutes) {
    minutesUntil = openMinutes - currentMinutes;
    nextEvent = "open";
  } else {
    minutesUntil = (24 * 60 - currentMinutes) + openMinutes;
    nextEvent = "open";
  }
  
  const hours = Math.floor(minutesUntil / 60);
  const mins = minutesUntil % 60;
  const timeUntil = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  
  return { isOpen, timeUntil, nextEvent };
}

interface MarketStatusProps {
  marketId?: string;
  variant?: "default" | "compact" | "badge";
  className?: string;
}

export default function MarketStatus({
  marketId = "gpw",
  variant = "default",
  className = "",
}: MarketStatusProps) {
  const [status, setStatus] = useState<{ isOpen: boolean; timeUntil: string; nextEvent: "open" | "close" } | null>(null);
  const market = MARKETS.find(m => m.id === marketId) || MARKETS[0];

  useEffect(() => {
    setStatus(getMarketStatus(market));
    const interval = setInterval(() => {
      setStatus(getMarketStatus(market));
    }, 60000);
    return () => clearInterval(interval);
  }, [market]);

  if (!status) return null;

  if (variant === "badge") {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
        status.isOpen ? "bg-[#4ade80]/10 text-[#4ade80]" : "bg-[#f87171]/10 text-[#f87171]"
      } ${className}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? "bg-[#4ade80] animate-pulse" : "bg-[#f87171]"}`} />
        {status.isOpen ? "Otwarta" : "Zamknięta"}
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className={`w-2 h-2 rounded-full ${status.isOpen ? "bg-[#4ade80] animate-pulse" : "bg-[#f87171]"}`} />
        <span className="text-xs text-[#a1a1aa]">{market.shortName}</span>
        <span className={`text-xs font-medium ${status.isOpen ? "text-[#4ade80]" : "text-[#f87171]"}`}>
          {status.isOpen ? "Otwarta" : "Zamknięta"}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-medium text-[#f4f4f5]">{market.name}</h4>
          <p className="text-xs text-[#71717a]">{market.shortName}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
          status.isOpen ? "bg-[#4ade80]/10" : "bg-[#f87171]/10"
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            status.isOpen ? "bg-[#4ade80] animate-pulse" : "bg-[#f87171]"
          }`} />
          <span className={`text-sm font-medium ${
            status.isOpen ? "text-[#4ade80]" : "text-[#f87171]"
          }`}>
            {status.isOpen ? "Otwarta" : "Zamknięta"}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#71717a]">
          {status.nextEvent === "close" ? "Zamknięcie za:" : "Otwarcie za:"}
        </span>
        <span className="font-medium text-[#f4f4f5]">{status.timeUntil}</span>
      </div>
    </motion.div>
  );
}

// Market Status Grid
export function MarketStatusGrid({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${className}`}>
      {MARKETS.map(market => (
        <MarketStatus key={market.id} marketId={market.id} />
      ))}
    </div>
  );
}

