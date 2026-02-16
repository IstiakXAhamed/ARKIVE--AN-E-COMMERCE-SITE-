"use client";

import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface AnnouncementBarProps {
  message?: string;
  link?: string;
  enabled?: boolean;
}

export function AnnouncementBar({ 
  message = "Free Shipping on Orders Over 3000 Tk!", 
  link = "/shop",
  enabled = true 
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem("announcement-dismissed");
    if (enabled && !isDismissed) {
      setIsVisible(true);
    }
  }, [enabled]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("announcement-dismissed", "true");
  };

  if (!enabled) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 text-white relative z-50 overflow-hidden"
        >
          <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 relative text-xs md:text-sm font-medium">
            <Sparkles size={14} className="text-yellow-400 shrink-0 animate-pulse" />
            
            {link ? (
              <Link href={link} className="hover:underline decoration-white/50 underline-offset-2 flex-1 text-center truncate">
                {message}
              </Link>
            ) : (
              <span className="flex-1 text-center truncate">{message}</span>
            )}
            
            <button 
              onClick={handleDismiss}
              className="absolute right-4 p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Dismiss announcement"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
