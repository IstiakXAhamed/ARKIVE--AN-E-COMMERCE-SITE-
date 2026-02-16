import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch all settings (public for basic, full for admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const full = searchParams.get("full") === "true";
    
    // Check auth for full settings
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN";
    
    if (full && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.siteSetting.findMany({
      where: full ? undefined : {
        group: {
          in: ["general", "contact", "social", "shipping", "pwa", "system"]
        }
      },
      orderBy: { group: "asc" }
    });

    // Convert to key-value object
    const settingsObj: Record<string, string> = {};
    settings.forEach((s) => {
      settingsObj[s.key] = s.value;
    });

    return NextResponse.json({ settings: settingsObj });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PUT - Update settings (admin only)
export async function PUT(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (user?.role !== "ADMIN" && user?.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { key, value, group = "general", type = "string", label } = body;

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    // Upsert the setting
    await prisma.siteSetting.upsert({
      where: { key },
      create: {
        key,
        value: String(value),
        type,
        group,
        label: label || key,
      },
      update: {
        value: String(value),
        type,
        group,
        label: label || key,
      },
    });

    return NextResponse.json({ success: true, key, value });
  } catch (error) {
    console.error("Error updating setting:", error);
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
}

// POST - Batch update settings
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (user?.role !== "ADMIN" && user?.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Invalid settings object" }, { status: 400 });
    }

    // Update multiple settings
    const updates = Object.entries(settings).map(async ([key, value]) => {
      if (value === undefined || value === null) return;
      
      let type = "string";
      let group = "general";
      
      // Determine type and group based on key
      if (key.includes("Threshold") || key.includes("Cost")) {
        type = "number";
      } else if (key.includes("Enabled") || key.includes("ShowOnce")) {
        type = "boolean";
      } else if (key === "siteName" || key === "siteDescription") {
        group = "general";
      } else if (key === "contactEmail" || key === "contactPhone" || key === "contactAddress") {
        group = "contact";
      } else if (key.includes("Url")) {
        group = "social";
      } else if (key.includes("pwa") || key.includes("mobile") || key.includes("Mobile")) {
        group = "pwa";
      } else if (key.includes("popup")) {
        group = "popup";
      }

      await prisma.siteSetting.upsert({
        where: { key },
        create: {
          key,
          value: String(value),
          type,
          group,
          label: key,
        },
        update: {
          value: String(value),
          type,
          group,
          label: key,
        },
      });
    });

    await Promise.all(updates);

    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
