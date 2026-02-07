import { NextRequest, NextResponse } from "next/server";

// Dynamic API - requires Node.js runtime (not compatible with static export)
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RSSItem {
  title: string;
  link: string;
  description: string;
  content: string;
  date: string;
  image?: string;
  category?: string;
}

const FALLBACK_ITEMS: RSSItem[] = [
  {
    title: "GPW rośnie mimo słabszego sentymentu w Europie",
    link: "https://fusionfinance.pl/fallback/gpw-rosnie",
    description: "Indeks WIG20 notuje umiarkowane wzrosty dzięki dobrej postawie spółek energetycznych i banków.",
    content: "Indeks WIG20 notuje umiarkowane wzrosty dzięki dobrej postawie spółek energetycznych i banków. Inwestorzy oczekują na dane inflacyjne z Polski oraz decyzję EBC w sprawie stóp procentowych.",
    date: new Date().toISOString(),
    image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&q=90",
    category: "gielda",
  },
  {
    title: "Złoty stabilny. Inwestorzy czekają na dane o inflacji",
    link: "https://fusionfinance.pl/fallback/zloty-stabilny",
    description: "Kurs EUR/PLN utrzymuje się w okolicach 4,30, a USD/PLN w rejonie 3,95. Rynek czeka na nowe projekcje NBP.",
    content: "Kurs EUR/PLN utrzymuje się w okolicach 4,30, a USD/PLN w rejonie 3,95. Rynek czeka na nowe projekcje NBP i komentarze decydentów dotyczące ścieżki stóp procentowych.",
    date: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1604594849809-dfedbc827105?w=1200&q=90",
    category: "waluty",
  },
  {
    title: "Bitcoin powyżej 42 tys. USD. Rosną oczekiwania na ETF spot",
    link: "https://fusionfinance.pl/fallback/bitcoin-etf",
    description: "Ceny bitcoina utrzymują się powyżej 42 tys. USD, a inwestorzy liczą na rychłą akceptację ETF-ów spot w USA.",
    content: "Ceny bitcoina utrzymują się powyżej 42 tys. USD, a inwestorzy liczą na rychłą akceptację ETF-ów spot w USA. Analitycy wskazują na rosnące zainteresowanie instytucji aktywami cyfrowymi.",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&q=90",
    category: "crypto",
  },
  {
    title: "Ropa Brent stabilizuje się w okolicach 82 USD za baryłkę",
    link: "https://fusionfinance.pl/fallback/ropa-brent",
    description: "Rynek ropy czeka na dane o zapasach w USA oraz sygnały z OPEC+ dotyczące polityki wydobycia.",
    content: "Rynek ropy czeka na dane o zapasach w USA oraz sygnały z OPEC+ dotyczące polityki wydobycia. Analitycy wskazują, że popyt pozostaje solidny, a zmienność może wzrosnąć wraz z danymi makro.",
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1508387024700-9fe5c0b25c95?w=1200&q=90",
    category: "surowce",
  },
  {
    title: "Stopy procentowe w Polsce bez zmian, RPP zachowuje ostrożność",
    link: "https://fusionfinance.pl/fallback/rpp-stopy",
    description: "Rada Polityki Pieniężnej pozostawiła stopy procentowe bez zmian, wskazując na niepewność otoczenia makroekonomicznego.",
    content: "Rada Polityki Pieniężnej pozostawiła stopy procentowe bez zmian, wskazując na niepewność otoczenia makroekonomicznego. Rynki finansowe śledzą kolejne publikacje inflacyjne i komentarze członków Rady.",
    date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=1200&q=90",
    category: "gospodarka",
  },
];

function getFallbackItems(limit: number): RSSItem[] {
  return FALLBACK_ITEMS.slice(0, limit).map((item, index) => ({
    ...item,
    date: new Date(Date.now() - index * 45 * 60 * 1000).toISOString(),
  }));
}

