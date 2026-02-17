import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.heroGridItem.findMany({
      orderBy: { position: "asc" },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET hero items error:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { position, title, subtitle, imageUrl, link } = body;

    if (!position) {
      return NextResponse.json({ error: "Position is required" }, { status: 400 });
    }

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const item = await prisma.heroGridItem.upsert({
      where: { position },
      update: {
        title: title.trim(),
        subtitle: subtitle?.trim() || null,
        imageUrl: imageUrl?.trim() || "",
        link: link?.trim() || "#",
      },
      create: {
        position,
        title: title.trim(),
        subtitle: subtitle?.trim() || null,
        imageUrl: imageUrl?.trim() || "",
        link: link?.trim() || "#",
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("PUT hero item error:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}
