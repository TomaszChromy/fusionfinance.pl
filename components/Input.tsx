"use client";

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, useState } from "react";
import { motion } from "framer-motion";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, iconPosition = "left", className = "", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className={className}>
        {label && (
          <label className="block text-[12px] font-medium text-[#a1a1aa] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === "left" && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full px-4 py-2.5 bg-white/[0.02] border rounded-xl text-[14px] text-[#f4f4f5] placeholder:text-[#52525b] transition-all outline-none ${
              icon && iconPosition === "left" ? "pl-10" : ""
            } ${icon && iconPosition === "right" ? "pr-10" : ""} ${
              error
                ? "border-red-500/50 focus:border-red-500"
                : isFocused
                ? "border-[#c9a962]/50 ring-1 ring-[#c9a962]/20"
                : "border-white/10 hover:border-white/20"
            }`}
            {...props}
          />
          {icon && iconPosition === "right" && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a]">
              {icon}
            </span>
          )}
        </div>
        {error && <p className="mt-1.5 text-[11px] text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-[11px] text-[#52525b]">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = "", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className={className}>
        {label && (
          <label className="block text-[12px] font-medium text-[#a1a1aa] mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-3 bg-white/[0.02] border rounded-xl text-[14px] text-[#f4f4f5] placeholder:text-[#52525b] transition-all outline-none resize-none min-h-[100px] ${
            error
              ? "border-red-500/50 focus:border-red-500"
              : isFocused
              ? "border-[#c9a962]/50 ring-1 ring-[#c9a962]/20"
              : "border-white/10 hover:border-white/20"
          }`}
          {...props}
        />
        {error && <p className="mt-1.5 text-[11px] text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-[11px] text-[#52525b]">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

interface CheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({ label, checked = false, onChange, disabled = false, className = "" }: CheckboxProps) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer group ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <motion.div
          animate={{
            backgroundColor: checked ? "#c9a962" : "transparent",
            borderColor: checked ? "#c9a962" : "rgba(255,255,255,0.2)",
          }}
          className="w-5 h-5 rounded-md border-2 flex items-center justify-center"
        >
          <motion.svg
            initial={false}
            animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            className="w-3 h-3 text-[#08090c]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </motion.svg>
        </motion.div>
      </div>
      <span className="text-[13px] text-[#a1a1aa] group-hover:text-[#f4f4f5] transition-colors">
        {label}
      </span>
    </label>
  );
}

interface SwitchProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function Switch({ label, checked = false, onChange, disabled = false, size = "md", className = "" }: SwitchProps) {
  const sizes = {
    sm: { track: "w-8 h-4", thumb: "w-3 h-3", translate: "translate-x-4" },
    md: { track: "w-11 h-6", thumb: "w-5 h-5", translate: "translate-x-5" },
  };
  const s = sizes[size];

  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative ${s.track} rounded-full transition-colors ${
          checked ? "bg-[#c9a962]" : "bg-white/20"
        }`}
      >
        <motion.span
          animate={{ x: checked ? (size === "sm" ? 16 : 20) : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`absolute top-1/2 -translate-y-1/2 left-0 ${s.thumb} bg-white rounded-full shadow-sm`}
        />
      </button>
      {label && <span className="text-[13px] text-[#a1a1aa]">{label}</span>}
    </label>
  );
}

