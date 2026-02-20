# ARKIVE Admin Implementation Roadmap

Based on SilkMart analysis, here's what needs to be implemented in ARKIVE.

## Current Status

### ✅ Already Implemented (Good!)
- Super Console dashboard with real-time stats
- User Management (role promotion/demotion, user deletion)
- Settings API (GET/PUT/POST)
- Mobile App Banner with PWA controls
- Site Settings management

### ❌ Missing Critical Features

## 1. Product Management (PRIORITY 1)

### Pages Needed
- [x] `/admin/products` - Product list (exists but basic)
- [ ] `/admin/products/new` - Create product form
- [ ] `/admin/products/[id]/edit` - Edit product form

### API Routes Needed
- [ ] `POST /api/admin/products` - Create product
- [ ] `PUT /api/admin/products/[id]` - Update product
- [ ] `DELETE /api/admin/products/[id]` - Delete product
- [ ] `GET /api/admin/products` - Fix to include variants

### Implementation Tasks
```typescript
// 1. Update Prisma Schema
model ProductVariant {
  id          String   @id @default(cuid())
  productId   String
  sku         String   @unique
  size        String?
  color       String?
  stock       Int      @default(0)
  price       Float?    // Individual variant pricing
  salePrice   Float?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}

// 2. Create VariantManager component
// Location: src/components/admin/VariantManager.tsx
// Features:
// - Add/remove variant rows
// - Size and color inputs
// - Stock tracking per variant
// - Optional individual pricing per variant

// 3. Create Product Form (new/edit)
// Location: src/app/(admin)/admin/products/new/page.tsx
// Features:
// - Name → Auto-generate slug
// - Category dropdown
// - Description textarea
// - Image upload (multiple)
// - Base price + sale price
// - Variant manager
// - Featured/Bestseller toggles
// - Submit → POST /api/admin/products
```

---

## 2. Order Management (PRIORITY 2)

### Pages Needed
- [x] `/admin/orders` - Order list (exists)
- [ ] `/admin/orders/[id]` - Order detail page

### API Routes Needed
- [ ] `PUT /api/admin/orders/[id]` - Update order status
- [ ] `GET /api/admin/orders/[id]` - Get single order details

### Implementation Tasks
```typescript
// 1. Order Detail Page
// Location: src/app/(admin)/admin/orders/[id]/page.tsx
// Features:
// - Order summary (number, date, total)
// - Customer info (name, email, phone)
// - Shipping address
// - Order items with product details
// - Status dropdown (pending → confirmed → processing → shipped → delivered)
// - Payment status toggle
// - Tracking number input
// - Notes/comments section
// - Cancel order button (restores stock)
// - Print receipt button

// 2. Status Update API
// Location: src/app/api/admin/orders/[id]/route.ts
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await checkAdmin(request)
  if (!admin) return unauthorized()
  
  const { status, paymentStatus, trackingNumber, notes } = await request.json()
  
  const updateData: any = {}
  if (status) updateData.status = status
  if (paymentStatus) updateData.paymentStatus = paymentStatus
  if (trackingNumber) updateData.trackingNumber = trackingNumber
  if (notes) updateData.notes = notes
  
  // If cancelled, restore stock
  if (status === 'CANCELLED') {
    // TODO: Restore variant stock
  }
  
  const order = await prisma.orders.update({
    where: { id: params.id },
    data: updateData
  })
  
  return NextResponse.json({ order })
}
```

---

## 3. Coupon Management (PRIORITY 3)

### Pages Needed
- [ ] `/admin/coupons` - Coupon list
- [ ] `/admin/coupons/new` - Create coupon

### Database Schema
```prisma
model Coupon {
  id              String   @id @default(cuid())
  code            String   @unique
  description     String?
  discountType    String   // percentage, fixed
  discountValue   Float
  minPurchase     Float?
  maxDiscount     Float?
  startDate       DateTime
  endDate         DateTime
  usageLimit      Int?
  usedCount       Int      @default(0)
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## 4. Category Management (PRIORITY 4)

### Pages Needed
- [ ] `/admin/categories` - Category list
- [ ] `/admin/categories/new` - Create category

### API Routes Needed
- [ ] `POST /api/admin/categories` - Create category
- [ ] `PUT /api/admin/categories/[id]` - Update category
- [ ] `DELETE /api/admin/categories/[id]` - Delete category

---

## 5. Image Upload Infrastructure

### Current Status
- ❌ No upload API route exists in ARKIVE

### Implementation Needed
```typescript
// Location: src/app/api/upload/route.ts
// Copy from SilkMart: app/api/upload/route.ts
// Features:
// - Cloudinary integration (primary)
// - Local fallback for development
// - File size limits (10MB)
// - Type validation (images only)
// - Authentication required
// - Folder organization

