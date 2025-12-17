/**
 * Utility do konwersji URL RSS na internal slugs i linki
 */

export function urlToSlug(url: string, title: string): string {
  try {
    // Jeśli URL zawiera już slug, spróbuj go wydobyć
    const urlObj = new URL(url);
    const path = urlObj.pathname;

    // Bankier.pl - format: /wiadomosci/artykul/xxxxx
    if (url.includes("bankier.pl")) {
      const match = path.match(/\/artykul[s]?\/([^/]+)/);
      if (match) return match[1];
    }

    // Money.pl - format: /artykuly/xxxxx
    if (url.includes("money.pl")) {
      const match = path.match(/\/artykuly\/([^/]+)/);
      if (match) return match[1];
    }

    // Parkiet.pl - format: /wiadomosci/xxxxx
    if (url.includes("parkiet.pl")) {
      const match = path.match(/\/wiadomosci\/([^/]+)/);
      if (match) return match[1];
    }

    // PAP - format: /nww/xxxxx
    if (url.includes("pap.pl")) {
      const match = path.match(/\/nww\/([^/]+)/);
      if (match) return match[1];
    }

    // Fallback - stwórz slug z tytułu
    return generateSlugFromTitle(title, url);
  } catch {
    return generateSlugFromTitle(title, url);
  }
}

function generateSlugFromTitle(title: string, url: string): string {
  // Stwórz slug z tytułu + hash URL aby mieć unikalność
  const urlHash = hashCode(url).toString().slice(0, 8);
  const titleSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);

  return `${titleSlug}-${urlHash}`;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Konwertuj URL RSS na internal link z query parametrem
 * Używa formatu /artykul/?source=URL&title=TITLE dla kompatybilności
 */
export function getRssArticleLink(title: string, url: string): string {
  const params = new URLSearchParams({
    title: title,
    source: url,
  });
  return `/artykul?${params.toString()}`;
}
