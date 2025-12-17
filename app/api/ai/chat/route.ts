import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const getOpenAI = () => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
};

const SYSTEM_PROMPT = `Jesteś ekspertem finansowym o imieniu FinBot. Pomagasz użytkownikom w:
- Wyjaśnianiu pojęć finansowych (akcje, obligacje, ETF, kryptowaluty, forex)
- Analizie rynków i trendów
- Podstawach inwestowania i oszczędzania
- Wyjaśnianiu wskaźników ekonomicznych (PKB, inflacja, stopy procentowe)

Zasady:
1. Odpowiadaj po polsku, krótko i rzeczowo
2. NIE dawaj konkretnych rekomendacji inwestycyjnych
3. Zawsze przypominaj o ryzyku inwestycyjnym
4. Używaj prostego języka
5. Jeśli nie wiesz - przyznaj się`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const openai = getOpenAI();
    if (!openai) {
      return NextResponse.json(
        { error: "AI service not configured", fallback: true },
        { status: 503 }
      );
    }

    const { message, history = [] } = await request.json();

    if (!message || message.length > 500) {
      return NextResponse.json(
        { error: "Message required (max 500 chars)" },
        { status: 400 }
      );
    }

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-6).map((m: ChatMessage) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content?.trim() || "Przepraszam, nie mogę teraz odpowiedzieć.";

    return NextResponse.json({
      reply,
      tokensUsed: completion.usage?.total_tokens || 0,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}

