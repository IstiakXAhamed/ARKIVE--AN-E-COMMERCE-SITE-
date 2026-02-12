import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/admin/customers - List customers
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = { role: "CUSTOMER" };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
          orders: { select: { id: true, total: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      customers: customers.map((c) => ({
        id: c.id,
        name: c.name || "Unknown",
        email: c.email,
        role: c.role,
        avatar: c.name?.[0] || c.email?.[0] || "U",
        orders: c.orders.length,
        spent: c.orders.reduce((sum, o) => sum + Number(o.total), 0),
        joined: c.createdAt.toISOString().split("T")[0],
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET customers error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
