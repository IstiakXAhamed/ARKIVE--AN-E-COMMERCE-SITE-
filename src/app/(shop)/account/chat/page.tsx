"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function AccountChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900">Messages</h1>
        <p className="text-gray-500">View your conversation history</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Live Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No archived messages</h3>
          <p className="text-gray-500 mt-2 mb-6 max-w-sm mx-auto">
            You can use the floating chat widget at the bottom right to contact support or ask our AI assistant.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
