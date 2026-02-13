import { PrismaClient } from "../../prisma/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Detect environment
const isProduction = process.env.NODE_ENV === "production";

export const prisma = (() => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const baseUrl = process.env.DATABASE_URL || "";
  
  // MariaDB adapter requires mariadb:// protocol, convert from mysql:// if needed
  let dbUrl = baseUrl;
  if (dbUrl.startsWith("mysql://")) {
    dbUrl = "mariadb://" + dbUrl.slice(8); // replace mysql:// with mariadb://
  }
  
  // Use MariaDB adapter for driver-based connection
  const adapter = new PrismaMariaDb(dbUrl);

  const client = new PrismaClient({
    adapter,
    log: isProduction ? ["error"] : ["query", "error", "warn"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
})();
