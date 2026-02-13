import { PrismaClient } from "../../prisma/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Detect environment
const isProduction = process.env.NODE_ENV === "production";

export const prisma = (() => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  // Environment-aware connection configuration
  // cPanel needs strict limits to avoid NPROC issues
  const connectionParams = isProduction 
    ? "?connection_limit=1&pool_timeout=5"
    : "?connection_limit=5&pool_timeout=10";

  const baseUrl = process.env.DATABASE_URL || "";
  // Ensure we don't duplicate query params if they already exist
  const separator = baseUrl.includes("?") ? "&" : "";
  // Strip existing params if we are appending our own, or just append carefully?
  // Simplest is to append. If baseUrl has params, logic needs to be robust.
  // But usually DATABASE_URL is clean.
  
  // Actually, let's just use the URL as provided for now, but if it helps, we can append.
  // For MySQL/MariaDB, connection_limit is valid.
  
  const client = new PrismaClient({
    log: isProduction ? ["error"] : ["query", "error", "warn"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
})();
