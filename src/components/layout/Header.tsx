"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X
} from "lucide-react";
import { useCartStore } from "@/stores/cart";

const navLinks = [
  { label: "Women", href: "/category/women" },
  { label: "Men", href: "/category/men" },
  { label: "Couple", href: "/category/unisex" },
  { label: "Stationery", href: "/category/stationery" },
  { label: "Flash Sale", href: "/flash-sale", highlight: true },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted
    ? items.reduce((total, item) => total + item.quantity, 0)
    : 0;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-display text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              ARKIVE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  link.highlight 
                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {link.highlight && "⚡ "}{link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 lg:gap-2">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link 
              href="/wishlist"
              className="hidden sm:flex w-10 h-10 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              <Heart size={20} />
            </Link>

            {/* Account */}
            <Link 
              href="/account"
              className="hidden sm:flex w-10 h-10 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              <User size={20} />
            </Link>

            {/* Cart */}
            <Link 
              href="/cart"
              className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-gray-100"
            >
              <div className="py-4">
                <div className="relative max-w-xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search for jewelry, watches, rings..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-emerald-500 text-sm"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <nav className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium ${
                    link.highlight 
                      ? "bg-gradient-to-r from-red-500 to-orange-500 text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.highlight && "⚡ "}{link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100 mt-4 flex gap-2">
                <Link href="/wishlist" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium">
                  <Heart size={18} /> Wishlist
                </Link>
                <Link href="/account" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium">
                  <User size={18} /> Account
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
