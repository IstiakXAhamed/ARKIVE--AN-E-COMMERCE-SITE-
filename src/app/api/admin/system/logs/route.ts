import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const level = searchParams.get("level"); // Optional filter by log level
    const action = searchParams.get("action"); // Optional filter by action

    // Validate pagination parameters
    const validPage = Math.max(1, page);
    const validLimit = Math.min(100, Math.max(1, limit)); // Cap at 100 per page
    const skip = (validPage - 1) * validLimit;

    // Build filter conditions
    const where: any = {};
    if (level) where.level = level;
    if (action) where.action = { contains: action };

    // Fetch logs with pagination
    const [logs, total] = await Promise.all([
      prisma.systemLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: validLimit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.systemLog.count({ where }),
    ]);

    const totalPages = Math.ceil(total / validLimit);

    return NextResponse.json({
      logs,
      pagination: {
        page: validPage,
        limit: validLimit,
        total,
        totalPages,
        hasMore: validPage < totalPages,
      },
    });
  } catch (error) {
    console.error("GET system logs error:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
