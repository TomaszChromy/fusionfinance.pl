import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /api/ai/summarize
 * Generowanie streszczenia artykułu
 */
export async function POST(request: NextRequest) {
  try {
    const { title, content, maxLength = 150 } = await request.json();

    if (!content || content.length < 100) {
      return NextResponse.json(
        { error: "Content too short for summarization" },
        { status: 400 }
      );
    }

    // Limit content length do 2000 znaków aby zaoszczędzić tokens
    const limitedContent = content.substring(0, 2000);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a financial news summarizer. Create a concise summary in Polish (${maxLength} characters max) of the following financial article. The summary should be professional, accurate, and highlight key information.`,
        },
        {
          role: "user",
          content: `Title: ${title}\n\nContent: ${limitedContent}`,
        },
      ],
      max_tokens: 100,
      temperature: 0.5,
    });

    const summary =
      completion.choices[0].message.content?.trim() || "Unable to generate summary";

    // Cache summary (opcjonalnie - w przyszłości można dodać Redis)
    return NextResponse.json({
      summary,
      tokenUsage: completion.usage?.total_tokens || 0,
    });
  } catch (error) {
    console.error("Summarization error:", error);

    if (error instanceof Error && error.message.includes("API key")) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
