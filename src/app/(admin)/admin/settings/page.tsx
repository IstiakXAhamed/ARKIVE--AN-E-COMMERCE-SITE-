"use client";

import { useState } from "react";
import { Save, Globe, Palette, Truck, CreditCard, Bell } from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const [general, setGeneral] = useState({
    siteName: "ARKIVE",
    tagline: "Premium Jewelry & Accessories",
    email: "hello@arkive.com.bd",
    phone: "+880 1712-345678",
    address: "House 12, Road 5, Dhanmondi, Dhaka 1205",
    currency: "BDT",
    currencySymbol: "৳",
  });

  const [shipping, setShipping] = useState({
    flatRate: "120",
    freeShippingMin: "3000",
    processingDays: "2",
    divisions: "Dhaka, Chittagong, Rajshahi, Khulna, Barisal, Sylhet, Rangpur, Mymensingh",
  });

  const [payment, setPayment] = useState({
    bkash: true,
    nagad: true,
    cod: true,
    bkashNumber: "01712345678",
    nagadNumber: "01812345678",
  });

  const [notifications, setNotifications] = useState({
    orderEmail: true,
    orderSms: false,
    lowStock: true,
    lowStockThreshold: "5",
    newCustomer: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

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
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Save size={16} />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
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
              <input type="text" value={general.siteName} onChange={(e) => setGeneral({ ...general, siteName: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="form-label">Tagline</label>
              <input type="text" value={general.tagline} onChange={(e) => setGeneral({ ...general, tagline: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="form-label">Contact Email</label>
              <input type="email" value={general.email} onChange={(e) => setGeneral({ ...general, email: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="form-label">Phone Number</label>
              <input type="text" value={general.phone} onChange={(e) => setGeneral({ ...general, phone: e.target.value })} className="form-input" />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Address</label>
              <input type="text" value={general.address} onChange={(e) => setGeneral({ ...general, address: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="form-label">Currency</label>
              <input type="text" value={general.currency} onChange={(e) => setGeneral({ ...general, currency: e.target.value })} className="form-input bg-gray-50" readOnly />
            </div>
            <div>
              <label className="form-label">Currency Symbol</label>
              <input type="text" value={general.currencySymbol} onChange={(e) => setGeneral({ ...general, currencySymbol: e.target.value })} className="form-input bg-gray-50" readOnly />
            </div>
          </div>
        </div>
      )}

      {/* Shipping */}
      {activeTab === "shipping" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">Shipping Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="form-label">Flat Rate (৳)</label>
              <input type="number" value={shipping.flatRate} onChange={(e) => setShipping({ ...shipping, flatRate: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="form-label">Free Shipping Minimum (৳)</label>
              <input type="number" value={shipping.freeShippingMin} onChange={(e) => setShipping({ ...shipping, freeShippingMin: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="form-label">Processing Days</label>
              <input type="number" value={shipping.processingDays} onChange={(e) => setShipping({ ...shipping, processingDays: e.target.value })} className="form-input" />
            </div>
            <div className="md:col-span-3">
              <label className="form-label">Available Divisions</label>
              <input type="text" value={shipping.divisions} onChange={(e) => setShipping({ ...shipping, divisions: e.target.value })} className="form-input" />
              <p className="text-xs text-gray-400 mt-1">Comma-separated list of delivery divisions</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment */}
      {activeTab === "payment" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">Payment Methods</h2>
          <div className="space-y-4">
            {/* bKash */}
            <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl">
              <input
                type="checkbox"
                checked={payment.bkash}
                onChange={(e) => setPayment({ ...payment, bkash: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">bKash</p>
                <p className="text-xs text-gray-500 mb-2">Accept payments via bKash</p>
                {payment.bkash && (
                  <input
                    type="text"
                    value={payment.bkashNumber}
                    onChange={(e) => setPayment({ ...payment, bkashNumber: e.target.value })}
                    className="form-input max-w-xs"
                    placeholder="bKash number"
                  />
                )}
              </div>
            </div>
            {/* Nagad */}
            <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl">
              <input
                type="checkbox"
                checked={payment.nagad}
                onChange={(e) => setPayment({ ...payment, nagad: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nagad</p>
                <p className="text-xs text-gray-500 mb-2">Accept payments via Nagad</p>
                {payment.nagad && (
                  <input
                    type="text"
                    value={payment.nagadNumber}
                    onChange={(e) => setPayment({ ...payment, nagadNumber: e.target.value })}
                    className="form-input max-w-xs"
                    placeholder="Nagad number"
                  />
                )}
              </div>
            </div>
            {/* COD */}
            <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl">
              <input
                type="checkbox"
                checked={payment.cod}
                onChange={(e) => setPayment({ ...payment, cod: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Cash on Delivery</p>
                <p className="text-xs text-gray-500">Allow customers to pay on delivery</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">New Order Email</p>
                <p className="text-xs text-gray-500">Get notified when a new order is placed</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, orderEmail: !notifications.orderEmail })}
                className={`w-11 h-6 rounded-full transition-colors ${notifications.orderEmail ? "bg-emerald-500" : "bg-gray-300"}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${notifications.orderEmail ? "translate-x-5.5" : "translate-x-0.5"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">Low Stock Alert</p>
                <p className="text-xs text-gray-500">Get alerted when product stock is low</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={notifications.lowStockThreshold}
                  onChange={(e) => setNotifications({ ...notifications, lowStockThreshold: e.target.value })}
                  className="w-16 form-input text-center"
                  placeholder="5"
                />
                <button
                  onClick={() => setNotifications({ ...notifications, lowStock: !notifications.lowStock })}
                  className={`w-11 h-6 rounded-full transition-colors ${notifications.lowStock ? "bg-emerald-500" : "bg-gray-300"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${notifications.lowStock ? "translate-x-5.5" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">New Customer</p>
                <p className="text-xs text-gray-500">Get notified when a new customer registers</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, newCustomer: !notifications.newCustomer })}
                className={`w-11 h-6 rounded-full transition-colors ${notifications.newCustomer ? "bg-emerald-500" : "bg-gray-300"}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${notifications.newCustomer ? "translate-x-5.5" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
