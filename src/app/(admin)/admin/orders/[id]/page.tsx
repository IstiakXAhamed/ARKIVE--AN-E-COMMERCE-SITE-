'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Loader2,
  RefreshCw,
  CheckCircle,
  Truck
} from 'lucide-react';
import { formatPrice, formatDateTime } from '@/lib/utils';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
};

const statusOptions = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
];

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  couponCode?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  adminNotes?: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  addresses: {
    fullName: string;
    address: string;
    area: string;
    district: string;
    division: string;
    phone: string;
  } | null;
  order_items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
    products: {
      id: string;
      name: string;
      slug: string;
      product_images: Array<{ url: string }>;
    };
  }>;
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const confirmPayment = async () => {
    if (
      !confirm(
        'Confirm payment received? This will mark the order as paid.'
      )
    )
      return;

    setConfirmingPayment(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          paymentStatus: 'PAID',
          status: 'CONFIRMED'
        })
      });

      const data = await res.json();

      if (res.ok) {
        setOrder((prev) =>
          prev
            ? { ...prev, paymentStatus: 'PAID', status: 'CONFIRMED' }
            : null
        );
        alert(data.message || 'Payment confirmed!');
      } else {
        alert(data.error || 'Failed to confirm payment');
      }
    } catch (error) {
      alert('Failed to confirm payment');
    } finally {
      setConfirmingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Order not found</p>
        <Link href="/admin/orders">
          <Button className="mt-4">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              Order #{order.orderNumber}
            </h1>
            <p className="text-muted-foreground">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={fetchOrder} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items ({order.order_items?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      {item.products?.product_images?.[0]?.url ||
                      item.image ? (
                        <img
                          src={
                            item.products?.product_images?.[0]?.url ||
                            item.image ||
                            ''
                          }
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(Number(item.price))} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(Number(order.subtotal))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{formatPrice(Number(order.shippingCost))}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(Number(order.discount))}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(Number(order.total))}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Details Sidebar */}
        <div className="space-y-4">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    statusColors[order.status] || 'bg-gray-100'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Update Status
                </label>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  disabled={updating}
                  className="w-full p-2 border rounded-md"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() +
                        s.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Payment Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Method</span>
                  <span className="font-medium">
                    {order.paymentMethod === 'COD'
                      ? '💵 COD'
                      : '💳 Online'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span
                    className={`font-semibold ${
                      order.paymentStatus === 'PAID'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {order.paymentStatus === 'PAID'
                      ? '✓ Paid'
                      : '⏳ Pending'}
                  </span>
                </div>
                {order.couponCode && (
                  <div className="flex justify-between">
                    <span>Coupon</span>
                    <span className="font-medium text-blue-600">
                      {order.couponCode}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Payment Button */}
              {order.paymentStatus !== 'PAID' && (
                <Button
                  onClick={confirmPayment}
                  disabled={confirmingPayment}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {confirmingPayment ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Confirm Payment
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Tracking Info */}
          {(order.trackingNumber || order.trackingUrl) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {order.trackingNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tracking Number
                    </p>
                    <p className="font-medium">{order.trackingNumber}</p>
                  </div>
                )}
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Track Package →
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.user?.name || 'Guest'}</p>
              <p className="text-sm text-muted-foreground">
                {order.user?.email}
              </p>
              {order.user?.phone && (
                <p className="text-sm text-muted-foreground">
                  {order.user.phone}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.addresses ? (
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.addresses.fullName}</p>
                  <p>{order.addresses.address}</p>
                  <p>
                    {order.addresses.area}, {order.addresses.district}
                  </p>
                  <p>{order.addresses.division}</p>
                  <p>{order.addresses.phone}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No address on file</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
