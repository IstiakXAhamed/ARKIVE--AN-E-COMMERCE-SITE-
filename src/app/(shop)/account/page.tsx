"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { 
  ShoppingBag, 
  MapPin, 
  Heart, 
  MessageSquare, 
  User, 
  ChevronRight,
  Package
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

const menuItems = [
  { href: "/account/orders", label: "My Orders", icon: ShoppingBag, description: "View and track your orders" },
  { href: "/account/addresses", label: "Addresses", icon: MapPin, description: "Manage delivery addresses" },
  { href: "/wishlist", label: "Wishlist", icon: Heart, description: "Your saved items" },
  { href: "/account/chat", label: "Support Chat", icon: MessageSquare, description: "Contact customer support" },
  { href: "/account/profile", label: "Profile Settings", icon: User, description: "Edit your profile" },
]

export default function AccountPage() {
  const { data: session } = useSession()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="p-6 text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-2xl">
                {session?.user?.name ? getInitials(session.user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <h2 className="font-display text-xl font-semibold">{session?.user?.name}</h2>
            <p className="text-gray-500">{session?.user?.email}</p>
            <Link href="/account/profile" className="mt-4 inline-block">
              <Button variant="outline" size="sm">Edit Profile</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-500">Orders</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Package className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-500">Processing</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-500">Wishlist</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <MapPin className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-500">Addresses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.label}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
