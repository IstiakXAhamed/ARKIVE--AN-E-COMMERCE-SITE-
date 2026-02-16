"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Store,
  Sparkles,
  Tag,
  Menu,
  X,
  Layout,
  ShieldAlert,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Storefront", href: "/admin/storefront", icon: Layout },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: Tag },
  { label: "AI Tools", href: "/admin/ai-tools", icon: Sparkles },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const isSuperAdmin = session?.user?.role === "SUPERADMIN";

  return (
    <>
      {/* ... (Mobile menu button and overlay remain same) */}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "left-0" : "-left-64 lg:left-0"
        )}
      >
        {/* ... (Logo section remains same) */}

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon 
                  size={20} 
                  className={cn(
                    "shrink-0 transition-colors",
                    active ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600"
                  )} 
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          {/* Super Console Link */}
          {isSuperAdmin && (
            <Link
              href="/admin/super-console"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group mt-6",
                isActive("/admin/super-console")
                  ? "bg-red-50 text-red-700"
                  : "text-gray-600 hover:bg-red-50 hover:text-red-700"
              )}
              title={collapsed ? "Super Console" : undefined}
            >
              <ShieldAlert 
                size={20} 
                className={cn(
                  "shrink-0 transition-colors",
                  isActive("/admin/super-console") ? "text-red-600" : "text-gray-400 group-hover:text-red-600"
                )} 
              />
              {!collapsed && <span>Super Console</span>}
            </Link>
          )}
        </nav>

        {/* ... (Bottom actions remain same) */}
      </aside>
    </>
  );
}
