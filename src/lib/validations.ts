import { z } from 'zod';

// User Validation
export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['customer', 'admin', 'superadmin']).default('customer'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Address Validation
export const addressSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  district: z.string().min(2, 'District is required'),
  postalCode: z.string().optional(),
  isDefault: z.boolean().default(false),
});

// Category Validation
export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  emoji: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

// Product Validation
export const productVariantSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  size: z.string().optional(),
  color: z.string().optional(),
  stock: z.number().min(0, 'Stock cannot be negative'),
  price: z.number().min(0, 'Price cannot be negative').optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().uuid('Category is required'),
  basePrice: z.number().min(0, 'Price cannot be negative'),
  salePrice: z.number().min(0).optional(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isActive: z.boolean().default(true),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  variants: z.array(productVariantSchema).optional(),
});

// Cart Validation
export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

// Order Validation
export const orderItemSchema = z.object({
  productId: z.string().uuid(),
  variantInfo: z.string().optional(),
  quantity: z.number().min(1),
  price: z.number().min(0),
});

export const orderSchema = z.object({
  addressId: z.string().uuid('Address is required'),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['cod', 'bkash', 'nagad', 'rocket', 'bank']),
  notes: z.string().optional(),
});

// Review Validation
export const reviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(5, 'Review must be at least 5 characters'),
  photos: z.array(z.string()).optional(),
});

// Coupon Validation
export const couponSchema = z.object({
  code: z.string().min(3, 'Coupon code is required'),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed', 'free_shipping']),
  discountValue: z.number().min(0),
  minOrderValue: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
  usageLimit: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
});

// Flash Sale Validation
export const flashSaleSchema = z.object({
  name: z.string().min(2, 'Sale name is required'),
  description: z.string().optional(),
  discountPercent: z.number().min(1).max(100),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  productIds: z.array(z.string().uuid()).min(1, 'At least one product is required'),
  isActive: z.boolean().default(true),
});

// Contact Form Validation
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Site Settings Validation
export const siteSettingsSchema = z.object({
  storeName: z.string().min(1),
  storeTagline: z.string().min(1),
  storeDescription: z.string().optional(),
  storeEmail: z.string().email(),
  storePhone: z.string().min(10),
  storeAddress: z.string().min(5),
  shippingCost: z.number().min(0),
  freeShippingMin: z.number().min(0),
  codEnabled: z.boolean(),
  bkashEnabled: z.boolean(),
  bkashNumber: z.string(),
  nagadEnabled: z.boolean(),
  nagadNumber: z.string(),
});

// Chat Message Validation
export const chatMessageSchema = z.object({
  sessionId: z.string(),
  message: z.string().min(1, 'Message cannot be empty'),
  senderName: z.string().min(1),
});
