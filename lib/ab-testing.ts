/**
 * A/B Testing utility
 * Prosty system testów A/B oparty na cookies/localStorage
 */

export interface ABExperiment {
  id: string;
  name: string;
  variants: string[];
  weights?: number[]; // Opcjonalne wagi dla każdego wariantu
}

const EXPERIMENTS: ABExperiment[] = [
  {
    id: "hero_cta",
    name: "Hero Call-to-Action",
    variants: ["Rozpocznij teraz", "Dołącz za darmo", "Sprawdź bezpłatnie"],
  },
  {
    id: "pricing_layout",
    name: "Pricing Layout",
    variants: ["cards", "table"],
  },
];

export function getExperiments(): ABExperiment[] {
  return EXPERIMENTS;
}

export function getExperiment(id: string): ABExperiment | undefined {
  return EXPERIMENTS.find((e) => e.id === id);
}

/**
 * Pobiera wariant dla użytkownika (deterministycznie na podstawie userId/sessionId)
 */
export function getVariant(experimentId: string, userId?: string): string {
  const experiment = getExperiment(experimentId);
  if (!experiment) return "";

  // Jeśli brak userId, losuj
  const seed = userId || Math.random().toString();
  const hash = hashString(seed + experimentId);
  const index = hash % experiment.variants.length;

  return experiment.variants[index];
}

/**
 * Prosta funkcja hash dla determinizmu
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Hook do użycia w komponentach React
 */
export function useABTest(experimentId: string, userId?: string): string {
  if (typeof window === "undefined") {
    return getVariant(experimentId, userId);
  }

  // Sprawdź localStorage
  const storageKey = `ab_${experimentId}`;
  const stored = localStorage.getItem(storageKey);

  if (stored) {
    return stored;
  }

  // Przypisz wariant i zapisz
  const variant = getVariant(experimentId, userId);
  localStorage.setItem(storageKey, variant);

  return variant;
}

/**
 * Śledź konwersję dla eksperymentu
 */
export async function trackConversion(experimentId: string, variant: string): Promise<void> {
  try {
    await fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "ab_conversion",
        eventData: { experimentId, variant },
      }),
    });
  } catch (error) {
    console.error("Failed to track AB conversion:", error);
  }
}
