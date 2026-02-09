import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FALLBACK_ARTICLES } from "@/data/articles-fallback";

export const dynamicParams = false;

export async function generateStaticParams() {
  return FALLBACK_ARTICLES.map(article => ({ slug: article.slug }));
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const IS_STATIC = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true" || process.env.STATIC_EXPORT === "true";

interface ArticlePayload {
  item?: {
    id?: string;
    slug: string;
    title: string;
    summary: string;
    content: string;
    coverImage?: string | null;
    category?: string | null;
    tags?: string[] | null;
    source?: string | null;
    publishedAt: string;
  };
  source?: string;
}

function getFallbackArticle(slug: string): ArticlePayload | null {
  const fallback = FALLBACK_ARTICLES.find(a => a.slug === slug);
  if (!fallback) return null;
  return {
    item: { id: fallback.slug, ...fallback },
    source: "fallback",
  };
}

async function fetchArticle(slug: string, baseUrl: string): Promise<ArticlePayload> {
  const fallback = getFallbackArticle(slug);

  if (IS_STATIC && fallback) {
    return fallback;
  }

  // Avoid slow network calls during static generation; rely on bundled fallback content instead.
  if (process.env.NEXT_PHASE === "phase-production-build") {
    if (fallback) return fallback;
    return { item: undefined };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${baseUrl}/api/articles/${slug}`, {
      next: { revalidate: 120 },
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Article fetch failed: ${res.status}`);
    }
    return await res.json();
  } catch {
    return fallback ?? { item: undefined };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const baseUrl = BASE_URL;
  const data = await fetchArticle(slug, baseUrl);
  const article = data.item;
  if (!article) return {};

  const title = article.title;
  const description = article.summary?.slice(0, 160) || "Analiza finansowa FusionFinance";
  const url = `${baseUrl}/artykuly/${article.slug}`;
  const image = article.coverImage || `${baseUrl}/og-image.svg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const baseUrl = BASE_URL;
  const data = await fetchArticle(slug, baseUrl);
  const article = data.item;

  if (!article) {
    notFound();
  }

  const publishedDate = new Date(article.publishedAt).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const paragraphs = article.content.split(/\n\n+/).map(p => p.trim()).filter(Boolean);

  return (
    <main className="min-h-screen bg-[#08090c]">
      <Navbar />

      <div className="mx-auto max-w-5xl px-5 lg:px-8 py-10 lg:py-14">
        <Breadcrumbs />

        <article className="bg-[#0c0d10] border border-white/5 rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
          {article.coverImage && (
            <div className="relative h-[260px] lg:h-[360px] overflow-hidden">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              <div className="absolute bottom-5 left-5 text-white text-xs px-3 py-1.5 rounded-full bg-black/50 border border-white/10">
                {article.category || "Analiza"}
              </div>
            </div>
          )}

          <div className="p-6 lg:p-10">
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#71717a] mb-4">
              <span>{publishedDate}</span>
              <span className="w-1 h-1 rounded-full bg-[#c9a962]/60" />
              <span>{article.source || "FusionFinance"}</span>
              {article.tags?.length ? (
                <span className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-full bg-white/5 text-[11px] text-[#a1a1aa]">
                      #{tag}
                    </span>
                  ))}
                </span>
              ) : null}
            </div>

            <h1 className="font-serif text-3xl lg:text-4xl text-[#f4f4f5] font-medium leading-tight mb-4">
              {article.title}
            </h1>
            <p className="text-lg text-[#a1a1aa] leading-relaxed mb-6">{article.summary}</p>

            <div className="flex items-center gap-3 mb-8">
              <ShareButtons
                url={`${baseUrl}/artykuly/${article.slug}`}
                title={article.title}
                description={article.summary}
                variant="horizontal"
              />
            </div>

            <div className="prose prose-invert max-w-none prose-p:my-4 prose-li:my-2 prose-headings:text-[#f4f4f5] prose-strong:text-[#f4f4f5] prose-a:text-[#c9a962]">
              {paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
        </article>
      </div>

      <Footer />
    </main>
  );
}
