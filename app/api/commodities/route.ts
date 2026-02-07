import { NextResponse } from "next/server";

type Commodity = {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  source: string;
};

const FALLBACK: Commodity[] = [
  { symbol: "XAU", name: "Złoto (oz)", price: 2145.2, changePercent: 0.35, source: "Fallback" },
  { symbol: "XAG", name: "Srebro (oz)", price: 25.4, changePercent: -0.42, source: "Fallback" },
  { symbol: "BRN", name: "Ropa Brent", price: 82.3, changePercent: -0.78, source: "Fallback" },
  { symbol: "WTI", name: "Ropa WTI", price: 78.9, changePercent: -0.65, source: "Fallback" },
  { symbol: "HG", name: "Miedź (lb)", price: 3.86, changePercent: 1.22, source: "Fallback" },
];

export async function GET() {
  const items: Commodity[] = [...FALLBACK];

  // Złoto z NBP (jeśli dostępne)
  try {
    const res = await fetch("https://api.nbp.pl/api/cenyzlota/last/1?format=json", { next: { revalidate: 300 } });
    if (res.ok) {
      const data = await res.json();
      const price = data?.[0]?.cena;
      if (typeof price === "number") {
        items[0] = {
          symbol: "XAU",
          name: "Złoto (oz)",
          price,
          changePercent: 0,
          source: "NBP",
        };
      }
    }
  } catch {
    // silent fallback
  }

  // Metale szlachetne (metals.live)
  try {
    const res = await fetch("https://api.metals.live/v1/spot", { next: { revalidate: 300 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        for (const entry of data) {
          const [name, price] = Array.isArray(entry) ? entry : [];
          if (typeof name === "string" && typeof price === "number") {
            const upper = name.toString().toUpperCase();
            if (upper === "GOLD") {
              items[0] = { symbol: "XAU", name: "Złoto (oz)", price, changePercent: 0, source: "metals.live" };
            }
            if (upper === "SILVER") {
              items[1] = { symbol: "XAG", name: "Srebro (oz)", price, changePercent: 0, source: "metals.live" };
            }
            if (upper === "COPPER") {
              items[4] = { symbol: "HG", name: "Miedź (lb)", price, changePercent: 0, source: "metals.live" };
            }
          }
        }
      }
    }
  } catch {
    // fallback
  }

  // Ropa (energy feed z metals.live)
  try {
    const res = await fetch("https://api.metals.live/v1/energy", { next: { revalidate: 300 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        for (const entry of data) {
          const [name, price] = Array.isArray(entry) ? entry : [];
          if (typeof name === "string" && typeof price === "number") {
            const upper = name.toUpperCase();
            if (upper.includes("BRENT")) {
              items[2] = { symbol: "BRN", name: "Ropa Brent", price, changePercent: 0, source: "metals.live" };
            }
            if (upper.includes("WTI")) {
              items[3] = { symbol: "WTI", name: "Ropa WTI", price, changePercent: 0, source: "metals.live" };
            }
          }
        }
      }
    }
  } catch {
    // fallback
  }

  return NextResponse.json({ items });
}
