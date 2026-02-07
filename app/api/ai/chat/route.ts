import { NextResponse } from "next/server";
import OpenAI from "openai";
import { env } from "@/lib/env";
import { auth } from "@/lib/auth";
import { hasFeatureAccess } from "@/lib/features";

const client = new OpenAI({
  apiKey: env.fusionOpenAiKey,
});

const SYSTEM_PROMPT = `Jesteś FinBotem, asystentem finansowym na stronie FusionFinance.pl.
Odpowiadasz krótko, konkretnie, po polsku.
Pomagasz w kwestiach finansowych, giełdowych, kryptowalut i ekonomii.
NIE dajesz konkretnych rekomendacji inwestycyjnych - tylko informacje edukacyjne.`;

const cache = new Map<string, { reply: string; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function POST(req: Request) {
  try {
    console.log("[FinBot] OpenAI key prefix:", env.fusionOpenAiKey?.slice(0, 15));

    if (!env.fusionOpenAiKey) {
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

    const session = await auth();
    const hasAccess = await hasFeatureAccess(session?.user?.id, "ai.chat");
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Funkcja dostępna tylko w planie PRO. Zaloguj się lub ulepsz plan." },
        { status: 402 }
      );
    }

    const now = Date.now();
    const cached = cache.get(userMessage);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({ reply: cached.reply, cached: true });
    }

    const riskyWords = ["kup", "sprzedaj", "które akcje", "jaki coin", "wejdź w", "wyjdź z", "shortuj", "longuj"];
    const lower = userMessage.toLowerCase();
    if (riskyWords.some((w) => lower.includes(w))) {
      const caution =
        "Nie mogę udzielić rekomendacji inwestycyjnej. Mogę pomóc zrozumieć ryzyko, strategie ogólne lub wskazać, na co zwracać uwagę (dywersyfikacja, profil ryzyka, horyzont czasowy).";
      cache.set(userMessage, { reply: caution, timestamp: now });
      return NextResponse.json({ reply: caution, cached: false });
    }

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

    const finalReply = `${reply}\n\nPamiętaj: to nie jest porada inwestycyjna. Oceń własny profil ryzyka.`;

    cache.set(userMessage, { reply: finalReply, timestamp: now });

    return NextResponse.json({ reply: finalReply, cached: false });

  } catch (error: unknown) {
    console.error("[/api/ai/chat] error:", error);

    // Szczegółowy błąd dla debugowania
    const errorMessage =
      typeof error === "object" && error && "message" in error
        ? String((error as { message?: unknown }).message)
        : "Unknown error";
    const statusCode =
      typeof error === "object" && error && "status" in error && typeof (error as { status?: unknown }).status === "number"
        ? (error as { status: number }).status
        : 500;

    return NextResponse.json(
      { error: `FinBot error: ${errorMessage}` },
      { status: statusCode }
    );
  }
}
