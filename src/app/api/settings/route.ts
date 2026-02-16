import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: [
            "mobileBannerEnabled",
            "mobileBannerDelay",
            "announcementEnabled",
            "maintenanceMode",
            "pwaEnabled"
          ]
        }
      }
    });

    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({ settings: settingsMap });
  } catch (error) {
    console.error("Failed to fetch public settings:", error);
    return NextResponse.json({ settings: {} }, { status: 500 });
  }
}
