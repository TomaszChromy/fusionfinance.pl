"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CryptoSection from "@/components/sections/CryptoSection";
import RSSArticlesPaginated from "@/components/RSSArticlesPaginated";

const cryptoData = [
  { symbol: "BTC", name: "Bitcoin", price: "97,245.00", change: "+3.42%", cap: "1.91T USD", icon: "₿" },
  { symbol: "ETH", name: "Ethereum", price: "3,456.78", change: "+2.15%", cap: "415B USD", icon: "Ξ" },
  { symbol: "BNB", name: "Binance Coin", price: "634.50", change: "+1.87%", cap: "94B USD", icon: "◉" },
  { symbol: "SOL", name: "Solana", price: "234.80", change: "+5.23%", cap: "108B USD", icon: "◎" },
  { symbol: "XRP", name: "Ripple", price: "2.34", change: "+8.91%", cap: "134B USD", icon: "✕" },
  { symbol: "ADA", name: "Cardano", price: "1.05", change: "+4.56%", cap: "37B USD", icon: "₳" },
  { symbol: "DOGE", name: "Dogecoin", price: "0.42", change: "-1.23%", cap: "62B USD", icon: "Ð" },
  { symbol: "DOT", name: "Polkadot", price: "8.90", change: "+2.78%", cap: "12B USD", icon: "●" },
];

