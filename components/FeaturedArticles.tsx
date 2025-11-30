"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const featuredArticles = [
  {
    id: 1,
    slug: "rewolucja-ai-finanse",
    title: "Rewolucja AI w sektorze finansowym",
    description: "Jak sztuczna inteligencja zmienia oblicze bankowosci i inwestycji",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
    category: "Technologie",
    time: "15 min temu",
  },
  {
    id: 2,
    slug: "gpw-analiza-2025",
    title: "GPW: Analiza trendow na 2025 rok",
    description: "Eksperci prognozuja wzrosty w sektorze energetycznym",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&q=80",
    category: "Gielda",
    time: "32 min temu",
  },
  {
    id: 3,
    slug: "kryptowaluty-prognozy-2025",
    title: "Kryptowaluty: Co przyniesie nowy rok?",
    description: "Bitcoin i Ethereum - prognozy analitykow na 2025",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600&q=80",
    category: "Crypto",
    time: "1 godz temu",
  },
];

export default function FeaturedArticles() {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#e6edf3]">Wyróżnione artykuły</h2>
        <Link href="/analizy" className="text-[13px] text-[#58a6ff] hover:underline">
          Zobacz wszystkie →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredArticles.map((article, index) => (
          <Link key={article.id} href={`/artykul/${article.slug}`}>
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117]/80 to-transparent" />
                <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white bg-[#238636] rounded">
                  {article.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#e6edf3] mb-2 group-hover:text-[#58a6ff] transition-colors">
                {article.title}
              </h3>
              <p className="text-[14px] text-[#8b949e] mb-2">{article.description}</p>
              <span className="text-[12px] text-[#8b949e]">{article.time}</span>
            </motion.article>
          </Link>
        ))}
      </div>
    </section>
  );
}

