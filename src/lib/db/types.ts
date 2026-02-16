/**
 * Database Types for ARKIVE
 * These types match what the UI components expect
 */

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
  image?: string;
}

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  categorySlug: string;
  subcategory?: string;
  badge?: "sale" | "new" | "flash";
  rating?: number;
  reviewsCount?: number;
  description?: string;
  shortDesc?: string;
  metaDescription?: string;
  stock?: number;
  images?: ProductImageData[];
}

export interface ProductImageData {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface OrderItemData {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  createdAt: Date;
  items: OrderItemData[];
  customer?: {
    name: string;
    email: string;
  };
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  pendingOrders: number;
  lowStockItems: number;
}

export interface RecentOrderData {
  id: string;
  orderNumber: string;
  customer: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface TopProductData {
  id: string;
  name: string;
  sold: number;
  revenue: number;
  image: string;
}
