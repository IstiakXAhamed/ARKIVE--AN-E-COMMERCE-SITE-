"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Truck, Bell, Smartphone, Sparkles, Users } from "lucide-react";

interface Settings {
  // General
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  
  // Social
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  
  // Shipping
  freeShippingThreshold: string;
  shippingCost: string;
  
  // PWA & Mobile
  pwaEnabled: boolean;
  mobileBannerEnabled: boolean;
  mobileBannerText: string;
  mobileBannerButtonText: string;
  mobileBannerDelay: string;
  
  // Popup
  popupEnabled: boolean;
  popupContent: string;
  popupDelay: string;
  popupShowOnce: boolean;
}

const defaultSettings: Settings = {
  siteName: "ARKIVE",
  siteDescription: "Your premier destination for elegant jewelry and accessories in Bangladesh",
  contactEmail: "contact@arkive.com.bd",
  contactPhone: "+880 1339-705214",
  contactAddress: "Bangladesh",
  facebookUrl: "https://facebook.com/ARKIVE",
  instagramUrl: "https://instagram.com/arkive_shop_bd",
  twitterUrl: "",
  freeShippingThreshold: "3000",
  shippingCost: "120",
  pwaEnabled: true,
  mobileBannerEnabled: true,
  mobileBannerText: "Get the ARKIVE App for a better experience!",
  mobileBannerButtonText: "Download App",
  mobileBannerDelay: "3",
  popupEnabled: false,
  popupContent: "",
  popupDelay: "5",
  popupShowOnce: true,
};

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings?full=true");
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings({ ...defaultSettings, ...data.settings });
        }
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save settings");
      }
    } catch (err) {
      setError("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "social", label: "Social", icon: Users },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "pwa", label: "PWA & App", icon: Smartphone },
    { id: "popup", label: "Popups", icon: Sparkles },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure your store settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
        >
          <Save size={16} />
          {isSaving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* General */}
      {activeTab === "general" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">General Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="form-label">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Address</label>
              <input
                type="text"
                value={settings.contactAddress}
                onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Site Description</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="form-input"
                rows={3}
              />
            </div>
          </div>
        </div>
      )}

      {/* Social */}
      {activeTab === "social" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="form-label">Facebook URL</label>
              <input
                type="url"
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="form-input"
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <label className="form-label">Instagram URL</label>
              <input
                type="url"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                className="form-input"
                placeholder="https://instagram.com/yourpage"
              />
            </div>
            <div>
              <label className="form-label">Twitter/X URL</label>
              <input
                type="url"
                value={settings.twitterUrl}
                onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                className="form-input"
                placeholder="https://twitter.com/yourpage"
              />
            </div>
          </div>
        </div>
      )}

      {/* Shipping */}
      {activeTab === "shipping" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">Shipping Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="form-label">Shipping Cost (৳)</label>
              <input
                type="number"
                value={settings.shippingCost}
                onChange={(e) => setSettings({ ...settings, shippingCost: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Free Shipping Minimum (৳)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })}
                className="form-input"
              />
              <p className="text-xs text-gray-400 mt-1">Orders above this amount get free shipping</p>
            </div>
          </div>
        </div>
      )}

      {/* PWA & Mobile */}
      {activeTab === "pwa" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">PWA & Mobile App Settings</h2>
          
          {/* PWA Enable */}
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-900">Enable PWA</p>
              <p className="text-xs text-gray-500">Allow users to install the app</p>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, pwaEnabled: !settings.pwaEnabled })}
              className={`w-11 h-6 rounded-full transition-colors ${settings.pwaEnabled ? "bg-emerald-500" : "bg-gray-300"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${settings.pwaEnabled ? "translate-x-5.5" : "translate-x-0.5"}`} />
            </button>
          </div>

          {/* Mobile Banner Enable */}
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-900">Mobile App Banner</p>
              <p className="text-xs text-gray-500">Show download prompt on mobile devices</p>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, mobileBannerEnabled: !settings.mobileBannerEnabled })}
              className={`w-11 h-6 rounded-full transition-colors ${settings.mobileBannerEnabled ? "bg-emerald-500" : "bg-gray-300"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${settings.mobileBannerEnabled ? "translate-x-5.5" : "translate-x-0.5"}`} />
            </button>
          </div>

          {settings.mobileBannerEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-gray-50 rounded-xl">
              <div>
                <label className="form-label">Banner Text</label>
                <input
                  type="text"
                  value={settings.mobileBannerText}
                  onChange={(e) => setSettings({ ...settings, mobileBannerText: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Button Text</label>
                <input
                  type="text"
                  value={settings.mobileBannerButtonText}
                  onChange={(e) => setSettings({ ...settings, mobileBannerButtonText: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Show After (seconds)</label>
                <input
                  type="number"
                  value={settings.mobileBannerDelay}
                  onChange={(e) => setSettings({ ...settings, mobileBannerDelay: e.target.value })}
                  className="form-input"
                  min={0}
                  max={60}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Popup */}
      {activeTab === "popup" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">Welcome Popup Settings</h2>
          
          {/* Popup Enable */}
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-900">Enable Welcome Popup</p>
              <p className="text-xs text-gray-500">Show a popup when users first visit</p>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, popupEnabled: !settings.popupEnabled })}
              className={`w-11 h-6 rounded-full transition-colors ${settings.popupEnabled ? "bg-emerald-500" : "bg-gray-300"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${settings.popupEnabled ? "translate-x-5.5" : "translate-x-0.5"}`} />
            </button>
          </div>

          {settings.popupEnabled && (
            <div className="space-y-5 p-4 bg-gray-50 rounded-xl">
              <div>
                <label className="form-label">Popup Content (HTML allowed)</label>
                <textarea
                  value={settings.popupContent}
                  onChange={(e) => setSettings({ ...settings, popupContent: e.target.value })}
                  className="form-input"
                  rows={5}
                  placeholder="Welcome message, discounts, etc."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Show After (seconds)</label>
                  <input
                    type="number"
                    value={settings.popupDelay}
                    onChange={(e) => setSettings({ ...settings, popupDelay: e.target.value })}
                    className="form-input"
                    min={0}
                    max={30}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Show Only Once</p>
                    <p className="text-xs text-gray-500">Don&apos;t show again after closing</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, popupShowOnce: !settings.popupShowOnce })}
                    className={`w-11 h-6 rounded-full transition-colors ${settings.popupShowOnce ? "bg-emerald-500" : "bg-gray-300"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${settings.popupShowOnce ? "translate-x-5.5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
