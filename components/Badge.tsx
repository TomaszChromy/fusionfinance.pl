"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info" | "outline";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  pulse?: boolean;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-white/10 text-[#a1a1aa] border-white/10",
  primary: "bg-[#c9a962]/20 text-[#c9a962] border-[#c9a962]/30",
  success: "bg-green-500/20 text-green-400 border-green-500/30",
  warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  danger: "bg-red-500/20 text-red-400 border-red-500/30",
  info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  outline: "bg-transparent text-[#a1a1aa] border-white/20",
};

const sizes: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-[11px]",
  lg: "px-3 py-1.5 text-[12px]",
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  icon,
  removable = false,
  onRemove,
  pulse = false,
  className = "",
}: BadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {icon && <span className="w-3.5 h-3.5">{icon}</span>}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 p-0.5 hover:bg-white/10 rounded-full transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.span>
  );
}

// Category badge
export function CategoryBadge({ category, className = "" }: { category: string; className?: string }) {
  const categoryColors: Record<string, BadgeVariant> = {
    crypto: "warning",
    forex: "info",
    stocks: "success",
    economy: "primary",
    gold: "primary",
    default: "default",
  };

  const categoryLabels: Record<string, string> = {
    crypto: "Krypto",
    forex: "Forex",
    stocks: "Giełda",
    economy: "Gospodarka",
    gold: "Złoto",
  };

  const variant = categoryColors[category.toLowerCase()] || categoryColors.default;
  const label = categoryLabels[category.toLowerCase()] || category;

  return (
    <Badge variant={variant} size="sm" className={className}>
      {label}
    </Badge>
  );
}

// Status badge
export function StatusBadge({ 
  status 
}: { 
  status: "online" | "offline" | "away" | "busy" 
}) {
  const statusConfig = {
    online: { variant: "success" as BadgeVariant, label: "Online", pulse: true },
    offline: { variant: "default" as BadgeVariant, label: "Offline", pulse: false },
    away: { variant: "warning" as BadgeVariant, label: "Zaraz wracam", pulse: false },
    busy: { variant: "danger" as BadgeVariant, label: "Zajęty", pulse: false },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} size="sm" pulse={config.pulse}>
      {config.label}
    </Badge>
  );
}

// Number badge (for notifications)
export function NumberBadge({ 
  count, 
  max = 99,
  className = "" 
}: { 
  count: number; 
  max?: number;
  className?: string;
}) {
  if (count <= 0) return null;

  return (
    <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full ${className}`}>
      {count > max ? `${max}+` : count}
    </span>
  );
}

