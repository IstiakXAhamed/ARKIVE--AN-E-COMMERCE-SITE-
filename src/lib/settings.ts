import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
  try {
    // Get or create default settings
    let settings = await prisma.storeSettings.findUnique({
      where: { id: "main" },
    });

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          id: "main",
          storeName: "ARKIVE",
          currency: "BDT",
          aiEnabled: true,
          aiModel: "gemini-2.0-flash",
        },
      });
    }

    return settings;
  } catch (error) {
    console.error("getSiteSettings error:", error);
    // Return defaults if DB fails
    return {
      storeName: "ARKIVE",
      storeEmail: "support@arkive.com",
      storePhone: "+880 1234 567890",
      currency: "BDT",
      aiEnabled: true,
      aiModel: "gemini-2.0-flash",
    };
  }
}
