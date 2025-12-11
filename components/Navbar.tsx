"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import NotificationCenter from "./NotificationCenter";
import UserMenu from "./UserMenu";

const navLinks = [
  { name: "Rynki", href: "/rynki" },
  { name: "Giełda", href: "/gielda" },
  { name: "Crypto", href: "/crypto" },
  { name: "Waluty", href: "/waluty" },
  { name: "Analizy", href: "/analizy" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-[#08090c]/98 backdrop-blur-xl shadow-lg shadow-black/20"
        : "bg-[#08090c]/95 backdrop-blur-xl"
    } border-b border-[#c9a962]/20`}>
      {/* Gold accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#c9a962] to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="mx-auto max-w-[1400px] px-4 lg:px-6"
      >
        {/* Compact top bar - hidden when scrolled */}
        <div className={`flex items-center justify-between transition-all duration-300 overflow-hidden ${
          scrolled ? "h-0 py-0 opacity-0" : "h-auto py-2 opacity-100"
        } border-b border-white/5`}>
          <span className="text-[10px] text-[#71717a] uppercase tracking-[0.12em] font-medium">
            {new Date().toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="text-[10px] text-[#71717a] hover:text-[#c9a962] uppercase tracking-[0.08em] font-medium transition-colors duration-200 flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Szukaj
            </button>
          </div>
        </div>

        {/* Search Modal */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-[20vh]"
              onClick={() => setSearchOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="w-full max-w-2xl mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <SearchBar onClose={() => setSearchOpen(false)} isOpen={searchOpen} />
                <p className="text-center text-xs text-[#71717a] mt-4">
                  Naciśnij <kbd className="px-2 py-1 bg-white/10 rounded text-[10px]">ESC</kbd> aby zamknąć
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main header row - Logo + Navigation */}
        <div className={`flex items-center justify-between transition-all duration-300 ${
          scrolled ? "py-2" : "py-4"
        }`}>
          {/* Logo */}
          <Link href="/" className="group flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <h1 className={`font-serif font-medium text-[#f4f4f5] tracking-tight transition-all duration-300 ${
                scrolled ? "text-2xl lg:text-3xl" : "text-3xl lg:text-4xl"
              }`}>
                Fusion<span className="bg-gradient-to-r from-[#e4d4a5] via-[#c9a962] to-[#9a7b3c] bg-clip-text text-transparent">Finance</span>
              </h1>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.25 }}
              >
                <Link
                  href={item.href}
                  className="relative px-4 py-2 text-[12px] text-[#a1a1aa] hover:text-[#c9a962] uppercase tracking-[0.1em] font-medium transition-all duration-200 group rounded-lg hover:bg-white/[0.03]"
                >
                  {item.name}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-gradient-to-r from-transparent via-[#c9a962] to-transparent group-hover:w-[60%] transition-all duration-300" />
                </Link>
              </motion.div>
            ))}

            {/* Favorites, History & Theme Toggle */}
            <div className="ml-2 pl-2 border-l border-white/10 flex items-center gap-1">
              <Link
                href="/ulubione"
                className="p-2 text-[#71717a] hover:text-[#f87171] transition-colors rounded-lg hover:bg-white/[0.03]"
                title="Ulubione artykuły"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>
              <Link
                href="/historia"
                className="p-2 text-[#71717a] hover:text-[#60a5fa] transition-colors rounded-lg hover:bg-white/[0.03]"
                title="Historia przeglądania"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
              <NotificationCenter />
              <UserMenu />
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#a1a1aa] hover:text-[#c9a962] transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.nav
          initial={false}
          animate={{ height: mobileMenuOpen ? "auto" : 0, opacity: mobileMenuOpen ? 1 : 0 }}
          className="md:hidden overflow-hidden border-t border-white/5"
        >
          <div className="py-3 space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-[13px] text-[#a1a1aa] hover:text-[#c9a962] hover:bg-white/[0.03] uppercase tracking-[0.1em] font-medium transition-all duration-200 rounded-lg"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </motion.nav>
      </motion.div>
    </header>
  );
}
