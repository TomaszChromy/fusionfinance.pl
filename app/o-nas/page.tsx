"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Timeline from "@/components/Timeline";
import SocialProof from "@/components/SocialProof";
import Testimonials from "@/components/Testimonials";
import PageHero from "@/components/PageHero";

const TIMELINE_EVENTS = [
  { id: "1", date: "2024 Q1", title: "Powstanie projektu", description: "Start prac nad FusionFinance jako precyzyjny agregator newsów finansowych." },
  { id: "2", date: "2024 Q2", title: "MVP", description: "Pierwsza wersja: RSS, kursy walut NBP, dark mode, architektura Next.js 16." },
  { id: "3", date: "2024 Q3-Q4", title: "Rozbudowa", description: "GPW, crypto, kalkulatory, testy Lighthouse, twarde standardy dostępności." },
  { id: "4", date: "2025", title: "Stabilizacja & bezpieczeństwo", description: "Monitoring, rate limiting, audyt SEO/Performance, konsolidacja API." },
  { id: "5", date: "2026 (koniec)", title: "PWA Enterprise", description: "Instalowalna aplikacja z pełnym offline, push, sync w tle i trybem oszczędzania danych." },
];

const TEAM = [
  { name: "Tomasz Chromy", role: "Założyciel & Lead Developer", icon: "👨‍💻" },
  { name: "AI Systems", role: "Asysta inżynieryjna (automatyzacje, QA, research)", icon: "🤖" },
];

export default function ONasPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#08090c]">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-[1000px] px-4 lg:px-6">
        <PageHero
          title="O FusionFinance"
          subtitle="Jedno miejsce do monitorowania rynków, finansów osobistych i inwestycji. Kuratorujemy wiarygodne źródła, dbamy o jakość danych i estetykę interfejsu."
          eyebrow="Informacje"
          badge="Polski agregator"
        />

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
              FusionFinance powstał, by łączyć wiarygodne dane rynkowe z nowoczesnym doświadczeniem użytkownika. Stawiamy
              na przejrzystość, szybkość i konsekwentny design premium, tak by analitycy, inwestorzy i pasjonaci finansów
              mogli pracować na sprawdzonych informacjach w jednym miejscu.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-sm text-[#a1a1aa]">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-[#c9a962] text-xs uppercase tracking-[0.1em] mb-1">Wiarygodność</p>
                <p>Kuracja źródeł, jasne atrybucje, walidacja feedów i alarmy na wypadek błędów danych.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-[#c9a962] text-xs uppercase tracking-[0.1em] mb-1">Dostępność</p>
                <p>UX mobile-first, kontrasty AA, klawiatura i skróty, tryb oszczędzania danych.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-[#c9a962] text-xs uppercase tracking-[0.1em] mb-1">Bezpieczeństwo</p>
                <p>Rate limiting, sanity checks dla API, monitorowanie uptime i logów anomalii.</p>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          >
            {[
              { icon: "📰", title: "Agregacja newsów", desc: "Kuracja wiodących portali, de-duplikacja, tagowanie" },
              { icon: "💹", title: "Kursy walut i stopy", desc: "NBP + wskaźniki makro, cache z walidacją" },
              { icon: "📊", title: "Notowania GPW", desc: "WIG20, mWIG40, głębokie kategorie i filtry" },
              { icon: "₿", title: "Kryptowaluty", desc: "BTC, ETH, altcoiny, wyceny w PLN i USD" },
              { icon: "🧮", title: "Kalkulatory", desc: "Kredyt, procent składany, ROI, hedging FX" },
              { icon: "📱", title: "PWA 2026", desc: "Pełny offline + push, produkcja do końca 2026" },
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

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-lg font-medium text-[#f4f4f5] mb-6 flex items-center gap-2">
              <span>✨</span> Kluczowe funkcje
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
