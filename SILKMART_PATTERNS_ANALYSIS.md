# SilkMart Admin Implementation Patterns

**Reference Codebase**: `C:\Users\samia\Desktop\Learning Journey\HostNin\SilkMartWebSite`

## 1. Product Management

### Database Schema (Prisma)
```prisma
model Product {
  id              String   @id @default(uuid())
  name            String
  slug            String   @unique
  description     String
  categoryId      String
  sellerId        String?
  basePrice       Float
  salePrice       Float?
  images          String   // JSON array stringified
  isFeatured      Boolean  @default(false)
  isBestseller    Boolean  @default(false)
  isActive        Boolean  @default(true)
  productType     String   @default("clothing")
  metaTitle       String?
  metaDescription String?  @db.Text
  metaKeywords    String?
  variantPricing  Boolean  @default(false)
  hasWarranty     Boolean  @default(false)
  warrantyPeriod  String?
}

model ProductVariant {
  id          String   @id @default(uuid())
  productId   String
  sku         String   @unique
  size        String?
  color       String?
  stock       Int      @default(0)
  price       Float?    // Individual variant pricing
  salePrice   Float?    // Individual variant sale price
}
```

### API Routes Pattern

#### GET /api/admin/products (List Products)
```typescript
// Features:
// - Pagination (page, limit params)
// - Seller filtering (sellers see only their products)
// - Include category, variants, seller relations
// - Parse JSON images field

const whereClause = admin.role === 'seller' 
  ? { sellerId: admin.id }
  : {}

const [products, total] = await Promise.all([
  prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
      variants: true,
      seller: { select: { id: true, name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit
  }),
  prisma.product.count({ where: whereClause })
])

// Parse images from JSON string
const productsWithParsedImages = products.map((p) => {
  let images: string[] = []
  try {
    const imageStr = p.images as string || '[]'
    const cleanStr = imageStr.replace(/\\"/g, '"')
    images = JSON.parse(cleanStr)
  } catch (error) {
    images = []
  }
  return { ...p, images }
})
```

#### POST /api/admin/products (Create Product)
```typescript
const payload = {
  name,
  slug,
  description,
  categoryId,
  sellerId: admin.id,
  basePrice: parseFloat(basePrice),
  salePrice: salePrice ? parseFloat(salePrice) : null,
  images: JSON.stringify(images), // Store as JSON string
  isFeatured: isFeatured || false,
  isBestseller: isBestseller || false,
  isActive: isActive !== false,
  productType: productType || 'clothing',
  metaTitle,
  metaDescription,
  metaKeywords,
  variantPricing: variantPricing || false,
  variants: {
    create: variants?.map((v: any) => ({
      size: v.size,
      color: v.color,
      sku: v.sku || `${slug}-${v.size}-${v.color}`,
      stock: parseInt(v.stock) || 0,
      price: v.price ? parseFloat(v.price.toString()) : null,
      salePrice: v.salePrice ? parseFloat(v.salePrice.toString()) : null
    })) || []
  }
}

const product = await prisma.product.create({
  data: payload,
  include: { category: true, variants: true, seller: true }
})
```

#### PUT /api/admin/products/[id] (Update Product)
```typescript
// Key Pattern: Delete existing variants, then create new ones
const product = await prisma.product.update({
  where: { id: params.id },
  data: {
    name,
    description,
    categoryId,
    basePrice: parseFloat(basePrice),
    salePrice: salePrice ? parseFloat(salePrice) : null,
    images: JSON.stringify(images),
    isFeatured,
    isBestseller,
    isActive,
    variants: {
      deleteMany: {}, // Delete all existing variants
      create: variants?.map((v: any) => ({
        size: v.size,
        color: v.color,
        sku: v.sku || `${params.id.slice(0, 8)}-${v.size}-${v.color}-${Date.now()}`,
        stock: parseInt(v.stock) || 0,
        price: v.price ? parseFloat(v.price.toString()) : null,
        salePrice: v.salePrice ? parseFloat(v.salePrice.toString()) : null
      })) || []
    }
  },
  include: { category: true, variants: true }
})
```

#### DELETE /api/admin/products/[id] (Delete Product)
```typescript
// Delete variants first
await prisma.productVariant.deleteMany({
  where: { productId: params.id }
})

// Then delete product
await prisma.product.delete({
  where: { id: params.id }
})
```

