import { MetadataRoute } from "next";
import { FALLBACK_ARTICLES } from "@/data/articles-fallback";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://fusionfinance.pl";
  const currentDate = new Date().toISOString();

  type PageEntry = {
    path: string;
    priority: number;
    changeFrequency: "hourly" | "daily" | "monthly" | "weekly" | "yearly";
    lastModified?: string;
  };

  // Strony główne - najwyższy priorytet
  const mainPages: PageEntry[] = [
    { path: "", priority: 1.0, changeFrequency: "hourly" as const },
    { path: "/rynki", priority: 0.95, changeFrequency: "hourly" as const },
    { path: "/gielda", priority: 0.95, changeFrequency: "hourly" as const },
    { path: "/crypto", priority: 0.95, changeFrequency: "hourly" as const },
    { path: "/waluty", priority: 0.95, changeFrequency: "hourly" as const },
    { path: "/kursy-walut", priority: 0.9, changeFrequency: "hourly" as const },
    { path: "/analizy", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/markets", priority: 0.85, changeFrequency: "hourly" as const },
  ];

  // Strony funkcjonalne
  const functionalPages: PageEntry[] = [
    { path: "/szukaj", priority: 0.7, changeFrequency: "daily" as const },
    { path: "/artykul", priority: 0.8, changeFrequency: "daily" as const },
  ];

  // Strony użytkownika
  const userPages: PageEntry[] = [
    { path: "/logowanie", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/rejestracja", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/profil", priority: 0.4, changeFrequency: "weekly" as const },
    { path: "/ulubione", priority: 0.4, changeFrequency: "weekly" as const },
    { path: "/watchlist", priority: 0.4, changeFrequency: "weekly" as const },
    { path: "/alerty", priority: 0.4, changeFrequency: "weekly" as const },
    { path: "/ustawienia", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/historia", priority: 0.4, changeFrequency: "daily" as const },
  ];

  // Strony informacyjne
  const infoPages: PageEntry[] = [
    { path: "/o-nas", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/kontakt", priority: 0.6, changeFrequency: "monthly" as const },
  ];

  // Strony prawne
  const legalPages: PageEntry[] = [
    { path: "/polityka-prywatnosci", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/regulamin", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/cookies", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const allPages: PageEntry[] = [...mainPages, ...functionalPages, ...userPages, ...infoPages, ...legalPages];

  const articlePages: PageEntry[] = FALLBACK_ARTICLES.map((article) => ({
    path: `/artykuly/${article.slug}`,
    priority: 0.8,
    changeFrequency: "daily" as const,
    lastModified: (() => {
      const parsed = new Date(article.publishedAt);
      return Number.isNaN(parsed.getTime()) ? currentDate : parsed.toISOString();
    })(),
  }));

  return [...allPages, ...articlePages].map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: page.lastModified ?? currentDate,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
