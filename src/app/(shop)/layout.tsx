import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { SilkChat } from "@/components/store/SilkChat";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { MobileBottomBar } from "@/components/pwa/MobileBottomBar";
import { MobileAppBannerWrapper } from "@/components/pwa/MobileAppBannerWrapper";
import { isMaintenanceMode } from "@/lib/maintenance";
import { MaintenanceScreen } from "@/components/layout/MaintenanceScreen";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const maintenance = await isMaintenanceMode();

  if (maintenance) {
    return <MaintenanceScreen />;
  }

  return (
    <AuthProvider>
      <Header />
      <main className="min-h-screen pb-16 lg:pb-0">{children}</main>
      <Footer />
      <MobileAppBannerWrapper />
      <SilkChat />
      <PWAInstallPrompt />
      <MobileBottomBar />
    </AuthProvider>
  );
}
