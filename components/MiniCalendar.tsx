"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface EconomicEvent {
  id: string;
  date: Date;
  title: string;
  country?: string;
  importance: "low" | "medium" | "high";
  time?: string;
}

interface MiniCalendarProps {
  events?: EconomicEvent[];
  className?: string;
}

const DAYS_PL = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"];
const MONTHS_PL = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];

export default function MiniCalendar({ events = [], className = "" }: MiniCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
  };

  const importanceColor = {
    low: "bg-[#71717a]",
    medium: "bg-[#fbbf24]",
    high: "bg-[#f87171]",
  };

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={goToPrevMonth} className="p-1 hover:bg-white/5 rounded-lg transition-colors text-[#71717a] hover:text-[#f4f4f5]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-sm font-medium text-[#f4f4f5]">
          {MONTHS_PL[month]} {year}
        </h3>
        <button onClick={goToNextMonth} className="p-1 hover:bg-white/5 rounded-lg transition-colors text-[#71717a] hover:text-[#f4f4f5]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_PL.map(day => (
          <div key={day} className="text-center text-[10px] text-[#52525b] font-medium py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayEvents = getEventsForDay(day);
          const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
          const hasHighImportance = dayEvents.some(e => e.importance === "high");

          return (
            <motion.button
              key={day}
              whileHover={{ scale: 1.1 }}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs relative transition-colors ${
                isToday
                  ? "bg-[#c9a962] text-[#08090c] font-bold"
                  : dayEvents.length > 0
                  ? "bg-white/5 text-[#f4f4f5]"
                  : "text-[#a1a1aa] hover:bg-white/5"
              }`}
            >
              {day}
              {dayEvents.length > 0 && !isToday && (
                <div className="absolute bottom-0.5 flex gap-0.5">
                  {dayEvents.slice(0, 3).map((event, idx) => (
                    <span key={idx} className={`w-1 h-1 rounded-full ${importanceColor[event.importance]}`} />
                  ))}
                </div>
              )}
              {hasHighImportance && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#f87171] rounded-full animate-pulse" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#71717a]" />
          <span className="text-[10px] text-[#71717a]">Niski</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#fbbf24]" />
          <span className="text-[10px] text-[#71717a]">Średni</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#f87171]" />
          <span className="text-[10px] text-[#71717a]">Wysoki</span>
        </div>
      </div>
    </div>
  );
}

// Upcoming Events List
export function UpcomingEvents({
  events,
  limit = 5,
  className = "",
}: {
  events: EconomicEvent[];
  limit?: number;
  className?: string;
}) {
  const sortedEvents = [...events]
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit);

  const importanceColors = {
    low: "border-l-[#71717a]",
    medium: "border-l-[#fbbf24]",
    high: "border-l-[#f87171]",
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {sortedEvents.map(event => (
        <div key={event.id} className={`bg-[#0c0d10] border border-white/5 ${importanceColors[event.importance]} border-l-4 rounded-lg p-3`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#f4f4f5]">{event.title}</p>
              {event.country && <p className="text-xs text-[#71717a]">{event.country}</p>}
            </div>
            <div className="text-right">
              <p className="text-xs text-[#a1a1aa]">
                {new Date(event.date).toLocaleDateString("pl-PL", { day: "numeric", month: "short" })}
              </p>
              {event.time && <p className="text-[10px] text-[#52525b]">{event.time}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