// Environment Variables Needed:
// CLOUDINARY_CLOUD_NAME=your-cloud-name
// CLOUDINARY_API_KEY=your-api-key
// CLOUDINARY_API_SECRET=your-api-secret
```

---

## 6. Admin Authentication Fix

### Current Issues
- `/api/admin/settings/hero` → 401 (FIXED: role case sensitivity)
- `/api/admin/customers` → 401 (FIXED: role case sensitivity)

### Fix Applied
```typescript
// BEFORE (WRONG):
if (session?.user?.role !== 'admin' && session?.user?.role !== 'superadmin')

// AFTER (CORRECT):
if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPERADMIN')
```

---

## Implementation Priority Order

### Week 1: Product Management
1. Create Product schema with variants
2. Build image upload API (/api/upload)
3. Create VariantManager component
4. Build Product Create page
5. Build Product Edit page
6. Update Product List page with edit/delete

### Week 2: Order Management
1. Build Order Detail page
2. Create Order Update API
3. Add status update dropdown
4. Implement stock restoration on cancel
5. Add print receipt functionality

### Week 3: Coupons & Categories
1. Create Coupon schema
2. Build Coupon CRUD pages
3. Build Category CRUD pages
4. Integrate coupons into checkout

---

## File Structure Reference

```
src/
├── app/
│   ├── (admin)/
│   │   └── admin/
│   │       ├── products/
│   │       │   ├── page.tsx          ✅ Exists (needs enhancement)
│   │       │   ├── new/
│   │       │   │   └── page.tsx      ❌ MISSING
│   │       │   └── [id]/
│   │       │       └── edit/
│   │       │           └── page.tsx  ❌ MISSING
│   │       ├── orders/
│   │       │   ├── page.tsx          ✅ Exists
│   │       │   └── [id]/
│   │       │       └── page.tsx      ❌ MISSING
│   │       ├── coupons/
│   │       │   ├── page.tsx          ❌ MISSING
│   │       │   └── new/
│   │       │       └── page.tsx      ❌ MISSING
│   │       └── categories/
│   │           ├── page.tsx          ❌ MISSING
│   │           └── new/
│   │               └── page.tsx      ❌ MISSING
│   └── api/
│       ├── admin/
│       │   ├── products/
│       │   │   ├── route.ts          ❌ MISSING (needs POST)
│       │   │   └── [id]/
│       │   │       └── route.ts      ❌ MISSING
│       │   ├── orders/
│       │   │   └── [id]/
│       │   │       └── route.ts      ❌ MISSING (needs PUT)
│       │   ├── coupons/
│       │   │   └── route.ts          ❌ MISSING
│       │   └── categories/
│       │       └── route.ts          ❌ MISSING
│       └── upload/
│           └── route.ts              ❌ MISSING
└── components/
    └── admin/
        ├── VariantManager.tsx        ❌ MISSING
        ├── ImageUploader.tsx         ❌ MISSING
        └── ProductForm.tsx           ❌ MISSING
```

---

## Quick Start Commands

### 1. Update Database Schema
```bash
# Add ProductVariant model to prisma/schema.prisma
# Add Coupon model
# Run migration
npx prisma migrate dev --name add_product_variants_and_coupons
```

### 2. Install Required Packages
```bash
npm install cloudinary
```

### 3. Environment Variables
```bash
# Add to .env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Testing Checklist

### Product Management
- [ ] Create product with multiple images
- [ ] Create product with variants (sizes/colors)
- [ ] Edit existing product
- [ ] Delete product (cascade delete variants)
- [ ] Toggle featured/active status
- [ ] Search products

### Order Management
- [ ] View order details
- [ ] Update order status
- [ ] Add tracking number
- [ ] Cancel order (verify stock restored)
- [ ] Print receipt

### User Management
- [ ] Promote user to admin
- [ ] Demote admin to customer
- [ ] Delete user
- [ ] Search users

---

## Notes

- **Keep ARKIVE's UI/UX**: Use Tailwind v4 + shadcn/ui components
- **Port logic, not design**: Extract SilkMart's data handling patterns, not their visual design
- **Mobile-first**: Ensure all admin pages are responsive
- **Role-based access**: SUPERADMIN > ADMIN > CUSTOMER
- **Optimistic UI**: Update UI immediately, rollback on error
