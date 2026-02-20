"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function AdminChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900">Live Chat Support</h1>
        <p className="text-gray-500">Manage customer support conversations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No active chats</h3>
          <p className="text-gray-500 mt-2 mb-6 max-w-sm mx-auto">
            Customer chat sessions will appear here. You can join them to provide support.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
