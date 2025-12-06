import { NextRequest, NextResponse } from "next/server";

// Skip this route during static export
export const dynamic = "force-dynamic";

interface RSSItem {
  title: string;
  link: string;
  description: string;
  content: string;
  date: string;
  image?: string;
  category?: string;
}

// Źródła RSS - tylko polskie portale
const RSS_FEEDS: Record<string, string[]> = {
  // Rynki finansowe ogólnie + makro/gospodarka
  rynki: [
    "https://www.bankier.pl/rss/wiadomosci.xml",
    "https://www.money.pl/rss/rss.xml",
    "https://businessinsider.com.pl/feed",
    "https://www.pb.pl/rss/wszystkie.xml",
    "https://www.parkiet.com/rss.xml",
    "https://forsal.pl/feed",
    "https://www.wnp.pl/rss/serwis_ekonomiczny.xml",
    "https://www.rp.pl/rss/ekonomia",
    // PAP - oficjalna agencja prasowa
    "https://pap-mediaroom.pl/kategoria/biznes-i-finanse/rss.xml",
    // Gazeta.pl - gospodarka
    "http://rss.gazeta.pl/pub/rss/gospodarka.xml",
    // MyBank - rynek kapitałowy
    "https://mybank.pl/news/wiadomosci-rss.xml",
    "https://mybank.pl/news/wiadomosci-rynek-kapitalowy-rss.xml",
  ],
  // Giełda i akcje - GPW oficjalnie + portale
  gielda: [
    // GPW oficjalne
    "https://www.gpw.pl/rss_aktualnosci",
    "https://www.gpw.pl/rss_komunikaty",
    "https://www.gpw.pl/rss_komunikaty_indeksowe",
    "https://www.gpw.pl/rss_komunikaty_prasowe",
    "https://www.gpw.pl/rss-kalendarium-zdarzen",
    // Bankier
    "https://www.bankier.pl/rss/gielda.xml",
    "https://www.bankier.pl/rss/espi.xml",
    // MyBank
    "https://mybank.pl/news/wiadomosci-gielda-rss.xml",
    // Inne portale
    "https://stooq.pl/rss/",
    "https://www.parkiet.com/rss.xml",
    "https://www.pb.pl/rss/gielda.xml",
    "https://businessinsider.com.pl/gielda/feed",
    "https://www.stockwatch.pl/rss/",
  ],
  // Kryptowaluty - polskie źródła
  crypto: [
    "https://mybank.pl/news/wiadomosci-kryptowaluty-rss.xml",
    "https://www.bankier.pl/rss/wiadomosci.xml",
    "https://businessinsider.com.pl/feed",
    "https://www.money.pl/rss/rss.xml",
    "https://forsal.pl/feed",
  ],
  // Waluty i Forex
  waluty: [
    "https://www.bankier.pl/rss/waluty.xml",
    "https://mybank.pl/news/wiadomosci-waluty-rss.xml",
    "https://www.money.pl/rss/rss.xml",
    "https://forsal.pl/feed",
    "https://www.pb.pl/rss/wszystkie.xml",
  ],
  // Analizy - SII, Bankier, portale
  analizy: [
    "https://www.bankier.pl/rss/wiadomosci.xml",
    "https://www.parkiet.com/rss.xml",
    "https://www.pb.pl/rss/wszystkie.xml",
    "https://businessinsider.com.pl/feed",
    // SII - analizy inwestycyjne
    "https://www.sii.org.pl/feed/",
  ],
  // Dla strony głównej - mix wszystkich polskich źródeł
  all: [
    // GPW oficjalne
    "https://www.gpw.pl/rss_aktualnosci",
    "https://www.gpw.pl/rss_komunikaty",
    // PAP - breaking news
    "https://pap-mediaroom.pl/kategoria/biznes-i-finanse/rss.xml",
    // Bankier
    "https://www.bankier.pl/rss/wiadomosci.xml",
    "https://www.bankier.pl/rss/gielda.xml",
    "https://www.bankier.pl/rss/waluty.xml",
    // MyBank
    "https://mybank.pl/news/wiadomosci-rss.xml",
    "https://mybank.pl/news/wiadomosci-gielda-rss.xml",
    "https://mybank.pl/news/wiadomosci-kryptowaluty-rss.xml",
    // Inne portale
    "https://www.money.pl/rss/rss.xml",
    "https://businessinsider.com.pl/feed",
    "https://www.parkiet.com/rss.xml",
    "https://www.pb.pl/rss/wszystkie.xml",
    "https://forsal.pl/feed",
  ],
  // Dla featured section / breaking news
  bankier: [
    // GPW + PAP dla breaking news
    "https://www.gpw.pl/rss_aktualnosci",
    "https://www.gpw.pl/rss_komunikaty",
    "https://pap-mediaroom.pl/kategoria/biznes-i-finanse/rss.xml",
    "https://www.bankier.pl/rss/wiadomosci.xml",
    "https://www.bankier.pl/rss/gielda.xml",
  ],
  // Gospodarka / Makro
  gospodarka: [
    "https://pap-mediaroom.pl/kategoria/biznes-i-finanse/rss.xml",
    "http://rss.gazeta.pl/pub/rss/gospodarka.xml",
    "https://www.bankier.pl/rss/wiadomosci.xml",
    "https://www.money.pl/rss/rss.xml",
    "https://forsal.pl/feed",
    "https://www.pb.pl/rss/wszystkie.xml",
    "https://mybank.pl/news/wiadomosci-banki-rss.xml",
  ],
  // Surowce / Towary
  surowce: [
    "https://mybank.pl/news/wiadomosci-towary-rss.xml",
    "https://www.bankier.pl/rss/wiadomosci.xml",
    "https://forsal.pl/feed",
  ],
};

