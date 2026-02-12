import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { SilkChat } from "@/components/store/SilkChat";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { MobileBottomBar } from "@/components/pwa/MobileBottomBar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Header />
      <main className="min-h-screen pb-16 lg:pb-0">{children}</main>
      <Footer />
      <SilkChat />
      <PWAInstallPrompt />
      <MobileBottomBar />
    </AuthProvider>
  );
}
