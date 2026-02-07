"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import SocialProof, { TrustBadges } from "@/components/SocialProof";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export default function KontaktPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#08090c]">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-[1200px] px-4 lg:px-6">
          <PageHero
            title="Kontakt"
            subtitle="Jedyne oficjalne miejsce kontaktu: tomasz.chromy@outlook.com. Współpraca, uwagi, zgłoszenia."
            eyebrow="Informacje"
            badge="Direct mail"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-6 lg:p-8">
                <h2 className="text-lg font-medium text-[#f4f4f5] mb-4 flex items-center gap-2">
                  <span>✉️</span>
                  Kontakt e-mail
                </h2>
                <p className="text-sm text-[#a1a1aa] mb-4">
                  Jedyne oficjalne miejsce kontaktu:{" "}
                  <Link
                    href="mailto:tomasz.chromy@outlook.com"
                    className="text-[#c9a962] hover:text-[#e4d4a5] transition-colors"
                  >
                    tomasz.chromy@outlook.com
                  </Link>
                </p>
                <div className="flex items-center gap-3 bg-[#0f1115] border border-white/5 rounded-lg p-4">
                  <div className="px-3 py-2 rounded-md bg-[#c9a962]/15 text-[#c9a962] text-sm font-semibold">
                    tomasz.chromy@outlook.com
                  </div>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText("tomasz.chromy@outlook.com")}
                    className="text-xs text-[#f4f4f5] border border-white/10 rounded px-3 py-2 hover:border-[#c9a962]/50 transition-colors"
                  >
                    Kopiuj
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-6">
                <TrustBadges />
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-medium text-[#f4f4f5] mb-6 flex items-center gap-2">
                <span>❓</span>
                Często zadawane pytania
              </h2>
              <FAQ variant="grouped" />
            </motion.div>
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="text-center text-lg font-medium text-[#f4f4f5] mb-8">
              Projekt <span className="text-[#c9a962]">open source</span> w aktywnym rozwoju
            </h2>
            <SocialProof variant="combined" />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
