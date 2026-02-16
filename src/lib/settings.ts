/**
 * Site Settings - Read/Write site configuration from database
 */
import { prisma } from "@/lib/prisma";

export interface SiteSettings {
  // General
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  
  // Contact
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  
  // Social
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  
  // Shipping
  freeShippingThreshold: number;
  shippingCost: number;
  
  // PWA & Mobile
  pwaEnabled: boolean;
  mobileBannerEnabled: boolean;
  mobileBannerText: string;
  mobileBannerButtonText: string;
  mobileBannerDelay: number; // seconds
  
  // Popups
  popupEnabled: boolean;
  popupContent: string;
  popupDelay: number; // seconds
  popupShowOnce: boolean;
}

/**
 * Get all site settings as an object
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        group: {
          in: ["general", "contact", "social", "shipping", "pwa", "popup"]
        }
      }
    });
    
    // Convert array to object
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    
    // Return with defaults
    return {
      siteName: settingsMap.siteName || "ARKIVE",
      siteDescription: settingsMap.siteDescription || "Your premier destination for elegant jewelry and accessories in Bangladesh",
      logo: settingsMap.logo || "",
      favicon: settingsMap.favicon || "",
      contactEmail: settingsMap.contactEmail || "contact@arkive.com.bd",
      contactPhone: settingsMap.contactPhone || "+880 1339-705214",
      contactAddress: settingsMap.contactAddress || "Bangladesh",
      facebookUrl: settingsMap.facebookUrl || "https://facebook.com/ARKIVE",
      instagramUrl: settingsMap.instagramUrl || "https://instagram.com/arkive_shop_bd",
      twitterUrl: settingsMap.twitterUrl || "",
      freeShippingThreshold: parseFloat(settingsMap.freeShippingThreshold) || 3000,
      shippingCost: parseFloat(settingsMap.shippingCost) || 120,
      pwaEnabled: settingsMap.pwaEnabled !== "false",
      mobileBannerEnabled: settingsMap.mobileBannerEnabled !== "false",
      mobileBannerText: settingsMap.mobileBannerText || "Get the ARKIVE App for a better experience!",
      mobileBannerButtonText: settingsMap.mobileBannerButtonText || "Download App",
      mobileBannerDelay: parseInt(settingsMap.mobileBannerDelay) || 3,
      popupEnabled: settingsMap.popupEnabled === "true",
      popupContent: settingsMap.popupContent || "",
      popupDelay: parseInt(settingsMap.popupDelay) || 5,
      popupShowOnce: settingsMap.popupShowOnce !== "false",
    };
  } catch (error) {
    console.error("Error fetching site settings:", error);
    // Return defaults on error
    return getDefaultSettings();
  }
}

/**
 * Get default settings
 */
function getDefaultSettings(): SiteSettings {
  return {
    siteName: "ARKIVE",
    siteDescription: "Your premier destination for elegant jewelry and accessories in Bangladesh",
    logo: "",
    favicon: "",
    contactEmail: "contact@arkive.com.bd",
    contactPhone: "+880 1339-705214",
    contactAddress: "Bangladesh",
    facebookUrl: "https://facebook.com/ARKIVE",
    instagramUrl: "https://instagram.com/arkive_shop_bd",
    twitterUrl: "",
    freeShippingThreshold: 3000,
    shippingCost: 120,
    pwaEnabled: true,
    mobileBannerEnabled: true,
    mobileBannerText: "Get the ARKIVE App for a better experience!",
    mobileBannerButtonText: "Download App",
    mobileBannerDelay: 3,
    popupEnabled: false,
    popupContent: "",
    popupDelay: 5,
    popupShowOnce: true,
  };
}

/**
 * Update a single site setting
 */
export async function updateSiteSetting(
  key: string,
  value: string,
  type: string = "string",
  group: string = "general",
  label?: string
): Promise<boolean> {
  try {
    await prisma.siteSetting.upsert({
      where: { key },
      create: {
        key,
        value,
        type,
        group,
        label: label || key,
      },
      update: {
        value,
        type,
        group,
        label: label || key,
      },
    });
    return true;
  } catch (error) {
    console.error("Error updating site setting:", error);
    return false;
  }
}

/**
 * Update multiple site settings at once
 */
export async function updateSiteSettings(
  settings: Partial<SiteSettings>
): Promise<boolean> {
  try {
    const updates = Object.entries(settings).map(([key, value]) => {
      if (value === undefined || value === null) return null;
      
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
      
      return updateSiteSetting(key, String(value), type, group);
    });
    
    await Promise.all(updates.filter(Boolean));
    return true;
  } catch (error) {
    console.error("Error updating site settings:", error);
    return false;
  }
}
