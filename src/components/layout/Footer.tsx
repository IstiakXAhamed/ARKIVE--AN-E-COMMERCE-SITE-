import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, Clock } from "lucide-react";

const footerLinks = {
  shop: [
    { label: "Women's Collection", href: "/category/women" },
    { label: "Men's Collection", href: "/category/men" },
    { label: "Couple Items", href: "/category/unisex" },
    { label: "Stationery", href: "/category/stationery" },
  ],
  support: [
    { label: "Track Order", href: "/track-order" },
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Contact Us", href: "/contact" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block mb-3 md:mb-4">
              <span className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">ARKIVE</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 md:mb-6 max-w-sm">
              Your premier destination for elegant jewelry and accessories in Bangladesh.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
              <a href="tel:+8801339705214" className="flex items-center gap-2 md:gap-3 text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                <Phone size={14} className="text-emerald-400" />
                +880 1339-705214
              </a>
              <a href="mailto:contact@arkive.com.bd" className="flex items-center gap-2 md:gap-3 text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                <Mail size={14} className="text-emerald-400" />
                contact@arkive.com.bd
              </a>
              <div className="flex items-center gap-2 md:gap-3 text-gray-400 text-sm">
                <Clock size={14} className="text-emerald-400" />
                Sat - Thu: 10AM - 8PM
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2 md:gap-3">
              <a 
                href="https://facebook.com/ARKIVE" 
                target="_blank" 
                rel="noopener"
                className="w-9 h-9 md:w-10 md:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="https://instagram.com/arkive_shop_bd" 
                target="_blank" 
                rel="noopener"
                className="w-9 h-9 md:w-10 md:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 md:mb-4 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2 md:space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 md:mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 md:space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + Payment */}
          <div>
            <h4 className="font-semibold text-white mb-3 md:mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 md:space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Payment Methods */}
            <div className="mt-4 md:mt-6">
              <h4 className="font-semibold text-white mb-2 md:mb-3 text-sm uppercase tracking-wider">We Accept</h4>
              <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                <span className="px-2 py-1 md:px-3 md:py-1.5 bg-gray-800 rounded text-[10px] md:text-xs text-gray-300">bKash</span>
                <span className="px-2 py-1 md:px-3 md:py-1.5 bg-gray-800 rounded text-[10px] md:text-xs text-gray-300">Nagad</span>
                <span className="px-2 py-1 md:px-3 md:py-1.5 bg-gray-800 rounded text-[10px] md:text-xs text-gray-300">COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4 md:py-5 flex flex-col sm:flex-row justify-between items-center gap-2 md:gap-3">
          <p className="text-gray-500 text-xs md:text-sm text-center sm:text-left">
            © 2026 ARKIVE. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs md:text-sm">
            Made with ❤️ in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
