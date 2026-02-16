"use client";

import { useState, useEffect } from "react";

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  freeShippingThreshold: number;
  shippingCost: number;
  pwaEnabled: boolean;
  mobileBannerEnabled: boolean;
  mobileBannerText: string;
  mobileBannerButtonText: string;
  mobileBannerDelay: number;
  popupEnabled: boolean;
  popupContent: string;
  popupDelay: number;
  popupShowOnce: boolean;
}

const defaultSettings: SiteSettings = {
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

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setSettings({ ...defaultSettings, ...data.settings });
          }
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, isLoading, setSettings };
}
