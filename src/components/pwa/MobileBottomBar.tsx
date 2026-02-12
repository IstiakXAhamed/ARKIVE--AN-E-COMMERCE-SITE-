"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, Heart, User } from "lucide-react";
import { useCartStore } from "@/stores/cart";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: Search },
  { label: "Cart", href: "/cart", icon: ShoppingBag, badge: true },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Account", href: "/account", icon: User },
];

export function MobileBottomBar() {
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  const cartCount = mounted
    ? items.reduce((total, item) => total + item.quantity, 0)
    : 0;

  // Only show in standalone PWA mode on mobile
  if (!isStandalone) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 pb-safe lg:hidden">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 w-16 h-full relative transition-colors",
                active ? "text-emerald-600" : "text-gray-400"
              )}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                {tab.badge && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
