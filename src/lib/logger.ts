import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { headers } from "next/headers";

type LogLevel = "INFO" | "WARN" | "ERROR" | "CRITICAL";

interface LogOptions {
  action: string;
  message: string;
  level?: LogLevel;
  metadata?: any;
  userId?: string;
}

/**
 * Log a system action to the database for the Super Console.
 * Supports different log levels: INFO, WARN, ERROR, CRITICAL
 */
export async function logSystemAction(options: LogOptions) {
  try {
    const session = await auth();
    const headersList = await headers();
    
    // Determine user ID (explicit > session > null)
    const userId = options.userId || session?.user?.id;
    
    // Get request context
    const ipAddress = headersList.get("x-forwarded-for") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    await prisma.systemLog.create({
      data: {
        action: options.action,
        message: options.message,
        level: (options.level || "INFO") as "INFO" | "WARN" | "ERROR" | "CRITICAL",
        metadata: options.metadata || {},
        userId,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    // Fallback to console if DB logging fails
    console.error("Failed to write system log:", error);
    console.error("Original log attempt:", options);
  }
}
