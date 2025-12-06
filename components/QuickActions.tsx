"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface QuickAction {
  id: string;
  icon: string;
  label: string;
  href?: string;
  onClick?: () => void;
  color?: string;
}

const DEFAULT_ACTIONS: QuickAction[] = [
  { id: "search", icon: "🔍", label: "Szukaj", href: "/szukaj" },
  { id: "currency", icon: "💱", label: "Kursy walut", href: "/kursy-walut" },
  { id: "crypto", icon: "₿", label: "Kryptowaluty", href: "/crypto" },
  { id: "gpw", icon: "📈", label: "GPW", href: "/gielda" },
  { id: "favorites", icon: "⭐", label: "Ulubione", href: "/ulubione" },
];

interface QuickActionsProps {
  actions?: QuickAction[];
  position?: "bottom-right" | "bottom-left";
  className?: string;
}

export default function QuickActions({
  actions = DEFAULT_ACTIONS,
  position = "bottom-right",
  className = "",
}: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positionClass = position === "bottom-right" ? "right-6 bottom-6" : "left-6 bottom-6";
  const menuPosition = position === "bottom-right" ? "right-0 bottom-full" : "left-0 bottom-full";

  return (
    <div className={`fixed ${positionClass} z-50 ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`absolute ${menuPosition} mb-4 z-50`}
            >
              <div className="bg-[#0c0d10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2 min-w-[180px]">
                {actions.map((action, index) => (
                  <motion.a
                    key={action.id}
                    href={action.href}
                    onClick={() => {
                      action.onClick?.();
                      setIsOpen(false);
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#a1a1aa] hover:bg-white/5 hover:text-[#f4f4f5] transition-colors"
                  >
                    <span className="text-lg">{action.icon}</span>
                    <span>{action.label}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors z-50 ${
          isOpen
            ? "bg-white/10 text-[#f4f4f5]"
            : "bg-gradient-to-br from-[#c9a962] to-[#a68b4b] text-[#08090c]"
        }`}
      >
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl"
        >
          {isOpen ? "✕" : "⚡"}
        </motion.span>

        {/* Pulse animation when closed */}
        {!isOpen && (
          <motion.span
            className="absolute inset-0 rounded-full bg-[#c9a962]"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
  );
}

// Minimal version - just icons in a row
export function QuickActionsBar({
  actions = DEFAULT_ACTIONS.slice(0, 4),
  className = "",
}: {
  actions?: QuickAction[];
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {actions.map((action) => (
        <a
          key={action.id}
          href={action.href}
          onClick={action.onClick}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-lg transition-colors"
          title={action.label}
        >
          {action.icon}
        </a>
      ))}
    </div>
  );
}

