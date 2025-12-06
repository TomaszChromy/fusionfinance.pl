"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "ua", name: "Українська", flag: "🇺🇦" },
];

interface LanguageSwitcherProps {
  variant?: "default" | "compact" | "dropdown" | "flags";
  currentLanguage?: string;
  onChange?: (langCode: string) => void;
  className?: string;
}

export default function LanguageSwitcher({
  variant = "default",
  currentLanguage = "pl",
  onChange,
  className = "",
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(currentLanguage);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (langCode: string) => {
    setSelected(langCode);
    setIsOpen(false);
    onChange?.(langCode);
  };

  const currentLang = LANGUAGES.find((l) => l.code === selected) || LANGUAGES[0];

  if (variant === "flags") {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {LANGUAGES.slice(0, 2).map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all ${
              selected === lang.code
                ? "bg-[#c9a962]/20 ring-1 ring-[#c9a962]"
                : "bg-white/5 hover:bg-white/10"
            }`}
            title={lang.name}
          >
            {lang.flag}
          </button>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <span className="text-sm">{currentLang.flag}</span>
          <span className="text-xs text-[#a1a1aa] uppercase">{currentLang.code}</span>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-1 bg-[#0c0d10] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/5 transition-colors ${
                    selected === lang.code ? "bg-[#c9a962]/10 text-[#c9a962]" : "text-[#a1a1aa]"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="text-xs">{lang.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === "dropdown") {
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-[#0c0d10] border border-white/10 rounded-lg hover:border-[#c9a962]/30 transition-colors"
        >
          <span className="text-lg">{currentLang.flag}</span>
          <span className="text-sm text-[#f4f4f5]">{currentLang.name}</span>
          <svg
            className={`w-4 h-4 text-[#71717a] transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 bg-[#0c0d10] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/5 transition-colors ${
                    selected === lang.code ? "bg-[#c9a962]/10" : ""
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className={`text-sm ${selected === lang.code ? "text-[#c9a962]" : "text-[#a1a1aa]"}`}>
                    {lang.name}
                  </span>
                  {selected === lang.code && (
                    <svg className="w-4 h-4 text-[#c9a962] ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default variant - simple toggle between PL/EN
  return (
    <div className={`flex items-center bg-white/5 rounded-lg p-1 ${className}`}>
      {LANGUAGES.slice(0, 2).map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleSelect(lang.code)}
          className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            selected === lang.code ? "text-[#08090c]" : "text-[#a1a1aa] hover:text-white"
          }`}
        >
          {selected === lang.code && (
            <motion.div
              layoutId="lang-pill"
              className="absolute inset-0 bg-[#c9a962] rounded-md"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <span>{lang.flag}</span>
            <span className="uppercase">{lang.code}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

