import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * POST /api/ai/sentiment
 * Analiza sentymentu tekstu (pozytywny/negatywny/neutralny)
 * Używa prostego algorytmu bazującego na słowach kluczowych
 */
export async function POST(request: NextRequest) {
  try {
    const { text, language = "pl" } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const sentiment = analyzeSentiment(text, language);

    return NextResponse.json(sentiment);
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze sentiment" },
      { status: 500 }
    );
  }
}

interface SentimentResult {
  score: number; // -1 to 1
  sentiment: "positive" | "negative" | "neutral";
  confidence: number; // 0 to 1
  keywords: string[];
}

/**
 * Prosty algorytm analizy sentymentu dla polskiego tekstu finansowego
 */
function analyzeSentiment(text: string, language: string = "pl"): SentimentResult {
  const lowerText = text.toLowerCase();

  // Słowa kluczowe dla polskiego
  const positiveWords = [
    "wzrost", "zysk", "przychód", "ekspansja", "inwestycja", "sukces",
    "rentowny", "efektywny", "solidny", "bezpieczny", "wzrostowy",
    "optymizm", "perspektywy", "szansa", "potencjał", "lepiej",
    "poprawa", "rekordu", "najlepszy", "wzmocnienie", "działalność",
  ];

  const negativeWords = [
    "strata", "spadek", "kryzys", "zagrożenie", "ryzyko", "upadek",
    "bankructwo", "straty", "słaby", "niski", "pesymizm", "strach",
    "pogorszenie", "zapaść", "zapaść", "negatywny", "trudny",
    "niepewny", "destabilizacja", "anomalia", "osłabienie",
  ];

  // Liczymy słowa
  let positiveCount = 0;
  let negativeCount = 0;
  const foundKeywords: string[] = [];

  positiveWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const matches = lowerText.match(regex);
    if (matches) {
      positiveCount += matches.length;
      foundKeywords.push(word);
    }
  });

  negativeWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const matches = lowerText.match(regex);
    if (matches) {
      negativeCount += matches.length;
      foundKeywords.push(word);
    }
  });

  // Oblicz score (-1 do 1)
  const totalWords = positiveCount + negativeCount;
  let score = 0;
  let confidence = 0;

  if (totalWords > 0) {
    score = (positiveCount - negativeCount) / totalWords;
    confidence = Math.min(totalWords / 10, 1); // Max confidence at 10 keywords
  }

  // Określ sentiment
  let sentiment: "positive" | "negative" | "neutral" = "neutral";
  if (score > 0.2) sentiment = "positive";
  else if (score < -0.2) sentiment = "negative";

  return {
    score,
    sentiment,
    confidence,
    keywords: [...new Set(foundKeywords)], // Unique keywords
  };
}
