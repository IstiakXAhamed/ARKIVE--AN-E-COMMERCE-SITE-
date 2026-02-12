"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, CreditCard, User } from "lucide-react";

const demoOrderDetails: Record<string, {
  id: string;
  customer: { name: string; email: string; phone: string };
  shipping: { address: string; city: string; division: string; zip: string };
  items: { name: string; quantity: number; price: number; image: string }[];
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: string;
  payment: string;
  date: string;
  timeline: { label: string; date: string; done: boolean }[];
}> = {
  "ORD-1024": {
    id: "ORD-1024",
    customer: { name: "Fatima Rahman", email: "fatima@email.com", phone: "+880 1712-345678" },
    shipping: { address: "House 12, Road 5, Dhanmondi", city: "Dhaka", division: "Dhaka", zip: "1205" },
    items: [
      { name: "Elegant Pearl Earrings", quantity: 1, price: 890, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=80" },
      { name: "Rose Gold Diamond Ring", quantity: 1, price: 2450, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=80" },
      { name: "Crystal Charm Bracelet", quantity: 1, price: 750, image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=80" },
    ],
    subtotal: 4090,
    shipping_cost: 120,
    total: 4210,
    status: "Processing",
    payment: "bKash",
    date: "2026-02-12 14:30",
    timeline: [
      { label: "Order Placed", date: "Feb 12, 2:30 PM", done: true },
      { label: "Payment Confirmed", date: "Feb 12, 2:32 PM", done: true },
      { label: "Processing", date: "Feb 12, 3:00 PM", done: true },
      { label: "Shipped", date: "", done: false },
      { label: "Delivered", date: "", done: false },
    ],
  },
};

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const order = demoOrderDetails[orderId];

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Order {orderId}</h1>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="text-gray-500">Order details will be available when connected to the database.</p>
          <Link href="/admin/orders" className="mt-4 inline-block text-sm text-emerald-600 hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{order.id}</h1>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{order.date}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
          <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
            Update Status
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Package size={18} /> Order Items
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">৳{item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 px-5 py-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>৳{order.shipping_cost}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>৳{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={18} /> Order Timeline
            </h2>
            <div className="space-y-4">
              {order.timeline.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    step.done ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"
                  }`}>
                    {step.done ? <CheckCircle size={14} /> : <Clock size={14} />}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${step.done ? "text-gray-900" : "text-gray-400"}`}>
                      {step.label}
                    </p>
                    {step.date && <p className="text-xs text-gray-500">{step.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User size={18} /> Customer
            </h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-gray-900">{order.customer.name}</p>
              <p className="text-gray-500">{order.customer.email}</p>
              <p className="text-gray-500">{order.customer.phone}</p>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin size={18} /> Shipping Address
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{order.shipping.address}</p>
              <p>{order.shipping.city}, {order.shipping.division}</p>
              <p>{order.shipping.zip}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard size={18} /> Payment
            </h2>
            <div className="text-sm">
              <p className="text-gray-600">Method: <span className="font-medium text-gray-900">{order.payment}</span></p>
              <p className="text-gray-600 mt-1">Status: <span className="font-medium text-emerald-600">Paid</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