### Frontend Pattern (Admin Product List)

#### File: app/admin/products/page.tsx
```typescript
// Key Features:
// 1. Search by name
// 2. Toggle Featured/Active with optimistic UI
// 3. Mobile-first responsive design (card view on mobile, table on desktop)
// 4. Delete confirmation dialog
// 5. Loading skeletons

const toggleFeatured = async (product: any) => {
  // Optimistic update - update UI FIRST
  const previousValue = product.isFeatured
  setProducts(products.map(p =>
    p.id === product.id ? { ...p, isFeatured: !p.isFeatured } : p
  ))

  try {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...product,
        isFeatured: !previousValue,
        variants: product.variants.map((v: any) => ({
          size: v.size,
          color: v.color,
          stock: v.stock,
          sku: v.sku || ''
        }))
      })
    })

    if (!res.ok) {
      // Revert on error
      setProducts(products.map(p =>
        p.id === product.id ? { ...p, isFeatured: previousValue } : p
      ))
      toast({ title: 'Error', variant: 'destructive' })
    }
  } catch (error) {
    // Revert on error
    setProducts(products.map(p =>
      p.id === product.id ? { ...p, isFeatured: previousValue } : p
    ))
  }
}
```

### Frontend Pattern (Create Product)

#### File: app/admin/products/new/page.tsx
```typescript
// Key Features:
// 1. Auto-generate slug from name
// 2. Image upload to Cloudinary (or local fallback)
// 3. Variant management component
// 4. AI product assist integration
// 5. Simple/Advanced mode toggle
// 6. Category dropdown

// Auto-generate slug
useEffect(() => {
  if (formData.name) {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setFormData(prev => ({ ...prev, slug }))
  }
}, [formData.name])

// Image upload handler
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files
  if (!files || files.length === 0) return
  setUploading(true)
  const newImages: string[] = []
  
  try {
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'products')
      
      const res = await fetch('/api/upload', { 
        method: 'POST', 
        body: formData 
      })
      
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.url) newImages.push(data.url)
      }
    }
    setImages(prev => [...prev, ...newImages])
  } catch {
    toast({ title: 'Upload Failed', variant: 'destructive' })
  } finally {
    setUploading(false)
  }
}

// Submit handler
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  
  try {
    const payload = {
      ...formData,
      basePrice: parseFloat(formData.basePrice),
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
      images: images,
      variants: variants.map(v => ({ 
        ...v, 
        stock: parseInt(v.stock.toString()) 
      }))
    }
    
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    if (res.ok) {
      toast({ title: 'Success!', description: 'Product created' })
      router.push('/admin/products')
    } else {
      throw new Error('Failed to create')
    }
  } catch {
    toast({ title: 'Error', variant: 'destructive' })
  } finally {
    setLoading(false)
  }
}
```

---

## 2. Order Management

### Database Schema
```prisma
model Order {
  id                  String   @id @default(uuid())
  userId              String?
  orderNumber         String   @unique
  addressId           String
  paymentMethod       String   // cod, stripe, etc
  paymentStatus       String   @default("pending") // pending, paid, failed
  status              String   @default("pending") // pending, confirmed, processing, shipped, delivered, cancelled
  subtotal            Float
  shippingCost        Float
  discount            Float?
  total               Float
  trackingNumber      String?
  notes               String?
  guestEmail          String?
  paymentConfirmedAt  DateTime?
  receiptSentAt       DateTime?
  createdAt           DateTime @default(now())
  
  user     User?       @relation(fields: [userId], references: [id])
  address  Address     @relation(fields: [addressId], references: [id])
  items    OrderItem[]
  payment  Payment?
}

model OrderItem {
  id          String  @id @default(uuid())
  orderId     String
  productId   String
  variantInfo String? // JSON with variant details
  quantity    Int
  price       Float
  
  order    Order   @relation(fields: [orderId], references: [id])
  product  Product @relation(fields: [productId], references: [id])
}
```

### API Routes Pattern

#### GET /api/admin/orders (List Orders)
```typescript
// Features:
// - Pagination
// - Seller filtering (sellers see only orders with their products)
// - Include user, items, products, address, payment

const whereClause = admin.role === 'seller' 
  ? {
      items: {
        some: {
          product: { sellerId: admin.id }
        }
      }
    }
  : {}

const [orders, total] = await Promise.all([
  prisma.order.findMany({
    where: whereClause,
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: { 
            select: { 
              name: true, 
              images: true,
              sellerId: true,
              seller: { select: { id: true, name: true } }
            } 
          }
        }
      },
      address: true,
      payment: true
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit
  }),
  prisma.order.count({ where: whereClause })
])
```

