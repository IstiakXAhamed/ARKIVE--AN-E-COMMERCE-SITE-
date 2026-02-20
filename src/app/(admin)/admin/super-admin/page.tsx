'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Shield, Settings, MessageSquare, Gift, Sparkles, LayoutDashboard } from 'lucide-react'
import { FeatureToggles } from '@/components/admin/super-admin/FeatureToggles'
import { GamificationSettings } from '@/components/admin/super-admin/GamificationSettings'
import { InternalChat } from '@/components/admin/super-admin/InternalChat'
import { PermissionCenter } from '@/components/admin/super-admin/PermissionCenter'
import { AISettings } from '@/components/admin/super-admin/AISettings'

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Super Admin Console</h1>
        <p className="text-muted-foreground">
          Manage global settings, user permissions, and system configurations.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
          <TabsTrigger value="overview" className="py-2">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="permissions" className="py-2">
            <Shield className="w-4 h-4 mr-2" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="features" className="py-2">
            <Settings className="w-4 h-4 mr-2" />
            Features
          </TabsTrigger>
          <TabsTrigger value="chat" className="py-2">
            <MessageSquare className="w-4 h-4 mr-2" />
            Internal Chat
          </TabsTrigger>
          <TabsTrigger value="ai" className="py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Center
          </TabsTrigger>
          <TabsTrigger value="gamification" className="py-2">
            <Gift className="w-4 h-4 mr-2" />
            Gamification
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Use Caution</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">System Core</div>
                <p className="text-xs text-muted-foreground">
                  Changes here affect the entire platform.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quick Access</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Team Chat</div>
                <p className="text-xs text-muted-foreground">
                  Communicate with staff directly.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Status</CardTitle>
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Active</div>
                <p className="text-xs text-muted-foreground">
                  Gemini integration is running.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <FeatureToggles />
            </div>
            <div className="col-span-3">
              <InternalChat />
            </div>
          </div>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4">
          <PermissionCenter />
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <FeatureToggles />
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[700px] border-0 shadow-none">
            <InternalChat />
          </Card>
        </TabsContent>

        {/* AI Tab */}
        <TabsContent value="ai" className="space-y-4">
          <AISettings />
        </TabsContent>

        {/* Gamification Tab */}
        <TabsContent value="gamification" className="space-y-4">
          <GamificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