// Słowa kluczowe do filtrowania artykułów według kategorii
const CATEGORY_KEYWORDS: Record<string, { include: string[]; exclude: string[] }> = {
  rynki: {
    include: ["rynek", "indeks", "gpw", "s&p", "nasdaq", "dow", "ftse", "dax", "nikkei", "obligacj", "surowc", "commodit", "futures", "etf", "fundusz", "gospodark", "pkb", "inflacj", "stopy procentowe", "nbp", "fed", "ecb"],
    exclude: ["bitcoin", "ethereum", "kryptowalut", "blockchain", "nft", "token"]
  },
  gielda: {
    include: ["gpw", "wig", "wig20", "mwig", "swig", "akcj", "spółk", "dywidend", "emisj", "ipo", "debiut", "notowania", "sesj", "parkiet", "makler", "cdp", "knf", "espi", "ebi", "giełd", "indeks", "kurs akcji"],
    exclude: ["bitcoin", "ethereum", "kryptowalut", "forex", "eur/", "usd/"]
  },
  crypto: {
    include: ["bitcoin", "btc", "ethereum", "eth", "kryptowalut", "crypto", "blockchain", "token", "nft", "defi", "altcoin", "binance", "coinbase", "mining", "halving", "stablecoin", "usdt", "solana", "cardano", "xrp", "ripple", "dogecoin", "shiba", "web3"],
    exclude: []
  },
  waluty: {
    include: ["eur/", "usd/", "gbp/", "chf/", "jpy/", "walut", "forex", "kurs", "złot", "dolar", "euro", "frank", "jen", "funt", "nbp", "kantor", "wymian", "pln", "eur", "usd", "gbp", "chf"],
    exclude: ["bitcoin", "ethereum", "kryptowalut", "akcj", "gpw"]
  },
  analizy: {
    include: ["analiz", "prognoz", "rekomendacj", "raport", "perspektyw", "outlook", "target", "wycen", "wskaźnik", "rsi", "macd", "fibonacci", "trend", "wsparci", "opór", "sygnał", "techniczn", "fundament", "komentarz"],
    exclude: []
  },
  gospodarka: {
    include: ["gospodark", "pkb", "inflacj", "bezroboci", "stopy procentowe", "nbp", "fed", "ecb", "bank centralny", "polityka monetarna", "budżet", "deficyt", "dług", "eksport", "import", "handel", "przemysł", "produkcj"],
    exclude: ["bitcoin", "ethereum", "kryptowalut"]
  },
  surowce: {
    include: ["surowc", "ropa", "złoto", "srebro", "miedź", "gaz", "węgiel", "commodit", "towar", "metal", "energia", "brent", "wti", "opec"],
    exclude: ["bitcoin", "ethereum", "kryptowalut"]
  },
};

