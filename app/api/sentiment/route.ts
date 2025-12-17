import { NextRequest, NextResponse } from "next/server";

// Zamiast biblioteki 'natural' użyję prostej analizy słów kluczowych
// Natural library ma problemy z SSR w Next.js
const positiveWords = [
  "wzrost",
  "zysk",
  "pozytywny",
  "dobry",
  "świetny",
  "doskonały",
  "rekord",
  "sukces",
  "udało",
  "rośnie",
  "wzmacnia",
  "poprawia",
  "najlepszy",
  "bullish",
  "gainer",
  "plus",
  "zyski",
  "boom",
  "wzrost",
  "przychód",
];

const negativeWords = [
  "spadek",
  "strata",
  "negatywny",
  "zły",
  "złe",
  "opadnie",
  "krach",
  "kryzys",
  "bankructwo",
  "zagrożenie",
  "ryzyko",
  "błędy",
  "najgorszy",
  "bearish",
  "loser",
  "minus",
  "straty",
  "kryzys",
  "spada",
  "panika",
];

/**
 * POST /api/sentiment
 * Analiza sentymentu tekstu
 * Zwraca: { sentiment: "positive" | "neutral" | "negative", score: -1 to 1 }
 */
export async function POST(request: NextRequest) {
  try {
    const { text, language = "pl" } = await request.json();

    if (!text || text.length < 10) {
      return NextResponse.json(
        { error: "Text too short for sentiment analysis" },
        { status: 400 }
      );
    }

    const sentiment = analyzeSentiment(text.toLowerCase());

    return NextResponse.json(sentiment);
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze sentiment" },
      { status: 500 }
    );
  }
}

function analyzeSentiment(text: string): {
  sentiment: "positive" | "neutral" | "negative";
  score: number;
  confidence: number;
} {
  let positiveCount = 0;
  let negativeCount = 0;

  // Liczenie pozytywnych i negatywnych słów
  positiveWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const matches = text.match(regex);
    positiveCount += matches ? matches.length : 0;
  });

  negativeWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const matches = text.match(regex);
    negativeCount += matches ? matches.length : 0;
  });

  // Obliczenie wyniku
  const totalWords = positiveCount + negativeCount;
  let score = 0;

  if (totalWords > 0) {
    score = (positiveCount - negativeCount) / totalWords;
  }

  // Klasyfikacja sentymentu
  let sentiment: "positive" | "neutral" | "negative";
  if (score > 0.1) {
    sentiment = "positive";
  } else if (score < -0.1) {
    sentiment = "negative";
  } else {
    sentiment = "neutral";
  }

  // Ufność (confidence)
  const confidence = Math.min(Math.abs(score) * 2, 1);

  return {
    sentiment,
    score: Math.round(score * 100) / 100,
    confidence: Math.round(confidence * 100),
  };
}
