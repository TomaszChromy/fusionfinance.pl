"use client";

import { motion } from "framer-motion";

const breakingNews = [
  "Fed utrzymuje stopy procentowe - rynki reagują wzrostami",
  "Bitcoin przekracza 97 000 USD - nowy rekord w zasięgu",
  "GPW: WIG20 zyskuje 2.3% na otwarciu sesji",
  "Inflacja w Polsce spada do 4.1% - poniżej prognoz",
  "Tesla ogłasza rekordową sprzedaż w Q4 2024",
];

export default function BreakingNews() {
  return (
    <div className="bg-gradient-to-r from-[#9a7b3c] via-[#c9a962] to-[#9a7b3c] overflow-hidden">
      <div className="flex items-center">
        <div className="bg-[#08090c] px-[21px] py-[8px] font-medium text-[11px] uppercase tracking-[0.15em] flex-shrink-0 text-[#c9a962]">
          Breaking
        </div>
        <div className="overflow-hidden flex-1">
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
            className="flex items-center gap-[34px] whitespace-nowrap py-[8px] px-[21px]"
          >
            {breakingNews.concat(breakingNews).map((news, index) => (
              <span key={index} className="text-[12px] font-medium flex items-center gap-[8px] text-[#08090c]">
                <span className="w-[5px] h-[5px] bg-[#08090c] rounded-full" />
                {news}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

