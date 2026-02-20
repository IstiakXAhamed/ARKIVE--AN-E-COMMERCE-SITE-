'use client'

import { useState, useEffect } from 'react'
import { 
  Save, Loader2, Store, Mail, Phone, MapPin, Clock, X,
  Facebook, Instagram, Twitter, Youtube, Linkedin, Globe, FileText,
  Activity, Star, Package, Truck, 
  RotateCcw, CreditCard, CheckCircle2, Gift
} from 'lucide-react'
import { FileUpload } from '@/components/FileUpload'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<any>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings || {})
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        toast.success('Settings saved successfully!')
      } else {
        throw new Error('Failed to save')
      }
    } catch (err) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const update = (field: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Globe className="w-8 h-8 text-primary" />
            App Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage global configuration for your store</p>
        </div>
        <Button onClick={saveSettings} disabled={saving} className="gap-2 w-full sm:w-auto">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-8 h-auto gap-1 bg-muted p-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Store Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Store className="w-5 h-5" /> Store Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Store Logo</Label>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                   {settings.logo && (
                    <div className="relative w-24 h-24 border rounded-lg p-2 bg-muted flex-shrink-0">
                      <img 
                        src={settings.logo} 
                        alt="Logo preview" 
                        className="w-full h-full object-contain"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                        onClick={() => update('logo', '')}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                   )}
                   <div className="w-full max-w-sm">
                     <FileUpload 
                       folder="settings" 
                       onUpload={(url: string) => update('logo', url)} 
                       className={settings.logo ? 'py-2' : ''}
                     />
                     <p className="text-xs text-muted-foreground mt-1">
                       Recommended: PNG or SVG, transparent background.
                     </p>
                   </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Store Name</Label>
                  <Input value={settings.storeName || ''} onChange={(e) => update('storeName', e.target.value)} />
                </div>
              <div className="space-y-2">
                <Label>Tagline</Label>
                <Input value={settings.storeTagline || ''} onChange={(e) => update('storeTagline', e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Store Description</Label>
                <Textarea value={settings.storeDescription || ''} onChange={(e) => update('storeDescription', e.target.value)} rows={3} />
              </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5" /> Contact Information</CardTitle>
              <CardDescription>Visible on Contact page and Footer</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Store Email</Label>
                <Input value={settings.storeEmail || ''} onChange={(e) => update('storeEmail', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Store Phone</Label>
                <Input value={settings.storePhone || ''} onChange={(e) => update('storePhone', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input value={settings.supportEmail || ''} onChange={(e) => update('supportEmail', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Support Phone (WhatsApp)</Label>
                <Input value={settings.supportPhone || ''} onChange={(e) => update('supportPhone', e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Address</Label>
                <Textarea value={settings.storeAddress || ''} onChange={(e) => update('storeAddress', e.target.value)} rows={2} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" /> Feature Toggles</CardTitle>
              <CardDescription>Enable or disable major site features globally.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <div>
                    <label className="font-semibold block">Free Shipping Badge</label>
                    <span className="text-sm text-muted-foreground">Show "Free Shipping" highlight on product pages</span>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={settings.showFreeShipping !== false}
                  onChange={(e) => update('showFreeShipping', e.target.checked)}
                  className="w-5 h-5 accent-primary"
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-green-600" />
                  <div>
                    <label className="font-semibold block">Easy Returns Badge</label>
                    <span className="text-sm text-muted-foreground">Show "Easy Returns" highlight on product pages</span>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={settings.showEasyReturns !== false}
                  onChange={(e) => update('showEasyReturns', e.target.checked)}
                  className="w-5 h-5 accent-primary"
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <div>
                    <label className="font-semibold block">COD Available Badge</label>
                    <span className="text-sm text-muted-foreground">Show "Cash on Delivery" highlight on product pages</span>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={settings.showCOD !== false}
                  onChange={(e) => update('showCOD', e.target.checked)}
                  className="w-5 h-5 accent-primary"
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                  <div>
                    <label className="font-semibold block">Authenticity Badge</label>
                    <span className="text-sm text-muted-foreground">Show "100% Authentic" highlight on product pages</span>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={settings.showAuthentic !== false}
                  onChange={(e) => update('showAuthentic', e.target.checked)}
                  className="w-5 h-5 accent-primary"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Facebook className="w-4 h-4 text-blue-600" /> Facebook</Label>
                <Input value={settings.facebook || ''} onChange={(e) => update('facebook', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-600" /> Instagram</Label>
                <Input value={settings.instagram || ''} onChange={(e) => update('instagram', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Twitter className="w-4 h-4 text-blue-400" /> Twitter</Label>
                <Input value={settings.twitter || ''} onChange={(e) => update('twitter', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Youtube className="w-4 h-4 text-red-600" /> YouTube</Label>
                <Input value={settings.youtube || ''} onChange={(e) => update('youtube', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">WhatsApp (Link)</Label>
                <Input value={settings.whatsapp || ''} onChange={(e) => update('whatsapp', e.target.value)} placeholder="https://wa.me/..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
         {/* Using simplified content management */}
         <Card>
            <CardHeader>
              <CardTitle>Global Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                 <Label>Footer About Text</Label>
                 <Textarea value={settings.footerAbout || ''} onChange={(e) => update('footerAbout', e.target.value)} rows={3} />
               </div>
            </CardContent>
         </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Logistics</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Standard Shipping Cost</Label>
                <Input type="number" value={settings.shippingCost || ''} onChange={(e) => update('shippingCost', parseFloat(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Free Shipping Minimum Order</Label>
                <Input type="number" value={settings.freeShippingMin || ''} onChange={(e) => update('freeShippingMin', parseFloat(e.target.value))} />
              </div>
              <div className="space-y-2 flex items-center gap-2 pt-4">
                <input 
                  type="checkbox"
                  checked={settings.codEnabled !== false}
                  onChange={(e) => update('codEnabled', e.target.checked)}
                  className="w-5 h-5 accent-primary"
                />
                <Label>Enable Cash on Delivery (COD)</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
