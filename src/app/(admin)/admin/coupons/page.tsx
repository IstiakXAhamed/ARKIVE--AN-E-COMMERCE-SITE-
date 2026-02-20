"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tag, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">Coupons</h1>
          <p className="text-gray-500">Manage discount codes and promotions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Active Coupons
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Tag className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No coupons found</h3>
          <p className="text-gray-500 mt-2 mb-6 max-w-sm mx-auto">
            Create your first coupon code to run promotions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
