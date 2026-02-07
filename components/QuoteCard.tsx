"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface QuoteCardProps {
  quote: string;
  author: string;
  role?: string;
  avatarUrl?: string;
  variant?: "default" | "large" | "minimal";
  className?: string;
}

export default function QuoteCard({
  quote,
  author,
  role,
  avatarUrl,
  variant = "default",
  className = "",
}: QuoteCardProps) {
  if (variant === "minimal") {
    return (
      <div className={`border-l-2 border-[#c9a962] pl-4 ${className}`}>
        <p className="text-sm text-[#a1a1aa] italic mb-2">&ldquo;{quote}&rdquo;</p>
        <p className="text-xs text-[#71717a]">— {author}</p>
      </div>
    );
  }

  if (variant === "large") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br from-[#0c0d10] to-[#08090c] border border-[#c9a962]/20 rounded-2xl p-8 relative overflow-hidden ${className}`}
      >
        {/* Decorative quote mark */}
        <div className="absolute top-4 left-4 text-[120px] font-serif text-[#c9a962]/10 leading-none pointer-events-none">
          &ldquo;
        </div>
        
        <div className="relative z-10">
          <p className="text-xl lg:text-2xl font-serif text-[#f4f4f5] leading-relaxed mb-6 italic">
            &ldquo;{quote}&rdquo;
          </p>
          
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={author} width={56} height={56} className="rounded-full object-cover border-2 border-[#c9a962]/30" unoptimized />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#c9a962] to-[#9a7b3c] flex items-center justify-center text-[#08090c] font-serif text-xl font-bold">
                {author.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-lg font-medium text-[#f4f4f5]">{author}</p>
              {role && <p className="text-sm text-[#c9a962]">{role}</p>}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-[#0c0d10] border border-white/5 rounded-xl p-5 hover:border-[#c9a962]/20 transition-colors ${className}`}
    >
      <div className="flex gap-3 mb-3">
        <span className="text-3xl font-serif text-[#c9a962] leading-none">&ldquo;</span>
        <p className="text-sm text-[#a1a1aa] italic leading-relaxed">{quote}</p>
      </div>
      
      <div className="flex items-center gap-3 ml-8">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={author} width={32} height={32} className="rounded-full object-cover" unoptimized />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#c9a962]/20 flex items-center justify-center text-[#c9a962] text-xs font-bold">
            {author.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-xs font-medium text-[#f4f4f5]">{author}</p>
          {role && <p className="text-[10px] text-[#71717a]">{role}</p>}
        </div>
      </div>
    </motion.div>
  );
}

// Daily Quote Component
export function DailyQuote({ className = "" }: { className?: string }) {
  const quotes = [
    { quote: "Rynkiem kieruje strach i chciwość.", author: "Warren Buffett", role: "CEO Berkshire Hathaway" },
    { quote: "Czas na rynku jest ważniejszy niż timing rynku.", author: "Ken Fisher", role: "Założyciel Fisher Investments" },
    { quote: "Inwestuj w to, co znasz.", author: "Peter Lynch", role: "Były zarządzający Fidelity Magellan" },
    { quote: "Ryzyko pochodzi z niewiedzy.", author: "Warren Buffett", role: "CEO Berkshire Hathaway" },
    { quote: "Bogactwo to transfer od niecierpliwych do cierpliwych.", author: "Warren Buffett", role: "CEO Berkshire Hathaway" },
  ];

  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const todayQuote = quotes[dayOfYear % quotes.length];

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">💡</span>
        <h3 className="text-sm font-medium text-[#c9a962]">Cytat dnia</h3>
      </div>
      <QuoteCard {...todayQuote} variant="minimal" />
    </div>
  );
}

// Expert Quote with verified badge
export function ExpertQuote({
  quote,
  author,
  role,
  avatarUrl,
  verified = false,
  className = "",
}: QuoteCardProps & { verified?: boolean }) {
  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-5 ${className}`}>
      <p className="text-sm text-[#a1a1aa] italic mb-4">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={author} width={40} height={40} className="rounded-full object-cover" unoptimized />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a962] to-[#9a7b3c] flex items-center justify-center text-[#08090c] font-bold">
            {author.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium text-[#f4f4f5]">{author}</p>
            {verified && (
              <svg className="w-4 h-4 text-[#60a5fa]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          {role && <p className="text-xs text-[#71717a]">{role}</p>}
        </div>
      </div>
    </div>
  );
}
