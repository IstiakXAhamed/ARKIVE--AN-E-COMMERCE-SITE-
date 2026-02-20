import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const navItems = [
    { href: "/account", label: "Dashboard" },
    { href: "/account/orders", label: "My Orders" },
    { href: "/account/addresses", label: "Addresses" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/account/profile", label: "Profile" },
    { href: "/account/chat", label: "Messages" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="hidden md:block">
          <div className="sticky top-24 space-y-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-emerald-100 text-emerald-700">
                  {session.user.name ? getInitials(session.user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="font-semibold text-gray-900 truncate">{session.user.name}</p>
                <p className="text-sm text-gray-500 truncate">{session.user.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button variant="ghost" className="w-full justify-start">
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="md:col-span-3">
          {children}
        </div>
      </div>
    </div>
  )
}
