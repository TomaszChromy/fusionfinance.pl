"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Stat {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

// Realistyczne statystyki dla projektu beta
const BETA_STATS: Stat[] = [
  { value: 6, label: "Źródeł RSS", suffix: "+" },
  { value: 12, label: "Integracji API" },
  { value: 27, label: "Podstron" },
  { value: 100, label: "Open Source", suffix: "%" },
];

const PARTNER_LOGOS = [
  { name: "NBP", icon: "🏦" },
  { name: "GPW", icon: "📈" },
  { name: "Bankier.pl", icon: "💰" },
  { name: "Money.pl", icon: "💵" },
  { name: "Parkiet", icon: "📊" },
  { name: "Puls Biznesu", icon: "📰" },
];

interface SocialProofProps {
  variant?: "stats" | "partners" | "combined" | "compact";
  className?: string;
}

export default function SocialProof({ variant = "combined", className = "" }: SocialProofProps) {
  if (variant === "stats") {
    return <StatsSection className={className} />;
  }

  if (variant === "partners") {
    return <PartnersSection className={className} />;
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center justify-center gap-6 ${className}`}>
        {BETA_STATS.slice(0, 3).map((stat, i) => (
          <div key={i} className="text-center">
            <p className="text-lg font-bold text-[#c9a962]">
              {stat.prefix}{stat.value.toLocaleString()}{stat.suffix}
            </p>
            <p className="text-[10px] text-[#71717a]">{stat.label}</p>
          </div>
        ))}
      </div>
    );
  }

  // Combined
  return (
    <div className={`space-y-8 ${className}`}>
      <StatsSection />
      <PartnersSection />
    </div>
  );
}

function StatsSection({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {BETA_STATS.map((stat, index) => (
        <AnimatedStat key={index} stat={stat} delay={index * 0.1} />
      ))}
    </div>
  );
}

function AnimatedStat({ stat, delay }: { stat: Stat; delay: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = stat.value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= stat.value) {
        setCount(stat.value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, stat.value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      onViewportEnter={() => setIsVisible(true)}
      className="bg-[#0c0d10] border border-white/5 rounded-xl p-5 text-center hover:border-[#c9a962]/20 transition-colors"
    >
      <p className="text-2xl md:text-3xl font-bold text-[#c9a962] mb-1">
        {stat.prefix}
        {count.toLocaleString()}
        {stat.suffix}
      </p>
      <p className="text-xs text-[#71717a]">{stat.label}</p>
    </motion.div>
  );
}

function PartnersSection({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-center text-xs text-[#52525b] uppercase tracking-wider mb-4">
        Zaufane źródła danych
      </p>
      <div className="flex flex-wrap items-center justify-center gap-6">
        {PARTNER_LOGOS.map((partner, index) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.1 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] rounded-lg border border-white/5 hover:border-[#c9a962]/20 transition-colors"
          >
            <span className="text-xl">{partner.icon}</span>
            <span className="text-xs text-[#a1a1aa] font-medium">{partner.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Trust badges - realne cechy projektu
export function TrustBadges({ className = "" }: { className?: string }) {
  const badges = [
    { icon: "🔒", label: "HTTPS" },
    { icon: "📱", label: "PWA Ready" },
    { icon: "🌙", label: "Dark Mode" },
    { icon: "🚀", label: "Next.js 16" },
  ];

  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 ${className}`}>
      {badges.map((badge) => (
        <div key={badge.label} className="flex items-center gap-1.5 text-xs text-[#71717a]">
          <span>{badge.icon}</span>
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}

