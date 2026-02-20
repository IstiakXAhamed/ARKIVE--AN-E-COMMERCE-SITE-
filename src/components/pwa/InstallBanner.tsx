"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Check if banner was recently dismissed
      const dismissed = localStorage.getItem("pwa-banner-dismissed")
      const dismissedTime = dismissed ? parseInt(dismissed) : 0
      const oneDay = 24 * 60 * 60 * 1000
      
      if (Date.now() - dismissedTime > oneDay) {
        setIsVisible(true)
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setIsVisible(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem("pwa-banner-dismissed", Date.now().toString())
  }

  if (!isVisible || isInstalled) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-white rounded-lg shadow-lg border p-4 lg:hidden">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-emerald-100 rounded-lg shrink-0">
          <Download className="h-5 w-5 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">Install Arkive App</h4>
          <p className="text-sm text-gray-500 mt-1">
            Add to your home screen for a better shopping experience
          </p>
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm" 
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleInstall}
            >
              Install
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleDismiss}
            >
              Not Now
            </Button>
          </div>
        </div>
        <button 
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
