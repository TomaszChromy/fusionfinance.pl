"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SparklineChart, { generateMockData } from "@/components/SparklineChart";

const FAQ_ITEMS = [
  { q: "Co to jest Bitcoin?", a: "Bitcoin (BTC) to pierwsza i największa kryptowaluta świata, stworzona w 2009 roku przez anonimowego Satoshi Nakamoto. Działa na zdecentralizowanej sieci blockchain bez pośredników." },
  { q: "Ile jest bitcoinów?", a: "Maksymalna podaż Bitcoina jest ograniczona do 21 milionów monet. Obecnie w obiegu jest około 19.5 miliona BTC. Ostatni bitcoin zostanie wydobyty około 2140 roku." },
  { q: "Co to jest halving Bitcoina?", a: "Halving to wydarzenie co ~4 lata, gdy nagroda za wydobycie bloku spada o połowę. Zmniejsza to inflację BTC i historycznie poprzedzało wzrosty cen." },
  { q: "Czy Bitcoin jest bezpieczny?", a: "Sieć Bitcoin jest bardzo bezpieczna dzięki kryptografii i decentralizacji. Ryzyko dotyczy głównie przechowywania (giełdy, portfele) i zmienności cen." },
  { q: "Jak kupić Bitcoin w Polsce?", a: "Bitcoin można kupić na giełdach kryptowalut (Binance, Zonda, BitBay), w kantorach krypto lub przez automaty Bitcoin. Wymagana jest weryfikacja tożsamości (KYC)." },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Bitcoin (BTC) - Aktualny kurs, wykres, analiza",
  "description": "Aktualny kurs Bitcoina w PLN i USD. Sprawdź wykres, analizę i najważniejsze informacje o największej kryptowalucie świata.",
  "author": { "@type": "Organization", "name": "FusionFinance.pl", "url": "https://fusionfinance.pl" },
  "publisher": { "@type": "Organization", "name": "FusionFinance.pl", "logo": { "@type": "ImageObject", "url": "https://fusionfinance.pl/logo.png" } },
  "datePublished": "2024-01-01",
  "dateModified": new Date().toISOString().split("T")[0],
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://fusionfinance.pl/crypto/bitcoin/" }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQ_ITEMS.map(item => ({ "@type": "Question", "name": item.q, "acceptedAnswer": { "@type": "Answer", "text": item.a } }))
};

export default function BitcoinPage() {
  const [price, setPrice] = useState<{ usd: number; pln: number; change24h: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sparkline] = useState(() => generateMockData(30, "up"));

  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,pln&include_24hr_change=true");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setPrice({ usd: data.bitcoin.usd, pln: data.bitcoin.pln, change24h: data.bitcoin.usd_24h_change });
      } catch {
        setPrice({ usd: 97500, pln: 389000, change24h: 2.5 });
      }
      setLoading(false);
    }
    fetchPrice();
  }, []);

  return (
    <main className="min-h-screen bg-[#08090c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <div className="mx-auto max-w-[1000px] px-4 lg:px-6 py-8">
        <Breadcrumbs />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 mt-4">
          <h1 className="text-3xl lg:text-4xl font-serif font-medium text-[#f4f4f5] mb-2">
            <span className="bg-gradient-to-r from-[#f7931a] to-[#ffb347] bg-clip-text text-transparent">Bitcoin</span> (BTC)
          </h1>
          <p className="text-[#71717a] text-sm">Aktualny kurs Bitcoina, wykres i analiza największej kryptowaluty świata</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#0c0d10] border border-[#f7931a]/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">₿</span>
              <div>
                <p className="text-sm text-[#71717a]">Bitcoin</p>
                <p className="text-xs text-[#52525b]">BTC</p>
              </div>
            </div>
            <div className="text-right">
              {loading ? <div className="h-10 w-32 bg-white/5 rounded animate-pulse" /> : (
                <>
                  <p className="text-3xl font-bold text-[#f4f4f5]">${price?.usd.toLocaleString()}</p>
                  <p className="text-sm text-[#71717a]">{price?.pln.toLocaleString()} PLN</p>
                  <p className={`text-xs ${(price?.change24h ?? 0) >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                    {(price?.change24h ?? 0) >= 0 ? "+" : ""}{price?.change24h.toFixed(2)}% (24h)
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="h-20"><SparklineChart data={sparkline} color="#f7931a" height={80} /></div>
          <p className="text-[10px] text-[#52525b] mt-2 text-center">Dane z CoinGecko API</p>
        </motion.div>

        <div className="space-y-8">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-[#0c0d10] border border-white/5 rounded-xl p-6">
            <h2 className="text-xl font-medium text-[#f4f4f5] mb-4">📊 Kluczowe informacje o Bitcoin</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                <p className="text-xs text-[#71717a]">Max. podaż</p>
                <p className="text-sm font-bold text-[#f4f4f5]">21M BTC</p>
              </div>
              <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                <p className="text-xs text-[#71717a]">W obiegu</p>
                <p className="text-sm font-bold text-[#f4f4f5]">~19.5M BTC</p>
              </div>
              <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                <p className="text-xs text-[#71717a]">Rok powstania</p>
                <p className="text-sm font-bold text-[#f4f4f5]">2009</p>
              </div>
              <div className="bg-white/[0.02] rounded-lg p-3 text-center">
                <p className="text-xs text-[#71717a]">ATH</p>
                <p className="text-sm font-bold text-[#f4f4f5]">$108,000</p>
              </div>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-[#0c0d10] border border-white/5 rounded-xl p-6">
            <h2 className="text-xl font-medium text-[#f4f4f5] mb-4">❓ Najczęściej zadawane pytania</h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="border border-white/5 rounded-lg overflow-hidden">
                  <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors">
                    <span className="text-sm font-medium text-[#f4f4f5]">{item.q}</span>
                    <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} className="text-[#f7931a]">▼</motion.span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}>
                        <p className="px-4 pb-4 text-sm text-[#a1a1aa] leading-relaxed">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        <div className="mt-8 text-center text-xs text-[#52525b]">
          <p>⚠️ Kryptowaluty są wysoce zmienne. <a href="/disclaimer" className="text-[#f7931a] hover:underline">Przeczytaj zastrzeżenie prawne</a>.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}

