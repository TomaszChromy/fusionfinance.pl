"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  title?: string;
  description?: string;
  onComplete?: () => void;
  variant?: "default" | "compact" | "minimal";
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const difference = targetDate.getTime() - new Date().getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

type TimeUnitVariant = {
  textSize: string;
  padding: string;
  labelSize: string;
};

const TimeUnit = ({ value, label, variant }: { value: number; label: string; variant: TimeUnitVariant }) => (
  <div className="flex flex-col items-center">
    <motion.div
      key={value}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`font-mono font-bold ${variant.textSize} text-[#f4f4f5] bg-[#0c0d10] border border-white/10 rounded-lg ${variant.padding}`}
    >
      {value.toString().padStart(2, "0")}
    </motion.div>
    <span className={`text-[#71717a] uppercase tracking-wider mt-1 ${variant.labelSize}`}>
      {label}
    </span>
  </div>
);

export default function CountdownTimer({
  targetDate,
  title,
  description,
  onComplete,
  variant = "default",
  className = "",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(targetDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);

      if (Object.values(newTimeLeft).every(v => v === 0)) {
        clearInterval(timer);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const timeUnitVariant = useMemo(
    () => ({
      textSize:
        variant === "compact" ? "text-xl" : variant === "minimal" ? "text-lg" : "text-3xl",
      padding:
        variant === "compact" ? "px-2 py-1" : variant === "minimal" ? "px-1.5 py-0.5" : "px-4 py-2",
      labelSize: variant === "minimal" ? "text-[8px]" : "text-[10px]",
    }),
    [variant]
  );

  if (variant === "minimal") {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <span className="font-mono text-sm text-[#f4f4f5]">
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {timeLeft.hours.toString().padStart(2, "0")}:
          {timeLeft.minutes.toString().padStart(2, "0")}:
          {timeLeft.seconds.toString().padStart(2, "0")}
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-2xl p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-serif font-medium text-[#f4f4f5] mb-1 text-center">{title}</h3>
      )}
      {description && (
        <p className="text-xs text-[#71717a] mb-4 text-center">{description}</p>
      )}
      
      <div className="flex items-center justify-center gap-3">
        <TimeUnit value={timeLeft.days} label="Dni" variant={timeUnitVariant} />
        <span className="text-2xl text-[#c9a962] font-bold">:</span>
        <TimeUnit value={timeLeft.hours} label="Godz" variant={timeUnitVariant} />
        <span className="text-2xl text-[#c9a962] font-bold">:</span>
        <TimeUnit value={timeLeft.minutes} label="Min" variant={timeUnitVariant} />
        <span className="text-2xl text-[#c9a962] font-bold">:</span>
        <TimeUnit value={timeLeft.seconds} label="Sek" variant={timeUnitVariant} />
      </div>
    </div>
  );
}

// Event Countdown - preset for economic events
export function EventCountdown({
  eventName,
  eventDate,
  eventType = "release",
  className = "",
}: {
  eventName: string;
  eventDate: Date;
  eventType?: "release" | "meeting" | "announcement" | "deadline";
  className?: string;
}) {
  const typeColors = {
    release: "from-[#4ade80] to-[#22c55e]",
    meeting: "from-[#60a5fa] to-[#3b82f6]",
    announcement: "from-[#c9a962] to-[#9a7b3c]",
    deadline: "from-[#f87171] to-[#ef4444]",
  };

  const typeIcons = {
    release: "📊",
    meeting: "🏛️",
    announcement: "📢",
    deadline: "⏰",
  };

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-4 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${typeColors[eventType]} flex items-center justify-center text-lg`}>
          {typeIcons[eventType]}
        </div>
        <div>
          <h4 className="text-sm font-medium text-[#f4f4f5]">{eventName}</h4>
          <p className="text-[10px] text-[#71717a]">
            {eventDate.toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
      </div>
      <CountdownTimer targetDate={eventDate} variant="compact" />
    </div>
  );
}
