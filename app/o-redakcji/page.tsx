"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import PageHero from "@/components/PageHero";

const REDAKCJA = [
  {
    name: "Tomasz Chromy",
    role: "Założyciel & Główny Redaktor",
    bio: "Twórca FusionFinance.pl. Pasjonat technologii i finansów. Zajmuje się rozwojem platformy i agregacją treści finansowych.",
    avatar: "TC",
    links: { website: "https://tomaszchromy.com" },
  },
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "FusionFinance.pl",
  "url": "https://fusionfinance.pl",
  "logo": "https://fusionfinance.pl/logo.png",
  "founder": {
    "@type": "Person",
    "name": "Tomasz Chromy",
    "url": "https://tomaszchromy.com"
  },
  "foundingDate": "2024",
  "description": "Agregator wiadomości finansowych z wiodących polskich portali",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "tomasz.chromy@outlook.com",
    "contactType": "customer service"
  }
};

export default function ORedakcjiPage() {
  return (
    <main className="min-h-screen bg-[#08090c]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Navbar />

      <div className="mx-auto max-w-[900px] px-4 lg:px-6 py-12">
        <PageHero
          title="O redakcji"
          subtitle="Kim jesteśmy, skąd bierzemy treści i jak dbamy o jakość agregatora."
          eyebrow="Informacje"
          badge="Polski agregator"
        />

        {/* Editorial Policy */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0c0d10] border border-white/5 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📋</span>
            <h2 className="text-xl font-medium text-[#c9a962]">Polityka redakcyjna</h2>
          </div>
          <div className="space-y-4 text-[#a1a1aa] leading-relaxed">
            <p>
              <strong className="text-[#f4f4f5]">FusionFinance.pl</strong> to agregator wiadomości finansowych, który zbiera i prezentuje treści z wiodących polskich portali finansowych. Naszym celem jest dostarczenie użytkownikom jednego miejsca do śledzenia najważniejszych informacji z rynków.
            </p>
            <p>
              <strong className="text-[#f4f4f5]">Zasady:</strong>
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2"><span className="text-[#c9a962]">•</span> Agregujemy treści z wiarygodnych źródeł (Money.pl, Bankier.pl, ISBnews, PAP)</li>
              <li className="flex items-start gap-2"><span className="text-[#c9a962]">•</span> Zawsze podajemy źródło oryginalnego artykułu</li>
              <li className="flex items-start gap-2"><span className="text-[#c9a962]">•</span> Dane rynkowe pobieramy z oficjalnych API (NBP, CoinGecko)</li>
              <li className="flex items-start gap-2"><span className="text-[#c9a962]">•</span> Nie tworzymy własnych rekomendacji inwestycyjnych</li>
              <li className="flex items-start gap-2"><span className="text-[#c9a962]">•</span> Projekt jest open source i transparentny</li>
            </ul>
          </div>
        </motion.section>

        {/* Team */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-medium text-[#f4f4f5] mb-6 flex items-center gap-2">
            <span>👥</span> Zespół
          </h2>
          <div className="grid gap-4">
            {REDAKCJA.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-[#0c0d10] border border-white/5 rounded-xl p-6 flex items-start gap-4"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#c9a962] to-[#9a7b3c] flex items-center justify-center text-[#08090c] font-bold text-lg flex-shrink-0">
                  {person.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-[#f4f4f5]">{person.name}</h3>
                  <p className="text-sm text-[#c9a962] mb-2">{person.role}</p>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">{person.bio}</p>
                  {person.links.website && (
                    <Link
                      href={person.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#71717a] hover:text-[#c9a962] mt-2 transition-colors"
                    >
                      🌐 {person.links.website.replace("https://", "")}
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Sources */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0c0d10] border border-white/5 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📰</span>
            <h2 className="text-xl font-medium text-[#f4f4f5]">Źródła informacji</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "Money.pl", type: "Portal finansowy" },
              { name: "Bankier.pl", type: "Portal finansowy" },
              { name: "ISBnews", type: "Agencja prasowa" },
              { name: "PAP Biznes", type: "Agencja prasowa" },
              { name: "NBP", type: "Kursy walut" },
              { name: "CoinGecko", type: "Kryptowaluty" },
            ].map((source) => (
              <div key={source.name} className="text-center p-3 bg-white/[0.02] rounded-lg">
                <p className="text-sm font-medium text-[#f4f4f5]">{source.name}</p>
                <p className="text-[10px] text-[#71717a]">{source.type}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8"
        >
          <p className="text-[#71717a] text-sm mb-4">
            Masz pytania do redakcji? Skontaktuj się z nami:
          </p>
          <Link
            href="mailto:tomasz.chromy@outlook.com"
            className="text-[#c9a962] hover:text-[#e4d4a5] transition-colors"
          >
            tomasz.chromy@outlook.com
          </Link>
        </motion.section>
      </div>

      <Footer />
    </main>
  );
}
