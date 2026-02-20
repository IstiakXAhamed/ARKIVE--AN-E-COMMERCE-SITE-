"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900">Analytics</h1>
        <p className="text-gray-500">View detailed sales and traffic reports</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sales Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
            <p className="text-gray-400">Chart Placeholder</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
            <p className="text-gray-400">Chart Placeholder</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
