"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface EconomicEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  country: string;
  impact: "low" | "medium" | "high";
  previous?: string;
  forecast?: string;
  actual?: string;
}

const MOCK_EVENTS: EconomicEvent[] = [
  { id: "1", date: "2024-12-06", time: "09:00", title: "PKB Polski Q3", country: "🇵🇱", impact: "high", previous: "0.5%", forecast: "0.8%" },
  { id: "2", date: "2024-12-06", time: "14:30", title: "Zatrudnienie USA", country: "🇺🇸", impact: "high", previous: "180K", forecast: "200K" },
  { id: "3", date: "2024-12-06", time: "16:00", title: "Indeks ISM", country: "🇺🇸", impact: "medium", previous: "52.1", forecast: "52.5" },
  { id: "4", date: "2024-12-07", time: "10:00", title: "Decyzja EBC", country: "🇪🇺", impact: "high", previous: "4.50%", forecast: "4.50%" },
  { id: "5", date: "2024-12-08", time: "11:00", title: "Inflacja Niemcy", country: "🇩🇪", impact: "medium", previous: "2.9%", forecast: "2.8%" },
  { id: "6", date: "2024-12-09", time: "14:00", title: "CPI Polska", country: "🇵🇱", impact: "high", previous: "4.9%", forecast: "4.7%" },
];

const IMPACT_COLORS = {
  low: { bg: "bg-[#4ade80]/10", text: "text-[#4ade80]", dot: "bg-[#4ade80]" },
  medium: { bg: "bg-[#fbbf24]/10", text: "text-[#fbbf24]", dot: "bg-[#fbbf24]" },
  high: { bg: "bg-[#f87171]/10", text: "text-[#f87171]", dot: "bg-[#f87171]" },
};

interface MarketCalendarProps {
  variant?: "default" | "compact" | "week";
  className?: string;
}

export default function MarketCalendar({ variant = "default", className = "" }: MarketCalendarProps) {
  const [filter, setFilter] = useState<"all" | "high">("all");

  const filteredEvents = filter === "high" 
    ? MOCK_EVENTS.filter((e) => e.impact === "high")
    : MOCK_EVENTS;

  // Group by date
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, EconomicEvent[]>);

  if (variant === "compact") {
    const todayEvents = MOCK_EVENTS.filter((e) => e.date === "2024-12-06").slice(0, 3);
    return (
      <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[#f4f4f5]">📅 Dziś</span>
          <span className="text-xs text-[#52525b]">{todayEvents.length} wydarzeń</span>
        </div>
        <div className="space-y-2">
          {todayEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${IMPACT_COLORS[event.impact].dot}`} />
              <span className="text-xs text-[#71717a]">{event.time}</span>
              <span className="text-xs text-[#a1a1aa] truncate">{event.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#f4f4f5] flex items-center gap-2">
          <span>📅</span>
          Kalendarz ekonomiczny
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              filter === "all" ? "bg-[#c9a962] text-[#08090c]" : "bg-white/5 text-[#71717a]"
            }`}
          >
            Wszystkie
          </button>
          <button
            onClick={() => setFilter("high")}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              filter === "high" ? "bg-[#f87171] text-white" : "bg-white/5 text-[#71717a]"
            }`}
          >
            Ważne
          </button>
        </div>
      </div>

      {/* Events by date */}
      <div className="max-h-96 overflow-y-auto">
        {Object.entries(groupedEvents).map(([date, events]) => (
          <div key={date}>
            <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5">
              <span className="text-xs font-medium text-[#c9a962]">
                {new Date(date).toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "short" })}
              </span>
            </div>
            <div className="divide-y divide-white/5">
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{event.country}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#71717a]">{event.time}</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${IMPACT_COLORS[event.impact].dot}`} />
                      </div>
                      <p className="text-sm font-medium text-[#f4f4f5] mt-0.5">{event.title}</p>
                      {(event.previous || event.forecast) && (
                        <div className="flex gap-3 mt-1 text-xs">
                          {event.previous && <span className="text-[#52525b]">Pop: {event.previous}</span>}
                          {event.forecast && <span className="text-[#c9a962]">Prog: {event.forecast}</span>}
                          {event.actual && <span className="text-[#4ade80]">Fakt: {event.actual}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

