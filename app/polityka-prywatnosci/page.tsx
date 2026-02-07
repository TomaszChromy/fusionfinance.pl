"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export default function PolitykaPrywatnosciPage() {
  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />

      <div className="mx-auto max-w-[800px] px-5 lg:px-8 py-[55px]">
        <PageHero
          title="Polityka prywatności"
          subtitle="Informacje prawne dotyczące przetwarzania danych użytkowników FusionFinance."
          eyebrow="Informacje prawne"
          badge="Aktualizacja: 30 listopada 2025"
        />

          {/* Content */}
          <div className="space-y-[34px]">
            <section className="bg-[#0f1115] border border-white/5 rounded-lg p-[34px]">
              <h2 className="text-[18px] font-medium text-[#f4f4f5] mb-[13px]">1. Informacje ogólne</h2>
              <p className="text-[15px] text-[#a1a1aa] leading-relaxed">
                Niniejsza polityka prywatności określa zasady przetwarzania i ochrony danych osobowych przekazanych przez użytkowników w związku z korzystaniem z serwisu FusionFinance.pl. Dbamy o Twoją prywatność i bezpieczeństwo Twoich danych.
              </p>
            </section>

            <section className="bg-[#0f1115] border border-white/5 rounded-lg p-[34px]">
              <h2 className="text-[18px] font-medium text-[#f4f4f5] mb-[13px]">2. Administrator danych</h2>
              <p className="text-[15px] text-[#a1a1aa] leading-relaxed mb-[13px]">
                Administratorem danych osobowych jest Tomasz Chromy.
              </p>
              <div className="bg-[#08090c] border border-[#c9a962]/20 rounded-lg p-[21px]">
                <p className="text-[13px] text-[#71717a] uppercase tracking-[0.1em] mb-[8px]">Kontakt:</p>
                <p className="text-[15px] text-[#f4f4f5]">tomasz.chromy@outlook.com</p>
                <p className="text-[13px] text-[#a1a1aa] mt-[5px]">tomaszchromy.com</p>
              </div>
            </section>

            <section className="bg-[#0f1115] border border-white/5 rounded-lg p-[34px]">
              <h2 className="text-[18px] font-medium text-[#f4f4f5] mb-[13px]">3. Hosting</h2>
              <p className="text-[15px] text-[#a1a1aa] leading-relaxed mb-[13px]">
                Serwis FusionFinance.pl jest hostowany na serwerach <span className="text-[#c9a962] font-medium">nazwa.pl</span>. Dane są przechowywane na serwerach zlokalizowanych w Polsce, zgodnie z wymogami RODO.
              </p>
            </section>

            <section className="bg-[#0f1115] border border-white/5 rounded-lg p-[34px]">
              <h2 className="text-[18px] font-medium text-[#f4f4f5] mb-[13px]">4. Cel przetwarzania danych</h2>
              <div className="space-y-[13px] text-[15px] text-[#a1a1aa] leading-relaxed">
                <p>Dane osobowe przetwarzane są w następujących celach:</p>
                <ul className="space-y-[8px] ml-[21px]">
                  <li className="flex items-start gap-[8px]">
                    <span className="text-[#c9a962]">•</span>
                    Świadczenie usług drogą elektroniczną
                  </li>
                  <li className="flex items-start gap-[8px]">
                    <span className="text-[#c9a962]">•</span>
                    Prowadzenie statystyk i analiz ruchu
                  </li>
                  <li className="flex items-start gap-[8px]">
                    <span className="text-[#c9a962]">•</span>
                    Cele marketingowe (za wyraźną zgodą użytkownika)
                  </li>
                </ul>
              </div>
            </section>

            <section className="bg-[#0f1115] border border-white/5 rounded-lg p-[34px]">
              <h2 className="text-[18px] font-medium text-[#f4f4f5] mb-[13px]">5. Prawa użytkownika (RODO)</h2>
              <div className="space-y-[13px] text-[15px] text-[#a1a1aa] leading-relaxed">
                <p>Zgodnie z RODO, przysługują Ci następujące prawa:</p>
                <ul className="space-y-[8px] ml-[21px]">
                  <li className="flex items-start gap-[8px]">
                    <span className="text-[#c9a962]">•</span>
                    Prawo dostępu do swoich danych
                  </li>
                  <li className="flex items-start gap-[8px]">
                    <span className="text-[#c9a962]">•</span>
                    Prawo do sprostowania danych
                  </li>
                  <li className="flex items-start gap-[8px]">
                    <span className="text-[#c9a962]">•</span>
                    Prawo do usunięcia danych („prawo do bycia zapomnianym”)
                  </li>
                  <li className="flex items-start gap-[8px]">
                    <span className="text-[#c9a962]">•</span>
                    Prawo do ograniczenia przetwarzania
                  </li>
                  <li className="flex items-start gap-[8px]">
                    <span className="text-[#c9a962]">•</span>
                    Prawo do przenoszenia danych
                  </li>
                </ul>
              </div>
            </section>
          </div>
      </div>

      <Footer />
    </main>
  );
}
