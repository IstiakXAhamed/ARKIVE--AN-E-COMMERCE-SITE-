// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: 'customer' | 'admin' | 'superadmin';
  isActive: boolean;
  permissions: string[];
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  userId?: string | null;
  guestEmail?: string | null;
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode?: string | null;
  isDefault: boolean;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  emoji?: string | null;
  parentId?: string | null;
  isActive: boolean;
  sortOrder: number;
  children?: Category[];
  parent?: Category | null;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  basePrice: number;
  salePrice?: number | null;
  images: string[];
  isFeatured: boolean;
  isBestseller: boolean;
  isActive: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  category: Category;
  variants: ProductVariant[];
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size?: string | null;
  color?: string | null;
  stock: number;
  price?: number | null;
}

// Cart Types
export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  product: Product;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  guestEmail?: string | null;
  addressId: string;
  name?: string | null;
  phone?: string | null;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  couponCode?: string | null;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string | null;
  notes?: string | null;
  address: Address;
  items: OrderItem[];
  payment?: Payment | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantInfo?: string | null;
  quantity: number;
  price: number;
  product: Product;
}

export interface Payment {
  id: string;
  orderId: string;
  transactionId?: string | null;
  method: string;
  amount: number;
  status: string;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string | null;
  photos?: string[] | null;
  isApproved: boolean;
  adminReply?: string | null;
  user: User;
  createdAt: Date;
}

// Wishlist Types
export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  product: Product;
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minOrderValue?: number | null;
  maxDiscount?: number | null;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number | null;
  usedCount: number;
  isActive: boolean;
}

// Flash Sale Types
export interface FlashSale {
  id: string;
  name: string;
  description?: string | null;
  discountPercent: number;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  products: FlashSaleProduct[];
}

export interface FlashSaleProduct {
  id: string;
  flashSaleId: string;
  productId: string;
  product: Product;
}

// Chat Types
export interface ChatSession {
  id: string;
  sessionId: string;
  userId?: string | null;
  customerName: string;
  customerEmail?: string | null;
  status: 'active' | 'closed';
  assignedTo?: string | null;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderType: 'customer' | 'admin' | 'system';
  senderId?: string | null;
  senderName: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'promotion' | 'stock' | 'chat';
  title: string;
  message: string;
  isRead: boolean;
  link?: string | null;
  createdAt: Date;
}

// Contact Message Types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  adminNotes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Site Settings Types
export interface SiteSettings {
  id: string;
  // Store Identity
  storeName: string;
  storeTagline: string;
  storeDescription?: string | null;
  logo?: string | null;
  favicon?: string | null;
  
  // Stats
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;
  
  // Features Toggle
  showFreeShipping: boolean;
  showEasyReturns: boolean;
  showCOD: boolean;
  showAuthentic: boolean;
  
  // Feature Text
  featureShippingTitle: string;
  featureShippingDesc: string;
  featureReturnTitle: string;
  featureReturnDesc: string;
  featureCODTitle: string;
  featureCODDesc: string;
  featureAuthenticTitle: string;
  featureAuthenticDesc: string;
  
  // Contact Info
  storeEmail: string;
  email2?: string | null;
  storePhone: string;
  phone2?: string | null;
  storeAddress: string;
  addressLine2?: string | null;
  workingDays: string;
  workingHours: string;
  offDays: string;
  
  // Social Links
  facebook?: string | null;
  instagram?: string | null;
  whatsapp?: string | null;
  
  // About Page
  aboutTitle: string;
  aboutContent?: string | null;
  aboutMission?: string | null;
  aboutVision?: string | null;
  
  // Footer
  footerAbout?: string | null;
  copyrightText: string;
  
  // SEO
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  
  // Chat Settings
  chatStatus: string;
  
  // Promo Banner
  promoEnabled: boolean;
  promoCode: string;
  promoMessage: string;
  promoEndTime?: Date | null;
  
  // PWA Settings
  pwaInstallBannerEnabled: boolean;
  pwaInstallButtonEnabled: boolean;
  pwaAppName: string;
  pwaShortName: string;
  pwaThemeColor: string;
  pwaBackgroundColor: string;
  pwaSplashText: string;
  pwaStartPage: string;
  
  // Shipping & Payment
  shippingCost: number;
  freeShippingMin: number;
  codEnabled: boolean;
  
  // Payment Gateways
  bkashEnabled: boolean;
  bkashType: string;
  bkashNumber: string;
  bkashAccountName: string;
  bkashInstructions?: string | null;
  
  nagadEnabled: boolean;
  nagadType: string;
  nagadNumber: string;
  nagadAccountName: string;
  nagadInstructions?: string | null;
  
  rocketEnabled: boolean;
  rocketNumber: string;
  rocketAccountName: string;
  rocketInstructions?: string | null;
  
  bankEnabled: boolean;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  bankBranch: string;
  bankRoutingNumber: string;
  bankInstructions?: string | null;
  
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
