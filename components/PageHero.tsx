"use client";

import { motion } from "framer-motion";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  badge?: string;
  accentFrom?: string;
  accentTo?: string;
  rightSlot?: React.ReactNode;
}

export default function PageHero({
  title,
  subtitle,
  eyebrow,
  badge,
  accentFrom = "#c9a962",
  accentTo = "#9a7b3c",
  rightSlot,
}: PageHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 lg:mb-10"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-[55px] h-[3px] rounded-full" style={{ background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})` }} />
          {eyebrow && (
            <span className="text-[11px] uppercase tracking-[0.12em] text-[#c9a962]">{eyebrow}</span>
          )}
        </div>
        {badge && (
          <span className="text-[10px] px-3 py-1 rounded-full bg-white/5 text-[#c9a962] uppercase tracking-[0.1em]">
            {badge}
          </span>
        )}
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-serif text-3xl lg:text-4xl font-medium text-[#f4f4f5]">{title}</h1>
          {subtitle && <p className="text-sm text-[#a1a1aa] max-w-3xl leading-relaxed">{subtitle}</p>}
        </div>
        {rightSlot}
      </div>
    </motion.div>
  );
}