export default function CryptoPage() {
  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />

      <div className="mx-auto max-w-[1200px] px-5 lg:px-8 py-[34px]">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 21 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="mb-[34px]"
        >
          <div className="flex items-center gap-3 mb-[13px]">
            <div className="w-[55px] h-[3px] bg-gradient-to-r from-[#f7931a] to-[#f59e0b] rounded-full" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-medium text-[#f4f4f5] mb-[13px]">Kryptowaluty</h1>
          <p className="text-[15px] text-[#a1a1aa] max-w-2xl leading-relaxed">
            Aktualne kursy kryptowalut, analizy rynku i najnowsze wiadomości ze świata crypto
          </p>
        </motion.div>

        {/* Market stats - Fibonacci grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[21px] mb-[55px]">
          {[
            { label: "Kapitalizacja rynku", value: "3.45T USD", change: "+2.3%" },
            { label: "Wolumen 24h", value: "156B USD", change: "+15.4%" },
            { label: "Dominacja BTC", value: "55.4%", change: "-0.8%" },
            { label: "Fear & Greed", value: "78", change: "Extreme Greed" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 13 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-[#0f1115] border border-[#c9a962]/10 rounded-lg p-[21px] hover:border-[#c9a962]/30 transition-colors duration-300"
            >
              <p className="text-[11px] text-[#71717a] mb-[8px] uppercase tracking-[0.1em]">{stat.label}</p>
              <p className="text-[21px] font-medium text-[#f4f4f5]">{stat.value}</p>
              <p className={`text-[12px] mt-[5px] ${stat.change.startsWith("+") ? "text-[#4ade80]" : stat.change.startsWith("-") ? "text-[#f87171]" : "text-[#fbbf24]"}`}>
                {stat.change}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Crypto table */}
        <div className="bg-[#0f1115] border border-[#c9a962]/10 rounded-lg overflow-hidden mb-[55px]">
          <table className="w-full">
            <thead className="bg-[#08090c]">
              <tr>
                <th className="text-left text-[11px] text-[#71717a] font-medium px-[21px] py-[13px] uppercase tracking-[0.1em]">#</th>
                <th className="text-left text-[11px] text-[#71717a] font-medium px-[21px] py-[13px] uppercase tracking-[0.1em]">Nazwa</th>
                <th className="text-right text-[11px] text-[#71717a] font-medium px-[21px] py-[13px] uppercase tracking-[0.1em]">Cena</th>
                <th className="text-right text-[11px] text-[#71717a] font-medium px-[21px] py-[13px] uppercase tracking-[0.1em]">Zmiana 24h</th>
                <th className="text-right text-[11px] text-[#71717a] font-medium px-[21px] py-[13px] uppercase tracking-[0.1em] hidden md:table-cell">Kapitalizacja</th>
              </tr>
            </thead>
            <tbody>
              {cryptoData.map((crypto, i) => (
                <tr key={crypto.symbol} className="border-t border-white/5 hover:bg-[#c9a962]/5 cursor-pointer transition-colors duration-300">
                  <td className="px-[21px] py-[13px] text-[13px] text-[#71717a]">{i + 1}</td>
                  <td className="px-[21px] py-[13px]">
                    <div className="flex items-center gap-[13px]">
                      <span className="w-[34px] h-[34px] rounded-full bg-[#f7931a]/10 flex items-center justify-center text-[#f7931a] text-[16px]">{crypto.icon}</span>
                      <div>
                        <span className="text-[14px] font-medium text-[#f4f4f5]">{crypto.name}</span>
                        <span className="text-[12px] text-[#71717a] ml-2">{crypto.symbol}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-[21px] py-[13px] text-[14px] text-[#f4f4f5] text-right font-mono">${crypto.price}</td>
                  <td className={`px-[21px] py-[13px] text-[13px] text-right font-medium ${crypto.change.startsWith("+") ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                    {crypto.change}
                  </td>
                  <td className="px-[21px] py-[13px] text-[13px] text-[#71717a] text-right hidden md:table-cell">{crypto.cap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Golden ratio grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[61.8fr_38.2fr] gap-[34px]">
          <div>
            {/* Wiadomości crypto */}
            <div>
              <div className="flex items-center gap-3 mb-[21px]">
                <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#f7931a] to-[#f59e0b] rounded-full" />
                <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Wiadomości kryptowalutowe</h2>
                <span className="px-[13px] py-[5px] bg-[#f7931a]/10 text-[#f7931a] text-[10px] font-medium rounded-full uppercase tracking-wider">
                  Investing.com
                </span>
              </div>
              <div className="bg-[#0f1115] border border-white/5 rounded-lg p-[21px]">
                <RSSArticlesPaginated feedType="crypto" totalArticles={80} articlesPerPage={10} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Popularne tokeny */}
            <div className="flex items-center gap-3 mb-[21px]">
              <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#c9a962] to-[#9a7b3c] rounded-full" />
              <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Popularne tokeny</h2>
            </div>
            <CryptoSection />

            {/* Stablecoiny */}
            <div className="mt-[34px]">
              <div className="flex items-center gap-3 mb-[21px]">
                <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#4ade80] to-[#22c55e] rounded-full" />
                <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Stablecoiny</h2>
              </div>
              <div className="bg-[#0f1115] border border-white/5 rounded-lg p-[21px]">
                <div className="space-y-[13px]">
                  {[
                    { symbol: "USDT", name: "Tether", price: "$1.00", cap: "91B" },
                    { symbol: "USDC", name: "USD Coin", price: "$1.00", cap: "42B" },
                    { symbol: "DAI", name: "Dai", price: "$1.00", cap: "5.3B" },
                    { symbol: "BUSD", name: "Binance USD", price: "$1.00", cap: "3.8B" },
                  ].map((coin) => (
                    <div key={coin.symbol} className="flex justify-between items-center pb-[13px] border-b border-white/5 last:border-0 last:pb-0">
                      <div className="flex items-center gap-[8px]">
                        <span className="w-[21px] h-[21px] rounded-full bg-[#4ade80]/10 flex items-center justify-center text-[10px] text-[#4ade80] font-medium">$</span>
                        <div>
                          <span className="text-[13px] text-[#f4f4f5] font-medium">{coin.symbol}</span>
                          <span className="text-[11px] text-[#71717a] ml-1">{coin.name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[12px] text-[#f4f4f5]">{coin.price}</span>
                        <span className="text-[10px] text-[#71717a] ml-2">{coin.cap}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trendy rynkowe */}
            <div className="mt-[34px]">
              <div className="flex items-center gap-3 mb-[21px]">
                <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#60a5fa] to-[#3b82f6] rounded-full" />
                <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Trendy rynkowe</h2>
              </div>
              <div className="bg-[#0f1115] border border-white/5 rounded-lg p-[21px] space-y-[13px]">
                <div className="flex justify-between pb-[13px] border-b border-white/5"><span className="text-[#a1a1aa]">Top Gainer:</span><span className="text-[#4ade80] font-medium">XRP +8.91%</span></div>
                <div className="flex justify-between pb-[13px] border-b border-white/5"><span className="text-[#a1a1aa]">Top Loser:</span><span className="text-[#f87171] font-medium">DOGE -1.23%</span></div>
                <div className="flex justify-between pb-[13px] border-b border-white/5"><span className="text-[#a1a1aa]">Najaktywniejszy:</span><span className="text-[#f4f4f5] font-medium">BTC</span></div>
                <div className="flex justify-between"><span className="text-[#a1a1aa]">Nowe ATH:</span><span className="text-[#fbbf24] font-medium">SOL, XRP</span></div>
              </div>
            </div>

            {/* Tematy */}
            <div className="mt-[34px]">
              <div className="flex items-center gap-3 mb-[21px]">
                <div className="w-[3px] h-[21px] bg-gradient-to-b from-[#a78bfa] to-[#8b5cf6] rounded-full" />
                <h2 className="text-[13px] font-medium text-[#f4f4f5] uppercase tracking-[0.15em]">Tematy</h2>
              </div>
              <div className="bg-[#0f1115] border border-white/5 rounded-lg p-[21px]">
                <div className="flex flex-wrap gap-[8px]">
                  {["#Bitcoin", "#Ethereum", "#DeFi", "#NFT", "#Altcoiny", "#Stablecoiny", "#Layer2", "#Web3", "#Mining", "#Halving"].map((tag) => (
                    <span key={tag} className="px-[13px] py-[5px] bg-[#c9a962]/10 text-[#c9a962] text-[11px] rounded-full hover:bg-[#c9a962]/20 cursor-pointer transition-colors duration-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}