#### PUT /api/admin/orders/[id] (Update Order)
```typescript
// Features:
// - Update status and paymentStatus
// - Send email notifications
// - Award loyalty points on delivery
// - Restore stock on cancellation

const updateData: any = {}
if (status) updateData.status = status
if (paymentStatus) updateData.paymentStatus = paymentStatus
if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber
if (notes !== undefined) updateData.notes = notes

// If payment confirmed, set timestamp
if (paymentStatus === 'paid' && existingOrder.paymentStatus !== 'paid') {
  updateData.paymentConfirmedAt = new Date()
}

const order = await prisma.order.update({
  where: { id: params.id },
  data: updateData,
  include: {
    user: { select: { name: true, email: true } },
    items: { include: { product: true } },
    address: true
  }
})

// Handle payment confirmation - generate PDF receipt
if (paymentStatus === 'paid' && existingOrder.paymentStatus !== 'paid') {
  const recipientEmail = order.user?.email || existingOrder.guestEmail
  
  if (recipientEmail && sendEmail !== false) {
    // Fire-and-forget background email
    (async () => {
      const pdfBuffer = await generateTemplatedPDF(order.id)
      await sendOrderConfirmationWithPDF({
        to: recipientEmail,
        orderNumber: order.orderNumber,
        customerName: order.address.name,
        items: order.items.map((item: any) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: order.total,
        pdfBuffer
      })
    })()
  }
}

// Handle cancelled orders - restore stock
if (status === 'cancelled' && existingOrder.status !== 'cancelled') {
  for (const item of order.items) {
    if (item.variantInfo) {
      try {
        const variantData = JSON.parse(item.variantInfo)
        if (variantData.variantId) {
          await prisma.productVariant.update({
            where: { id: variantData.variantId },
            data: { stock: { increment: item.quantity } }
          })
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    }
  }
}
```

### Frontend Pattern (Order List)

#### File: app/admin/orders/page.tsx
```typescript
// Key Features:
// 1. Auto-refresh every 30 seconds
// 2. Export orders functionality
// 3. Status dropdown with color coding
// 4. Payment status badges
// 5. Send receipt button
// 6. Share order functionality
// 7. Pagination

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
}

const paymentStatusColors: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800'
}

// Auto-refresh
useAutoRefresh(useCallback(() => fetchOrders(), [pagination.page]))

// Update status
const updateStatus = async (orderId: string, newStatus: string) => {
  setUpdating(orderId)
  try {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    
    if (res.ok) {
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      ))
    }
  } finally {
    setUpdating(null)
  }
}
```

---

## 3. User/Customer Management

### API Routes Pattern

#### GET /api/admin/users (List Users)
```typescript
const [users, total] = await Promise.all([
  prisma.user.findMany({
    include: {
      _count: { select: { orders: true } },
      loyaltyPoints: {
        include: {
          tier: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit
  }),
  prisma.user.count()
])
```

#### PUT /api/admin/users (Update User Role)
```typescript
// SuperAdmin can promote/demote users
const { userId, role } = await request.json()

// Validate role
const validRoles = ['customer', 'admin', 'superadmin']
if (!validRoles.includes(role)) {
  return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
}

const user = await prisma.user.update({
  where: { id: userId },
  data: { role }
})
```

### Frontend Pattern (Customer List)

#### File: app/admin/customers/page.tsx
```typescript
// Key Features:
// 1. Pagination
// 2. Search by name/email
// 3. Role badges
// 4. Loyalty tier management
// 5. AI customer persona analysis
// 6. Auto-refresh

const getTierBadge = (user: User) => {
  if (user.loyaltyPoints?.tier) {
    return (
      <span 
        className="px-2 py-1 rounded-full text-xs font-semibold text-white"
        style={{ backgroundColor: user.loyaltyPoints.tier.color }}
      >
        {user.loyaltyPoints.tier.displayName}
      </span>
    )
  }
  return <span className="px-2 py-1 rounded-full text-xs bg-gray-100">No Tier</span>
}
```

---

## 4. Authentication & Authorization Pattern

