"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface FooterProps {
  settings?: {
    storeName?: string
    storeEmail?: string
    storePhone?: string
    storeAddress?: string
    facebook?: string
    instagram?: string
    whatsapp?: string
    copyrightText?: string
    footerAbout?: string
  }
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="relative h-12 w-32">
              <Image
                src="/logo.png"
                alt="ARKIVE"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-400">
              {settings?.footerAbout || "Curated Collections for Every Style. Discover premium fashion and accessories crafted with care."}
            </p>
            <div className="flex gap-4">
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="hover:text-emerald-400 transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/category/women" className="hover:text-emerald-400 transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/category/men" className="hover:text-emerald-400 transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link href="/flash-sale" className="hover:text-emerald-400 transition-colors">
                  Flash Sale
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-emerald-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-emerald-400 transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-emerald-400 transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              {settings?.storeAddress && (
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-emerald-400" />
                  <span>{settings.storeAddress}</span>
                </li>
              )}
              {settings?.storePhone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <span>{settings.storePhone}</span>
                </li>
              )}
              {settings?.storeEmail && (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emerald-400" />
                  <span>{settings.storeEmail}</span>
                </li>
              )}
            </ul>

            {/* Newsletter */}
            <div className="pt-4">
              <h5 className="font-medium text-white mb-2">Newsletter</h5>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
                <Button size="sm" className="shrink-0">
                  Join
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>{settings?.copyrightText || `© ${currentYear} 𝓐𝓡𝓚𝓘𝓥𝓔. All rights reserved.`}</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-gray-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
