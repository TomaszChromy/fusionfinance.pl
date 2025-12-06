"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  icon?: ReactNode;
  status?: "completed" | "current" | "upcoming";
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export default function Timeline({ items, className = "" }: TimelineProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#c9a962] via-[#c9a962]/50 to-transparent" />
      
      <div className="space-y-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-10"
          >
            {/* Dot */}
            <div className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 ${
              item.status === "completed" 
                ? "bg-[#4ade80] border-[#4ade80]" 
                : item.status === "current"
                ? "bg-[#c9a962] border-[#c9a962] animate-pulse"
                : "bg-[#0c0d10] border-[#71717a]"
            }`} />
            
            {/* Content */}
            <div className="bg-[#0c0d10] border border-white/5 rounded-lg p-4 hover:border-[#c9a962]/20 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-[#f4f4f5] mb-1">{item.title}</h4>
                  {item.description && (
                    <p className="text-xs text-[#71717a]">{item.description}</p>
                  )}
                </div>
                {item.date && (
                  <span className="text-[10px] text-[#52525b] uppercase tracking-wider whitespace-nowrap">
                    {item.date}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Horizontal Timeline
export function HorizontalTimeline({ items, className = "" }: TimelineProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Horizontal line */}
      <div className="absolute left-0 right-0 top-4 h-0.5 bg-gradient-to-r from-[#c9a962] via-[#c9a962]/50 to-transparent" />
      
      <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#c9a962]/20">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pt-8 min-w-[200px]"
          >
            {/* Dot */}
            <div className={`absolute left-1/2 -translate-x-1/2 top-2 w-4 h-4 rounded-full border-2 ${
              item.status === "completed" 
                ? "bg-[#4ade80] border-[#4ade80]" 
                : item.status === "current"
                ? "bg-[#c9a962] border-[#c9a962] animate-pulse"
                : "bg-[#0c0d10] border-[#71717a]"
            }`} />
            
            {/* Content */}
            <div className="text-center">
              <h4 className="text-sm font-medium text-[#f4f4f5] mb-1">{item.title}</h4>
              {item.description && (
                <p className="text-xs text-[#71717a] line-clamp-2">{item.description}</p>
              )}
              {item.date && (
                <span className="text-[10px] text-[#c9a962] uppercase tracking-wider mt-2 block">
                  {item.date}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// News Timeline for articles
export function NewsTimeline({ 
  items 
}: { 
  items: Array<{ id: string; title: string; time: string; source?: string }> 
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex gap-3 group cursor-pointer"
        >
          <div className="flex flex-col items-center">
            <div className="w-2 h-2 rounded-full bg-[#c9a962] group-hover:scale-125 transition-transform" />
            {index < items.length - 1 && (
              <div className="w-0.5 flex-1 bg-white/10 mt-1" />
            )}
          </div>
          <div className="flex-1 pb-3">
            <p className="text-sm text-[#f4f4f5] group-hover:text-[#c9a962] transition-colors line-clamp-2">
              {item.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-[#71717a]">{item.time}</span>
              {item.source && (
                <>
                  <span className="w-1 h-1 rounded-full bg-[#52525b]" />
                  <span className="text-[10px] text-[#52525b]">{item.source}</span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