### File: lib/auth.ts
```typescript
// verifyAuth - Always fetches FRESH role from database
export async function verifyAuth(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) return null
    
    const payload = await verifyToken(token)
    if (!payload) return null
    
    // Fetch fresh user data from database to get current role
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, name: true, isActive: true }
    })
    
    if (!dbUser || dbUser.isActive === false) return null
    
    // Return user with FRESH role from database
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role, // Fresh role from DB, not stale JWT!
    }
  } catch (error) {
    return null
  }
}
```

### Admin Middleware Pattern
```typescript
async function checkAdmin(request: NextRequest) {
  const user = await verifyAuth(request)
  // Allow admin, superadmin, and seller roles
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'seller')) {
    return null
  }
  return user
}

// In API route:
export async function GET(request: NextRequest) {
  const admin = await checkAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // ... rest of logic
}
```

---

## 5. Image Upload Pattern

### File: app/api/upload/route.ts
```typescript
export async function POST(request: NextRequest) {
  // 1. Verify authentication
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  // 2. Parse form data
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const folder = formData.get('folder') as string || 'uploads'

  // 3. Cloudinary upload (preferred)
  const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                       process.env.CLOUDINARY_API_KEY && 
                       process.env.CLOUDINARY_API_SECRET

  if (useCloudinary) {
    const { v2: cloudinary } = await import('cloudinary')
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    return new Promise<NextResponse>((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: `your-app/${folder}`, 
          resource_type: 'auto' 
        },
        (error: any, result: any) => {
          if (error) {
            resolve(NextResponse.json({ error: error.message }, { status: 500 }))
          } else {
            resolve(NextResponse.json({
              success: true,
              url: result?.secure_url,
              publicId: result?.public_id
            }))
          }
        }
      )
      uploadStream.end(buffer)
    })
  } else {
    // 4. Local fallback (dev only)
    const timestamp = Date.now()
    const fileName = `${timestamp}_${file.name}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = path.join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    return NextResponse.json({
      success: true,
      url: `/uploads/${folder}/${fileName}`,
      warning: 'Using local storage. Configure Cloudinary for production.'
    })
  }
}
```

---

## Key Takeaways for ARKIVE Implementation

### 1. **Product Management Must-Haves**
- ✅ Variant system with individual SKUs, stock, pricing
- ✅ Image upload to Cloudinary (with local fallback)
- ✅ JSON stringified images array in DB
- ✅ Auto-slug generation from product name
- ✅ Optimistic UI updates for toggle actions
- ✅ Delete existing variants before creating new ones on update

### 2. **Order Management Must-Haves**
- ✅ Status enum: pending → confirmed → processing → shipped → delivered / cancelled
- ✅ Payment status: pending → paid / failed
- ✅ Auto-restore stock on cancellation
- ✅ Email notifications (non-blocking background tasks)
- ✅ Receipt PDF generation
- ✅ Auto-refresh for real-time updates

### 3. **User Management Must-Haves**
- ✅ Role-based access: customer, admin, superadmin
- ✅ Fresh role check from database (not cached in JWT)
- ✅ SuperAdmin can promote/demote users
- ✅ Pagination + search

### 4. **Authentication Pattern**
- ✅ `verifyAuth()` always fetches fresh role from DB
- ✅ `checkAdmin()` middleware for admin-only routes
- ✅ Support for admin, superadmin, and seller roles

### 5. **UI/UX Patterns**
- ✅ Mobile-first: card view on mobile, table on desktop
- ✅ Loading skeletons for better UX
- ✅ Optimistic UI updates with error rollback
- ✅ Toast notifications for feedback
- ✅ Confirmation dialogs for destructive actions
- ✅ Color-coded status badges

---

## Next Steps for ARKIVE

1. **Port Product Management**
   - Create `/admin/products/new` page
   - Implement product edit page
   - Add variant management UI component
   - Integrate image upload to Cloudinary

2. **Port Order Management**
   - Create order detail page
   - Add status update dropdown
   - Implement receipt generation
   - Add export functionality

3. **Port User Management**
   - Create role promotion/demotion UI
   - Add user search and filtering
   - Implement pagination

4. **Keep ARKIVE's UI**
   - Use ARKIVE's design system (Tailwind + shadcn/ui)
   - Maintain ARKIVE's aesthetic (modern, clean, professional)
   - Adapt SilkMart's logic, not their visual design
