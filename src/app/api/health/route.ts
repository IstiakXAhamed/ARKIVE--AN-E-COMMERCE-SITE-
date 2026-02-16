import { NextRequest, NextResponse } from "next/server";
import { logSystemAction } from "@/lib/logger";

/**
 * Health Check API Endpoint
 * 
 * Purpose: Verify the API routing layer is functioning correctly
 * This endpoint is independent of database connections and external services
 * 
 * Endpoint: GET/POST /api/health
 * Response: 200 OK with JSON status
 * 
 * Use cases:
 * - Server uptime monitoring
 * - Load balancer health checks
 * - Basic API connectivity verification
 * - Logging health checks to system logs
 */

export async function GET(request: NextRequest) {
  // Log health check (non-blocking - fire and forget)
  logSystemAction({
    action: "HEALTH_CHECK",
    message: "Health check endpoint accessed",
    level: "INFO",
    metadata: {
      method: "GET",
      path: "/api/health",
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
    },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  // Allow POST for compatibility with various health check systems
  
  // Log health check (non-blocking - fire and forget)
  logSystemAction({
    action: "HEALTH_CHECK",
    message: "Health check endpoint accessed",
    level: "INFO",
    metadata: {
      method: "POST",
      path: "/api/health",
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
    },
    { status: 200 }
  );
}
