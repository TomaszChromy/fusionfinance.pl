"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RSSArticles from "@/components/RSSArticles";

// HD obrazy kategoryzowane tematycznie
const themeImages: Record<string, string[]> = {
  crypto: [
    "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1600&q=90",
    "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=1600&q=90",
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&q=90",
  ],
  forex: [
    "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=1600&q=90",
    "https://images.unsplash.com/photo-1559526324-593bc073d938?w=1600&q=90",
  ],
  stocks: [
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1600&q=90",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1600&q=90",
  ],
  economy: [
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=90",
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1600&q=90",
  ],
  gold: [
    "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1600&q=90",
    "https://images.unsplash.com/photo-1624365168968-f283d506c6b6?w=1600&q=90",
  ],
  default: [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=90",
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1600&q=90",
  ],
};

function detectTheme(title: string): string {
  const t = title.toLowerCase();
  if (/bitcoin|ethereum|kryptowalut|crypto|btc|eth|blockchain/.test(t)) return "crypto";
  if (/eur\/|usd\/|walut|forex|złot|dolar|euro|frank/.test(t)) return "forex";
  if (/gpw|wig|akcj|giełd|s&p|nasdaq|dow|indeks/.test(t)) return "stocks";
  if (/złoto|gold|srebr|platyn|metal/.test(t)) return "gold";
  if (/pkb|inflacj|nbp|stopy|fed|ecb|gospodar/.test(t)) return "economy";
  return "default";
}

function getImageForTitle(title: string, urlImage?: string | null): string {
  if (urlImage && urlImage.startsWith("http")) return urlImage;
  const theme = detectTheme(title);
  const images = themeImages[theme] || themeImages.default;
  const index = title.length % images.length;
  return images[index];
}

function formatPolishDate(dateStr: string): string {
  const months = ["stycznia","lutego","marca","kwietnia","maja","czerwca",
                  "lipca","sierpnia","września","października","listopada","grudnia"];
  const date = new Date(dateStr);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function generateArticleContent(title: string, description: string): string[] {
  const paragraphs: string[] = [];
  paragraphs.push(description || "Artykuł finansowy z najnowszymi informacjami rynkowymi.");
  
  const templates = [
    "Analitycy rynkowi zwracają uwagę na kluczowe czynniki wpływające na obecną sytuację. Według ekspertów, obserwowane trendy mogą mieć istotne znaczenie dla dalszego rozwoju sytuacji na rynkach finansowych.",
    "Inwestorzy z niepokojem śledzą rozwój wydarzeń, które mogą wpłynąć na ich portfele. Strategie zabezpieczające stają się coraz popularniejsze wśród uczestników rynku.",
    "Perspektywy na najbliższe miesiące pozostają niepewne. Eksperci zalecają ostrożność i dywersyfikację portfela inwestycyjnego.",
    "Globalne rynki finansowe reagują na najnowsze dane makroekonomiczne. Indeksy giełdowe notują znaczące wahania w odpowiedzi na zmieniające się warunki.",
    "Banki centralne kontynuują politykę mającą na celu stabilizację sytuacji gospodarczej. Decyzje dotyczące stóp procentowych pozostają w centrum uwagi inwestorów.",
  ];
  
  templates.forEach(t => paragraphs.push(t));
  return paragraphs;
}

function ArticleContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "Artykuł finansowy";
  const description = searchParams.get("desc") || "";
  const dateStr = searchParams.get("date") || new Date().toISOString();
  const sourceUrl = searchParams.get("source") || "#";
  const urlImage = searchParams.get("image");

  const heroImage = getImageForTitle(title, urlImage);
  const paragraphs = generateArticleContent(title, description);

  return (
    <article className="max-w-[720px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 21 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Breadcrumb */}
        <nav className="mb-[21px] text-[11px] text-[#71717a] tracking-[0.1em] uppercase">
          <Link href="/" className="hover:text-[#c9a962]">Strona główna</Link>
          <span className="mx-2">›</span>
          <span className="text-[#a1a1aa]">Artykuł</span>
        </nav>

        {/* Title */}
        <h1 className="font-serif text-[32px] md:text-[42px] font-medium text-[#f4f4f5] leading-tight mb-[21px]">
          {title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-[12px] text-[#71717a] mb-[34px]">
          <time>{formatPolishDate(dateStr)}</time>
          <span>•</span>
          <span>5 min czytania</span>
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[#c9a962] hover:underline ml-auto">
            Źródło →
          </a>
        </div>

        {/* Hero Image */}
        <figure className="mb-[34px]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
            <Image src={heroImage} alt={title} fill className="object-cover" sizes="720px" priority unoptimized />
          </div>
          <figcaption className="mt-[13px] text-[11px] text-[#71717a] text-center italic">
            Zdjęcie ilustracyjne · FusionFinance
          </figcaption>
        </figure>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[16px] text-[#d4d4d8] leading-[1.8] mb-[21px]">{p}</p>
          ))}
        </div>
      </motion.div>
    </article>
  );
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-[#08090c] text-[#f4f4f5]">
      <Navbar />
      <main className="px-[21px] md:px-[55px] py-[55px]">
        <Suspense fallback={<div className="text-center py-20">Ładowanie...</div>}>
          <ArticleContent />
        </Suspense>
        <section className="max-w-[720px] mx-auto mt-[89px]">
          <h2 className="text-[18px] font-medium text-[#f4f4f5] mb-[21px]">Powiązane artykuły</h2>
          <RSSArticles feedType="bankier" limit={4} showImage={true} />
        </section>
      </main>
      <Footer />
    </div>
  );
}

