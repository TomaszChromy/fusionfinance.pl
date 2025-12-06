"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";

interface NotificationProps {
  id: string;
  title: string;
  message?: string;
  type?: "info" | "success" | "warning" | "error";
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
  onClose?: () => void;
  duration?: number;
  className?: string;
}

const typeStyles = {
  info: {
    bg: "bg-[#3b82f6]/10",
    border: "border-[#3b82f6]/30",
    icon: "text-[#3b82f6]",
    iconBg: "bg-[#3b82f6]/20",
  },
  success: {
    bg: "bg-[#4ade80]/10",
    border: "border-[#4ade80]/30",
    icon: "text-[#4ade80]",
    iconBg: "bg-[#4ade80]/20",
  },
  warning: {
    bg: "bg-[#fbbf24]/10",
    border: "border-[#fbbf24]/30",
    icon: "text-[#fbbf24]",
    iconBg: "bg-[#fbbf24]/20",
  },
  error: {
    bg: "bg-[#f87171]/10",
    border: "border-[#f87171]/30",
    icon: "text-[#f87171]",
    iconBg: "bg-[#f87171]/20",
  },
};

const defaultIcons = {
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function Notification({
  title,
  message,
  type = "info",
  icon,
  action,
  onClose,
  duration,
  className = "",
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const styles = typeStyles[type];

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`${styles.bg} ${styles.border} border rounded-xl p-4 ${className}`}
    >
      <div className="flex gap-3">
        <div className={`w-10 h-10 rounded-lg ${styles.iconBg} ${styles.icon} flex items-center justify-center flex-shrink-0`}>
          {icon || defaultIcons[type]}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-[#f4f4f5]">{title}</h4>
          {message && <p className="text-xs text-[#a1a1aa] mt-0.5">{message}</p>}
          {action && (
            <button
              onClick={action.onClick}
              className={`text-xs font-medium mt-2 ${styles.icon} hover:underline`}
            >
              {action.label}
            </button>
          )}
        </div>
        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className="text-[#71717a] hover:text-[#f4f4f5] transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
}

// Notification Stack
export function NotificationStack({ 
  notifications,
  onClose,
}: { 
  notifications: NotificationProps[];
  onClose: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={() => onClose(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

