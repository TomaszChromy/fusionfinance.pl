"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Timeline from "@/components/Timeline";
import SocialProof from "@/components/SocialProof";
import Testimonials from "@/components/Testimonials";

const TIMELINE_EVENTS = [
  { id: "1", date: "2024 Q1", title: "Powstanie projektu", description: "Start prac nad FusionFinance jako agregator newsów finansowych" },
  { id: "2", date: "2024 Q2", title: "MVP", description: "Pierwsza wersja z RSS, kursami walut i dark mode" },
  { id: "3", date: "2024 Q3", title: "Rozbudowa", description: "Dodanie GPW, kryptowalut, kalkulatorów i słownika" },
  { id: "4", date: "2024 Q4", title: "PWA", description: "Wersja Progressive Web App z offline i powiadomieniami" },
];

const TEAM = [
  { name: "Tomasz Chromy", role: "Założyciel & Developer", icon: "👨‍💻" },
  { name: "AI Assistant", role: "Współtwórca kodu", icon: "🤖" },
];

export default function ONasPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#08090c]">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-[1000px] px-4 lg:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl lg:text-4xl font-serif font-medium text-[#f4f4f5] mb-3">
              O <span className="bg-gradient-to-r from-[#e4d4a5] via-[#c9a962] to-[#9a7b3c] bg-clip-text text-transparent">FusionFinance</span>
            </h1>
            <p className="text-[#71717a] text-sm max-w-lg mx-auto">
              Twój osobisty agregator wiadomości finansowych. Wszystko w jednym miejscu.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0c0d10] border border-white/5 rounded-2xl p-8 mb-12"
          >
            <h2 className="text-lg font-medium text-[#c9a962] mb-4 flex items-center gap-2">
              <span>🎯</span> Nasza misja
            </h2>
            <p className="text-[#a1a1aa] leading-relaxed">
              FusionFinance powstał z potrzeby posiadania jednego, eleganckiego miejsca do śledzenia 
              wszystkich informacji finansowych. Agregujemy newsy z najlepszych polskich portali, 
              prezentujemy aktualne kursy walut z NBP, notowania giełdowe i kryptowaluty. 
              Wszystko w luksusowym, ciemnym interfejsie zaprojektowanym z myślą o profesjonalistach.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          >
            {[
              { icon: "📰", title: "Agregacja newsów", desc: "Z 6+ wiodących portali" },
              { icon: "💹", title: "Kursy walut", desc: "Dane z NBP w czasie rzeczywistym" },
              { icon: "📊", title: "Notowania GPW", desc: "WIG20, mWIG40 i więcej" },
              { icon: "₿", title: "Kryptowaluty", desc: "Bitcoin, Ethereum i altcoiny" },
              { icon: "🧮", title: "Kalkulatory", desc: "Procent składany, kredyty, ROI" },
              { icon: "📱", title: "PWA", desc: "Działa offline, można instalować" },
            ].map((feature, i) => (
              <div key={i} className="bg-[#0c0d10] border border-white/5 rounded-xl p-5 hover:border-[#c9a962]/20 transition-colors">
                <span className="text-2xl mb-2 block">{feature.icon}</span>
                <h3 className="text-sm font-medium text-[#f4f4f5] mb-1">{feature.title}</h3>
                <p className="text-xs text-[#71717a]">{feature.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-lg font-medium text-[#f4f4f5] mb-6 flex items-center gap-2">
              <span>📅</span> Historia projektu
            </h2>
            <Timeline items={TIMELINE_EVENTS} />
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-lg font-medium text-[#f4f4f5] mb-6 flex items-center gap-2">
              <span>👥</span> Zespół
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {TEAM.map((member, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#0c0d10] border border-white/5 rounded-xl px-6 py-4">
                  <span className="text-3xl">{member.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-[#f4f4f5]">{member.name}</p>
                    <p className="text-xs text-[#71717a]">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-lg font-medium text-[#f4f4f5] mb-6 flex items-center gap-2">
              <span>💬</span> Co mówią użytkownicy
            </h2>
            <Testimonials variant="grid" />
          </motion.div>

          {/* Social Proof */}
          <SocialProof variant="combined" />
        </div>
      </main>

      <Footer />
    </div>
  );
}

