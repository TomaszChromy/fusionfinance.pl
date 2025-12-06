"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
  formatNumber?: boolean;
}

export default function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  decimals = 0,
  className = "",
  formatNumber = true,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 30,
    duration: duration * 1000,
  });

  const display = useTransform(spring, (current) => {
    const formatted = decimals > 0 
      ? current.toFixed(decimals) 
      : Math.round(current);
    
    if (formatNumber && typeof formatted === "number") {
      return formatted.toLocaleString("pl-PL");
    }
    
    return formatted.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      spring.set(value);
      setHasAnimated(true);
    }
  }, [isInView, value, spring, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

// Multiple stats in a row
interface StatItem {
  value: number;
  suffix?: string;
  label: string;
  prefix?: string;
}

export function AnimatedStats({ stats, className = "" }: { stats: StatItem[]; className?: string }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
          className="text-center p-4 bg-white/[0.02] border border-white/10 rounded-xl"
        >
          <div className="text-2xl md:text-3xl font-bold text-[#c9a962]">
            <AnimatedCounter 
              value={stat.value} 
              suffix={stat.suffix} 
              prefix={stat.prefix}
            />
          </div>
          <div className="text-[12px] text-[#71717a] mt-1 uppercase tracking-wide">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Percentage counter with progress bar
export function PercentageCounter({ 
  value, 
  label,
  color = "#c9a962",
  className = "" 
}: { 
  value: number; 
  label: string;
  color?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className={className}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[13px] text-[#a1a1aa]">{label}</span>
        <span className="text-[13px] font-medium" style={{ color }}>
          <AnimatedCounter value={value} suffix="%" />
        </span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${value}%` : 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

