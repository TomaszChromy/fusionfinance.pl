"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative h-[400px] w-full overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&q=80"
          alt="Financial Markets"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117]/95 via-[#0d1117]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 h-full flex items-center">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-block px-3 py-1 mb-4 text-[11px] font-semibold uppercase tracking-wider text-[#58a6ff] bg-[#58a6ff]/10 rounded-full border border-[#58a6ff]/20">
              Breaking News
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#e6edf3] leading-tight mb-4">
              Rynki w centrum uwagi: Rekordowe wzrosty indeksow
            </h1>
            <p className="text-lg text-[#8b949e] mb-6 leading-relaxed">
              S&P 500 osiaga nowe szczyty. Inwestorzy reaguja na dane o inflacji i decyzje Fed.
              Sprawdz najnowsze analizy i prognozy ekspertow.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/artykul/rekordowe-wzrosty" className="px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white font-medium rounded-lg transition-colors">
                Czytaj wiecej
              </Link>
              <Link href="/analizy" className="px-6 py-3 border border-[#30363d] hover:border-[#8b949e] text-[#e6edf3] font-medium rounded-lg transition-colors">
                Analiza rynku
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#161b22]/90 backdrop-blur-sm border-t border-[#21262d]">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-[#8b949e] text-sm">S&P 500</span>
              <span className="text-[#e6edf3] font-semibold">4,783.45</span>
              <span className="text-[#3fb950] text-sm">+1.23%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8b949e] text-sm">NASDAQ</span>
              <span className="text-[#e6edf3] font-semibold">15,234.67</span>
              <span className="text-[#3fb950] text-sm">+0.87%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8b949e] text-sm">BTC/USD</span>
              <span className="text-[#e6edf3] font-semibold">97,245.00</span>
              <span className="text-[#f85149] text-sm">-0.45%</span>
            </div>
          </div>
          <span className="text-[11px] text-[#8b949e]">Aktualizacja: 2 min temu</span>
        </div>
      </div>
    </motion.section>
  );
}

