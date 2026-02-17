"use client";

import { useState, useEffect } from "react";
import { X, Smartphone, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function MobileAppBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [settings, setSettings] = useState<{ enabled: boolean; delay: number }>({ enabled: true, delay: 3000 });

  useEffect(() => {
    // Fetch settings
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        const enabled = data.settings?.mobileBannerEnabled !== "false"; // Default true
        const delay = parseInt(data.settings?.mobileBannerDelay || "3000", 10);
        setSettings({ enabled, delay });
      })
      .catch(err => console.error("Failed to load banner settings", err));

    // Check if mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
        setIsMobile(true);
      }
    };

    checkMobile();
  }, []);

  useEffect(() => {
    if (!isMobile || !settings.enabled) return;

    // Check if dismissed previously
    const dismissedAt = localStorage.getItem("app-banner-dismissed");
    if (dismissedAt) {
      const diff = Date.now() - parseInt(dismissedAt, 10);
      // Show again after 24 hours (86400000 ms)
      if (diff > 86400000) {
        const timer = setTimeout(() => setIsVisible(true), settings.delay);
        return () => clearTimeout(timer);
      }
    } else {
      const timer = setTimeout(() => setIsVisible(true), settings.delay);
      return () => clearTimeout(timer);
    }
  }, [isMobile, settings]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("app-banner-dismissed", Date.now().toString());
  };

  const handleInstall = () => {
    // Logic for PWA install or redirect to App Store
    console.log("Install app clicked");
  };

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-4 right-4 z-50 md:hidden"
        >
          <div className="bg-surface-900/90 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl border border-white/10 flex items-center gap-4 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 pointer-events-none" />
            
            <button 
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-white/60 hover:text-white"
            >
              <X size={16} />
            </button>

            <div className="bg-white/10 p-3 rounded-lg">
              <Smartphone size={24} className="text-primary-300" />
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-sm">Get the App</h3>
              <p className="text-xs text-white/70">Shop faster & easier</p>
            </div>

            <Button 
              size="sm" 
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-lg shadow-primary-500/30"
              onClick={handleInstall}
            >
              <Download size={14} className="mr-1" />
              Install
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
