"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CookiesPage() {
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
              Polityka Cookies
            </h1>
            <p className="text-[15px] text-[#a1a1aa]">
              Ostatnia aktualizacja: 30 listopada 2025
            </p>
          </div>

          {/* Content */}
          <div className="space-y-[34px]">
            <section className="bg-[#0f1115] border border-white/5 rounded-lg p-[34px]">
              <h2 className="text-[18px] font-medium text-[#f4f4f5] mb-[13px]">1. Czym są pliki cookies?</h2>
              <p className="text-[15px] text-[#a1a1aa] leading-relaxed">
                Pliki cookies (ciasteczka) to małe pliki tekstowe, które są zapisywane na Twoim urządzeniu podczas odwiedzania naszej strony internetowej. Pozwalają nam zapamiętać Twoje preferencje i poprawić jakość korzystania z serwisu FusionFinance.pl.
              </p>
            </section>

            <section className="bg-[#0f1115] border border-white/5 rounded-lg p-[34px]">
              <h2 className="text-[18px] font-medium text-[#f4f4f5] mb-[13px]">2. Jakie cookies wykorzystujemy?</h2>
              <div className="space-y-[21px] text-[15px] text-[#a1a1aa] leading-relaxed">
                <div>
                  <h3 className="text-[#c9a962] font-medium mb-[8px]">Cookies niezbędne</h3>
                  <p>Konieczne do prawidłowego funkcjonowania strony. Bez nich serwis nie będzie działał poprawnie.</p>
                </div>
                <div>
                  <h3 className="text-[#c9a962] font-medium mb-[8px]">Cookies analityczne</h3>
                  <p>Pomagają nam zrozumieć, jak użytkownicy korzystają z serwisu. Używamy Google Analytics do analizy ruchu.</p>
                </div>
                <div>
                  <h3 className="text-[#c9a962] font-medium mb-[8px]">Cookies funkcjonalne</h3>
                  <p>Zapamiętują Twoje preferencje, np. wybraną walutę w przeliczniku czy preferowany tryb wyświetlania.</p>
                </div>
              </div>
            </section>

            <section className="bg-[#0f1115] border border-white/5 rounded-lg p-[34px]">
              <h2 className="text-[18px] font-medium text-[#f4f4f5] mb-[13px]">3. Hosting i przetwarzanie danych</h2>
              <p className="text-[15px] text-[#a1a1aa] leading-relaxed mb-[13px]">
                Strona FusionFinance.pl jest hostowana na serwerach <span className="text-[#c9a962] font-medium">nazwa.pl</span> - wiodącego polskiego dostawcy usług hostingowych. Dane są przetwarzane zgodnie z polskim prawem i regulacjami RODO.
              </p>
              <div className="bg-[#08090c] border border-[#c9a962]/20 rounded-lg p-[21px] mt-[21px]">
                <p className="text-[13px] text-[#71717a] uppercase tracking-[0.1em] mb-[8px]">Dostawca hostingu:</p>
                <p className="text-[15px] text-[#f4f4f5] font-medium">nazwa.pl sp. z o.o.</p>
                <p className="text-[13px] text-[#a1a1aa]">ul. Pana Tadeusza 2, 30-727 Kraków</p>
              </div>
            </section>

            <section className="bg-[#0f1115] border border-white/5 rounded-lg p-[34px]">
              <h2 className="text-[18px] font-medium text-[#f4f4f5] mb-[13px]">4. Jak zarządzać cookies?</h2>
              <p className="text-[15px] text-[#a1a1aa] leading-relaxed">
                Możesz w każdej chwili zmienić ustawienia dotyczące cookies w swojej przeglądarce. Większość przeglądarek pozwala na blokowanie lub usuwanie plików cookies. Pamiętaj jednak, że wyłączenie cookies może wpłynąć na funkcjonalność strony.
              </p>
            </section>

            <section className="bg-[#0f1115] border border-white/5 rounded-lg p-[34px]">
              <h2 className="text-[18px] font-medium text-[#f4f4f5] mb-[13px]">5. Kontakt</h2>
              <p className="text-[15px] text-[#a1a1aa] leading-relaxed">
                W razie pytań dotyczących polityki cookies, prosimy o kontakt pod adresem: <a href="mailto:kontakt@fusionfinance.pl" className="text-[#c9a962] hover:text-[#e4d4a5] transition-colors">kontakt@fusionfinance.pl</a>
              </p>
            </section>
          </div>
        </motion.div>

        <Footer />
      </div>
    </main>
  );
}

