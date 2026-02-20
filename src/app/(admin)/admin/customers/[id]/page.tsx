'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Shield,
  Calendar
} from 'lucide-react';
import { formatPrice, formatDateTime } from '@/lib/utils';

const roleConfig: Record<string, { color: string; label: string; icon: any }> = {
  SUPERADMIN: { color: 'bg-purple-100 text-purple-800', label: 'Super Admin', icon: ShieldCheck },
  ADMIN: { color: 'bg-indigo-100 text-indigo-800', label: 'Admin', icon: Shield },
  CUSTOMER: { color: 'bg-blue-100 text-blue-800', label: 'Customer', icon: User }
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
};

type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
  _count: {
    orders: number;
  };
  orders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  addresses: Array<{
    id: string;
    label: string;
    fullName: string;
    address: string;
    area: string;
    district: string;
    division: string;
    phone: string;
    isDefault: boolean;
  }>;
};

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomer();
  }, [customerId]);

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setCustomer(data.user);
      } else {
        console.error('Failed to fetch customer');
      }
    } catch (error) {
      console.error('Failed to fetch customer:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Customer not found</p>
        <Link href="/admin/customers">
          <Button className="mt-4">Back to Customers</Button>
        </Link>
      </div>
    );
  }

  const roleInfo = roleConfig[customer.role] || roleConfig.CUSTOMER;
  const RoleIcon = roleInfo.icon;
  const totalSpent = customer.orders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/customers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <p className="text-muted-foreground">{customer.email}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={fetchCustomer} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Order History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order History ({customer._count.orders})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customer.orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No orders yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customer.orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/admin/orders/${order.id}`}
                      className="block"
                    >
                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <p className="font-semibold">
                              #{order.orderNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDateTime(order.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                statusColors[order.status] ||
                                'bg-gray-100'
                              }`}
                            >
                              {order.status}
                            </span>
                            <p className="font-bold">
                              {formatPrice(Number(order.total))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Saved Addresses ({customer.addresses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customer.addresses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No saved addresses</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customer.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            address.isDefault
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {address.label}
                          {address.isDefault && ' (Default)'}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <p className="font-medium">{address.fullName}</p>
                        <p>{address.address}</p>
                        <p>
                          {address.area}, {address.district}
                        </p>
                        <p>{address.division}</p>
                        <p className="text-muted-foreground">
                          {address.phone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Email
                </p>
                <p className="font-medium">{customer.email}</p>
              </div>
              {customer.phone && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Phone
                  </p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <RoleIcon className="w-3 h-3" />
                  Role
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${roleInfo.color}`}
                >
                  {roleInfo.label}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Joined
                </p>
                <p className="font-medium">
                  {formatDateTime(customer.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Orders
                </span>
                <span className="font-bold text-lg">
                  {customer._count.orders}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Spent
                </span>
                <span className="font-bold text-lg text-green-600">
                  {formatPrice(totalSpent)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Avg Order Value
                </span>
                <span className="font-bold text-lg">
                  {customer._count.orders > 0
                    ? formatPrice(totalSpent / customer._count.orders)
                    : formatPrice(0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
