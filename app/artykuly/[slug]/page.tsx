import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import Breadcrumbs from "@/components/Breadcrumbs";

const isStaticExport = process.env.STATIC_EXPORT === "true";
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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

async function fetchArticle(slug: string, baseUrl: string): Promise<ArticlePayload> {
  const res = await fetch(`${baseUrl}/api/articles/${slug}`, { next: { revalidate: 120 } });
  if (!res.ok) {
    throw new Error(`Article fetch failed: ${res.status}`);
  }
  return res.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  if (isStaticExport) {
    return {
      title: "Artykuł | FusionFinance",
      description: "Wersja statyczna nie renderuje dynamicznych artykułów.",
    };
  }

  const baseUrl = BASE_URL;
  try {
    const data = await fetchArticle(params.slug, baseUrl);
    const article = data.item;
    if (!article) return {};

    const title = article.title;
    const description = article.summary?.slice(0, 160) || "Analiza finansowa FusionFinance";
    const url = `${baseUrl}/artykuly/${article.slug}`;
    const image = article.coverImage;

    return {
      title,
      description,
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
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  if (isStaticExport) {
    return (
      <main className="min-h-screen bg-[#08090c]">
        <Navbar />
        <div className="mx-auto max-w-4xl px-5 lg:px-8 py-14 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-[#c9a962] text-xs uppercase tracking-[0.12em]">
            Wersja statyczna
          </div>
          <h1 className="font-serif text-3xl lg:text-4xl text-[#f4f4f5] font-medium">
            Artykuły dynamiczne dostępne tylko w pełnej wersji serwera
          </h1>
          <p className="text-[#a1a1aa] max-w-2xl mx-auto">
            Ta instancja została zbudowana jako statyczna na potrzeby hostingu współdzielonego. 
            Aby przeczytać artykuły z pełnymi danymi, skorzystaj z wersji dynamicznej lub przejdź na stronę główną.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 bg-[#c9a962] text-[#08090c] rounded-xl font-medium hover:bg-[#e4d4a5] transition-colors"
          >
            Wróć na stronę główną
          </a>
        </div>
        <Footer />
      </main>
    );
  }

  const baseUrl = BASE_URL;
  let article: ArticlePayload["item"];

  try {
    const data = await fetchArticle(params.slug, baseUrl);
    article = data.item;
  } catch {
    article = undefined;
  }

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
