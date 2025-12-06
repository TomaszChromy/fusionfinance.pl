"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChipProps {
  children: ReactNode;
  variant?: "filled" | "outlined" | "soft";
  color?: "default" | "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md";
  icon?: ReactNode;
  onClick?: () => void;
  onRemove?: () => void;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
}

const colorStyles = {
  filled: {
    default: "bg-white/10 text-[#f4f4f5] hover:bg-white/20",
    primary: "bg-[#c9a962] text-[#08090c] hover:bg-[#e4d4a5]",
    success: "bg-green-500 text-white hover:bg-green-600",
    warning: "bg-amber-500 text-white hover:bg-amber-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
  },
  outlined: {
    default: "border-white/20 text-[#a1a1aa] hover:border-white/40 hover:text-[#f4f4f5]",
    primary: "border-[#c9a962]/50 text-[#c9a962] hover:border-[#c9a962] hover:bg-[#c9a962]/10",
    success: "border-green-500/50 text-green-400 hover:border-green-500 hover:bg-green-500/10",
    warning: "border-amber-500/50 text-amber-400 hover:border-amber-500 hover:bg-amber-500/10",
    danger: "border-red-500/50 text-red-400 hover:border-red-500 hover:bg-red-500/10",
  },
  soft: {
    default: "bg-white/5 text-[#a1a1aa] hover:bg-white/10 hover:text-[#f4f4f5]",
    primary: "bg-[#c9a962]/10 text-[#c9a962] hover:bg-[#c9a962]/20",
    success: "bg-green-500/10 text-green-400 hover:bg-green-500/20",
    warning: "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20",
  },
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-[11px] gap-1",
  md: "px-3 py-1.5 text-[12px] gap-1.5",
};

export default function Chip({
  children,
  variant = "filled",
  color = "default",
  size = "md",
  icon,
  onClick,
  onRemove,
  selected = false,
  disabled = false,
  className = "",
}: ChipProps) {
  const isClickable = !!onClick;
  const baseStyles = variant === "outlined" ? "border bg-transparent" : "";
  const selectedStyles = selected 
    ? "ring-2 ring-[#c9a962] ring-offset-2 ring-offset-[#0f1014]" 
    : "";
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <motion.span
      whileHover={!disabled && isClickable ? { scale: 1.02 } : {}}
      whileTap={!disabled && isClickable ? { scale: 0.98 } : {}}
      onClick={!disabled ? onClick : undefined}
      className={`inline-flex items-center rounded-full font-medium transition-colors ${baseStyles} ${colorStyles[variant][color]} ${sizeStyles[size]} ${selectedStyles} ${disabledStyles} ${
        isClickable && !disabled ? "cursor-pointer" : ""
      } ${className}`}
    >
      {icon && <span className="w-3.5 h-3.5 flex-shrink-0">{icon}</span>}
      {children}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 p-0.5 hover:bg-black/10 rounded-full transition-colors"
          disabled={disabled}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.span>
  );
}

// Chip group for filtering
interface ChipGroupProps {
  chips: Array<{ id: string; label: string; icon?: ReactNode }>;
  selected: string[];
  onChange: (selected: string[]) => void;
  multiple?: boolean;
  variant?: "filled" | "outlined" | "soft";
  size?: "sm" | "md";
  className?: string;
}

export function ChipGroup({
  chips,
  selected,
  onChange,
  multiple = false,
  variant = "soft",
  size = "md",
  className = "",
}: ChipGroupProps) {
  const handleClick = (id: string) => {
    if (multiple) {
      if (selected.includes(id)) {
        onChange(selected.filter((s) => s !== id));
      } else {
        onChange([...selected, id]);
      }
    } else {
      onChange(selected.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <AnimatePresence>
        {chips.map((chip) => (
          <Chip
            key={chip.id}
            variant={variant}
            size={size}
            color={selected.includes(chip.id) ? "primary" : "default"}
            icon={chip.icon}
            selected={selected.includes(chip.id)}
            onClick={() => handleClick(chip.id)}
          >
            {chip.label}
          </Chip>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Tag component (simpler, for display only)
export function Tag({ 
  children, 
  color = "default",
  className = "" 
}: { 
  children: ReactNode; 
  color?: "default" | "primary" | "success" | "warning" | "danger";
  className?: string;
}) {
  const colors = {
    default: "bg-white/10 text-[#a1a1aa]",
    primary: "bg-[#c9a962]/20 text-[#c9a962]",
    success: "bg-green-500/20 text-green-400",
    warning: "bg-amber-500/20 text-amber-400",
    danger: "bg-red-500/20 text-red-400",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
}

