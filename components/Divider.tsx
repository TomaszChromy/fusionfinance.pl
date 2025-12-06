"use client";

import { ReactNode } from "react";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed" | "dotted" | "gradient";
  label?: string;
  icon?: ReactNode;
  className?: string;
}

export default function Divider({
  orientation = "horizontal",
  variant = "solid",
  label,
  icon,
  className = "",
}: DividerProps) {
  const variants = {
    solid: "bg-white/10",
    dashed: "border-dashed border-t border-white/10 bg-transparent",
    dotted: "border-dotted border-t border-white/10 bg-transparent",
    gradient: "bg-gradient-to-r from-transparent via-white/20 to-transparent",
  };

  // Vertical divider
  if (orientation === "vertical") {
    return (
      <div
        className={`w-px min-h-[20px] ${variant === "gradient" ? "bg-gradient-to-b from-transparent via-white/20 to-transparent" : variants[variant]} ${className}`}
      />
    );
  }

  // Horizontal with label or icon
  if (label || icon) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className={`flex-1 h-px ${variants[variant]}`} />
        {icon ? (
          <span className="text-[#52525b]">{icon}</span>
        ) : (
          <span className="text-[11px] uppercase tracking-[0.15em] text-[#52525b] font-medium">
            {label}
          </span>
        )}
        <div className={`flex-1 h-px ${variants[variant]}`} />
      </div>
    );
  }

  // Simple horizontal
  return (
    <div className={`w-full h-px ${variants[variant]} ${className}`} />
  );
}

// Gold accent divider (FusionFinance branded)
export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`h-px bg-gradient-to-r from-transparent via-[#c9a962]/40 to-transparent ${className}`} />
  );
}

// Diamond divider (elegant)
export function DiamondDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#c9a962]/30" />
      <div className="w-1.5 h-1.5 rotate-45 border border-[#c9a962]/40" />
      <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#c9a962]/30" />
    </div>
  );
}

// Section divider with title
export function SectionDivider({ 
  title, 
  action,
  className = "" 
}: { 
  title: string; 
  action?: { label: string; onClick: () => void };
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between py-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-1 h-5 bg-[#c9a962] rounded-full" />
        <h3 className="text-[14px] font-medium text-[#f4f4f5]">{title}</h3>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="text-[12px] text-[#c9a962] hover:text-[#e4d4a5] transition-colors"
        >
          {action.label} →
        </button>
      )}
    </div>
  );
}

// Spacing divider (just space, no visible line)
export function Spacer({ size = "md" }: { size?: "xs" | "sm" | "md" | "lg" | "xl" }) {
  const sizes = {
    xs: "h-2",
    sm: "h-4",
    md: "h-8",
    lg: "h-12",
    xl: "h-16",
  };

  return <div className={sizes[size]} />;
}

