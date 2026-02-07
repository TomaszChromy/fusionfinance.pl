"use client";

import { motion } from "framer-motion";
import { Navbar, Footer } from "@/components/layout";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/logowanie?redirect=/panel/analytics");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#08090c]">
        <Navbar />
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-12 lg:py-16">
          <div className="h-96 bg-gradient-to-r from-[#c9a962]/20 to-transparent rounded-xl animate-pulse" />
        </div>
        <Footer />
      </main>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-[1400px] px-4 lg:px-6 py-12 lg:py-16"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-gradient-to-b from-[#c9a962] to-[#9a7b3c] rounded-full" />
            <div>
              <h1 className="text-3xl lg:text-4xl font-serif font-medium text-[#f4f4f5]">
                Analytics Panel
              </h1>
              <p className="text-sm text-[#71717a] mt-1">
                Śledzenie statystyk portalu i aktywności użytkowników
              </p>
            </div>
          </div>
        </motion.div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard />

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-6 lg:p-8 rounded-xl border border-white/10 bg-gradient-to-r from-[#c9a962]/10 to-transparent"
        >
          <h3 className="text-lg font-serif font-medium text-[#f4f4f5] mb-3">
            💡 Co to jest Analytics?
          </h3>
          <p className="text-sm text-[#a1a1aa] leading-relaxed">
            Panel analityki dostarcza ci przeglądu statystyk użytkowników portalu FusionFinance.pl.
            Możesz śledzić liczbę odwiedzin, unikatowych użytkowników, średni czas spędzony
            na stronie i wskaźnik odskoku. Te dane pomagają w optymalizacji treści i User Experience.
          </p>
        </motion.div>
      </motion.div>

      <Footer />
    </main>
  );
}
