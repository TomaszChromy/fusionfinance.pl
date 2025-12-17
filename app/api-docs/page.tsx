"use client";

import { motion } from "framer-motion";
import { Navbar, Footer } from "@/components/layout";
import Card from "@/components/Card";
import Link from "next/link";

export default function ApiDocPage() {
  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-[1400px] px-4 lg:px-6 py-12 lg:py-16"
      >
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-[#71717a] mb-12"
        >
          <a href="/" className="hover:text-[#c9a962] transition-colors">
            Strona główna
          </a>
          <span>/</span>
          <span className="text-[#f4f4f5]">Developer API</span>
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
                FusionFinance Developer API
              </h1>
              <p className="text-lg text-[#71717a] mt-2">
                Dostęp programistyczny do danych finansowych w czasie rzeczywistym
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Kolumna 1: Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 h-full">
              <h2 className="text-2xl font-serif font-medium text-[#f4f4f5] mb-4">
                Dokumentacja API
              </h2>
              <p className="text-[#a1a1aa] mb-6 leading-relaxed">
                FusionFinance oferuje RESTful API do dostępu danych finansowych, kursów walut,
                notowań giełdowych i kryptowalut.
              </p>
              <ul className="space-y-3 text-sm text-[#a1a1aa]">
                <li className="flex items-start gap-2">
                  <span className="text-[#c9a962]">✓</span>
                  <span>Aktualne kursy walut NBP</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c9a962]">✓</span>
                  <span>Notowania giełdowe GPW</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c9a962]">✓</span>
                  <span>Dane o kryptowalutach</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c9a962]">✓</span>
                  <span>Rate limiting</span>
                </li>
              </ul>
            </Card>
          </motion.div>

          {/* Kolumna 2: Autentykacja */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 h-full">
              <h2 className="text-2xl font-serif font-medium text-[#f4f4f5] mb-4">
                Autentykacja
              </h2>
              <p className="text-[#a1a1aa] mb-6">
                Każdy request musi zawierać Twój API key jako query parameter.
              </p>
              <div className="bg-[#15181e] p-4 rounded-lg mb-4 border border-white/5 overflow-x-auto">
                <code className="text-sm text-[#c9a962] whitespace-nowrap">
                  GET /api/v1/quotes?apiKey=YOUR_KEY
                </code>
              </div>
              <p className="text-xs text-[#71717a]">
                Utwórz API key w{" "}
                <Link href="/panel/developer" className="text-[#c9a962] hover:underline">
                  panelu developerskim
                </Link>
              </p>
            </Card>
          </motion.div>

          {/* Kolumna 3: Plany */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-8 h-full">
              <h2 className="text-2xl font-serif font-medium text-[#f4f4f5] mb-4">
                Limity API
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-[#f4f4f5] mb-1">Darmowy</p>
                  <p className="text-[#a1a1aa]">100 req/dzień</p>
                </div>
                <div>
                  <p className="font-semibold text-[#f4f4f5] mb-1">Basic</p>
                  <p className="text-[#a1a1aa]">1,000 req/dzień</p>
                </div>
                <div>
                  <p className="font-semibold text-[#f4f4f5] mb-1">Pro</p>
                  <p className="text-[#a1a1aa]">5,000 req/dzień</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8">
            <h2 className="text-2xl font-serif font-medium text-[#f4f4f5] mb-8">
              📡 Dostępne Endpoints
            </h2>

            <div className="space-y-8">
              {/* Endpoint: Quotes */}
              <div className="pb-8 border-b border-white/10 last:border-0">
                <div className="flex items-start gap-4 mb-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold">
                    GET
                  </span>
                  <span className="text-lg font-mono text-[#c9a962]">/api/v1/quotes</span>
                </div>
                <p className="text-[#a1a1aa] mb-4">Pobierz aktualne kursy walut</p>

                <div className="bg-[#15181e] p-4 rounded-lg mb-4 border border-white/5">
                  <p className="text-xs text-[#71717a] mb-2">Przykład:</p>
                  <code className="text-xs text-[#c9a962] block overflow-x-auto whitespace-nowrap">
                    GET /api/v1/quotes?apiKey=xxx&pairs=EUR/PLN,USD/PLN
                  </code>
                </div>

                <p className="text-sm text-[#a1a1aa]">
                  <strong>Parametry:</strong> pairs (string) - pary walut oddzielone przecinkami
                </p>
              </div>

              {/* Endpoint: Markets */}
              <div className="pb-8 border-b border-white/10 last:border-0">
                <div className="flex items-start gap-4 mb-4">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                    GET
                  </span>
                  <span className="text-lg font-mono text-[#c9a962]">/api/v1/markets</span>
                </div>
                <p className="text-[#a1a1aa] mb-4">Informacje o rynkach finansowych</p>

                <div className="bg-[#15181e] p-4 rounded-lg border border-white/5">
                  <p className="text-xs text-[#71717a] mb-2">Odpowiedź:</p>
                  <code className="text-xs text-[#c9a962] block overflow-x-auto">
                    {JSON.stringify(
                      {
                        status: "success",
                        data: [
                          { market: "GPW", status: "open", change: "+1.23%" },
                        ],
                      },
                      null,
                      2
                    ).substring(0, 150)}
                    ...
                  </code>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 p-12 rounded-2xl border border-white/10 bg-gradient-to-r from-[#c9a962]/10 to-transparent text-center"
        >
          <h2 className="text-2xl lg:text-3xl font-serif font-medium text-[#f4f4f5] mb-4">
            Gotowy do begin?
          </h2>
          <p className="text-lg text-[#a1a1aa] mb-6 max-w-2xl mx-auto">
            Utwórz konto i wygeneruj swój pierwszy API key już teraz
          </p>
          <Link
            href="/panel/developer"
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-[#c9a962] to-[#e4d4a5] text-black font-medium hover:shadow-lg hover:shadow-[#c9a962]/30 transition-all"
          >
            Panel Developerski →
          </Link>
        </motion.div>
      </motion.div>

      <Footer />
    </main>
  );
}
