import { prisma } from "@/lib/prisma";

export async function isMaintenanceMode(): Promise<boolean> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "maintenanceMode" }
    });
    return setting?.value === "true";
  } catch (error) {
    console.error("Failed to check maintenance mode:", error);
    return false; // Default to available on error
  }
}
