import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { SilkChat } from "@/components/store/SilkChat";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { MobileBottomBar } from "@/components/pwa/MobileBottomBar";
import { MobileAppBannerWrapper } from "@/components/pwa/MobileAppBannerWrapper";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { isMaintenanceMode } from "@/lib/maintenance";
import { MaintenanceScreen } from "@/components/layout/MaintenanceScreen";
import { prisma } from "@/lib/prisma";

async function getAnnouncementSettings() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: { in: ["announcementEnabled", "announcementMessage", "announcementLink"] }
      }
    });
    
    const config = {
      enabled: settings.find(s => s.key === "announcementEnabled")?.value === "true",
      message: settings.find(s => s.key === "announcementMessage")?.value || "Welcome to ARKIVE! Free Shipping on Orders Over 3000 Tk!",
      link: settings.find(s => s.key === "announcementLink")?.value || "/shop"
    };
    
    return config;
  } catch (error) {
    return { enabled: false, message: "", link: "" };
  }
}

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const maintenance = await isMaintenanceMode();
  const announcement = await getAnnouncementSettings();

  if (maintenance) {
    return <MaintenanceScreen />;
  }

  return (
    <AuthProvider>
      <AnnouncementBar 
        enabled={announcement.enabled} 
        message={announcement.message} 
        link={announcement.link} 
      />
      <Header />
      <main className="min-h-screen pb-16 lg:pb-0">{children}</main>
      <Footer />
      <MobileAppBannerWrapper />
      <SilkChat />
      <PWAInstallPrompt />
      <MobileBottomBar />
      <MobileBottomNav />
    </AuthProvider>
  );
}
