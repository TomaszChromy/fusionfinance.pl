import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WIG20 - Indeks GPW, notowania, skład, analiza | FusionFinance.pl",
  description: "WIG20 - główny indeks Giełdy Papierów Wartościowych w Warszawie. Aktualne notowania, skład indeksu, największe spółki i analiza.",
  keywords: ["WIG20", "GPW", "giełda", "indeks", "akcje", "Warszawa", "notowania", "PKO", "Orlen", "KGHM"],
  openGraph: {
    title: "WIG20 - Indeks GPW | FusionFinance.pl",
    description: "Główny indeks Giełdy Papierów Wartościowych w Warszawie.",
  },
  alternates: { canonical: "https://fusionfinance.pl/gielda/wig20/" },
};

export default function Wig20Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

