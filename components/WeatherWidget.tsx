"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface WeatherData {
  city: string;
  temp: number;
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "stormy";
  humidity: number;
  wind: number;
}

const WEATHER_ICONS: Record<string, string> = {
  sunny: "☀️",
  cloudy: "☁️",
  rainy: "🌧️",
  snowy: "❄️",
  stormy: "⛈️",
};

const MARKET_IMPACT: Record<string, { impact: string; sectors: string[] }> = {
  sunny: { impact: "Pozytywny", sectors: ["Turystyka", "Handel detaliczny", "Gastronomia"] },
  cloudy: { impact: "Neutralny", sectors: ["Stabilne warunki dla większości sektorów"] },
  rainy: { impact: "Mieszany", sectors: ["E-commerce ↑", "Transport ↓", "Energia ↑"] },
  snowy: { impact: "Negatywny", sectors: ["Logistyka ↓", "Budownictwo ↓", "Energia ↑"] },
  stormy: { impact: "Negatywny", sectors: ["Ubezpieczenia", "Transport", "Rolnictwo"] },
};

// Mock weather data for major financial cities
const MOCK_WEATHER: WeatherData[] = [
  { city: "Warszawa", temp: 12, condition: "cloudy", humidity: 65, wind: 15 },
  { city: "Nowy Jork", temp: 18, condition: "sunny", humidity: 45, wind: 10 },
  { city: "Londyn", temp: 14, condition: "rainy", humidity: 80, wind: 20 },
  { city: "Tokio", temp: 22, condition: "sunny", humidity: 55, wind: 8 },
  { city: "Frankfurt", temp: 11, condition: "cloudy", humidity: 70, wind: 12 },
];

interface WeatherWidgetProps {
  variant?: "default" | "compact" | "detailed";
  showMarketImpact?: boolean;
  className?: string;
}

export default function WeatherWidget({
  variant = "default",
  showMarketImpact = false,
  className = "",
}: WeatherWidgetProps) {
  const [currentCity, setCurrentCity] = useState(0);

  const weather = MOCK_WEATHER[currentCity];
  const impact = MARKET_IMPACT[weather.condition];

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <span className="text-2xl">{WEATHER_ICONS[weather.condition]}</span>
        <div>
          <span className="text-sm font-medium text-[#f4f4f5]">{weather.city}</span>
          <span className="text-sm text-[#a1a1aa] ml-2">{weather.temp}°C</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl p-5 ${className}`}>
      {/* City selector */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-none">
        {MOCK_WEATHER.map((w, i) => (
          <button
            key={w.city}
            onClick={() => setCurrentCity(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              i === currentCity
                ? "bg-[#c9a962] text-[#08090c]"
                : "bg-white/5 text-[#a1a1aa] hover:bg-white/10"
            }`}
          >
            {w.city}
          </button>
        ))}
      </div>

      {/* Weather display */}
      <motion.div
        key={currentCity}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-4">
          <span className="text-5xl">{WEATHER_ICONS[weather.condition]}</span>
          <div>
            <p className="text-3xl font-bold text-[#f4f4f5]">{weather.temp}°C</p>
            <p className="text-xs text-[#71717a] capitalize">{weather.condition}</p>
          </div>
        </div>
        <div className="text-right text-xs text-[#71717a]">
          <p>Wilgotność: {weather.humidity}%</p>
          <p>Wiatr: {weather.wind} km/h</p>
        </div>
      </motion.div>

      {/* Market impact */}
      {showMarketImpact && (
        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-[#71717a]">Wpływ na rynki:</span>
            <span className={`text-xs font-medium ${
              impact.impact === "Pozytywny" ? "text-[#4ade80]" :
              impact.impact === "Negatywny" ? "text-[#f87171]" : "text-[#fbbf24]"
            }`}>
              {impact.impact}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {impact.sectors.map((sector, i) => (
              <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-[#a1a1aa]">
                {sector}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Weather Strip - horizontal weather for multiple cities
export function WeatherStrip({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-6 overflow-x-auto scrollbar-none py-2 ${className}`}>
      {MOCK_WEATHER.map((weather) => (
        <div key={weather.city} className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-lg">{WEATHER_ICONS[weather.condition]}</span>
          <span className="text-xs text-[#a1a1aa]">{weather.city}</span>
          <span className="text-xs font-medium text-[#f4f4f5]">{weather.temp}°C</span>
        </div>
      ))}
    </div>
  );
}
