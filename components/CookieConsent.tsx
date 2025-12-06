"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "fusionfinance_cookie_consent";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Delay showing the banner for better UX
      setTimeout(() => setIsVisible(true), 1500);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      acceptedAt: new Date().toISOString(),
    }));
    setIsVisible(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      acceptedAt: new Date().toISOString(),
    }));
    setIsVisible(false);
  };

  if (!isLoaded) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="mx-auto max-w-4xl bg-[#0c0d10]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Cookie icon */}
              <div className="hidden md:flex items-center justify-center w-12 h-12 bg-[#c9a962]/10 rounded-xl shrink-0">
                <svg className="w-6 h-6 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                  <circle cx="8" cy="9" r="1.5" fill="currentColor" />
                  <circle cx="15" cy="8" r="1" fill="currentColor" />
                  <circle cx="10" cy="14" r="1" fill="currentColor" />
                  <circle cx="16" cy="13" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="17" r="1" fill="currentColor" />
                </svg>
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="text-[#f4f4f5] font-medium text-[15px] mb-1">
                  🍪 Ta strona używa plików cookies
                </h3>
                <p className="text-[#a1a1aa] text-[13px] leading-relaxed">
                  Używamy cookies, aby zapewnić najlepsze wrażenia na naszej stronie. 
                  Niektóre są niezbędne do działania serwisu, inne pomagają nam go ulepszać.{" "}
                  <Link href="/cookies" className="text-[#c9a962] hover:underline">
                    Dowiedz się więcej
                  </Link>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <button
                  onClick={acceptNecessary}
                  className="px-4 py-2.5 text-[13px] font-medium text-[#a1a1aa] hover:text-[#f4f4f5] border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200"
                >
                  Tylko niezbędne
                </button>
                <button
                  onClick={acceptAll}
                  className="px-4 py-2.5 text-[13px] font-medium text-[#08090c] bg-[#c9a962] hover:bg-[#b8994f] rounded-xl transition-all duration-200"
                >
                  Akceptuję wszystkie
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

