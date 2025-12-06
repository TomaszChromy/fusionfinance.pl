"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const icons: Record<AlertVariant, ReactNode> = {
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const styles: Record<AlertVariant, { bg: string; border: string; icon: string; title: string }> = {
  info: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: "text-blue-400",
    title: "text-blue-300",
  },
  success: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    icon: "text-green-400",
    title: "text-green-300",
  },
  warning: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: "text-amber-400",
    title: "text-amber-300",
  },
  error: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: "text-red-400",
    title: "text-red-300",
  },
};

export default function Alert({
  variant = "info",
  title,
  children,
  dismissible = false,
  onDismiss,
  icon,
  action,
  className = "",
}: AlertProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const style = styles[variant];

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          className={`flex gap-3 p-4 rounded-xl border ${style.bg} ${style.border} ${className}`}
        >
          {/* Icon */}
          <span className={`flex-shrink-0 ${style.icon}`}>
            {icon || icons[variant]}
          </span>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className={`text-[14px] font-medium mb-1 ${style.title}`}>
                {title}
              </h4>
            )}
            <div className="text-[13px] text-[#a1a1aa]">{children}</div>

            {action && (
              <button
                onClick={action.onClick}
                className={`mt-2 text-[12px] font-medium ${style.icon} hover:underline`}
              >
                {action.label}
              </button>
            )}
          </div>

          {/* Dismiss button */}
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Inline alert (minimal)
export function InlineAlert({
  variant = "info",
  children,
  className = "",
}: {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}) {
  const colors = {
    info: "text-blue-400",
    success: "text-green-400",
    warning: "text-amber-400",
    error: "text-red-400",
  };

  return (
    <p className={`flex items-center gap-2 text-[12px] ${colors[variant]} ${className}`}>
      <span className="w-4 h-4">{icons[variant]}</span>
      {children}
    </p>
  );
}

