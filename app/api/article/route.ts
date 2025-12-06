import { NextRequest, NextResponse } from "next/server";

// Skip this route during static export
export const dynamic = "force-dynamic";

interface ArticleData {
  title: string;
  content: string;
  description: string;
  date: string;
  source: string;
  image?: string;
}

// Site-specific selectors for Polish news sites
const siteSelectors: Record<string, RegExp[]> = {
  "bankier.pl": [
    /<div[^>]*class="[^"]*article-body[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*class="[^"]*(?:tags|related|share)/i,
    /<div[^>]*class="[^"]*lead[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*id="articleContent"[^>]*>([\s\S]*?)<\/div>/i,
  ],
  "money.pl": [
    /<div[^>]*class="[^"]*article-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*sc-[^"]*"[^>]*data-st-area="content"[^>]*>([\s\S]*?)<\/div>/i,
  ],
  "parkiet.com": [
    /<div[^>]*class="[^"]*article__content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*article-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ],
  "pb.pl": [
    /<div[^>]*class="[^"]*article-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ],
  "forsal.pl": [
    /<div[^>]*class="[^"]*article-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ],
  "mybank.pl": [
    /<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*post-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ],
  "gpw.pl": [
    /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ],
  "businessinsider.com.pl": [
    /<div[^>]*class="[^"]*article-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ],
};

// Function to fetch and parse article content from source URL
async function fetchArticleContent(url: string): Promise<string> {
  try {
    // Clean URL - remove RSS tracking params
    let cleanUrl = url.replace(/\?utm_source=RSS.*$/i, "").replace(/&amp;/g, "&");

    const response = await fetch(cleanUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pl-PL,pl;q=0.9,en;q=0.8",
        "Cache-Control": "no-cache",
      },
      redirect: "follow",
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      console.log(`Failed to fetch ${cleanUrl}: ${response.status}`);
      return "";
    }

    const html = await response.text();
    let content = "";

    // Detect site and use specific selectors
    const hostname = new URL(cleanUrl).hostname.replace("www.", "");
    const selectors = siteSelectors[hostname] || [];

    // Try site-specific selectors first
    for (const pattern of selectors) {
      const match = html.match(pattern);
      if (match && match[1] && match[1].length > 100) {
        content = match[1];
        break;
      }
    }

    // If no site-specific match, try generic patterns
    if (!content || content.length < 200) {
      const genericPatterns = [
        // JSON-LD schema (often contains full article text)
        /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
        // Article tag
        /<article[^>]*>([\s\S]*?)<\/article>/i,
        // Common content divs
        /<div[^>]*class="[^"]*article[-_]?body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
        /<div[^>]*class="[^"]*article[-_]?content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
        /<div[^>]*class="[^"]*entry[-_]?content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
        /<div[^>]*class="[^"]*post[-_]?content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
        /<div[^>]*class="[^"]*text[-_]?content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
        /<div[^>]*class="[^"]*story[-_]?body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
        /<main[^>]*>([\s\S]*?)<\/main>/i,
      ];

      for (const pattern of genericPatterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
          // Check if it's JSON-LD
          if (pattern.source.includes("ld\\+json")) {
            try {
              const jsonData = JSON.parse(match[1]);
              if (jsonData.articleBody) {
                content = jsonData.articleBody;
                break;
              }
            } catch {
              // Not valid JSON, continue
            }
          } else if (match[1].length > 200) {
            content = match[1];
            break;
          }
        }
      }
    }

    // If still no content, extract all paragraphs
    if (!content || content.length < 200) {
      const paragraphs: string[] = [];
      const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
      let pMatch;
      while ((pMatch = pRegex.exec(html)) !== null) {
        const text = pMatch[1].replace(/<[^>]*>/g, "").trim();
        // Filter out navigation, ads, and other non-content paragraphs
        if (text.length > 40 &&
            !text.match(/czytaj (też|więcej|dalej)/i) &&
            !text.match(/reklama|advertisement|cookie|polityka prywatności/i) &&
            !text.match(/^(udostępnij|podziel się|komentarz|oceń)/i)) {
          paragraphs.push(text);
        }
      }
      if (paragraphs.length > 0) {
        content = paragraphs.join("\n\n");
      }
    }

    // Clean up HTML and format content
    content = content
      // Remove unwanted elements
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "")
      .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "")
      .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, "")
      .replace(/<img[^>]*>/gi, "")
      .replace(/<button[^>]*>[\s\S]*?<\/button>/gi, "")
      .replace(/<form[^>]*>[\s\S]*?<\/form>/gi, "")
      .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, "")
      // Convert block elements to newlines
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<\/h[1-6]>/gi, "\n\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<li[^>]*>/gi, "• ")
      .replace(/<\/blockquote>/gi, "\n\n")
      // Remove remaining tags
      .replace(/<[^>]*>/g, "")
      // Decode HTML entities
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&ndash;/g, "–")
      .replace(/&mdash;/g, "—")
      .replace(/&hellip;/g, "…")
      .replace(/&[a-z]+;/gi, " ")
      .replace(/&#\d+;/g, " ")
      // Clean up whitespace
      .replace(/\t+/g, " ")
      .replace(/ +/g, " ")
      .replace(/\n +/g, "\n")
      .replace(/ +\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return content;
  } catch (error) {
    console.error("Error fetching article:", error);
    return "";
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing URL parameter" }, { status: 400 });
  }

  try {
    const content = await fetchArticleContent(url);

    const response: ArticleData = {
      title: "",
      content: content || "Pełna treść artykułu dostępna w źródle.",
      description: "",
      date: "",
      source: url,
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ 
      error: "Failed to fetch article",
      content: "Nie udało się pobrać treści artykułu. Przejdź do źródła, aby przeczytać pełny tekst."
    }, { status: 500 });
  }
}

