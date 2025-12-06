"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 21 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="mt-12 lg:mt-16 pt-10 lg:pt-14"
    >
      {/* Gold accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#c9a962]/40 to-transparent mb-10" />

      {/* Logo */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-block group">
          <span className="font-serif text-2xl lg:text-3xl font-medium text-[#f4f4f5]">
            Fusion<span className="bg-gradient-to-r from-[#e4d4a5] via-[#c9a962] to-[#9a7b3c] bg-clip-text text-transparent">Finance</span>
          </span>
          <div className="mt-2 mx-auto w-12 h-px bg-gradient-to-r from-transparent via-[#c9a962]/50 to-transparent group-hover:via-[#c9a962] transition-all duration-500" />
        </Link>
      </div>

      {/* Navigation links */}
      <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 text-[11px] uppercase tracking-[0.12em] font-medium mb-6">
        {["Rynki", "Giełda", "Crypto", "Waluty", "Analizy"].map((name) => (
          <Link
            key={name}
            href={`/${name.toLowerCase().replace("ł", "l")}`}
            className="text-[#71717a] hover:text-[#c9a962] transition-colors duration-200"
          >
            {name}
          </Link>
        ))}
      </div>

      {/* Elegant divider */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#c9a962]/30" />
        <div className="w-1.5 h-1.5 rotate-45 border border-[#c9a962]/40" />
        <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#c9a962]/30" />
      </div>

      {/* Newsletter Section */}
      <div className="max-w-md mx-auto mb-8 px-4">
        <NewsletterForm />
      </div>

      {/* Copyright */}
      <div className="text-center mb-4">
        <p className="text-xs text-[#a1a1aa] mb-1">
          <Link
            href="https://tomsoft-website.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c9a962] hover:text-[#e4d4a5] transition-colors duration-200"
          >
            TomSoft-Website
          </Link>
        </p>

        <p className="text-[10px] text-[#71717a] tracking-[0.15em] uppercase">
          <Link
            href="https://tomaszchromy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#c9a962] transition-colors duration-200"
          >
            Powered by Tomasz Chromy
          </Link>
        </p>
      </div>

      {/* Disclaimers */}
      <div className="text-center mb-6 max-w-3xl mx-auto px-4">
        <p className="font-serif font-medium text-xl lg:text-2xl tracking-tight leading-relaxed">
          <span className="text-[#f4f4f5]">UWAGA:</span>
          <span className="bg-gradient-to-r from-[#e4d4a5] via-[#c9a962] to-[#9a7b3c] bg-clip-text text-transparent"> Ta strona została stworzona wyłącznie w celach edukacyjnych i treningowych. Nie stanowi oferty handlowej ani porady inwestycyjnej.</span>
        </p>
      </div>

      {/* Legal links */}
      <div className="flex items-center justify-center gap-4 text-[10px] pb-6">
        <Link
          href="/polityka-prywatnosci"
          className="text-[#71717a] hover:text-[#c9a962] transition-colors duration-200 tracking-wide"
        >
          Polityka prywatności
        </Link>
        <span className="text-[#c9a962]/30">◆</span>
        <Link
          href="/regulamin"
          className="text-[#71717a] hover:text-[#c9a962] transition-colors duration-200 tracking-wide"
        >
          Regulamin
        </Link>
        <span className="text-[#c9a962]/30">◆</span>
        <Link
          href="/cookies"
          className="text-[#71717a] hover:text-[#c9a962] transition-colors duration-200 tracking-wide"
        >
          Cookies
        </Link>
      </div>

      {/* Bottom gold line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a962]/60 to-transparent" />
    </motion.footer>
  );
}
