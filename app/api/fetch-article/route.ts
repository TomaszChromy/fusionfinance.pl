import { NextRequest, NextResponse } from "next/server";

// @ts-ignore
import { load } from "cheerio";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "Missing URL parameter" },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL" },
        { status: 400 }
      );
    }

    // Fetch article content
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.status}` },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = load(html);

    // Extract title
    const title =
      $("meta[property='og:title']").attr("content") ||
      $("meta[name='twitter:title']").attr("content") ||
      $("h1").first().text() ||
      "Article";

    // Extract image
    const image =
      $("meta[property='og:image']").attr("content") ||
      $("meta[name='twitter:image']").attr("content") ||
      $("img").first().attr("src") ||
      undefined;

    // Extract description/content
    const description =
      $("meta[property='og:description']").attr("content") ||
      $("meta[name='description']").attr("content") ||
      $("meta[name='twitter:description']").attr("content") ||
      "";

    // Try to extract main article content
    let content = description;
    
    // Try common article selectors
    const articleSelectors = [
      "article",
      "[class*='article-content']",
      "[class*='article-body']",
      "[class*='post-content']",
      "[class*='entry-content']",
      "main",
    ];

    for (const selector of articleSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        // Remove scripts and styles
        element.find("script, style").remove();
        const text = element.text().trim();
        if (text.length > description.length) {
          content = text.slice(0, 2000); // Limit to 2000 characters
          break;
        }
      }
    }

    // Extract publish date
    const dateStr =
      $("meta[property='article:published_time']").attr("content") ||
      $("time").attr("datetime") ||
      $("[class*='date']").first().text() ||
      new Date().toISOString();

    // Extract source
    const hostname = new URL(url).hostname.replace("www.", "");

    return NextResponse.json({
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      image,
      date: dateStr,
      source: hostname,
      url,
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article content" },
      { status: 500 }
    );
  }
}
