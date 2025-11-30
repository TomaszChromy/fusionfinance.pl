"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 21 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="mt-[89px] pt-[55px]"
    >
      {/* Gold accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#c9a962]/40 to-transparent mb-[55px]" />

      {/* Logo */}
      <div className="text-center mb-[34px]">
        <Link href="/" className="inline-block group">
          <span className="font-serif text-3xl font-medium text-[#f4f4f5]">
            Fusion<span className="bg-gradient-to-r from-[#e4d4a5] via-[#c9a962] to-[#9a7b3c] bg-clip-text text-transparent">Finance</span>
          </span>
          <div className="mt-3 mx-auto w-[55px] h-[1px] bg-gradient-to-r from-transparent via-[#c9a962]/50 to-transparent group-hover:via-[#c9a962] transition-all duration-500" />
        </Link>
      </div>

      {/* Navigation links */}
      <div className="flex items-center justify-center gap-8 text-[12px] uppercase tracking-[0.15em] font-medium mb-[34px]">
        {["Rynki", "Giełda", "Crypto", "Waluty", "Analizy"].map((name, i) => (
          <Link
            key={name}
            href={`/${name.toLowerCase().replace("ł", "l")}`}
            className="text-[#71717a] hover:text-[#c9a962] transition-colors duration-300"
          >
            {name}
          </Link>
        ))}
      </div>

      {/* Elegant divider */}
      <div className="flex items-center justify-center gap-4 mb-[34px]">
        <div className="w-[89px] h-[1px] bg-gradient-to-r from-transparent to-[#c9a962]/30" />
        <div className="w-2 h-2 rotate-45 border border-[#c9a962]/40" />
        <div className="w-[89px] h-[1px] bg-gradient-to-l from-transparent to-[#c9a962]/30" />
      </div>

      {/* Copyright */}
      <div className="text-center mb-[21px]">
        <p className="text-[13px] text-[#a1a1aa] mb-2">
          {" "}
          <Link
            href="https://tomsoft-website.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c9a962] hover:text-[#e4d4a5] transition-colors duration-300"
          >
            TomSoft-Website
          </Link>
        </p>

        <p className="text-[11px] text-[#71717a] tracking-[0.2em] uppercase">
          <Link
            href="https://tomaszchromy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#c9a962] transition-colors duration-300"
          >
            Powered by Tomasz Chromy
          </Link>
        </p>
      </div>

      {/* Hosting info */}
      <div className="text-center mb-[21px]">
        <p className="text-[11px] text-[#52525b] tracking-wide">
          Hosting: <span className="text-[#71717a]">nazwa.pl</span>
        </p>
      </div>

      {/* Disclaimers */}
      <div className="text-center space-y-1 mb-[21px] max-w-xl mx-auto">
        <p className="text-[11px] text-[#52525b] leading-relaxed">
          This website was created for training purposes only and does not constitute a commercial offer.
        </p>
        <p className="text-[11px] text-[#52525b] leading-relaxed">
          Strona została stworzona w celach szkoleniowych i nie stanowi oferty handlowej.
        </p>
      </div>

      {/* Legal links */}
      <div className="flex items-center justify-center gap-5 text-[11px] pb-[34px]">
        <Link
          href="/polityka-prywatnosci"
          className="text-[#71717a] hover:text-[#c9a962] transition-colors duration-300 tracking-wide"
        >
          Polityka prywatności
        </Link>
        <span className="text-[#c9a962]/30">◆</span>
        <Link
          href="/regulamin"
          className="text-[#71717a] hover:text-[#c9a962] transition-colors duration-300 tracking-wide"
        >
          Regulamin
        </Link>
        <span className="text-[#c9a962]/30">◆</span>
        <Link
          href="/cookies"
          className="text-[#71717a] hover:text-[#c9a962] transition-colors duration-300 tracking-wide"
        >
          Cookies
        </Link>
      </div>

      {/* Bottom gold line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#c9a962]/60 to-transparent" />
    </motion.footer>
  );
}
