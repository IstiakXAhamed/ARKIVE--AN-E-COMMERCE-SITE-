import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Detect environment
const isProduction = process.env.NODE_ENV === "production";

export const prisma = (() => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  // Environment-aware connection configuration
  const connectionParams = isProduction 
    ? "?connection_limit=1&pool_timeout=5"
    : "?connection_limit=5&pool_timeout=10";

  const baseUrl = process.env.DATABASE_URL || "";
  // Ensure we don't duplicate query params if they already exist
  const separator = baseUrl.includes("?") ? "&" : "";
  const finalUrl = `${baseUrl}${separator}${connectionParams.replace("?", "")}`;

  const client = new PrismaClient({
    datasources: {
      db: {
        url: finalUrl,
      },
    },
    // Log queries in dev, only errors in prod
    log: isProduction ? ["error"] : ["query", "error", "warn"],
  });

  if (!isProduction) {
    globalForPrisma.prisma = client;
  }

  return client;
})();
