"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const SHORTCUTS: Shortcut[] = [
  { keys: ["?"], description: "Pokaż tę pomoc", category: "Ogólne" },
  { keys: ["/"], description: "Otwórz wyszukiwarkę", category: "Nawigacja" },
  { keys: ["g", "h"], description: "Strona główna", category: "Nawigacja" },
  { keys: ["g", "r"], description: "Rynki", category: "Nawigacja" },
  { keys: ["g", "c"], description: "Kryptowaluty", category: "Nawigacja" },
  { keys: ["g", "a"], description: "Analizy", category: "Nawigacja" },
  { keys: ["g", "f"], description: "Ulubione", category: "Nawigacja" },
  { keys: ["d"], description: "Przełącz dark/light mode", category: "Wygląd" },
  { keys: ["t"], description: "Przewiń na górę", category: "Nawigacja" },
  { keys: ["j"], description: "Następny artykuł", category: "Artykuły" },
  { keys: ["k"], description: "Poprzedni artykuł", category: "Artykuły" },
  { keys: ["l"], description: "Dodaj do ulubionych", category: "Artykuły" },
  { keys: ["o"], description: "Otwórz artykuł", category: "Artykuły" },
  { keys: ["Esc"], description: "Zamknij modal/menu", category: "Ogólne" },
];

interface HotkeysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HotkeysModal({ isOpen, onClose }: HotkeysModalProps) {
  // Group shortcuts by category
  const grouped = SHORTCUTS.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) acc[shortcut.category] = [];
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[10%] md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-[#0c0d10] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="text-lg font-medium text-[#f4f4f5] flex items-center gap-2">
                <span>⌨️</span>
                Skróty klawiszowe
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-[#71717a] hover:text-[#f4f4f5] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-6">
                {Object.entries(grouped).map(([category, shortcuts]) => (
                  <div key={category}>
                    <h3 className="text-xs text-[#c9a962] uppercase tracking-wider mb-3">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {shortcuts.map((shortcut, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2 px-3 bg-white/[0.02] rounded-lg"
                        >
                          <span className="text-sm text-[#a1a1aa]">
                            {shortcut.description}
                          </span>
                          <div className="flex gap-1">
                            {shortcut.keys.map((key, j) => (
                              <kbd
                                key={j}
                                className="px-2 py-1 bg-white/10 border border-white/10 rounded text-xs font-mono text-[#f4f4f5]"
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 text-center">
              <p className="text-xs text-[#52525b]">
                Naciśnij <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px] font-mono">?</kbd> aby pokazać/ukryć tę pomoc
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to use hotkeys modal globally
export function useHotkeysModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}

