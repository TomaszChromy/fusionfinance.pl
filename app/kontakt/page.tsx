"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import FAQ from "@/components/FAQ";
import SocialProof, { TrustBadges } from "@/components/SocialProof";

export default function KontaktPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#08090c]">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-[1200px] px-4 lg:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl lg:text-4xl font-serif font-medium text-[#f4f4f5] mb-3">
              Skontaktuj się z <span className="bg-gradient-to-r from-[#e4d4a5] via-[#c9a962] to-[#9a7b3c] bg-clip-text text-transparent">nami</span>
            </h1>
            <p className="text-[#71717a] text-sm max-w-lg mx-auto">
              Masz pytania, sugestie lub chcesz nawiązać współpracę? Napisz do nas!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-6 lg:p-8">
                <h2 className="text-lg font-medium text-[#f4f4f5] mb-6 flex items-center gap-2">
                  <span>✉️</span>
                  Wyślij wiadomość
                </h2>
                <ContactForm />
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
              Zaufało nam już ponad <span className="text-[#c9a962]">50 000</span> czytelników
            </h2>
            <SocialProof variant="combined" />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

