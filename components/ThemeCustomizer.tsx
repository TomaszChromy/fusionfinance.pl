"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface ThemeSettings {
  accentColor: string;
  fontSize: "small" | "medium" | "large";
  contrast: "normal" | "high";
  reducedMotion: boolean;
}

const ACCENT_COLORS = [
  { name: "Złoty", value: "#c9a962" },
  { name: "Niebieski", value: "#60a5fa" },
  { name: "Zielony", value: "#4ade80" },
  { name: "Fioletowy", value: "#a78bfa" },
  { name: "Różowy", value: "#f472b6" },
  { name: "Pomarańczowy", value: "#fb923c" },
];

const DEFAULT_SETTINGS: ThemeSettings = {
  accentColor: "#c9a962",
  fontSize: "medium",
  contrast: "normal",
  reducedMotion: false,
};

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export default function ThemeCustomizer({
  isOpen,
  onClose,
  className = "",
}: ThemeCustomizerProps) {
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem("themeSettings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (settings !== DEFAULT_SETTINGS) {
      localStorage.setItem("themeSettings", JSON.stringify(settings));
      // Apply settings
      document.documentElement.style.setProperty("--accent-color", settings.accentColor);
      document.documentElement.classList.toggle("high-contrast", settings.contrast === "high");
      document.documentElement.classList.toggle("reduce-motion", settings.reducedMotion);
      document.documentElement.style.setProperty(
        "--font-scale",
        settings.fontSize === "small" ? "0.9" : settings.fontSize === "large" ? "1.1" : "1"
      );
    }
  }, [settings]);

  const updateSetting = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem("themeSettings");
  };

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className={`fixed right-0 top-0 bottom-0 w-80 bg-[#0c0d10] border-l border-white/10 shadow-2xl z-50 overflow-y-auto ${className}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h2 className="text-lg font-medium text-[#f4f4f5]">Ustawienia wyglądu</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#a1a1aa] hover:text-white hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Accent Color */}
              <div>
                <label className="text-sm font-medium text-[#f4f4f5] mb-3 block">
                  Kolor akcentu
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => updateSetting("accentColor", color.value)}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        settings.accentColor === color.value
                          ? "ring-2 ring-white ring-offset-2 ring-offset-[#0c0d10]"
                          : ""
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="text-sm font-medium text-[#f4f4f5] mb-3 block">
                  Rozmiar czcionki
                </label>
                <div className="flex gap-2">
                  {(["small", "medium", "large"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSetting("fontSize", size)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        settings.fontSize === size
                          ? "bg-[#c9a962] text-[#08090c]"
                          : "bg-white/5 text-[#a1a1aa] hover:bg-white/10"
                      }`}
                    >
                      {size === "small" ? "A-" : size === "large" ? "A+" : "A"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contrast */}
              <div>
                <label className="text-sm font-medium text-[#f4f4f5] mb-3 block">
                  Kontrast
                </label>
                <div className="flex gap-2">
                  {(["normal", "high"] as const).map((contrast) => (
                    <button
                      key={contrast}
                      onClick={() => updateSetting("contrast", contrast)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        settings.contrast === contrast
                          ? "bg-[#c9a962] text-[#08090c]"
                          : "bg-white/5 text-[#a1a1aa] hover:bg-white/10"
                      }`}
                    >
                      {contrast === "normal" ? "Normalny" : "Wysoki"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#f4f4f5]">Ograniczone animacje</p>
                  <p className="text-xs text-[#71717a]">Redukuje efekty ruchu</p>
                </div>
                <button
                  onClick={() => updateSetting("reducedMotion", !settings.reducedMotion)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.reducedMotion ? "bg-[#c9a962]" : "bg-white/10"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.reducedMotion ? 24 : 2 }}
                    className="w-5 h-5 bg-white rounded-full shadow"
                  />
                </button>
              </div>

              {/* Reset */}
              <button
                onClick={resetSettings}
                className="w-full py-2.5 rounded-lg border border-white/10 text-sm text-[#a1a1aa] hover:bg-white/5 transition-colors"
              >
                Przywróć domyślne
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Settings button to open customizer
export function ThemeSettingsButton({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#a1a1aa] hover:text-[#c9a962] hover:border-[#c9a962]/30 transition-colors ${className}`}
      title="Ustawienia wyglądu"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>
  );
}

