import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

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
  title: "ARKIVE - Premium Jewelry & Accessories",
  description: "Discover exquisite jewelry and accessories. Shop premium earrings, rings, bracelets, watches, and more at ARKIVE Bangladesh.",
  keywords: ["jewelry", "accessories", "Bangladesh", "earrings", "rings", "bracelets", "watches", "premium"],
  authors: [{ name: "ARKIVE" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ARKIVE",
  },
  openGraph: {
    title: "ARKIVE - Premium Jewelry & Accessories",
    description: "Discover exquisite jewelry and accessories",
    type: "website",
    locale: "en_US",
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
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
