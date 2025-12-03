"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketSidebar from "@/components/MarketSidebar";
import RSSArticlesPaginated from "@/components/RSSArticlesPaginated";

export default function AnalizyPage() {
  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-5 lg:px-8 py-[34px]">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 21 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-[34px]"
        >
          <div className="flex items-center gap-3 mb-[13px]">
            <div className="w-[55px] h-[3px] bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] rounded-full" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-medium text-[#f4f4f5] mb-[13px]">Analizy</h1>
          <p className="text-[15px] text-[#a1a1aa] max-w-2xl leading-relaxed">
            Analizy fundamentalne i techniczne, prognozy rynkowe, rekomendacje inwestycyjne
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-[34px]">
          {/* Left column - Articles */}
          <div>
            <div className="flex items-center gap-3 mb-[21px]">
              <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#a78bfa] to-[#8b5cf6] rounded-full" />
              <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Analizy rynkowe</h2>
            </div>
            <RSSArticlesPaginated feedType="analizy" totalArticles={80} articlesPerPage={12} />
          </div>

          {/* Right column - Sidebar */}
          <div className="lg:sticky lg:top-[21px] lg:self-start">
            <MarketSidebar />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

