"use client";

import { MobileAppBanner } from "@/components/pwa/MobileAppBanner";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function MobileAppBannerWrapper() {
  const { settings, isLoading } = useSiteSettings();
  
  if (isLoading) return null;
  
  return (
    <MobileAppBanner
      showBanner={settings.mobileBannerEnabled}
      bannerText={settings.mobileBannerText}
      bannerButtonText={settings.mobileBannerButtonText}
    />
  );
}
