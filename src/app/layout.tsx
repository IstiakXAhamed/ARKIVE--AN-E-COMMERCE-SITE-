import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers/Providers"
import { Toaster } from "@/components/ui/sonner"
import { PWAServiceWorker } from "@/components/pwa/PWAServiceWorker"
import { InstallBanner } from "@/components/pwa/InstallBanner"
import { LiveChat } from "@/components/LiveChat";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "𝓐𝓡𝓚𝓘𝓥𝓔 - Curated Collections for Every Style",
  description: "Discover premium fashion and accessories at 𝓐𝓡𝓚𝓘𝓥𝓔. Shop elegant churis, jewelry, bags, and more with fast delivery across Bangladesh.",
  keywords: "fashion, jewelry, churis, bags, accessories, Bangladesh, online shopping",
  authors: [{ name: "𝓐𝓡𝓚𝓘𝓥𝓔" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Arkive",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192" },
      { url: "/icons/icon-512x512.png", sizes: "512x512" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png" },
    ],
  },
  openGraph: {
    title: "𝓐𝓡𝓚𝓘𝓥𝓔 - Curated Collections for Every Style",
    description: "Discover premium fashion and accessories at 𝓐𝓡𝓚𝓘𝓥𝓔.",
    type: "website",
    locale: "en_BD",
  },
}

export const viewport: Viewport = {
  themeColor: "#10b981",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
          <LiveChat />
        </Providers>
        <PWAServiceWorker />
        <InstallBanner />
      </body>
    </html>
  )
}
