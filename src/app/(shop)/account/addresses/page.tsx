"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AccountAddressesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">Addresses</h1>
          <p className="text-gray-500">Manage your shipping addresses</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Saved Addresses
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No saved addresses</h3>
          <p className="text-gray-500 mt-2 mb-6 max-w-sm mx-auto">
            You haven't added any shipping addresses yet. Add one to speed up checkout.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
