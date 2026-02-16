import { NextRequest, NextResponse } from "next/server";
import { logSystemAction } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

/**
 * Health Check API Endpoint
 * 
 * Purpose: Verify the API routing layer and database connectivity
 * 
 * Endpoint: GET/POST /api/health
 * Response: 200 OK with JSON status including database connectivity
 * 
 * Use cases:
 * - Server uptime monitoring
 * - Load balancer health checks
 * - API and database connectivity verification
 * - Logging health checks to system logs
 */

/**
 * Check database connectivity using a simple SELECT 1 query
 */
async function checkDatabaseConnectivity(): Promise<"connected" | "disconnected"> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return "connected";
  } catch (error) {
    return "disconnected";
  }
}

export async function GET(request: NextRequest) {
  // Check database connectivity (non-blocking)
  const database = await checkDatabaseConnectivity();

  // Log health check (non-blocking - fire and forget)
  logSystemAction({
    action: "HEALTH_CHECK",
    message: "Health check endpoint accessed",
    level: "INFO",
    metadata: {
      method: "GET",
      path: "/api/health",
      database,
    },
  }).catch(() => {
    // Silently fail if logging fails - don't affect health endpoint
  });

  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      database,
    },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  // Allow POST for compatibility with various health check systems
  
  // Check database connectivity (non-blocking)
  const database = await checkDatabaseConnectivity();

  // Log health check (non-blocking - fire and forget)
  logSystemAction({
    action: "HEALTH_CHECK",
    message: "Health check endpoint accessed",
    level: "INFO",
    metadata: {
      method: "POST",
      path: "/api/health",
      database,
    },
  }).catch(() => {
    // Silently fail if logging fails - don't affect health endpoint
  });

  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      database,
    },
    { status: 200 }
  );
}
