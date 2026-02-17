import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, { status: string; value?: string }> = {};

  // Database
  checks["DATABASE_URL"] = {
    status: process.env.DATABASE_URL ? "✅ SET" : "❌ MISSING",
  };

  // Auth
  checks["AUTH_SECRET"] = {
    status: process.env.AUTH_SECRET ? "✅ SET" : "❌ MISSING",
  };
  checks["NEXTAUTH_SECRET"] = {
    status: process.env.NEXTAUTH_SECRET ? "✅ SET" : "❌ MISSING",
  };
  checks["NEXTAUTH_URL"] = {
    status: process.env.NEXTAUTH_URL ? "✅ SET" : "❌ MISSING",
    value: process.env.NEXTAUTH_URL || "",
  };
  checks["AUTH_URL"] = {
    status: process.env.AUTH_URL ? "✅ SET" : "❌ MISSING",
    value: process.env.AUTH_URL || "",
  };

  // Google Auth
  checks["AUTH_GOOGLE_ID"] = {
    status: process.env.AUTH_GOOGLE_ID ? "✅ SET" : "❌ MISSING",
  };
  checks["AUTH_GOOGLE_SECRET"] = {
    status: process.env.AUTH_GOOGLE_SECRET ? "✅ SET" : "❌ MISSING",
  };

  // AI
  checks["GOOGLE_AI_API_KEY"] = {
    status: process.env.GOOGLE_AI_API_KEY ? "✅ SET" : "❌ MISSING",
    value: process.env.GOOGLE_AI_API_KEY
      ? `${process.env.GOOGLE_AI_API_KEY.substring(0, 10)}...`
      : "",
  };

  // Cloudinary
  checks["CLOUDINARY_CLOUD_NAME"] = {
    status: process.env.CLOUDINARY_CLOUD_NAME ? "✅ SET" : "❌ MISSING",
    value: process.env.CLOUDINARY_CLOUD_NAME || "",
  };
  checks["CLOUDINARY_API_KEY"] = {
    status: process.env.CLOUDINARY_API_KEY ? "✅ SET" : "❌ MISSING",
  };
  checks["CLOUDINARY_API_SECRET"] = {
    status: process.env.CLOUDINARY_API_SECRET ? "✅ SET" : "❌ MISSING",
  };

  // App URLs
  checks["NEXT_PUBLIC_APP_URL"] = {
    status: process.env.NEXT_PUBLIC_APP_URL ? "✅ SET" : "❌ MISSING",
    value: process.env.NEXT_PUBLIC_APP_URL || "",
  };

  // Count issues
  const missing = Object.values(checks).filter((c) => c.status.includes("MISSING")).length;

  return NextResponse.json({
    healthy: missing === 0,
    missing_count: missing,
    checks,
    node_env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
