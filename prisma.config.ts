// FusionFinance.pl - Prisma Config
import "dotenv/config";
import { defineConfig } from "prisma/config";
import { env } from "./lib/env";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env.databaseUrl || "postgresql://localhost:5432/fusionfinance",
  },
});