function extractImageFromContent(content: string): string | undefined {
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : undefined;
}

async function fetchRSSFeed(url: string): Promise<RSSItem[]> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 FusionFinance RSS Reader" },
      next: { revalidate: 300 },
    });
    
    if (!response.ok) return [];
    
    const text = await response.text();
    const items: RSSItem[] = [];
    
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    
    while ((match = itemRegex.exec(text)) !== null) {
      const itemContent = match[1];

      const title = itemContent.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/s)?.[1]?.trim() || "";
      const link = itemContent.match(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/s)?.[1]?.trim() || "";
      const description = itemContent.match(/<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/s)?.[1]?.trim() || "";
      const pubDate = itemContent.match(/<pubDate>(.*?)<\/pubDate>/s)?.[1]?.trim() || "";

      // Try to extract full content from content:encoded tag
      const contentEncoded = itemContent.match(/<content:encoded>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/)?.[1]?.trim() || "";

      // Use content:encoded if available, otherwise use description
      const fullContent = contentEncoded || description;

      // Try to extract image
      let image: string | undefined;
      const enclosure = itemContent.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
      const mediaContent = itemContent.match(/<media:content[^>]+url=["']([^"']+)["']/i);
      const mediaThumbnail = itemContent.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);

      if (enclosure) image = enclosure[1];
      else if (mediaContent) image = mediaContent[1];
      else if (mediaThumbnail) image = mediaThumbnail[1];
      else image = extractImageFromContent(fullContent);

      if (title && link) {
        // Clean HTML but preserve paragraph structure for content
        const cleanContent = fullContent
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(/<\/p>/gi, "\n\n")
          .replace(/<\/div>/gi, "\n")
          .replace(/<\/h[1-6]>/gi, "\n\n")
          .replace(/<li>/gi, "• ")
          .replace(/<\/li>/gi, "\n")
          .replace(/<[^>]*>/g, "")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&[^;]+;/g, " ")
          .replace(/\n{3,}/g, "\n\n")
          .trim();

        items.push({
          title: title.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim(),
          link,
          description: description.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").substring(0, 300).trim(),
          content: cleanContent,
          date: pubDate,
          image,
        });
      }
    }
    
    return items;
  } catch {
    return [];
  }
}

// Filtrowanie artykułów według słów kluczowych
function filterByCategory(items: RSSItem[], category: string): RSSItem[] {
  const keywords = CATEGORY_KEYWORDS[category];
  if (!keywords) return items;

  return items.filter(item => {
    const text = (item.title + " " + item.description).toLowerCase();

    // Sprawdź czy zawiera słowa kluczowe (include)
    const hasInclude = keywords.include.length === 0 ||
      keywords.include.some(kw => text.includes(kw.toLowerCase()));

    // Sprawdź czy NIE zawiera słów wykluczających (exclude)
    const hasExclude = keywords.exclude.some(kw => text.includes(kw.toLowerCase()));

    return hasInclude && !hasExclude;
  });
}

// Usuwanie duplikatów na podstawie tytułu
function removeDuplicates(items: RSSItem[]): RSSItem[] {
  const seen = new Set<string>();
  return items.filter(item => {
    const key = item.title.toLowerCase().substring(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const feedType = searchParams.get("feed") || "bankier";
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const feedUrls = RSS_FEEDS[feedType] || RSS_FEEDS.bankier;

  const allItems: RSSItem[] = [];

  for (const url of feedUrls) {
    const items = await fetchRSSFeed(url);
    allItems.push(...items);
  }

  // Filtruj według kategorii
  let filteredItems = filterByCategory(allItems, feedType);

  // Usuń duplikaty
  filteredItems = removeDuplicates(filteredItems);

  // Sortuj po dacie i limituj
  const sortedItems = filteredItems
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  return NextResponse.json({
    items: sortedItems,
    source: feedType,
    count: sortedItems.length,
  });
}

