import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.FUSION_OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Jesteś FinBotem, asystentem finansowym na stronie FusionFinance.pl.
Odpowiadasz krótko, konkretnie, po polsku.
Pomagasz w kwestiach finansowych, giełdowych, kryptowalut i ekonomii.
NIE dajesz konkretnych rekomendacji inwestycyjnych - tylko informacje edukacyjne.`;

export async function POST(req: Request) {
  try {
    console.log(
      "[FinBot] OpenAI key prefix:",
      process.env.FUSION_OPENAI_API_KEY?.slice(0, 15)
    );

    if (!process.env.FUSION_OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Brak FUSION_OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body || typeof body.message !== "string" || !body.message.trim()) {
      return NextResponse.json(
        { error: "Brak pola 'message' w body" },
        { status: 400 }
      );
    }

    const userMessage = body.message.trim();

    // Klasyczne API chat completions
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content?.trim()
      || "Przepraszam, nie udało się przetworzyć odpowiedzi.";

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("[/api/ai/chat] error:", error);

    // Szczegółowy błąd dla debugowania
    const errorMessage = error?.message || "Unknown error";
    const errorCode = error?.code || error?.status || 500;

    return NextResponse.json(
      { error: `FinBot error: ${errorMessage}` },
      { status: typeof errorCode === 'number' ? errorCode : 500 }
    );
  }
}

