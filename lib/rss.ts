// Polish financial RSS feeds
export const RSS_FEEDS = {
  bankier: "https://www.bankier.pl/rss/wiadomosci.xml",
  bankierGielda: "https://www.bankier.pl/rss/gielda.xml",
  bankierWaluty: "https://www.bankier.pl/rss/waluty.xml",
  money: "https://www.money.pl/rss/rss.xml",
  pb: "https://www.pb.pl/rss/wszystkie_artykuly",
  biznesInteria: "https://biznes.interia.pl/feed",
};

export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  category?: string;
  image?: string;
}

export interface RSSFeed {
  title: string;
  items: RSSItem[];
}

// Parse RSS XML to JSON
export function parseRSS(xml: string): RSSFeed {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");

  const channel = doc.querySelector("channel");
  const title = channel?.querySelector("title")?.textContent || "Feed";

  const items: RSSItem[] = [];
  const itemElements = doc.querySelectorAll("item");

  itemElements.forEach((item) => {
    const itemTitle = item.querySelector("title")?.textContent || "";
    const link = item.querySelector("link")?.textContent || "";
    const description = item.querySelector("description")?.textContent || "";
    const pubDate = item.querySelector("pubDate")?.textContent || "";
    const category = item.querySelector("category")?.textContent || undefined;

    // Try to extract image from various sources
    let image: string | undefined;
    const enclosure = item.querySelector("enclosure");
    if (enclosure?.getAttribute("type")?.startsWith("image")) {
      image = enclosure.getAttribute("url") || undefined;
    }
    const mediaContent = item.querySelector("content");
    if (!image && mediaContent) {
      image = mediaContent.getAttribute("url") || undefined;
    }

    items.push({
      title: itemTitle,
      link,
      description: stripHtml(description),
      pubDate,
      category,
      image,
    });
  });

  return { title, items };
}

// Strip HTML tags from string
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

// Format date to Polish format
export function formatPolishDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min temu`;
    } else if (diffHours < 24) {
      return `${diffHours} godz. temu`;
    } else if (diffDays < 7) {
      return `${diffDays} dni temu`;
    } else {
      return date.toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  } catch {
    return dateString;
  }
}

// Fetch RSS feed with CORS proxy
export async function fetchRSSFeed(feedUrl: string): Promise<RSSFeed | null> {
  try {
    // Use a CORS proxy for client-side fetching
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error("Failed to fetch");
    const xml = await response.text();
    return parseRSS(xml);
  } catch (error) {
    console.error("Error fetching RSS:", error);
    return null;
  }
}

