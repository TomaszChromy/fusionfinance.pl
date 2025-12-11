"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RegulaminPage() {
  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />

      <div className="mx-auto max-w-[800px] px-5 lg:px-8 py-[55px]">
        <motion.div
          initial={{ opacity: 0, y: 21 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Header */}
          <div className="text-center mb-[55px]">
            <div className="inline-flex items-center gap-[8px] text-[11px] text-[#c9a962] uppercase tracking-[0.15em] mb-[21px]">
              <span className="w-[21px] h-[1px] bg-[#c9a962]/50" />
              Informacje prawne
              <span className="w-[21px] h-[1px] bg-[#c9a962]/50" />
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl font-medium text-[#f4f4f5] mb-[21px]">
              Regulamin Serwisu
            </h1>
            <p className="text-[15px] text-[#a1a1aa]">
              Ostatnia aktualizacja: 30 listopada 2025
            </p>
          </div>

          {/* Content */}
          <div className="space-y-[34px]">
            <section className="bg-[#0f1115] border border-white/5 rounded-lg p-[34px]">
              <h2 className="text-[18px] font-medium text-[#f4f4f5] mb-[13px]">§1. Postanowienia ogólne</h2>
              <p className="text-[15px] text-[#a1a1aa] leading-relaxed">
                Niniejszy regulamin określa zasady korzystania z serwisu FusionFinance.pl dostępnego pod adresem https://fusionfinance.pl. Korzystanie z serwisu oznacza akceptację niniejszego regulaminu w całości.
              </p>
            </section>

            <section className="bg-[#0f1115] border border-white/5 rounded-lg p-[34px]">
              <h2 className="text-[18px] font-medium text-[#f4f4f5] mb-[13px]">§2. Definicje</h2>
              <div className="space-y-[13px] text-[15px] text-[#a1a1aa] leading-relaxed">
                <div className="flex items-start gap-[13px]">
                  <span className="text-[#c9a962] font-medium min-w-[120px]">Serwis</span>
                  <span>strona internetowa FusionFinance.pl</span>
                </div>
                <div className="flex items-start gap-[13px]">
                  <span className="text-[#c9a962] font-medium min-w-[120px]">Użytkownik</span>
                  <span>osoba fizyczna korzystająca z Serwisu</span>
                </div>
                <div className="flex items-start gap-[13px]">
                  <span className="text-[#c9a962] font-medium min-w-[120px]">Administrator</span>
                  <span>Tomasz Chromy</span>
                </div>
                <div className="flex items-start gap-[13px]">
                  <span className="text-[#c9a962] font-medium min-w-[120px]">Hosting</span>
                  <span>nazwa.pl sp. z o.o.</span>
                </div>
              </div>
            </section>

            <section className="bg-[#0f1115] border border-white/5 rounded-lg p-[34px]">
              <h2 className="text-[18px] font-medium text-[#f4f4f5] mb-[13px]">§3. Zasady korzystania</h2>
              <div className="space-y-[13px] text-[15px] text-[#a1a1aa] leading-relaxed">
                <p>Użytkownik zobowiązuje się do:</p>
                <ul className="space-y-[8px] ml-[21px]">
                  <li className="flex items-start gap-[8px]">
                    <span className="text-[#c9a962]">•</span>
                    Korzystania z Serwisu zgodnie z obowiązującym prawem
                  </li>
                  <li className="flex items-start gap-[8px]">
                    <span className="text-[#c9a962]">•</span>
                    Niepodejmowania działań mogących zakłócić działanie Serwisu
                  </li>
                  <li className="flex items-start gap-[8px]">
                    <span className="text-[#c9a962]">•</span>
                    Niekopiowania treści bez zgody Administratora
                  </li>
                </ul>
              </div>
            </section>

            <section className="bg-[#0f1115] border border-[#f87171]/20 rounded-lg p-[34px]">
              <h2 className="text-[18px] font-medium text-[#f4f4f5] mb-[13px]">§4. Wyłączenie odpowiedzialności</h2>
              <div className="bg-[#f87171]/10 border border-[#f87171]/20 rounded-lg p-[21px] mb-[13px]">
                <p className="text-[13px] text-[#f87171] font-medium uppercase tracking-[0.1em]">Ważne zastrzeżenie</p>
              </div>
              <p className="text-[15px] text-[#a1a1aa] leading-relaxed">
                Informacje prezentowane w Serwisie mają charakter <span className="text-[#f4f4f5] font-medium">wyłącznie informacyjny</span> i nie stanowią rekomendacji inwestycyjnych w rozumieniu przepisów prawa. Administrator nie ponosi odpowiedzialności za decyzje inwestycyjne podjęte na podstawie treści Serwisu. Przed podjęciem decyzji inwestycyjnych należy skonsultować się z licencjonowanym doradcą finansowym.
              </p>
            </section>

            <section className="bg-[#0f1115] border border-white/5 rounded-lg p-[34px]">
              <h2 className="text-[18px] font-medium text-[#f4f4f5] mb-[13px]">§5. Postanowienia końcowe</h2>
              <p className="text-[15px] text-[#a1a1aa] leading-relaxed">
                Administrator zastrzega sobie prawo do zmiany regulaminu. O zmianach użytkownicy będą informowani poprzez publikację nowej wersji regulaminu w Serwisie. W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy prawa polskiego.
              </p>
            </section>
          </div>
        </motion.div>

        <Footer />
      </div>
    </main>
  );
}

