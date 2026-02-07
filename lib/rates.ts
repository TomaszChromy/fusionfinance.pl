type RateMap = Record<string, number>;

const RATE_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

let cachedRates: { data: RateMap; fetchedAt: string; source: string; timestamp: number } | null = null;

const withTimeout = async <T>(promise: Promise<T>, ms: number): Promise<T> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), ms)
  );
  return Promise.race([promise, timeout]);
};

const fetchFromNBP = async (): Promise<{ rates: RateMap; fetchedAt: string }> => {
  const response = await withTimeout(
    fetch("https://api.nbp.pl/api/exchangerates/tables/A/?format=json", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    }),
    5_000
  );
  if (!response.ok) throw new Error(`NBP status ${response.status}`);
  const data = await response.json();
  const table = data?.[0];
  const fetchedAt = table?.effectiveDate || new Date().toISOString();
  const rates: RateMap = {};
  for (const rate of table?.rates || []) {
    rates[rate.code] = rate.mid;
  }
  return { rates, fetchedAt };
};

const fetchFromFallback = async (): Promise<{ rates: RateMap; fetchedAt: string }> => {
  const response = await withTimeout(
    fetch("https://api.exchangerate.host/latest?base=PLN", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    }),
    5_000
  );
  if (!response.ok) throw new Error(`fallback status ${response.status}`);
  const data = await response.json();
  const fetchedAt = data?.date || new Date().toISOString();
  const rates: RateMap = {};
  for (const [code, value] of Object.entries<number>(data.rates || {})) {
    rates[code] = 1 / value; // base PLN -> convert to foreign/base PLN
  }
  return { rates, fetchedAt };
};

export async function getPlnRates(): Promise<{
  rates: RateMap;
  fetchedAt: string;
  source: string;
}> {
  const now = Date.now();
  if (cachedRates && now - cachedRates.timestamp < RATE_CACHE_TTL_MS) {
    return {
      rates: cachedRates.data,
      fetchedAt: cachedRates.fetchedAt,
      source: cachedRates.source,
    };
  }

  try {
    const { rates, fetchedAt } = await fetchFromNBP();
    cachedRates = {
      data: rates,
      fetchedAt,
      source: "nbp",
      timestamp: now,
    };
    return { rates, fetchedAt, source: "nbp" };
  } catch (err) {
    console.warn("[rates] NBP failed, using fallback:", err);
  }

  const { rates, fetchedAt } = await fetchFromFallback();
  cachedRates = {
    data: rates,
    fetchedAt,
    source: "fallback",
    timestamp: now,
  };
  return { rates, fetchedAt, source: "fallback" };
}
