"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { name: "Rynki", href: "/rynki" },
  { name: "Giełda", href: "/gielda" },
  { name: "Crypto", href: "/crypto" },
  { name: "Waluty", href: "/waluty" },
  { name: "Analizy", href: "/analizy" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#08090c]/95 backdrop-blur-xl border-b border-[#c9a962]/20">
      {/* Subtle gold line accent at top */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#c9a962] to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="mx-auto max-w-[1200px] px-5 lg:px-8"
      >
        {/* Top bar with date */}
        <div className="flex items-center justify-between py-3 border-b border-white/5">
          <span className="text-[11px] text-[#71717a] uppercase tracking-[0.15em] font-medium">
            {new Date().toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </span>
          <div className="flex items-center gap-5">
            <button type="button" className="text-[11px] text-[#71717a] hover:text-[#c9a962] uppercase tracking-[0.1em] font-medium transition-colors duration-300">
              Szukaj
            </button>
          </div>
        </div>

        {/* Logo - Luxury centered */}
        <div className="py-6 text-center">
          <Link href="/" className="inline-block group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-serif text-4xl lg:text-5xl font-medium text-[#f4f4f5] tracking-tight">
                Fusion<span className="bg-gradient-to-r from-[#e4d4a5] via-[#c9a962] to-[#9a7b3c] bg-clip-text text-transparent">Finance</span>
              </h1>
              <div className="mt-2 mx-auto w-[89px] h-[2px] bg-gradient-to-r from-transparent via-[#c9a962]/60 to-transparent group-hover:via-[#c9a962] transition-all duration-500" />
            </motion.div>
          </Link>
        </div>

        {/* Navigation - Elegant centered */}
        <nav className="flex items-center justify-center gap-1 py-4 border-t border-white/5">
          {navLinks.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Link
                href={item.href}
                className="relative px-5 py-2 text-[13px] text-[#a1a1aa] hover:text-[#c9a962] uppercase tracking-[0.12em] font-medium transition-colors duration-300 group"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-gradient-to-r from-transparent via-[#c9a962] to-transparent group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </nav>
      </motion.div>
    </header>
  );
}
