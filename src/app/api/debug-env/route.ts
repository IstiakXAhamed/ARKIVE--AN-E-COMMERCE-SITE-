import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const envStatus = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    cwd: process.cwd(),
  };

  return NextResponse.json(envStatus);
}
