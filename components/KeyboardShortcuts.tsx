"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
}

export default function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);
  const router = useRouter();

  const shortcuts: Shortcut[] = [
    { key: "?", description: "Pokaż skróty klawiszowe", action: () => setShowHelp(true) },
    { key: "h", description: "Strona główna", action: () => router.push("/") },
    { key: "r", description: "Rynki", action: () => router.push("/rynki") },
    { key: "g", description: "Giełda", action: () => router.push("/gielda") },
    { key: "c", description: "Crypto", action: () => router.push("/crypto") },
    { key: "w", description: "Waluty", action: () => router.push("/waluty") },
    { key: "a", description: "Analizy", action: () => router.push("/analizy") },
    { key: "u", description: "Ulubione", action: () => router.push("/ulubione") },
    { key: "/", description: "Wyszukiwarka", action: () => document.querySelector<HTMLButtonElement>('[data-search-trigger]')?.click() },
    { key: "t", description: "Przełącz motyw", action: () => document.querySelector<HTMLButtonElement>('[data-theme-toggle]')?.click() },
    { key: "Escape", description: "Zamknij modal", action: () => setShowHelp(false) },
  ];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger when typing in inputs
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    // Don't trigger with modifiers (except shift for ?)
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    const shortcut = shortcuts.find(s => {
      if (s.key === "?") return e.key === "?" || (e.shiftKey && e.key === "/");
      if (s.key === "Escape") return e.key === "Escape";
      return e.key.toLowerCase() === s.key.toLowerCase();
    });

    if (shortcut) {
      e.preventDefault();
      shortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      {showHelp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowHelp(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0c0d10] border border-[#c9a962]/30 rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-[#f4f4f5]">Skróty klawiszowe</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              {shortcuts.filter(s => s.key !== "Escape").map((shortcut) => (
                <div
                  key={shortcut.key}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="text-[13px] text-[#a1a1aa]">{shortcut.description}</span>
                  <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-[11px] font-mono text-[#f4f4f5] min-w-[24px] text-center">
                    {shortcut.key === "/" ? "⁄" : shortcut.key.toUpperCase()}
                  </kbd>
                </div>
              ))}
            </div>

            <p className="mt-6 text-[11px] text-[#71717a] text-center">
              Naciśnij <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">ESC</kbd> aby zamknąć
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

