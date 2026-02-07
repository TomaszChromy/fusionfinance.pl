let cachedDevSecret: string | null = null;

const getAuthSecret = (): string => {
  const value = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (value) return value;

  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing required env variable: AUTH_SECRET. Set it in production for Auth.js.");
  }

  if (!cachedDevSecret) {
    // Non-crypto fallback for dev only; regenerate per boot to silence MissingSecret noise
    cachedDevSecret = `dev-secret-${Math.random().toString(36).slice(2)}-${Date.now()}`;
    console.warn("[env] AUTH_SECRET is not set. Using generated dev secret (do not use in production).");
  }
  return cachedDevSecret;
};

const getDatabaseUrl = (): string | undefined => {
  const value = process.env.DATABASE_URL;
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing required env variable: DATABASE_URL. Set it in production.");
  }
  console.warn("[env] DATABASE_URL not set. Some features (auth/db-backed content) will be disabled.");
  return undefined;
};

const optional = (key: string): string | undefined => {
  const value = process.env[key];
  if (!value && process.env.NODE_ENV !== "production") {
    // Helpful hint in dev; keep quiet in production logs
    console.warn(`[env] Optional variable ${key} is not set.`);
  }
  return value;
};

export const env = {
  authSecret: getAuthSecret(),
  nextauthUrl: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  databaseUrl: getDatabaseUrl(),
  googleClientId: optional("GOOGLE_CLIENT_ID"),
  googleClientSecret: optional("GOOGLE_CLIENT_SECRET"),
  stripeSecretKey: optional("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: optional("STRIPE_WEBHOOK_SECRET"),
  resendApiKey: optional("RESEND_API_KEY"),
  fusionOpenAiKey: optional("FUSION_OPENAI_API_KEY"),
  openAiKey: optional("OPENAI_API_KEY"),
  cronSecret: optional("CRON_SECRET"),
};
