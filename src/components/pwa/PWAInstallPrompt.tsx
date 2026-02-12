"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(standalone);
    if (standalone) return;

    // Check if user dismissed before
    const dismissed = localStorage.getItem("arkive-pwa-dismissed");
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      // Show again after 7 days
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Delay showing to not interrupt initial experience
      setTimeout(() => setShow(true), 5000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("arkive-pwa-dismissed", String(Date.now()));
  };

  if (isStandalone || !show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-40"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400"
          >
            <X size={16} />
          </button>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shrink-0">
              <Download size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Install ARKIVE</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Add ARKIVE to your home screen for a faster, app-like shopping experience.
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleDismiss}
              className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Not now
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 px-3 py-2 text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Install App
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
