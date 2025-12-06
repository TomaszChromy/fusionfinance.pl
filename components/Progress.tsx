"use client";

import { motion } from "framer-motion";

interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "danger";
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const variantStyles = {
  default: "bg-[#c9a962]",
  success: "bg-green-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

export default function Progress({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showLabel = false,
  label,
  animated = true,
  className = "",
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-[12px] text-[#a1a1aa]">{label}</span>}
          {showLabel && <span className="text-[12px] text-[#71717a]">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`w-full bg-white/10 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <motion.div
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${variantStyles[variant]}`}
        />
      </div>
    </div>
  );
}

// Circular progress
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: "default" | "success" | "warning" | "danger";
  showValue?: boolean;
  className?: string;
}

const circularVariants = {
  default: "stroke-[#c9a962]",
  success: "stroke-green-500",
  warning: "stroke-amber-500",
  danger: "stroke-red-500",
};

export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 6,
  variant = "default",
  showValue = true,
  className = "",
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-white/10 fill-none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          strokeDasharray={circumference}
          strokeLinecap="round"
          className={`fill-none ${circularVariants[variant]}`}
        />
      </svg>
      {showValue && (
        <span className="absolute text-[14px] font-medium text-[#f4f4f5]">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

// Steps progress
interface Step {
  label: string;
  completed?: boolean;
  current?: boolean;
}

interface StepsProgressProps {
  steps: Step[];
  className?: string;
}

export function StepsProgress({ steps, className = "" }: StepsProgressProps) {
  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          {/* Step circle */}
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-[12px] font-medium border-2 transition-colors ${
              step.completed
                ? "bg-[#c9a962] border-[#c9a962] text-[#08090c]"
                : step.current
                ? "border-[#c9a962] text-[#c9a962]"
                : "border-white/20 text-[#71717a]"
            }`}
          >
            {step.completed ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              index + 1
            )}
          </div>

          {/* Label */}
          <span
            className={`ml-2 text-[12px] ${
              step.completed || step.current ? "text-[#f4f4f5]" : "text-[#71717a]"
            }`}
          >
            {step.label}
          </span>

          {/* Connector */}
          {index < steps.length - 1 && (
            <div
              className={`w-12 h-0.5 mx-3 ${
                step.completed ? "bg-[#c9a962]" : "bg-white/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

