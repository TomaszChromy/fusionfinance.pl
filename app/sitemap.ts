import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://fusionfinance.pl";
  const currentDate = new Date().toISOString();

  // Strony główne - najwyższy priorytet
  const mainPages = [
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
  const functionalPages = [
    { path: "/szukaj", priority: 0.7, changeFrequency: "daily" as const },
    { path: "/artykul", priority: 0.8, changeFrequency: "daily" as const },
  ];

  // Strony użytkownika
  const userPages = [
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
  const infoPages = [
    { path: "/o-nas", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/kontakt", priority: 0.6, changeFrequency: "monthly" as const },
  ];

  // Strony prawne
  const legalPages = [
    { path: "/polityka-prywatnosci", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/regulamin", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/cookies", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/wypisz", priority: 0.2, changeFrequency: "yearly" as const },
  ];

  const allPages = [...mainPages, ...functionalPages, ...userPages, ...infoPages, ...legalPages];

  return allPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: currentDate,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}

