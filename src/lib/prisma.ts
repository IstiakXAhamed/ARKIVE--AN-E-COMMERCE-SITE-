import { PrismaClient } from "../../prisma/generated/prisma/client";

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

  // Workaround for "Unknown property datasources" error in Prisma 7:
  // Set the environment variable directly before instantiation.
  process.env.DATABASE_URL = finalUrl;

  const client = new PrismaClient({
    // Log queries in dev, only errors in prod
    log: isProduction ? ["error"] : ["query", "error", "warn"],
  });

  if (!isProduction) {
    globalForPrisma.prisma = client;
  }

  return client;
})();
