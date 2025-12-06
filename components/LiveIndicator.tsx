"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface LiveIndicatorProps {
  isLive?: boolean;
  label?: string;
  lastUpdate?: Date;
  variant?: "default" | "dot" | "badge" | "detailed";
  className?: string;
}

export default function LiveIndicator({
  isLive = true,
  label = "Na żywo",
  lastUpdate,
  variant = "default",
  className = "",
}: LiveIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    if (!lastUpdate) return;

    const updateTimeAgo = () => {
      const now = new Date();
      const diff = now.getTime() - lastUpdate.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (seconds < 60) {
        setTimeAgo("przed chwilą");
      } else if (minutes < 60) {
        setTimeAgo(`${minutes} min temu`);
      } else {
        setTimeAgo(`${hours} godz. temu`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 30000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  if (variant === "dot") {
    return (
      <span className={`relative flex h-2 w-2 ${className}`}>
        {isLive && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75" />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? "bg-[#4ade80]" : "bg-[#71717a]"}`} />
      </span>
    );
  }

  if (variant === "badge") {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
        isLive ? "bg-[#4ade80]/10 text-[#4ade80]" : "bg-white/5 text-[#71717a]"
      } ${className}`}>
        <LiveIndicator variant="dot" isLive={isLive} />
        {label}
      </span>
    );
  }

  if (variant === "detailed") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <LiveIndicator variant="dot" isLive={isLive} />
        <div>
          <span className={`text-xs font-medium ${isLive ? "text-[#4ade80]" : "text-[#71717a]"}`}>
            {isLive ? label : "Offline"}
          </span>
          {lastUpdate && (
            <p className="text-[10px] text-[#52525b]">Aktualizacja: {timeAgo}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LiveIndicator variant="dot" isLive={isLive} />
      <span className={`text-[10px] uppercase tracking-wider font-medium ${
        isLive ? "text-[#71717a]" : "text-[#52525b]"
      }`}>
        {label}
      </span>
    </div>
  );
}

// Pulsing Live Badge - for headers
export function LiveBadge({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-full ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444]" />
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ef4444]">LIVE</span>
    </motion.div>
  );
}

// Recording Indicator
export function RecordingIndicator({ 
  duration,
  className = "" 
}: { 
  duration?: number;
  className?: string;
}) {
  const [seconds, setSeconds] = useState(duration || 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ef4444]" />
      </span>
      <span className="font-mono text-sm text-[#ef4444]">{formatTime(seconds)}</span>
    </div>
  );
}

// Connection Status
export function ConnectionStatus({
  status,
  className = "",
}: {
  status: "connected" | "connecting" | "disconnected" | "error";
  className?: string;
}) {
  const statusConfig = {
    connected: { color: "text-[#4ade80]", bg: "bg-[#4ade80]", label: "Połączono" },
    connecting: { color: "text-[#fbbf24]", bg: "bg-[#fbbf24]", label: "Łączenie..." },
    disconnected: { color: "text-[#71717a]", bg: "bg-[#71717a]", label: "Rozłączono" },
    error: { color: "text-[#f87171]", bg: "bg-[#f87171]", label: "Błąd" },
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`relative flex h-2 w-2`}>
        {status === "connecting" && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.bg} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.bg}`} />
      </span>
      <span className={`text-xs ${config.color}`}>{config.label}</span>
    </div>
  );
}

