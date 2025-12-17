"use client";

import { motion } from "framer-motion";
import { Navbar, Footer } from "@/components/layout";
import PricingPlans from "@/components/PricingPlans";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-[1400px] px-4 lg:px-6 py-12 lg:py-16"
      >
        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-[#71717a] mb-12"
        >
          <a href="/" className="hover:text-[#c9a962] transition-colors">
            Strona główna
          </a>
          <span>/</span>
          <span className="text-[#f4f4f5]">Cennik</span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-gradient-to-b from-[#c9a962] to-[#9a7b3c] rounded-full" />
            <div>
              <h1 className="text-4xl lg:text-5xl font-serif font-medium text-[#f4f4f5]">
                Przejrzyste cennik
              </h1>
              <p className="text-lg text-[#71717a] mt-2">
                Bez ukrytych opłat, bez zaskoczеnia
              </p>
            </div>
          </div>
        </motion.div>

        {/* Pricing Plans Component */}
        <PricingPlans />

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 p-12 rounded-2xl border border-white/10 bg-gradient-to-r from-[#c9a962]/10 to-transparent text-center"
        >
          <h2 className="text-2xl lg:text-3xl font-serif font-medium text-[#f4f4f5] mb-4">
            Masz pytania?
          </h2>
          <p className="text-lg text-[#a1a1aa] mb-6 max-w-2xl mx-auto">
            Nasze zespoł wsparcia jest dostępny 24/7. Skontaktuj się z nami na
            temat planu, który najlepiej odpowiada Twoim potrzebom.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="mailto:tomasz.chromy@outlook.com"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#c9a962] to-[#e4d4a5] text-black font-medium hover:shadow-lg hover:shadow-[#c9a962]/30 transition-all"
            >
              ✉️ Email
            </a>
            <a
              href="/kontakt"
              className="px-6 py-3 rounded-lg border border-[#c9a962]/30 text-[#c9a962] font-medium hover:bg-white/[0.02] transition-colors"
            >
              Formularz kontaktowy
            </a>
          </div>
        </motion.section>
      </motion.div>

      <Footer />
    </main>
  );
}