const rssCache = new Map<string, { timestamp: number; items: RSSItem[] }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const FETCH_TIMEOUT_MS = 8_000;
const MAX_RETRIES = 2;
const TRANSLATE_ENDPOINT = "https://translate.googleapis.com/translate_a/single";

// Źródła RSS - tylko polskie portale
const RSS_FEEDS: Record<string, string[]> = {
  // Rynki finansowe ogólnie + makro/gospodarka
  rynki: [
    "https://www.bankier.pl/rss/wiadomosci.xml",
    "https://www.money.pl/rss/rss.xml",
    "https://businessinsider.com.pl/feed",
    "https://independenttrader.pl/feed",
    "https://www.egospodarka.pl/rss/",
    "https://www.obserwatorfinansowy.pl/feed/",
    "https://www.portalsamorzadowy.pl/rss/wszystkie-artykuly/",
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
    "https://www.fxmag.pl/rss",
    "https://www.bankier.pl/rss/komentarze.xml",
    "https://www.bankier.pl/rss/rynki.xml",
    "https://wgospodarce.pl/rss",
    "https://300gospodarka.pl/feed",
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
    "https://independenttrader.pl/feed",
    "https://www.fxmag.pl/gielda/rss",
    "https://stooq.pl/rss/powiadomienia.xml",
  ],
  // Kryptowaluty - polskie źródła
  crypto: [
    "https://mybank.pl/news/wiadomosci-kryptowaluty-rss.xml",
    "https://www.bankier.pl/rss/wiadomosci.xml",
    "https://businessinsider.com.pl/feed",
    "https://www.money.pl/rss/rss.xml",
    "https://forsal.pl/feed",
    "https://pl.beincrypto.com/feed/",
    "https://bitcoin.pl/feed/",
    "https://bithub.pl/feed/",
    "https://cointelegraph.com/rss",
    "https://decrypt.co/feed",
  ],
  // Waluty i Forex
  waluty: [
    "https://www.bankier.pl/rss/waluty.xml",
    "https://mybank.pl/news/wiadomosci-waluty-rss.xml",
    "https://www.money.pl/rss/rss.xml",
    "https://forsal.pl/feed",
    "https://www.pb.pl/rss/wszystkie.xml",
    "https://www.cinkciarz.pl/rss/analizy-i-komentarze",
    "https://www.fxmag.pl/waluty/rss",
  ],
  // Analizy - SII, Bankier, portale
  analizy: [
    "https://www.bankier.pl/rss/wiadomosci.xml",
    "https://www.parkiet.com/rss.xml",
    "https://www.pb.pl/rss/wszystkie.xml",
    "https://businessinsider.com.pl/feed",
    "https://independenttrader.pl/feed",
    "https://www.obserwatorfinansowy.pl/feed/",
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
    "https://independenttrader.pl/feed",
    "https://www.egospodarka.pl/rss/",
    "https://www.obserwatorfinansowy.pl/feed/",
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
  // Polska - newsy krajowe / gospodarka / rynki
  polska: [
    "https://www.bankier.pl/rss/wiadomosci.xml",
    "https://www.bankier.pl/rss/gielda.xml",
    "https://www.money.pl/rss/rss.xml",
    "https://www.pb.pl/rss/wszystkie.xml",
    "https://www.parkiet.com/rss.xml",
    "https://pap-mediaroom.pl/kategoria/biznes-i-finanse/rss.xml",
    "https://www.rp.pl/rss/ekonomia",
    "http://rss.gazeta.pl/pub/rss/gospodarka.xml",
    "https://www.egospodarka.pl/rss/",
    "https://www.obserwatorfinansowy.pl/feed/",
    "https://stooq.pl/rss/news_pl.xml",
    "https://wgospodarce.pl/rss",
    "https://300gospodarka.pl/feed",
    "https://biznes.wprost.pl/rss",
    "https://tvn24.pl/najnowsze.xml",
  ],
  // Świat - rynki globalne, makro, geopolityka
  swiat: [
    "https://feeds.bbci.co.uk/news/world/rss.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    "https://www.ft.com/world?format=rss",
    "https://www.cnbc.com/id/100727362/device/rss/rss.html",
    "https://www.aljazeera.com/xml/rss/all.xml",
    "https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best",
    "https://www.economist.com/the-world-this-week/rss.xml",
    "https://www.wsj.com/xml/rss/3_7085.xml",
    "https://feeds.skynews.com/feeds/rss/world.xml",
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
  polska: {
    include: ["polsk", "warszaw", "gpw", "nbp", "rpp", "wig", "złot", "pln", "kraj", "sejm", "rząd", "minister", "budżet"],
    exclude: ["bitcoin", "ethereum", "kryptowalut"]
  },
  swiat: {
    include: ["usa", "chin", "europ", "g20", "oecd", "fed", "ecb", "boe", "boj", "brent", "geopol", "world", "global", "europe", "asia", "america"],
    exclude: []
  },
};

// Proste wykrywanie języka – czy wygląda na polski
function isProbablyPolish(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  const hasPolishChars = /[ąćęłńóśźż]/.test(lower);
  if (hasPolishChars) return true;

  const commonPl = [" w ", " na ", " że ", " jest ", " nie ", " do ", " z ", " dla ", " przy "];
  const commonEn = [" the ", " of ", " and ", " in ", " for ", " to ", " with "];
  const enHits = commonEn.filter((w) => lower.includes(w)).length;
  const plHits = commonPl.filter((w) => lower.includes(w)).length;

  return plHits >= 2 && plHits >= enHits;
}

const translationCache = new Map<string, string>();

async function translateToPolish(text: string): Promise<string> {
  if (!text) return text;
  if (isProbablyPolish(text)) return text;

  const cached = translationCache.get(text);
  if (cached) return cached;

  try {
    const url = `${TRANSLATE_ENDPOINT}?client=gtx&sl=auto&tl=pl&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return text;

    const data = await response.json();
    const translated =
      Array.isArray(data) && Array.isArray(data[0])
        ? data[0]
            .map((chunk: unknown) => (Array.isArray(chunk) ? chunk[0] : ""))
            .filter(Boolean)
            .join("")
        : text;

    if (translated) {
      translationCache.set(text, translated);
      return translated;
    }
  } catch (error) {
    console.warn("[rss] translate failed:", error);
  }

  return text;
}

async function translateArticlesToPolish(items: RSSItem[]): Promise<RSSItem[]> {
  const translated = await Promise.all(
    items.map(async (item) => ({
      ...item,
      title: await translateToPolish(item.title),
      description: await translateToPolish(item.description),
      content: await translateToPolish(item.content),
    }))
  );

  return translated;
}

function extractImageFromContent(content: string): string | undefined {
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : undefined;
}

// Funkcja czyszcząca tekst boilerplate z różnych źródeł (money.pl, bankier.pl, etc.)
function cleanBoilerplate(text: string): string {
  const patterns = [
    // money.pl - info o redakcji, social share, kurs walut
    /Redakcja money\.pl\d{1,2} [a-ząćęłńóśźż]+ \d{4}, \d{1,2}:\d{2}/gi,
    /ZAPISZ\s*ZAPISANO\s*UDOSTĘPNIJ[^.]*Udostępnij na X[^.]*Udostępnij na Facebook(u)?/gi,
    /SKOMENTUJ/gi,
    /Dźwięk został wygenerowany automatycznie i może zawierać błędy/gi,
    /Kurs [a-ząćęłńóśźż\s]+ \d{1,2}\.\d{1,2}\.\d{4} - godz\. \d{1,2}:\d{2}[^.]+\./gi,
    /wobec złotego:\s*[\d,\.]+\s*wobec dolara amerykańskiego:\s*[\d,\.]+/gi,
    // Ogólne wzorce social share
    /Udostępnij na (Twitter|Facebook|X|LinkedIn)/gi,
    /Podziel się:\s*(Twitter|Facebook|X)/gi,
    // Bankier.pl
    /Zapisz artykuł/gi,
    /Dodaj do ulubionych/gi,
    // Forsal.pl, inne
    /Czytaj więcej na [a-zA-Z0-9.\-]+/gi,
    /Źródło:\s*(PAP|Reuters|ISBnews)/gi,
    // Puste nawiasy
    /\(\s*\)/g,
  ];

  let cleaned = text;
  for (const pattern of patterns) {
    cleaned = cleaned.replace(pattern, " ");
  }

  // Usuń nadmiarowe spacje
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

const withTimeout = async <T>(promise: Promise<T>, ms: number): Promise<T> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), ms)
  );
  return Promise.race([promise, timeout]);
};

async function fetchRSSFeed(url: string): Promise<RSSItem[]> {
  try {
    let lastError: unknown;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await withTimeout(
          fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0 FusionFinance RSS Reader" },
            cache: "no-store",
          }).catch(err => {
            // fetch may throw in sandboxed/non-network env – convert to error
            throw err;
          }),
          FETCH_TIMEOUT_MS
        );

        if (!response.ok) {
          lastError = new Error(`Bad status ${response.status}`);
          continue;
        }

        const text = await response.text();
        return parseFeed(text);
      } catch (err) {
        lastError = err;
      }
    }

    console.warn(`[rss] Failed to fetch ${url}:`, lastError);
    return [];
  } catch {
    return [];
  }
}

function parseFeed(text: string): RSSItem[] {
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

        // Czyść opis z boilerplate
        const cleanDescription = cleanBoilerplate(
          description.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim()
        ).substring(0, 300);

        items.push({
          title: title.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim(),
          link,
          description: cleanDescription,
          content: cleanBoilerplate(cleanContent),
          date: pubDate,
          image,
        });
      }
    }

    return items;
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

const normalizeLink = (link: string): string => {
  try {
    const url = new URL(link);
    url.hash = "";
    url.search = "";
    return url.toString();
  } catch {
    return link;
  }
};

// Usuwanie duplikatów na podstawie linku lub tytułu
function removeDuplicates(items: RSSItem[]): RSSItem[] {
  const seen = new Set<string>();
  return items.filter(item => {
    const key =
      (item.link ? normalizeLink(item.link) : "") ||
      item.title.toLowerCase().substring(0, 80);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const feedType = searchParams.get("feed") || "bankier";
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const feedUrls = RSS_FEEDS[feedType] || RSS_FEEDS.bankier;

    const cacheKey = `${feedType}`;
    const cached = rssCache.get(cacheKey);
    const now = Date.now();
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      const cachedItems = cached.items.slice(0, limit);
      return NextResponse.json({
        items: cachedItems,
        source: feedType,
        count: cachedItems.length,
        cached: true,
      });
    }

    let allItems: RSSItem[] = [];

    try {
      const results = await Promise.allSettled(feedUrls.map((url) => fetchRSSFeed(url)));

      for (const result of results) {
        if (result.status === "fulfilled") {
          allItems.push(...result.value);
        }
      }
    } catch (error) {
      console.error("[rss] fetch error:", error);
      allItems = [];
    }

    // Filtruj według kategorii
    let filteredItems = filterByCategory(allItems, feedType);

    // Usuń duplikaty
    filteredItems = removeDuplicates(filteredItems);

    // Sortuj po dacie i limituj
    const sortedItems = filteredItems
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);

    const finalItems = sortedItems.length > 0 ? sortedItems : getFallbackItems(limit);
    const translatedItems =
      feedType === "swiat" ? await translateArticlesToPolish(finalItems) : finalItems;

    rssCache.set(cacheKey, { timestamp: now, items: translatedItems });

    return NextResponse.json({
      items: translatedItems,
      source: feedType,
      count: translatedItems.length,
      cached: false,
    });
  } catch (error) {
    console.error("[rss] fatal error, returning fallback:", error);
    const fallback = getFallbackItems(10);
    return NextResponse.json({
      items: fallback,
      source: "fallback",
      count: fallback.length,
      cached: false,
    });
  }
}
