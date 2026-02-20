"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import { useSession } from "next-auth/react"

export default function AccountProfilePage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900">My Profile</h1>
        <p className="text-gray-500">Manage your personal information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <div className="p-3 bg-gray-50 rounded-md border text-gray-900">
                {session?.user?.name || "Loading..."}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="p-3 bg-gray-50 rounded-md border text-gray-900">
                {session?.user?.email || "Loading..."}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
