"use client";

import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";

interface MobileAppBannerProps {
  // Settings from database (passed from server)
  showBanner?: boolean;
  bannerText?: string;
  bannerButtonText?: string;
}

export function MobileAppBanner({
  showBanner = true,
  bannerText = "Get the ARKIVE App for a better experience!",
  bannerButtonText = "Download App",
}: MobileAppBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Listen for PWA install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    // Check if dismissed before
    const wasDismissed = localStorage.getItem("mobileAppBannerDismissed");
    if (wasDismissed) {
      const dismissedAt = parseInt(localStorage.getItem("bannerDismissedAt") || "0", 10);
      // Show again after 7 days
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
      }
    }
  }, []);

  useEffect(() => {
    // Show banner after a delay if conditions are met
    if (isMobile && showBanner && !isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Show after 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isMobile, showBanner, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("mobileAppBannerDismissed", "true");
      localStorage.setItem("bannerDismissedAt", Date.now().toString());
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    }
  };

  // Don't render if not mobile or banner is disabled
  if (!isMobile || !showBanner || isDismissed) {
    return null;
  }

  return (
    <>
      {/* Backdrop when visible */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleDismiss}
      />
      
      {/* Banner */}
      <div 
        className={`fixed bottom-16 left-2 right-2 md:left-4 md:right-4 z-50 transition-all duration-300 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center gap-3 p-3">
            {/* App Icon */}
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            
            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm line-clamp-2">
                {bannerText}
              </p>
              <p className="text-emerald-100 text-xs mt-0.5">
                Free to download • Works offline
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 bg-white text-emerald-700 px-3 py-2 rounded-lg font-semibold text-sm hover:bg-emerald-50 transition-colors"
              >
                <Download size={14} />
                {bannerButtonText}
              </button>
              
              <button
                onClick={handleDismiss}
                className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
