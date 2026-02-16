"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, Heart, User } from "lucide-react";
import { useCartStore } from "@/stores/cart";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: boolean;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "Cart", href: "/cart", icon: ShoppingCart, badge: true },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Account", href: "/account", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted
    ? items.reduce((total, item) => total + item.quantity, 0)
    : 0;

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "lg:hidden", // Hidden on desktop
        "bg-white/80 dark:bg-slate-950/80",
        "backdrop-blur-md",
        "border-t border-gray-200 dark:border-slate-800",
        "pb-safe"
      )}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1",
                "w-14 h-full relative",
                "transition-all duration-200 ease-out",
                "hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-lg",
                isActive
                  ? "text-emerald-600 dark:text-emerald-500"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              )}
              title={item.label}
            >
              {/* Icon container */}
              <div className="relative">
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                  style={{
                    transition: "all 200ms ease-out",
                  }}
                />

                {/* Cart badge */}
                {item.badge && cartCount > 0 && (
                  <span
                    className={cn(
                      "absolute -top-2 -right-2",
                      "w-5 h-5 bg-emerald-600 dark:bg-emerald-500",
                      "text-white text-xs font-bold",
                      "rounded-full flex items-center justify-center",
                      "ring-2 ring-white dark:ring-slate-950"
                    )}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className="text-[10px] font-medium leading-tight">
                {item.label}
              </span>

              {/* Active indicator bar */}
              {isActive && (
                <span
                  className={cn(
                    "absolute bottom-1.5",
                    "w-6 h-0.5",
                    "bg-emerald-600 dark:bg-emerald-500",
                    "rounded-full",
                    "transition-all duration-200"
                  )}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
