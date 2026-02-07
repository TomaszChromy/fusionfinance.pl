"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface ReadingSession {
  articleId: string;
  title: string;
  url: string;
  startedAt: string;
  duration: number; // seconds
  completed: boolean;
}

interface ReadingStatsData {
  totalArticles: number;
  totalMinutes: number;
  completedArticles: number;
  streak: number;
  lastReadDate: string;
  favoriteCategory?: string;
}

export default function ReadingStats({ className = "" }: { className?: string }) {
  const [stats] = useState<ReadingStatsData>(() =>
    calculateStats(getReadingSessions())
  );

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-6 ${className}`}>
      <h3 className="text-sm font-medium text-[#c9a962] mb-4 flex items-center gap-2">
        <span>📊</span>
        Twoje statystyki czytania
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <StatBox icon="📖" value={stats.totalArticles} label="Przeczytanych" />
        <StatBox icon="⏱️" value={stats.totalMinutes} label="Minut" suffix="min" />
        <StatBox icon="✅" value={stats.completedArticles} label="Ukończonych" />
        <StatBox icon="🔥" value={stats.streak} label="Dni z rzędu" suffix="dni" />
      </div>

      {/* Reading streak progress */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-[#71717a]">Cel tygodniowy</span>
          <span className="text-[#c9a962]">{Math.min(stats.totalArticles, 7)}/7 artykułów</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((stats.totalArticles / 7) * 100, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#c9a962] to-[#9a7b3c] rounded-full"
          />
        </div>
      </div>

      {/* Recent activity */}
      {stats.lastReadDate && (
        <p className="text-[10px] text-[#52525b] mt-4 text-center">
          Ostatnia aktywność: {new Date(stats.lastReadDate).toLocaleDateString("pl-PL")}
        </p>
      )}
    </div>
  );
}

function StatBox({
  icon,
  value,
  label,
  suffix,
}: {
  icon: string;
  value: number;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="bg-white/[0.02] rounded-lg p-3 text-center">
      <span className="text-lg">{icon}</span>
      <p className="text-xl font-bold text-[#f4f4f5] mt-1">
        {value}
        {suffix && <span className="text-xs text-[#71717a] ml-1">{suffix}</span>}
      </p>
      <p className="text-[10px] text-[#52525b]">{label}</p>
    </div>
  );
}

function getReadingSessions(): ReadingSession[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("reading-sessions") || "[]");
  } catch {
    return [];
  }
}

function calculateStats(sessions: ReadingSession[]): ReadingStatsData {
  const totalArticles = sessions.length;
  const totalMinutes = Math.round(
    sessions.reduce((acc, s) => acc + s.duration, 0) / 60
  );
  const completedArticles = sessions.filter((s) => s.completed).length;

  // Calculate streak
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const uniqueDates = [...new Set(
    sessions.map((s) => new Date(s.startedAt).toDateString())
  )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  for (let i = 0; i < uniqueDates.length; i++) {
    const sessionDate = new Date(uniqueDates[i]);
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (sessionDate.toDateString() === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }

  const lastReadDate = sessions.length > 0
    ? sessions.sort(
        (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      )[0].startedAt
    : "";

  return {
    totalArticles,
    totalMinutes,
    completedArticles,
    streak,
    lastReadDate,
  };
}

// Track reading function (to be used in article pages)
export function trackReading(articleId: string, title: string, url: string) {
  if (typeof window === "undefined") return;

  const startTime = Date.now();

  const saveSession = () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    if (duration < 10) return; // Ignore very short sessions

    const sessions = getReadingSessions();
    const session: ReadingSession = {
      articleId,
      title,
      url,
      startedAt: new Date(startTime).toISOString(),
      duration,
      completed: duration > 120, // 2+ minutes = completed
    };

    sessions.push(session);
    localStorage.setItem("reading-sessions", JSON.stringify(sessions.slice(-100)));
  };

  window.addEventListener("beforeunload", saveSession);
  return () => window.removeEventListener("beforeunload", saveSession);
}
