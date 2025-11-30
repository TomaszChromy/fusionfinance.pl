"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const articles = [
  {
    id: 1,
    slug: "nbp-stopy-procentowe",
    title: "NBP podejmuje decyzje o stopach procentowych - analiza wplywu na rynek",
    description: "Rada Polityki Pienieznej oglosila utrzymanie stop na niezmienionym poziomie. Eksperci komentuja.",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&q=80",
    category: "Makroekonomia",
    time: "2 godz temu",
    author: "Jan Kowalski",
  },
  {
    id: 2,
    slug: "sektor-it-gpw",
    title: "Sektor IT na GPW: Ktore spolki warto obserwowac?",
    description: "Analiza techniczna i fundamentalna najwazniejszych spolek technologicznych.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    category: "Gielda",
    time: "3 godz temu",
    author: "Anna Nowak",
  },
  {
    id: 3,
    slug: "ebc-regulacje",
    title: "Europejski Bank Centralny: Nowe wytyczne dla sektora bankowego",
    description: "EBC wprowadza zmiany w regulacjach dotyczacych wymogów kapitalowych.",
    image: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400&q=80",
    category: "Bankowosc",
    time: "4 godz temu",
    author: "Piotr Wisniewski",
  },
  {
    id: 4,
    slug: "rynek-nieruchomosci-2025",
    title: "Rynek nieruchomosci: Prognozy na 2025 rok",
    description: "Analitycy przewiduja stabilizacje cen mieszkan w najwiekszych miastach.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80",
    category: "Nieruchomosci",
    time: "5 godz temu",
    author: "Maria Kowalczyk",
  },
];

export default function ArticlesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      className="bg-[#161b22] border border-[#21262d] rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[#e6edf3]">Najnowsze wiadomosci</h2>
        <a href="#" className="text-[13px] text-[#58a6ff] hover:underline">
          Wszystkie →
        </a>
      </div>

      <div className="space-y-6">
        {articles.map((article, index) => (
          <motion.a
            key={article.id}
            href={`/artykul/${article.slug}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex gap-4 group cursor-pointer"
          >
            <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#58a6ff]">
                  {article.category}
                </span>
                <span className="text-[10px] text-[#8b949e]">•</span>
                <span className="text-[10px] text-[#8b949e]">{article.time}</span>
              </div>
              <h3 className="text-[14px] font-semibold text-[#e6edf3] mb-1 line-clamp-2 group-hover:text-[#58a6ff] transition-colors">
                {article.title}
              </h3>
              <p className="text-[12px] text-[#8b949e] line-clamp-2">{article.description}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
