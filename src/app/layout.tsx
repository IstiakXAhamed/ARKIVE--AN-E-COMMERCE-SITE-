import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { MobileAppBanner } from "@/components/layout/MobileAppBanner";
import AIChatAssistant from "@/components/AIChatAssistant";

// Force dynamic rendering to reduce build memory usage on shared hosting
export const dynamicParams = true;
export const revalidate = 0;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://arkive.com.bd"),
  title: {
    default: "ARKIVE - Premium Jewelry & Accessories",
    template: "%s | ARKIVE"
  },
  description: "Discover exquisite jewelry and accessories. Shop premium earrings, rings, bracelets, watches, and more at ARKIVE Bangladesh.",
  keywords: ["jewelry", "accessories", "Bangladesh", "earrings", "rings", "bracelets", "watches", "premium", "fashion", "luxury"],
  authors: [{ name: "ARKIVE" }],
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ARKIVE",
  },
  openGraph: {
    title: "ARKIVE - Premium Jewelry & Accessories",
    description: "Discover exquisite jewelry and accessories. Shop premium earrings, rings, bracelets, watches, and more at ARKIVE Bangladesh.",
    url: "https://arkive.com.bd",
    siteName: "ARKIVE",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARKIVE - Premium Jewelry & Accessories",
    description: "Discover exquisite jewelry and accessories. Shop premium earrings, rings, bracelets, watches, and more at ARKIVE Bangladesh.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-surface-50`}>
        {children}
        <AIChatAssistant />
        <MobileAppBanner />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
