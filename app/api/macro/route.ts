import { NextResponse } from "next/server";

type MacroPoint = {
  label: string;
  value: string;
  change?: string;
  source: string;
};

const FALLBACK: MacroPoint[] = [
  { label: "Stopa referencyjna NBP", value: "5,75%", change: "0 pb", source: "NBP" },
  { label: "Inflacja CPI (r/r)", value: "5,3%", change: "-0,2 pp", source: "GUS" },
  { label: "Bezrobocie", value: "5,0%", change: "-0,1 pp", source: "GUS" },
  { label: "PMI Przemysł", value: "48,7", change: "+0,4", source: "S&P Global" },
  { label: "PKB (r/r)", value: "2,3%", change: "+0,3 pp", source: "GUS" },
];

export async function GET() {
  const items: MacroPoint[] = [...FALLBACK];

  // CPI Polska (World Bank FP.CPI.TOTL.ZG)
  try {
    const res = await fetch("https://api.worldbank.org/v2/country/PL/indicator/FP.CPI.TOTL.ZG?format=json&per_page=1", {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const val = data?.[1]?.[0]?.value;
      if (typeof val === "number") {
        items[1] = {
          label: "Inflacja CPI (r/r)",
          value: `${val.toFixed(1)}%`,
          change: undefined,
          source: "World Bank",
        };
      }
    }
  } catch {
    // fallback
  }

  // PKB r/r Polska (NY.GDP.MKTP.KD.ZG)
  try {
    const res = await fetch("https://api.worldbank.org/v2/country/PL/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=1", {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const val = data?.[1]?.[0]?.value;
      if (typeof val === "number") {
        items[4] = {
          label: "PKB (r/r)",
          value: `${val.toFixed(1)}%`,
          change: undefined,
          source: "World Bank",
        };
      }
    }
  } catch {
    // fallback
  }

  // Bezrobocie (SL.UEM.TOTL.ZS)
  try {
    const res = await fetch("https://api.worldbank.org/v2/country/PL/indicator/SL.UEM.TOTL.ZS?format=json&per_page=1", {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const val = data?.[1]?.[0]?.value;
      if (typeof val === "number") {
        items[2] = {
          label: "Bezrobocie",
          value: `${val.toFixed(1)}%`,
          change: undefined,
          source: "World Bank",
        };
      }
    }
  } catch {
    // fallback
  }

  return NextResponse.json({ items });
}
