"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RSSArticles from "@/components/RSSArticles";
import MarketSidebar from "@/components/MarketSidebar";
import ShareButtons from "@/components/ShareButtons";
import FavoriteButton from "@/components/FavoriteButton";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import RelatedArticles from "@/components/RelatedArticles";
import { useHistory, generateHistoryId } from "@/hooks/useHistory";
// Nowe komponenty
import BackButton from "@/components/BackButton";
import CopyButton from "@/components/CopyButton";
import ArticleRating from "@/components/ArticleRating";
import QuickShareFAB from "@/components/QuickShareFAB";
import TrendingBadge, { getBadgeType } from "@/components/TrendingBadge";
import ImageLightbox from "@/components/ImageLightbox";
import TextSelectionPopover from "@/components/TextSelectionPopover";
import TableOfContents from "@/components/TableOfContents";
import { useToast } from "@/components/Toast";
import { FontSizeButtons } from "@/components/FontSizeAdjuster";

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
  if (isNaN(date.getTime())) return "Brak daty";
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function parseContent(content: string): string[] {
  if (!content || content.length < 50) {
    return [];
  }

  // Split by double newlines (paragraphs) or single newlines
  const paragraphs = content
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 20); // Filter out very short fragments

  return paragraphs;
}

function ArticleContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "Artykuł finansowy";
  const description = searchParams.get("desc") || "";
  const initialContent = searchParams.get("content") || "";
  const dateStr = searchParams.get("date") || new Date().toISOString();
  const sourceUrl = searchParams.get("source") || "#";
  const urlImage = searchParams.get("image");

  const [articleContent, setArticleContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { addToHistory } = useHistory();
  const { showToast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);

  const heroImage = getImageForTitle(title, urlImage);
  const badgeType = getBadgeType({ date: dateStr });

  // Add to history on mount - only once per article
  const addedToHistoryRef = useRef(false);
  useEffect(() => {
    if (addedToHistoryRef.current) return;
    addedToHistoryRef.current = true;

    const historyId = generateHistoryId(title, sourceUrl);
    addToHistory({
      id: historyId,
      title,
      description,
      image: heroImage,
      source: sourceUrl,
      date: dateStr,
    });
  }, [title, sourceUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  // Always fetch full article content from source
  useEffect(() => {
    if (sourceUrl && sourceUrl !== "#") {
      setLoading(true);
      fetch(`/api/article?url=${encodeURIComponent(sourceUrl)}`)
        .then(res => res.json())
        .then(data => {
          if (data.content && data.content.length > 100) {
            setArticleContent(data.content);
          } else if (initialContent && initialContent.length > 50) {
            setArticleContent(initialContent);
          }
        })
        .catch(() => {
          // Use initial content on error
          if (initialContent) {
            setArticleContent(initialContent);
          }
        })
        .finally(() => setLoading(false));
    } else {
      // No source URL, use initial content
      setArticleContent(initialContent || description || "");
      setLoading(false);
    }
  }, [sourceUrl, initialContent, description]);

  // Parse content into paragraphs
  const contentParagraphs = parseContent(articleContent);

  // If no content, use description
  const paragraphs = contentParagraphs.length > 0
    ? contentParagraphs
    : [description || "Pełna treść artykułu dostępna w źródle."];

  // Calculate reading time (average 200 words per minute)
  const wordCount = paragraphs.join(" ").split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="max-w-[800px]">
      <motion.div initial={{ opacity: 0, y: 21 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Back Button + Breadcrumb */}
        <div className="flex items-center gap-4 mb-[21px]">
          <BackButton variant="minimal" showLabel={false} />
          <nav className="text-[11px] text-[#71717a] tracking-[0.1em] uppercase">
            <Link href="/" className="hover:text-[#c9a962]">Strona główna</Link>
            <span className="mx-2">›</span>
            <span className="text-[#a1a1aa]">Artykuł</span>
          </nav>
        </div>

        {/* Badge + Title */}
        <div className="mb-[21px]">
          {badgeType && <TrendingBadge type={badgeType} className="mb-3" />}
          <h1 className="font-serif text-[28px] md:text-[38px] font-medium text-[#f4f4f5] leading-tight">
            {title}
          </h1>
        </div>

        {/* Meta + Copy Link + Font Size */}
        <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#71717a] mb-[34px]">
          <time>{formatPolishDate(dateStr)}</time>
          <span>•</span>
          <span>{readingTime} min czytania</span>
          <span>•</span>
          <span>{wordCount} słów</span>
          <div className="ml-auto flex items-center gap-3">
            <FontSizeButtons />
            <CopyButton
              text={typeof window !== 'undefined' ? window.location.href : ''}
              label="Link"
              variant="minimal"
              onCopy={() => showToast("Link skopiowany!", "success")}
            />
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[#c9a962] hover:underline flex items-center gap-1">
              Źródło <span>→</span>
            </a>
          </div>
        </div>

        {/* Hero Image with Lightbox */}
        <figure className="mb-[34px]">
          <ImageLightbox src={heroImage} alt={title} className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/5">
            <Image src={heroImage} alt={title} fill className="object-cover" sizes="800px" priority unoptimized />
          </ImageLightbox>
          <figcaption className="mt-[13px] text-[11px] text-[#52525b] text-center">
            Kliknij aby powiększyć • Zdjęcie ilustracyjne
          </figcaption>
        </figure>

        {/* Lead / Description */}
        {description && (
          <p className="text-[18px] text-[#e4e4e7] leading-relaxed mb-[34px] font-medium border-l-4 border-[#c9a962] pl-[21px]">
            {description}
          </p>
        )}

        {/* Table of Contents (for long articles) */}
        {!loading && articleContent.length > 2000 && (
          <TableOfContents content={articleContent} className="mb-[34px]" />
        )}

        {/* Content with Text Selection Popover */}
        <div ref={contentRef} className="prose prose-invert max-w-none relative">
          <TextSelectionPopover containerRef={contentRef} />
          {loading ? (
            <div className="space-y-4">
              <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
              <div className="h-4 bg-white/5 rounded animate-pulse w-[95%]" />
              <div className="h-4 bg-white/5 rounded animate-pulse w-[90%]" />
              <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
              <div className="h-4 bg-white/5 rounded animate-pulse w-[85%]" />
              <p className="text-[14px] text-[#71717a] mt-6">Pobieranie pełnej treści artykułu...</p>
            </div>
          ) : (
            paragraphs.map((p, i) => (
              <p key={i} className="text-[16px] text-[#d4d4d8] leading-[1.85] mb-[21px]">
                {p}
              </p>
            ))
          )}
        </div>

        {/* Article Rating */}
        <div className="mt-[34px] pt-[21px] border-t border-white/10">
          <ArticleRating articleId={sourceUrl} />
        </div>

        {/* Share & Favorite Buttons */}
        <div className="mt-[21px] pt-[21px] border-t border-white/10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <ShareButtons
              url={typeof window !== 'undefined' ? window.location.href : `https://fusionfinance.pl/artykul`}
              title={title}
              description={description}
            />
            <FavoriteButton
              article={{
                title,
                description,
                image: heroImage,
                source: sourceUrl,
                date: formatPolishDate(dateStr),
              }}
              size="lg"
              showLabel
            />
          </div>
        </div>

        {/* Source link at the bottom */}
        <div className="mt-[21px] pt-[21px] border-t border-white/10">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a962] text-[#08090c] font-medium rounded-lg hover:bg-[#e4d4a5] transition-colors"
          >
            Przejdź do pełnego artykułu w źródle
            <span>→</span>
          </a>
          <p className="text-[12px] text-[#52525b] mt-3">
            Treść pochodzi z zewnętrznego źródła i jest wyświetlana w celach informacyjnych.
          </p>
        </div>
      </motion.div>

      {/* Quick Share FAB */}
      <QuickShareFAB
        url={typeof window !== 'undefined' ? window.location.href : ''}
        title={title}
      />
    </article>
  );
}

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-[#08090c] text-[#f4f4f5]">
      <ReadingProgressBar showPercentage />
      <Navbar />
      <main className="max-w-[1400px] mx-auto px-5 lg:px-8 py-[55px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-[55px]">
          {/* Left column - Article */}
          <Suspense fallback={<div className="text-center py-20">Ładowanie artykułu...</div>}>
            <ArticleContent />
          </Suspense>

          {/* Right column - Sidebar */}
          <div className="lg:sticky lg:top-[21px] lg:self-start space-y-[21px]">
            <div className="flex items-center gap-3 mb-[13px]">
              <div className="w-[4px] h-[28px] bg-gradient-to-b from-[#60a5fa] to-[#3b82f6] rounded-full" />
              <div>
                <h2 className="text-[16px] font-serif font-medium text-[#f4f4f5]">Dane rynkowe</h2>
                <p className="text-[11px] text-[#71717a] mt-0.5">Aktualizowane na żywo</p>
              </div>
            </div>
            <MarketSidebar />
          </div>
        </div>

        {/* Related articles */}
        <section className="mt-[89px] pt-[55px] border-t border-white/5">
          <div className="flex items-center gap-3 mb-[34px]">
            <div className="w-[4px] h-[28px] bg-gradient-to-b from-[#c9a962] to-[#9a7b3c] rounded-full" />
            <h2 className="text-[20px] font-serif font-medium text-[#f4f4f5]">Powiązane artykuły</h2>
          </div>
          <RSSArticles feedType="all" limit={6} showImage={true} />
        </section>
      </main>
      <Footer />
    </div>
  );
}

