# 🎨 ARKIVE — Full E-Commerce Implementation Plan
### Designed by **LIZA: The Web Architect** | Emerald Elegance Design System

---

> [!IMPORTANT]
> This is a **complete, production-ready** e-commerce website plan for **𝓐𝓡𝓚𝓘𝓥𝓔** — built for mobile-first users, cPanel shared hosting, and zero-bug deployment. Every decision below follows the **Liza 5-Stage Design Protocol** and mirrors the battle-tested patterns from SilkMartWebSite.

---

## 📋 Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Tech Stack](#2-tech-stack)
3. [Liza Design System](#3-liza-design-system)
4. [Database Schema](#4-database-schema)
5. [Project Structure](#5-project-structure)
6. [Feature Breakdown](#6-feature-breakdown)
7. [Role & Permission System](#7-role--permission-system)
8. [Environment Configuration](#8-environment-configuration)
9. [cPanel Deployment Strategy](#9-cpanel-deployment-strategy)
10. [Verification Plan](#10-verification-plan)

---

## 1. Architecture Overview

```mermaid
graph TB
    subgraph "Frontend (VIEW)"
        A[Next.js 15 App Router] --> B[React 19 Components]
        B --> C[Tailwind CSS + Liza Design System]
        B --> D[Framer Motion Animations]
        B --> E[Zustand State Management]
    end

    subgraph "Backend (CONTROLLER)"
        F[Next.js API Routes] --> G[Auth.js v5 / NextAuth]
        F --> H[Cloudinary Image Upload]
        F --> I[Nodemailer Email]
        F --> J[Rate Limiting Middleware]
    end

    subgraph "Data (MODEL)"
        K[Prisma ORM] --> L[(MySQL Database)]
        K --> M[Data Validation - Zod]
    end

    A --> F
    F --> K

    subgraph "Deployment"
        N[cPanel + Passenger] --> O[app.js NPROC Lock]
        O --> A
    end
```

### MVC Strict Separation
| Layer | Responsibility | Location |
|-------|---------------|----------|
| **Model** | Prisma schema, DB queries | `prisma/`, `lib/prisma.ts` |
| **View** | React components (display only) | `src/components/`, `src/app/` |
| **Controller** | Business logic, API routes | `src/app/api/`, `src/lib/`, `src/hooks/` |

---

## 2. Tech Stack

| Category | Technology | Version | Reason |
|----------|-----------|---------|--------|
| **Framework** | Next.js (App Router) | 15.x | Latest stable, cPanel proven |
| **UI Library** | React | 19.x | Modern concurrent features |
| **UI Components** | **Shadcn/ui** | Latest | Beautiful, accessible, customizable primitives |
| **Auth** | Auth.js (NextAuth v5) | beta.25 | Google OAuth + Credentials |
| **Database** | MySQL | 8.x | cPanel native, phpMyAdmin |
| **ORM** | Prisma | 5.x | Type-safe queries, migrations |
| **Styling** | Tailwind CSS | 3.4.x | Utility-first, small bundle |
| **Animations** | Framer Motion | 12.x | Smooth micro-interactions |
| **Icons** | Lucide React | 0.460 | Tree-shakable, consistent |
| **State** | Zustand | 5.x | Lightweight atomic state |
| **Images** | Cloudinary | 2.x | CDN, transforms, cPanel-safe |
| **Charts** | Recharts | 2.13 | Admin analytics |
| **Forms** | React Hook Form + Zod | Latest | Validation, performance |
| **Fonts** | Playfair Display + Inter | Google Fonts | Liza typography hierarchy |
| **Email** | Nodemailer | 7.x | SMTP via cPanel |
| **PWA** | next-pwa / Custom SW | Latest | Offline-capable native-feel app |

---

## 3. Liza Design System

### 3.1 Visual Language — "Emerald Elegance"

```
60-30-10 COLOR RULE
├── 60% Surface:  #fafafa (Warm White) / #ffffff (Cards)
├── 30% Text:     #1f2937 (Primary) / #6b7280 (Secondary)
└── 10% Accent:   #10b981 (Emerald) / #c9a962 (Gold CTAs)
```

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#10b981` | Buttons, links, active states |
| `--color-primary-dark` | `#059669` | Hover states, headers |
| `--color-accent-gold` | `#c9a962` | Premium CTAs, "Add to Cart" |
| `--color-surface` | `#ffffff` | Card backgrounds |
| `--color-background` | `#fafafa` | Page background |
| `--color-error` | `#ef4444` | Errors, sale badges |
| `--color-warning` | `#f59e0b` | Flash sale, stock alerts |

### 3.2 Typography
- **Display Font (𝓐𝓡𝓚𝓘𝓥𝓔 branding):** Playfair Display (elegant serif) — for headings, site name, hero text
- **Body Font:** Inter (modern sans-serif) — for all body text, buttons, nav
- **Brand Name:** Use calligraphic `𝓐𝓡𝓚𝓘𝓥𝓔` styling wherever the site name appears
- **Logo:** `/logo.png` — used in navbar, favicon, footer, emails

### 3.3 Bento Grid System
| Card Type | Grid Span | Use Case |
|-----------|-----------|----------|
| Hero CTA | `col-span-2 row-span-2` | Homepage promo banner |
| Feature Card | `col-span-1 row-span-1` | Category, stats |
| Product Card | `col-span-1 row-span-1` | Product listings |
| Wide Banner | `col-span-2 row-span-1` | Flash sale, promos |

### 3.4 Micro-Interactions
- **Buttons:** `scale(0.98)` on press, shadow elevation on hover
- **Cards:** `translateY(-4px)` + shadow on hover
- **Product Images:** `scale(1.08)` zoom on card hover
- **Page Transitions:** Framer Motion `slideUp` + `fadeIn`
- **Loading states:** Skeleton pulse animations

### 3.5 Shadcn/ui Components Used

All UI primitives are built on **Shadcn/ui** (Radix UI + Tailwind CSS) — themed with the Emerald Elegance design system:

| Shadcn Component | Usage in Arkive |
|-----------------|----------------|
| `Button` | All CTAs, actions — themed with emerald/gold variants |
| `Card` | Product cards, stat cards, Bento grid items |
| `Dialog` / `Sheet` | Modals, cart drawer, mobile menus |
| `Input` / `Textarea` | All forms — login, checkout, product forms |
| `Select` / `Combobox` | Category filters, variant selectors, sort options |
| `Badge` | Status badges (order status, stock level, role) |
| `Toast` | Success/error notifications |
| `Tabs` | Category tabs, admin panel tabs, settings sections |
| `Accordion` | FAQ, product details, filter panels |
| `Carousel` | Product image gallery, testimonials slider |
| `Dropdown Menu` | User menu, admin actions, sort options |
| `Avatar` | User profiles, admin list, chat |
| `Switch` | Toggle switches in admin settings |
| `Skeleton` | Loading states on every data-fetching page |
| `Table` | Admin data tables (orders, products, customers) |
| `Tooltip` | Icon button hints, info tooltips |
| `Popover` | Color picker, filter popovers |
| `Command` | Search command palette (Ctrl+K) |
| `Separator` | Section dividers |
| `Progress` | Upload progress, order status progress |
| `Alert` | Important notices, warnings |
| `Breadcrumb` | Page navigation breadcrumbs |
| `Sidebar` | Admin collapsible sidebar |

> All Shadcn components are customized via `components.json` to use the Emerald Elegance color palette, 16px+ border radius, and Inter/Playfair Display fonts.

### 3.6 Mobile-First (Primary User Base)

| Breakpoint | Width | Columns | Notes |
|------------|-------|---------|-------|
| Mobile | `<640px` | 2-col grid | Bottom nav, touch targets 48px+ |
| Tablet | `640-1024px` | 3-col grid | Side drawer nav |
| Desktop | `>1024px` | 4-col grid | Top navbar, hover effects |

**Mobile-Specific Components:**
- `BottomNav.tsx` — Fixed bottom navigation bar (Home, Shop, Cart, Account)
- Touch-friendly product cards with 48px minimum tap targets
- Pull-to-refresh on product lists
- Swipe gestures for image galleries
- All Shadcn `Dialog` components render as full-screen `Sheet` on mobile

---

## 4. Database Schema

### 4.1 Core Models (Prisma + MySQL)

> Based on the battle-tested SilkMart schema, adapted for MySQL and Arkive's product categories.

```prisma
// ============= CORE MODELS =============

model User {
  id              String    @id @default(uuid())
  email           String    @unique
  password        String?
  name            String
  phone           String?
  role            String    @default("customer") // customer, admin, superadmin
  isActive        Boolean   @default(true)
  permissions     Json      @default("[]") // JSON array for MySQL
  createdById     String?
  googleId        String?   @unique
  emailVerified   Boolean   @default(false)
  verificationToken String? @unique
  verificationExpiry DateTime?
  avatar          String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  addresses       Address[]
  orders          Order[]
  reviews         Review[]
  wishlists       Wishlist[]
  cart            Cart?
  sentMessages    InternalMessage[] @relation("SentMessages")
  receivedMessages InternalMessage[] @relation("ReceivedMessages")
  
  @@index([role])
  @@index([createdAt])
  @@index([isActive])
}

model Category {
  id          String    @id @default(uuid())
  name        String
  slug        String    @unique
  description String?
  image       String?
  emoji       String?   // Category emoji icon
  parentId    String?
  isActive    Boolean   @default(true)
  sortOrder   Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  products    Product[]
}

model Product {
  id           String    @id @default(uuid())
  name         String
  slug         String    @unique
  description  String    @db.Text
  categoryId   String
  basePrice    Float
  salePrice    Float?
  images       Json      // JSON array of Cloudinary URLs
  isFeatured   Boolean   @default(false)
  isBestseller Boolean   @default(false)
  isActive     Boolean   @default(true)
  metaTitle    String?
  metaDescription String? @db.Text
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  category     Category  @relation(fields: [categoryId], references: [id])
  variants     ProductVariant[]
  reviews      Review[]
  wishlists    Wishlist[]
  orderItems   OrderItem[]
  cartItems    CartItem[]
  flashSales   FlashSaleProduct[]
  
  @@index([categoryId])
  @@index([isActive, isFeatured])
  @@index([createdAt])
  @@index([basePrice])
}

model ProductVariant {
  id        String   @id @default(uuid())
  productId String
  sku       String   @unique
  size      String?
  color     String?
  stock     Int      @default(0)
  price     Float?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model Cart {
  id        String     @id @default(uuid())
  userId    String     @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     CartItem[]
}

model CartItem {
  id        String   @id @default(uuid())
  cartId    String
  productId String
  variantId String?
  quantity  Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@index([cartId])
  @@index([productId])
}

model Address {
  id         String   @id @default(uuid())
  userId     String?
  guestEmail String?
  name       String
  phone      String
  address    String
  city       String
  district   String
  postalCode String?
  isDefault  Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  user       User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  orders     Order[]
}

model Order {
  id             String    @id @default(uuid())
  orderNumber    String    @unique
  userId         String?
  guestEmail     String?
  addressId      String
  name           String?
  phone          String?
  subtotal       Float
  shippingCost   Float
  discount       Float     @default(0)
  total          Float
  couponCode     String?
  status         String    @default("pending")
  paymentMethod  String
  paymentStatus  String    @default("pending")
  trackingNumber String?
  notes          String?   @db.Text
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  user           User?     @relation(fields: [userId], references: [id])
  address        Address   @relation(fields: [addressId], references: [id])
  items          OrderItem[]
  payment        Payment?
  
  @@index([userId])
  @@index([status])
  @@index([paymentStatus])
  @@index([createdAt])
}

model OrderItem {
  id          String   @id @default(uuid())
  orderId     String
  productId   String
  variantInfo String?  @db.Text // JSON: {size, color}
  quantity    Int
  price       Float
  createdAt   DateTime @default(now())
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product     Product  @relation(fields: [productId], references: [id])
  
  @@index([orderId])
  @@index([productId])
}

model Payment {
  id              String   @id @default(uuid())
  orderId         String   @unique
  transactionId   String?  @unique
  method          String
  amount          Float
  status          String   @default("pending")
  gatewayResponse String?  @db.Text
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  order           Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
}
```

### 4.2 Feature Models

```prisma
// ============= REVIEWS & WISHLISTS =============

model Review {
  id          String   @id @default(uuid())
  productId   String
  userId      String
  rating      Int      // 1-5
  comment     String?  @db.Text
  photos      Json?    // JSON array of photo URLs
  isApproved  Boolean  @default(false)
  adminReply  String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([productId])
  @@index([userId])
  @@index([isApproved])
}

model Wishlist {
  id        String   @id @default(uuid())
  userId    String
  productId String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
}

// ============= COUPONS & FLASH SALES =============

model Coupon {
  id            String   @id @default(uuid())
  code          String   @unique
  description   String?
  discountType  String   // percentage, fixed, free_shipping
  discountValue Float
  minOrderValue Float?
  maxDiscount   Float?
  validFrom     DateTime
  validUntil    DateTime
  usageLimit    Int?
  usedCount     Int      @default(0)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model FlashSale {
  id              String    @id @default(uuid())
  name            String
  description     String?
  discountPercent Float
  startTime       DateTime
  endTime         DateTime
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  products        FlashSaleProduct[]
}

model FlashSaleProduct {
  id          String    @id @default(uuid())
  flashSaleId String
  productId   String
  flashSale   FlashSale @relation(fields: [flashSaleId], references: [id], onDelete: Cascade)
  product     Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([flashSaleId, productId])
}

// ============= LIVE CHAT =============

model ChatSession {
  id            String        @id @default(uuid())
  sessionId     String        @unique
  userId        String?
  customerName  String        @default("Guest")
  customerEmail String?
  status        String        @default("active")
  assignedTo    String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  messages      ChatMessage[]
}

model ChatMessage {
  id         String      @id @default(uuid())
  sessionId  String
  senderType String      // customer, admin, system
  senderId   String?
  senderName String
  message    String      @db.Text
  isRead     Boolean     @default(false)
  createdAt  DateTime    @default(now())
  session    ChatSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  
  @@index([sessionId])
  @@index([senderType])
  @@index([isRead])
}

// ============= INTERNAL MESSAGING =============

model InternalMessage {
  id         String   @id @default(uuid())
  senderId   String
  receiverId String
  content    String   @db.Text
  isRead     Boolean  @default(false)
  createdAt  DateTime @default(now())
  sender     User     @relation("SentMessages", fields: [senderId], references: [id], onDelete: Cascade)
  receiver   User     @relation("ReceivedMessages", fields: [receiverId], references: [id], onDelete: Cascade)
  
  @@index([senderId])
  @@index([receiverId])
  @@index([isRead])
}

// ============= NOTIFICATIONS =============

model Notification {
  id        String   @id @default(uuid())
  userId    String
  type      String   // order, promotion, stock, chat
  title     String
  message   String
  isRead    Boolean  @default(false)
  link      String?
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([type])
  @@index([isRead])
  @@index([createdAt])
}

// ============= CONTACT MESSAGES =============

model ContactMessage {
  id         String   @id @default(uuid())
  name       String
  email      String
  phone      String?
  subject    String
  message    String   @db.Text
  isRead     Boolean  @default(false)
  isReplied  Boolean  @default(false)
  adminNotes String?  @db.Text
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  @@index([isRead])
  @@index([createdAt])
}

// ============= SITE SETTINGS (SuperAdmin Control) =============

model SiteSettings {
  id                String   @id @default("main")
  
  // Store Identity
  storeName         String   @default("𝓐𝓡𝓚𝓘𝓥𝓔")
  storeTagline      String   @default("Curated Collections for Every Style")
  storeDescription  String?  @db.Text
  logo              String?
  favicon           String?
  
  // Stats
  stat1Value        String   @default("5,000+")
  stat1Label        String   @default("Products Sold")
  stat2Value        String   @default("2,000+")
  stat2Label        String   @default("Happy Customers")
  stat3Value        String   @default("50+")
  stat3Label        String   @default("Collections")
  stat4Value        String   @default("4.9")
  stat4Label        String   @default("Average Rating")
  
  // Features Toggle
  showFreeShipping  Boolean  @default(true)
  showEasyReturns   Boolean  @default(true)
  showCOD           Boolean  @default(true)
  showAuthentic     Boolean  @default(true)
  
  // Feature Text
  featureShippingTitle  String @default("Free Shipping")
  featureShippingDesc   String @default("Orders over ৳2,000")
  featureReturnTitle    String @default("Easy Returns")
  featureReturnDesc     String @default("7-day return policy")
  featureCODTitle       String @default("COD Available")
  featureCODDesc        String @default("Cash on Delivery")
  featureAuthenticTitle String @default("100% Authentic")
  featureAuthenticDesc  String @default("Genuine products only")
  
  // Contact Info
  storeEmail        String   @default("contact@arkivee.com")
  email2            String?
  storePhone        String   @default("+8801339705214")
  phone2            String?
  storeAddress      String   @default("Bangladesh")
  addressLine2      String?
  workingDays       String   @default("Sat - Thu")
  workingHours      String   @default("10AM - 8PM")
  offDays           String   @default("Friday: 3PM - 8PM")
  
  // Social Links
  facebook          String?
  instagram         String?
  whatsapp          String?
  
  // About Page
  aboutTitle        String   @default("About 𝓐𝓡𝓚𝓘𝓥𝓔")
  aboutContent      String?  @db.Text
  aboutMission      String?  @db.Text
  aboutVision       String?  @db.Text
  
  // Footer
  footerAbout       String?  @db.Text
  copyrightText     String   @default("© 2026 𝓐𝓡𝓚𝓘𝓥𝓔. All rights reserved.")
  
  // SEO
  metaTitle         String?
  metaDescription   String?
  metaKeywords      String?
  
  // Chat Settings
  chatStatus        String   @default("online")
  
  // Promo Banner
  promoEnabled      Boolean  @default(true)
  promoCode         String   @default("WELCOME10")
  promoMessage      String   @default("🎉 Use code WELCOME10 for 10% OFF your first order!")
  promoEndTime      DateTime?
  
  // === PWA APP SETTINGS (SuperAdmin Controlled) ===
  pwaInstallBannerEnabled  Boolean @default(true)  // Show "Add to Home Screen" banner
  pwaInstallButtonEnabled  Boolean @default(true)  // Show install button in menu
  pwaAppName              String  @default("𝓐𝓡𝓚𝓘𝓥𝓔")
  pwaShortName            String  @default("Arkive")
  pwaThemeColor           String  @default("#10b981")
  pwaBackgroundColor      String  @default("#ffffff")
  pwaSplashText           String  @default("Curated Collections")
  pwaStartPage            String  @default("/")     // Which page opens on PWA launch
  
  // Shipping & Payment
  shippingCost      Float    @default(60)
  freeShippingMin   Float    @default(2000)
  codEnabled        Boolean  @default(true)
  
  // === DYNAMIC PAYMENT GATEWAYS (SuperAdmin Controlled) ===
  // bKash
  bkashEnabled      Boolean  @default(false)
  bkashType         String   @default("personal") // personal, agent, merchant
  bkashNumber       String   @default("")
  bkashAccountName  String   @default("")
  bkashInstructions String?  @db.Text // "Send money to this number..."
  
  // Nagad
  nagadEnabled      Boolean  @default(false)
  nagadType         String   @default("personal") // personal, merchant
  nagadNumber       String   @default("")
  nagadAccountName  String   @default("")
  nagadInstructions String?  @db.Text
  
  // Rocket (future-proof)
  rocketEnabled     Boolean  @default(false)
  rocketNumber      String   @default("")
  rocketAccountName String   @default("")
  rocketInstructions String? @db.Text
  
  // Bank Transfer (future-proof)
  bankEnabled       Boolean  @default(false)
  bankName          String   @default("")
  bankAccountNumber String   @default("")
  bankAccountName   String   @default("")
  bankBranch        String   @default("")
  bankRoutingNumber String   @default("")
  bankInstructions  String?  @db.Text
  
  updatedAt         DateTime @updatedAt
}

// ============= INVENTORY TRACKING =============

model InventoryLog {
  id            String   @id @default(uuid())
  productId     String
  variantId     String?
  previousStock Int
  newStock      Int
  change        Int
  reason        String   // order, restock, adjustment, return
  orderId       String?
  userId        String
  notes         String?
  createdAt     DateTime @default(now())
  
  @@index([productId])
  @@index([createdAt])
}

// ============= NEWSLETTER =============

model NewsletterSubscriber {
  id        String    @id @default(uuid())
  email     String    @unique
  source    String?
  isActive  Boolean   @default(true)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

**Total Models: 22** — covers all essential e-commerce features without bloat.

---

## 5. Project Structure

```
arkive-modern/
├── .agent/
│   └── skills/liza-web-architect/       # Liza Agent Skill
├── prisma/
│   ├── schema.prisma                    # Database schema (MySQL)
│   └── seed.ts                          # Seed data script
├── public/
│   ├── logo.png                         # Arkive logo
│   ├── manifest.json                    # PWA manifest
│   ├── sw.js                            # Service Worker
│   ├── offline.html                     # Offline fallback page
│   └── icons/                           # PWA icons (72-512px)
├── src/
│   ├── app/
│   │   ├── (shop)/                      # STOREFRONT (Route Group)
│   │   │   ├── layout.tsx               # Shop layout (Navbar + Footer + BottomNav)
│   │   │   ├── page.tsx                 # Homepage
│   │   │   ├── shop/page.tsx            # All products with filters
│   │   │   ├── category/[slug]/         # Category page
│   │   │   ├── product/[slug]/          # Product detail
│   │   │   ├── cart/page.tsx            # Cart
│   │   │   ├── checkout/page.tsx        # Checkout
│   │   │   ├── wishlist/page.tsx        # Wishlist
│   │   │   ├── login/page.tsx           # Login
│   │   │   ├── register/page.tsx        # Register
│   │   │   ├── account/                 # Customer dashboard
│   │   │   │   ├── page.tsx             # Account overview
│   │   │   │   ├── orders/page.tsx      # Order history
│   │   │   │   ├── addresses/page.tsx   # Saved addresses
│   │   │   │   ├── chat/page.tsx        # Customer chat
│   │   │   │   └── profile/page.tsx     # Edit profile
│   │   │   ├── about/page.tsx           # About page
│   │   │   ├── contact/page.tsx         # Contact page
│   │   │   └── flash-sale/page.tsx      # Flash sales
│   │   │
│   │   ├── (admin)/admin/               # ADMIN PANEL (Route Group)
│   │   │   ├── layout.tsx               # Admin sidebar layout
│   │   │   ├── page.tsx                 # Admin dashboard (Bento analytics)
│   │   │   ├── products/                # Product CRUD
│   │   │   │   ├── page.tsx             # Product list
│   │   │   │   ├── new/page.tsx         # Add product
│   │   │   │   └── [id]/edit/page.tsx   # Edit product
│   │   │   ├── orders/page.tsx          # Order management
│   │   │   ├── customers/page.tsx       # Customer management
│   │   │   ├── categories/page.tsx      # Category management
│   │   │   ├── chat/page.tsx            # Live chat admin
│   │   │   ├── coupons/page.tsx         # Coupon management
│   │   │   ├── flash-sales/page.tsx     # Flash sale management
│   │   │   ├── reviews/page.tsx         # Review moderation
│   │   │   ├── messages/page.tsx        # Contact messages
│   │   │   ├── analytics/page.tsx       # Sales analytics
│   │   │   ├── inventory/page.tsx       # Stock management
│   │   │   ├── notifications/page.tsx   # Notification center
│   │   │   ├── settings/page.tsx        # Site settings
│   │   │   ├── users/page.tsx           # User/admin management
│   │   │   └── super-console/page.tsx   # SuperAdmin Console ⚡
│   │   │
│   │   ├── api/                         # API ROUTES
│   │   │   ├── auth/[...nextauth]/      # Auth.js handler
│   │   │   ├── products/                # Product CRUD API
│   │   │   ├── categories/              # Category API  
│   │   │   ├── cart/                     # Cart operations
│   │   │   ├── orders/                  # Order management
│   │   │   ├── reviews/                 # Review operations
│   │   │   ├── wishlist/                # Wishlist operations
│   │   │   ├── chat/                    # Live chat API
│   │   │   ├── internal-chat/           # Internal messaging
│   │   │   ├── notifications/           # Notification API
│   │   │   ├── coupons/                 # Coupon operations
│   │   │   ├── flash-sales/             # Flash sale API
│   │   │   ├── upload/                  # Cloudinary upload
│   │   │   ├── contact/                 # Contact form
│   │   │   ├── newsletter/              # Newsletter subscribe
│   │   │   ├── settings/                # Site settings API
│   │   │   ├── admin/                   # Admin-only APIs
│   │   │   │   ├── users/               # User management
│   │   │   │   ├── analytics/           # Analytics data
│   │   │   │   └── inventory/           # Inventory operations
│   │   │   └── user/                    # Customer APIs
│   │   │       ├── profile/             # Profile update
│   │   │       └── addresses/           # Address CRUD
│   │   │
│   │   ├── globals.css                  # Liza Design System CSS
│   │   ├── layout.tsx                   # Root layout
│   │   ├── robots.ts                    # SEO robots
│   │   └── sitemap.ts                   # SEO sitemap
│   │
│   ├── components/
│   │   ├── ui/                          # BASE UI (Reusable)
│   │   │   ├── Button.tsx               # Liza-styled button
│   │   │   ├── Card.tsx                 # Bento card component
│   │   │   ├── Input.tsx                # Form input
│   │   │   ├── Badge.tsx                # Status badges
│   │   │   ├── Modal.tsx                # Dialog/Modal
│   │   │   ├── Select.tsx               # Dropdown select
│   │   │   ├── Textarea.tsx             # Text area
│   │   │   ├── Switch.tsx               # Toggle switch
│   │   │   ├── Skeleton.tsx             # Loading skeleton
│   │   │   ├── Toast.tsx                # Notification toasts
│   │   │   ├── ImageUpload.tsx          # Cloudinary uploader
│   │   │   └── DataTable.tsx            # Admin data table
│   │   │
│   │   ├── layout/                      # LAYOUT COMPONENTS
│   │   │   ├── Navbar.tsx               # Top navigation
│   │   │   ├── Footer.tsx               # Site footer
│   │   │   ├── BottomNav.tsx            # Mobile bottom nav
│   │   │   ├── Sidebar.tsx              # Admin sidebar
│   │   │   ├── Breadcrumb.tsx           # Page breadcrumbs
│   │   │   └── SearchBar.tsx            # Search with autocomplete
│   │   │
│   │   ├── store/                       # STOREFRONT COMPONENTS
│   │   │   ├── HeroSection.tsx          # Homepage hero (Bento)
│   │   │   ├── CategoryBar.tsx          # Category navigation
│   │   │   ├── ProductCard.tsx          # Product card
│   │   │   ├── ProductGrid.tsx          # Product grid layout
│   │   │   ├── ProductDetail.tsx        # Product detail view
│   │   │   ├── ProductGallery.tsx       # Image gallery
│   │   │   ├── CartDrawer.tsx           # Mini cart overlay
│   │   │   ├── FlashSaleBanner.tsx      # Flash sale countdown
│   │   │   ├── PromoBar.tsx             # Top promo banner
│   │   │   ├── TestimonialsSection.tsx  # Social proof
│   │   │   ├── NewsletterSection.tsx    # Email subscribe
│   │   │   └── FeaturesBar.tsx          # Trust signals
│   │   │
│   │   ├── admin/                       # ADMIN COMPONENTS
│   │   │   ├── StatsCard.tsx            # Dashboard stat card
│   │   │   ├── OrderTable.tsx           # Orders table
│   │   │   ├── ProductForm.tsx          # Product add/edit form
│   │   │   ├── ChatPanel.tsx            # Live chat panel
│   │   │   ├── AnalyticsCharts.tsx      # Revenue/order charts
│   │   │   ├── CustomerList.tsx         # Customer management
│   │   │   ├── PermissionManager.tsx    # Role permissions UI
│   │   │   └── SuperConsole.tsx         # SuperAdmin component
│   │   │
│   │   ├── providers/                   # CONTEXT PROVIDERS
│   │   │   ├── AuthProvider.tsx         # Auth session provider
│   │   │   ├── ThemeProvider.tsx        # Theme context
│   │   │   └── ToastProvider.tsx        # Toast notifications
│   │   │
│   │   ├── ai/                          # AI COMPONENTS
│   │   │   ├── AIChatAssist.tsx          # Admin chat AI assist
│   │   │   ├── AICouponGenerator.tsx     # AI coupon strategy
│   │   │   ├── AIImageGenerator.tsx      # AI image generation
│   │   │   ├── AIMarketingTools.tsx      # Marketing copy AI
│   │   │   ├── AIOrderInsights.tsx       # Order analysis AI
│   │   │   ├── AIReviewAssist.tsx        # Review moderation AI
│   │   │   ├── AISEOGenerator.tsx        # SEO tag generator
│   │   │   ├── AITranslator.tsx          # Content translator
│   │   │   └── AIAnnouncementGenerator.tsx # Promo copy AI
│   │   │
│   │   ├── product/                     # PRODUCT AI COMPONENTS
│   │   │   ├── AISmartBundles.tsx        # AI bundle suggestions
│   │   │   ├── AISizeRecommender.tsx     # Size recommendation
│   │   │   └── AIReviewSummary.tsx       # Review summary AI
│   │   │
│   │   ├── LiveChat.tsx                 # Customer-facing live chat
│   │   ├── AIChatAssistant.tsx          # AI-powered chat bot
│   │   ├── AIProductAssist.tsx          # Product page AI assist
│   │   └── AIRecommendations.tsx        # Smart recommendations
│   │
│   ├── lib/                             # BUSINESS LOGIC
│   │   ├── prisma.ts                    # Prisma client singleton
│   │   ├── auth.ts                      # Auth.js config
│   │   ├── auth.config.ts               # Auth providers
│   │   ├── utils.ts                     # Utility functions
│   │   ├── validations.ts              # Zod schemas
│   │   ├── permissions-config.ts        # Permission definitions
│   │   ├── email.ts                     # Email templates + sending
│   │   ├── cloudinary.ts               # Cloudinary helpers
│   │   ├── rate-limit.ts               # Rate limiting
│   │   ├── cache.ts                     # Simple in-memory cache
│   │   ├── gemini-ai.ts                # Gemini API client wrapper
│   │   ├── ai-assistant.ts             # Core AI functions
│   │   └── ai-config.ts                # AI feature toggle system
│   │
│   ├── hooks/                           # CUSTOM HOOKS
│   │   ├── useAuth.ts                   # Auth state hook
│   │   ├── useCart.ts                   # Cart operations
│   │   ├── useWishlist.ts              # Wishlist operations
│   │   └── useDebounce.ts              # Debounce utility
│   │
│   ├── stores/                          # ZUSTAND STATE
│   │   ├── cartStore.ts                # Cart store
│   │   ├── chatStore.ts                # Chat store
│   │   └── uiStore.ts                  # UI state (modals, drawers)
│   │
│   ├── types/                           # TYPE DEFINITIONS
│   │   └── index.ts                     # All TypeScript interfaces
│   │
│   └── middleware.ts                    # Rate limiting middleware
│
├── .env.local                           # Local development env
├── .env                                 # Production (cPanel) env
├── app.js                               # cPanel Passenger entry
├── next.config.ts                       # Next.js config (cPanel optimized)
├── tailwind.config.ts                   # Tailwind config
├── postcss.config.mjs                   # PostCSS config
├── tsconfig.json                        # TypeScript config
├── package.json                         # Dependencies
├── deploy.sh                            # cPanel deploy script
└── IMPLEMENTATION_PLAN.md               # This file
```

---

## 6. Feature Breakdown

### 6.1 🏠 Homepage — Extraordinary, Eye-Catching, Mobile-First

> [!IMPORTANT]
> The homepage is the **first impression**. It must make customers want to browse and buy instantly. Every section is designed to convert, with stunning visuals and buttery-smooth animations.

**Mobile Homepage Layout (scrolling top to bottom):**

| # | Section | Component | Mobile Experience |
|---|---------|-----------|------------------|
| 1 | Promo Bar | `PromoBar.tsx` | Dismissible top banner with promo code, Shadcn `Alert` |
| 2 | Navigation | `Navbar.tsx` | Sticky top — logo, search icon, cart badge, hamburger menu |
| 3 | Hero Section | `HeroSection.tsx` | **Full-width hero card** with lifestyle product photo, animated tagline "𝓐𝓡𝓚𝓘𝓥𝓔 — Curated for You", gradient overlay, CTA button with gold glow animation. Framer Motion `fadeIn` + `slideUp`. |
| 4 | Category Bar | `CategoryBar.tsx` | **Horizontal scroll** — beautiful circular emoji cards with labels (Women 👩, Men 👨, Unisex 🤝, Stationery ✏️, Combos 🎁). Tap to drill down. Glass morphism card style. |
| 5 | Flash Sale | `FlashSaleBanner.tsx` | **Animated countdown timer** — gradient banner with pulsing "🔥 FLASH SALE" badge, horizontally scrollable sale products below. Urgency-driven design. |
| 6 | Featured Products | `ProductGrid.tsx` | **2-col Bento grid** on mobile — product cards with image zoom on hover/tap, price, sale badge, wishlist heart icon, quick add-to-cart button. Lazy-loaded with skeleton loading. |
| 7 | "Shop by Category" | `CategoryShowcase.tsx` | **Large visual cards** — each category (Women, Men, etc.) with full-bleed lifestyle image + overlay text. Tap → category drill-down. |
| 8 | Bestsellers | `ProductGrid.tsx` | Auto-scrolling carousel of bestselling items with "🏆 Bestseller" badge |
| 9 | Trust Signals | `FeaturesBar.tsx` | 4 icon cards in 2x2 grid: Free Shipping, COD, Easy Returns, 100% Authentic. Shadcn `Card` with emerald icons. |
| 10 | Testimonials | `TestimonialsSection.tsx` | **Auto-playing carousel** — customer reviews with star ratings, photos, names. Shadcn `Carousel`. |
| 11 | Newsletter | `NewsletterSection.tsx` | Gradient background, animated email input, "Get 10% Off" CTA |
| 12 | Footer | `Footer.tsx` | Compact mobile footer — quick links, social icons, contact, copyright |
| 13 | Bottom Nav | `BottomNav.tsx` | **Fixed bottom bar**: Home / Shop / Cart (with badge) / Account — always visible, 56px height, haptic-feel active states |

### 6.2 🛍️ Shop & Product Pages — Category Drill-Down UX

> [!IMPORTANT]
> **The core UX is category-focused navigation.** Users click a top-level category (e.g. "Women") → see subcategories (Churi, Bracelet, etc.) → click subcategory → see product designs. This drill-down must feel instant and eye-catching.

**Navigation Flow:**
```
Homepage → [Women] → Shows: Earrings | Ring | Churi | Bracelet | Bag | Purse | Necklace | Nupur
                       ↓ Click "Churi"
                       → Grid of Churi designs (beautiful product cards)
                       ↓ Click a design
                       → Product Detail (gallery, size, price, add-to-cart)
```

**Category Landing Pages (`/category/[slug]`):**
- **Header:** Full-width category banner with lifestyle image
- **Subcategory Pills:** Horizontal scrollable pill buttons (styled, not plain)
- **Product Grid:** 2-col mobile, 4-col desktop Bento cards
- **Filters:** Price range slider, sort (newest, price, popular), in-stock toggle
- **Infinite Scroll:** Products load as user scrolls (no pagination clicks)

**Product Detail Page (`/product/[slug]`):**
- **Image Gallery:** Swipeable on mobile, thumbnail strip on desktop
- **Variant Selector:** Size/color chips with visual preview
- **Stock Indicator:** "In Stock" (green) / "Low Stock" (orange) / "Out of Stock" (gray)
- **Add to Cart CTA:** Full-width emerald button on mobile, sticky bottom bar
- **Reviews Section:** Star ratings, customer photos, admin replies
- **Related Products:** "You may also like" carousel from same subcategory
- **AI Suggestions:** "Complete the look" AI-powered recommendations

### 6.3 🛒 Cart & Checkout (Dynamic Payment)

- **Cart drawer** (mini cart overlay on add-to-cart)
- **Full cart page** with quantity controls, remove items, coupon input
- **Checkout** with address form + **dynamic payment methods:**
  - **COD** — Always visible if enabled in SiteSettings
  - **bKash** — Shows if `bkashEnabled: true`, displays number + instructions from SiteSettings
  - **Nagad** — Shows if `nagadEnabled: true`, displays number + instructions from SiteSettings
  - **Rocket/Bank** — Same dynamic toggle pattern
  - Payment method cards show account name, number, and custom instructions set by SuperAdmin
  - Customer enters Transaction ID after manual payment
- **Order confirmation** page with order number + payment instructions if manual

### 6.4 👤 Customer Account

| Feature | Page | Description |
|---------|------|-------------|
| Dashboard | `/account` | Order summary, profile overview |
| Orders | `/account/orders` | Order history with status tracking |
| Addresses | `/account/addresses` | Manage shipping addresses |
| Profile | `/account/profile` | Edit name, email, phone, password, avatar |
| Chat | `/account/chat` | Direct message to support |
| Wishlist | `/wishlist` | Saved products list |

### 6.5 🔐 Authentication

- **Login** with email/password + Google OAuth
- **Register** with email verification
- **Forgot Password** + Reset flow
- **Session management** via Auth.js v5
- **Role-based redirects** (customer → shop, admin → admin panel)

### 6.6 💬 Live Chat System

| Feature | Description |
|---------|-------------|
| Customer Widget | Floating chat bubble (bottom-right) |
| Guest Chat | No login required, session-based |
| Admin Panel | Real-time chat view in admin |
| Chat History | Persistent across sessions |
| Typing Indicator | Shows when admin is typing |
| Sound Alert | Notification sound for new messages |
| Status | Online/Away/Offline (controlled by SuperAdmin) |

### 6.7 📊 Admin Dashboard

- **Bento Grid analytics** — Revenue, Orders, Customers, Products (cards)
- **Revenue chart** (Recharts line chart, last 7/30 days)
- **Recent orders** table
- **Low stock alerts**
- **Pending reviews**
- **Unread messages count**

### 6.8 🛡️ Admin Features

| Section | Route | Features |
|---------|-------|----------|
| Products | `/admin/products` | CRUD, image upload, variants, categories |
| Orders | `/admin/orders` | Status update, tracking, payment confirm |
| Customers | `/admin/customers` | List, activate/deactivate, order history |
| Categories | `/admin/categories` | CRUD with emoji + image |
| Coupons | `/admin/coupons` | Create/edit/delete, usage tracking |
| Flash Sales | `/admin/flash-sales` | Create sales with products + timer |
| Reviews | `/admin/reviews` | Approve/reject, admin reply |
| Chat | `/admin/chat` | Live customer support |
| Messages | `/admin/messages` | Contact form messages |
| Inventory | `/admin/inventory` | Stock adjustments with log |
| Analytics | `/admin/analytics` | Revenue, order, customer charts |
| Settings | `/admin/settings` | Dynamic site settings |
| Users | `/admin/users` | Admin/user management + permissions |
| Notifications | `/admin/notifications` | Admin notification center |

### 6.9 ⚡ SuperAdmin Console (`/admin/super-console`)

This is the **crown jewel** — a dedicated SuperAdmin-only dashboard with **full system control**.

| Feature | Description |
|---------|-------------|
| **Site Identity** | Change store name, logo, tagline, favicon |
| **Admin Management** | Create admins, set roles, assign permissions |
| **Permission Control** | Granular per-admin permission toggling |
| **System Statistics** | Total users, orders, revenue, storage usage |
| **Feature Toggles** | Enable/disable: COD, returns, free shipping, promo banners |
| **Contact Management** | Update all phones, emails, addresses, social links |
| **About/Footer** | Edit about page content, footer text, copyright |
| **SEO Settings** | Meta title, description, keywords |
| **Chat Control** | Set chat status (online/away/offline) |
| **💳 Payment Gateway Control** | **Dynamic enable/disable each gateway (COD, bKash, Nagad, Rocket, Bank).** For each: toggle on/off, set account number, account name, account type (personal/agent/merchant), and custom payment instructions. All changes reflect instantly on checkout page. |
| **Shipping Settings** | Shipping costs, free shipping threshold |
| **Promo Management** | Enable promo bar, set code + message |
| **📱 PWA App Control** | **Toggle PWA install banner on/off.** Toggle PWA install button on/off. Both only appear on mobile. Control PWA app name, theme color, splash screen text. |
| **Category Management** | **Admin can add/remove/edit/reorder categories and subcategories** dynamically. No code changes needed — fully from dashboard. |
| **User Upgrades** | Promote customer → admin, set permissions |
| **Danger Zone** | Deactivate admins, bulk actions |

---

## 7. Role & Permission System

### 7.1 Role Hierarchy

```
SuperAdmin (GOD MODE — full access to everything)
├── Admin (configurable access via permissions)
│   ├── Manages products, orders, customers
│   ├── Access controlled by SuperAdmin
│   └── Cannot access Super Console
└── Customer (standard user)
    ├── Browse, cart, wishlist, order
    └── Profile management, chat
```

### 7.2 Permission Categories

| Category | Permissions | Who Can Grant |
|----------|------------|---------------|
| **Admin Abilities** | manage_products, manage_orders, manage_users, manage_marketing, manage_content, manage_settings, manage_communications, manage_storage | SuperAdmin |
| **Restricted** | manage_admins, access_financial_reports, database_backup, view_audit_logs, override_pricing, bulk_user_actions | SuperAdmin Only |
| **Feature Access** | access_analytics, access_flash_sales, access_bulk_upload, access_export_data | SuperAdmin |

### 7.3 Permission Enforcement

```typescript
// Every admin API route checks:
const user = await getServerSession()
if (user.role === 'superadmin') → FULL ACCESS
if (user.role === 'admin') → CHECK user.permissions.includes(requiredPermission)
if (user.role === 'customer') → REJECT (403)
```

---

## 8. Environment Configuration

### 8.1 `.env.local` — Local Development

```env
# Database (Local MySQL via XAMPP/MAMP)
DATABASE_URL="mysql://root:@localhost:3306/arkive_store"

# Auth
JWT_SECRET="dev-secret-key-change-in-production"
AUTH_SECRET="dev-auth-secret-key"
NEXTAUTH_URL="http://localhost:3000"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_URL="http://localhost:3000"

# Google OAuth
AUTH_GOOGLE_ID="your-google-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="duh7hpxhd"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# AI (Optional)
GOOGLE_AI_API_KEY="your-gemini-api-key"

# Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"
```

### 8.2 `.env` — cPanel Production

```env
# Database (cPanel MySQL)
DATABASE_URL="mysql://cpanel_user:password@127.0.0.1:3306/cpanel_arkive_db"

# Auth
JWT_SECRET="production-strong-random-secret"
AUTH_SECRET="production-auth-strong-secret"
NEXTAUTH_URL="https://arkivee.com"
AUTH_URL="https://arkivee.com"
NEXT_PUBLIC_APP_URL="https://arkivee.com"
NEXT_PUBLIC_URL="https://arkivee.com"

# Google OAuth
AUTH_GOOGLE_ID="your-google-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="duh7hpxhd"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# AI
GOOGLE_AI_API_KEY="your-gemini-api-key"

# Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"
```

> [!WARNING]
> **NEVER commit `.env` to Git!** The `.gitignore` already excludes `.env*`. The `.env` file must be manually uploaded to cPanel via File Manager.

---

## 9. cPanel Deployment Strategy

### 9.1 Proven Pattern (from SilkMartWebSite)

The deployment follows the exact same battle-tested approach used in SilkMart:

```
Git Push → cPanel Git Pull → npm install → prisma generate → next build → Passenger restarts app.js
```

### 9.2 Key Files for cPanel

#### `app.js` — Passenger Entry Point (NPROC-Locked)
- Forces `UV_THREADPOOL_SIZE=1`
- Spoofs `os.cpus()` to return 1 CPU
- Controls `child_process.fork()` and `child_process.spawn()`
- Starts Next.js in single-process production mode

#### `next.config.ts` — Optimized for Shared Hosting
- `compress: false` (Apache/Passenger handles it)
- `images.unoptimized: true` (Cloudinary handles optimization)
- `experimental.cpus: 1` (single CPU core)
- `experimental.workerThreads: false` (no worker threads)
- `eslint.ignoreDuringBuilds: true` (save resources)
- `typescript.ignoreBuildErrors: true` (save resources)
- Security headers (X-Frame-Options, CSP, etc.)
- Aggressive caching headers for static assets

#### `deploy.sh` — Automated Deploy Script
```bash
#!/bin/bash
cd ~/arkivee.com
git pull origin main
npm install --production=false
npx prisma generate
NODE_OPTIONS="--max-old-space-size=512" npm run build
touch tmp/restart.txt  # Signal Passenger to restart
```

#### `.htaccess` — Apache Configuration
```apache
PassengerNodejs /home/cpanel_user/.nvm/versions/node/v20.x.x/bin/node
PassengerAppRoot /home/cpanel_user/arkivee.com
PassengerStartupFile app.js
```

### 9.3 Database Setup

1. Create MySQL database in cPanel → `phpMyAdmin`
2. Run: `npx prisma db push` (creates all tables)
3. Run: `node prisma/seed.js` (seeds default data, categories, admin user)

---

## 10. Verification Plan

### 10.1 Automated Verification

| Step | Command | Expected Result |
|------|---------|-----------------|
| Install deps | `npm install` | No errors, all packages resolved |
| Prisma generate | `npx prisma generate` | Prisma Client generated |
| DB schema push | `npx prisma db push` | All 22 tables created in MySQL |
| Build check | `npx next build` | Build succeeds without errors |
| Lint check | `npx next lint` | No critical lint errors |
| Type check | `npx tsc --noEmit` | No TypeScript errors |
| Seed database | `npx tsx prisma/seed.ts` | Categories + admin user populated |

### 10.2 Browser Testing

| Test | How to Run | Expected Result |
|------|-----------|-----------------|
| Homepage loads | Open `http://localhost:3000` in Chrome DevTools (mobile) | Bento grid layout, hero, categories visible |
| Mobile responsive | Toggle DevTools responsive mode (375px, 428px, 768px) | Bottom nav shows, 2-col grid on mobile |
| Product pages | Click any product from homepage | Detail page with gallery, variants, reviews |
| Cart operations | Add to cart, change quantity, remove | Cart updates instantly via Zustand |
| Checkout flow | Add item → Cart → Checkout → COD | Order created, confirmation shown |
| Admin dashboard | Login as admin → `/admin` | Bento analytics dashboard with stats |
| Live chat | Click chat bubble → Send message | Message appears in admin chat panel |
| SuperAdmin console | Login as superadmin → `/admin/super-console` | All site settings editable |
| Search | Type in search bar | Autocomplete results appear |
| Auth flows | Login, Register, Google OAuth, Logout | All auth flows work correctly |

### 10.3 cPanel Compatibility Checks

| Check | Method | Expected |
|-------|--------|----------|
| Build on cPanel | SSH: `NODE_OPTIONS="--max-old-space-size=512" npm run build` | Build completes <5 min |
| NPROC usage | SSH: `ps -u $(whoami) | wc -l` | < 20 processes |
| Passenger start | `touch tmp/restart.txt` | App starts, no crash |
| MySQL connection | Visit any page that loads products | Data displayed correctly |
| Static assets | Check CSS/JS bundles load | No 404s, styles applied |

### 10.4 Manual Testing Checklist (User)

After deployment to cPanel, the user should manually verify:

1. **Visit `https://arkivee.com`** → Homepage loads with all sections
2. **Test on mobile phone** → Bottom nav visible, touch-friendly
3. **Create an account** → Register → Verify email works
4. **Login with Google** → OAuth redirect works
5. **Browse products** → Categories, search, filters work
6. **Add to cart & checkout** → Order is placed
7. **Login as SuperAdmin** → Super Console accessible
8. **Change site name in Super Console** → Name updates across site
9. **Create an admin** → Assign permissions → Test limited access
10. **Test live chat** → Send a message as guest, reply as admin

---

## ARKIVE Product Categories (Exact)

| Category | Subcategories | Emoji | UX Note |
|----------|--------------|-------|---------|
| **Women** | Earrings, Ring, **Churi**, Bracelet, Bag, Purse, Necklace, Nupur | 👩 | Main landing shows all subcategories as beautiful cards. Click "Churi" → shows all Churi designs. Click a design → product detail. |
| **Men** | Watch, Ring, Perfume, Bracelet *(more will be added later)* | 👨 | Same drill-down pattern. "Bakigula pore add hobe" — schema supports dynamic subcategory additions. |
| **Unisex** | Bracelet, Ring, Couple Rings, Couple Chains, Couple Bracelets | 🤝 | Couple items displayed as pairs with romantic styling |
| **Customised Stationery** | Notebooks, Pen, Stickers | ✏️ | Custom personalization options in product detail |
| **Combo Packages** | Special event combos | 🎁 | Bundle deals with savings displayed prominently |

---

## 🤖 AI Features (Full Suite — Powered by Google Gemini)

> [!IMPORTANT]
> All AI features from SilkMart are included, customized for Arkive's jewelry/accessories niche. Each feature can be individually toggled on/off from the Admin AI Settings panel.

### AI Configuration System

| File | Purpose |
|------|---------|
| `lib/gemini-ai.ts` | Gemini API client wrapper with retry logic |
| `lib/ai-assistant.ts` | Core AI functions (descriptions, chat, SEO, search) |
| `lib/ai-config.ts` | Per-feature toggle system (read/write JSON config) |
| `data/ai-config.json` | Runtime config file (which features are enabled) |
| `components/admin/AISettings.tsx` | Admin UI for toggling AI features + tuning params |

### Customer-Facing AI Features

| Feature | Component | API Route | Description |
|---------|-----------|-----------|-------------|
| **AI Chat Assistant** | `AIChatAssistant.tsx` | `/api/ai/chat` | Floating chatbot widget — answers product Q&A, order tracking, style advice, recommendations. Customized for jewelry/accessories context. |
| **AI Product Assistant** | `AIProductAssist.tsx` | `/api/ai/product-assist` | On product pages — answers customer questions about materials, sizing, care instructions, styling tips. Preset suggestion chips. |
| **Smart Recommendations** | `AIRecommendations.tsx` | `/api/products/recommendations` | "Complete the look" — suggests matching items (earrings + necklace set, couple rings + chains). Category-aware. |
| **AI Size Recommender** | `AISizeRecommender.tsx` | `/api/ai/size-recommend` | Recommends bracelet/ring/churi sizes based on customer input (wrist measurement, preferences). |
| **AI Review Summary** | `AIReviewSummary.tsx` | — | Summarizes all product reviews into a quick AI-generated overview ("Customers love the quality..."). |
| **AI Smart Bundles** | `AISmartBundles.tsx` | — | Suggests combo bundles for events (Valentine's, Eid, Birthday) based on browsing history. |
| **AI FAQ Generator** | — | `/api/ai/faq` | Auto-generates FAQ answers from product data for common questions. |
| **AI Image Search** | — | `/api/ai/image-search` | Search products using image description ("show me gold earrings like this"). |
| **Smart Search** | Built into `SearchBar.tsx` | — | Understands natural language queries ("gold bracelet under 500", "couple gift set"). |

### Admin-Facing AI Features

| Feature | Component | API Route | Description |
|---------|-----------|-----------|-------------|
| **AI Product Descriptions** | Built into `ProductForm.tsx` | `/api/ai/product-assist` | Auto-generate engaging product descriptions from name + category + features. One-click in product add/edit form. |
| **AI SEO Generator** | `AISEOGenerator.tsx` | `/api/ai/generate-seo` | Generates meta title, description, keywords for products and pages. Optimized for e-commerce SEO. |
| **AI Marketing Tools** | `AIMarketingTools.tsx` | `/api/ai/marketing-content` | Generate social media posts, email subject lines, ad copy, promotional text for campaigns. |
| **AI Review Moderation** | `AIReviewAssist.tsx` | — | Flag inappropriate reviews, suggest admin replies, sentiment analysis on customer feedback. |
| **AI Order Insights** | `AIOrderInsights.tsx` | `/api/ai/order-analysis` | Analyze order patterns, peak times, popular combos, revenue trends with AI-powered insights. |
| **AI Customer Analysis** | — | `/api/ai/customer-analysis` | Customer segmentation, purchase behavior analysis, churn prediction. |
| **AI Inventory Forecast** | — | `/api/ai/inventory-forecast` | Predict stock needs based on sales trends, seasonal patterns, and order velocity. |
| **AI Coupon Generator** | `AICouponGenerator.tsx` | — | Suggest optimal coupon strategies (discount %, timing, target audience) based on sales data. |
| **AI Announcement Generator** | `AIAnnouncementGenerator.tsx` | — | Generate promotional announcements, flash sale copy, holiday greetings. |
| **AI Translator** | `AITranslator.tsx` | — | Translate product descriptions and site content to Bengali/other languages. |
| **AI Chat Admin Panel** | `AIChatAssist.tsx` | — | AI-assisted admin chat: suggest replies, auto-responses for common queries. |

### AI API Routes (Complete)

```
src/app/api/ai/
├── route.ts                 # AI health check + config
├── chat/route.ts            # Customer chat assistant
├── product-assist/route.ts  # Product descriptions + Q&A
├── marketing-content/route.ts # Marketing copy generation
├── generate-seo/route.ts    # SEO meta generation
├── size-recommend/route.ts  # Size recommendation engine
├── inventory-forecast/route.ts # Stock prediction
├── order-analysis/route.ts  # Order pattern analysis
├── customer-analysis/route.ts # Customer segmentation
├── faq/route.ts             # FAQ auto-generation
├── image-search/route.ts    # Visual product search
├── debug/route.ts           # AI debug endpoint (dev only)
└── test/route.ts            # AI connectivity test
```

### AI Settings (Admin Panel)

SuperAdmin can control from `/admin/settings` → AI Settings tab:
- **Global AI Toggle** — Enable/disable all AI features at once
- **Per-Feature Toggles** — Turn on/off individual features (product_assist, chat_assist, review_moderation, seo_generator, analytics_insights)
- **Model Parameters** — Max tokens (default: 1024), Temperature (default: 0.7)
- **API Key Status** — Shows if Gemini API key is configured and active

> Uses **Google Gemini API** via `GOOGLE_AI_API_KEY` env variable. All prompts customized for Arkive's jewelry, accessories, and stationery niche.

---

## 🧪 Zero-Bug Testing Strategy

> [!CAUTION]
> **Every phase of development must be tested before moving to the next.** No feature ships without both automated and visual verification.

### Phase Testing Protocol

| Phase | What to Test | Method |
|-------|-------------|--------|
| **After each component** | Visual rendering on mobile (375px) + desktop (1440px) | Browser DevTools |
| **After each API route** | Request/response correctness, error handling, auth checks | Browser fetch + console |
| **After each page** | Full user flow end-to-end on mobile viewport | Browser subagent |
| **After cart/checkout** | Complete purchase flow: browse → add → cart → checkout → confirm | Browser subagent |
| **After admin panel** | All CRUD operations, permission checks, data integrity | Browser subagent |
| **Before deployment** | Full build (`next build`), no TypeScript errors, no console errors | Terminal |

### Mobile-First Responsiveness Checklist

- [ ] All touch targets ≥ 48px
- [ ] No horizontal scroll on any page at 375px width
- [ ] Bottom nav doesn't overlap content
- [ ] Product images load crisp on retina (2x Cloudinary)
- [ ] Forms are usable with mobile keyboard (no hidden inputs)
- [ ] Cart drawer slides in smoothly on mobile
- [ ] Search bar is accessible without scrolling
- [ ] All modals are fullscreen on mobile (<640px)

### Fluid UX Requirements

- **Page transitions:** Framer Motion `fadeIn` + `slideUp` (no jarring jumps)
- **Loading states:** Skeleton screens on every data-fetching page (never blank)
- **Optimistic updates:** Cart add/remove updates UI instantly, syncs in background
- **Error states:** Friendly error messages with retry buttons (never raw errors)
- **Empty states:** Beautiful illustrations for empty cart, no results, no orders
- **Toast notifications:** Success/error toasts for all user actions

---

## 📱 PWA App — Exclusive Native-Feel Mobile Experience

> [!IMPORTANT]
> The PWA (Progressive Web App) must feel like a **real native app**, NOT a website shortcut. When a customer installs it from the browser, it should open as a standalone app with its own splash screen, navigation, and UI that is **visually distinct** from the website.

### PWA vs Website — Key Differences

| Aspect | Website (Browser) | PWA App (Installed) |
|--------|-------------------|--------------------|
| **Navigation** | Top navbar + bottom nav | **Custom app-style bottom tab bar** with icons + labels, animated active states |
| **Header** | Full navbar with search, menu | **Minimal app header** — logo + cart icon only, status bar blends with theme |
| **Splash Screen** | None | **Branded splash** — Arkive logo + tagline on emerald gradient |
| **Loading** | Skeleton screens | **Pull-to-refresh** + native-style spinner |
| **Transitions** | Framer Motion fade | **iOS/Android-style slide** transitions (push/pop) |
| **URL Bar** | Visible | **Hidden** — standalone display mode |
| **Back Button** | Browser back | **In-app back navigation** with gesture support |
| **Offline** | Error page | **Cached content** — browse previously viewed products offline |
| **Homepage** | Full website homepage | **Simplified app home** — quick-access grid: categories, deals, orders, wishlist |

### PWA Install Flow (Mobile Only)

```
Customer visits site on mobile browser
    ↓
[PWA Install Banner] appears at bottom (if enabled by SuperAdmin)
    "Install 𝓐𝓡𝓚𝓘𝓥𝓔 for the best experience!"
    [Install Now] [Maybe Later]
    ↓
Customer taps "Install Now"
    ↓
Browser shows native "Add to Home Screen" prompt
    ↓
App icon appears on phone home screen
    ↓
Opening app shows branded splash screen
    ↓
App launches in standalone mode (no browser UI)
```

> **Banner + button only appear on mobile** (detected via user agent + media queries). Desktop users never see PWA prompts.

### PWA Technical Implementation

| File | Purpose |
|------|---------|
| `public/manifest.json` | App name, icons, theme color, display mode, splash config |
| `public/sw.js` | Service Worker — caches static assets, product pages, offline fallback |
| `public/offline.html` | Offline fallback page with Arkive branding |
| `public/icons/` | PWA icons at all sizes (72, 96, 128, 144, 152, 192, 384, 512) |
| `components/PWAInstallBanner.tsx` | Bottom banner prompt (mobile only, Shadcn `Sheet`) |
| `components/PWAInstallButton.tsx` | Menu install button (mobile only) |
| `src/hooks/usePWA.ts` | Hook for install state, `beforeinstallprompt` event, standalone detection |

### PWA Components

```
src/components/
├── PWAInstallBanner.tsx    # Bottom slide-up banner ("Install Arkive App!")
├── PWAInstallButton.tsx    # Install button for nav menu
├── PWAAppShell.tsx         # Standalone app shell layout (different from website)
├── PWABottomTabBar.tsx     # Native-style tab bar for PWA mode
└── PWASplashScreen.tsx     # Branded loading screen on app launch
```

### Standalone Detection

```typescript
// Detect if running as installed PWA
const isPWA = window.matchMedia('(display-mode: standalone)').matches
         || window.navigator.standalone === true;

// If PWA → use PWAAppShell layout with native-feel navigation
// If browser → use standard website layout with Navbar + Footer
```

### SuperAdmin PWA Controls (in SiteSettings)

| Setting | Default | Description |
|---------|---------|-------------|
| `pwaInstallBannerEnabled` | `true` | Show/hide install banner on mobile |
| `pwaInstallButtonEnabled` | `true` | Show/hide install button in mobile menu |
| `pwaAppName` | `"𝓐𝓡𝓚𝓘𝓥𝓔"` | App name shown on home screen |
| `pwaShortName` | `"Arkive"` | Short name for home screen icon |
| `pwaThemeColor` | `"#10b981"` | Status bar / theme color |
| `pwaBackgroundColor` | `"#ffffff"` | Splash screen background |
| `pwaSplashText` | `"Curated Collections"` | Text shown under logo on splash |
| `pwaStartPage` | `"/"` | Which page opens when app launches |

---

> [!NOTE]
> **This plan adapts the proven SilkMartWebSite architecture** (30+ models, 68 components, cPanel NPROC locking) while staying **leaner and cleaner** for Arkive. Single-vendor, category-focused, with dynamic payment gateways, full AI suite, Shadcn/ui components, and an exclusive PWA app experience.

---

```
==============================================================================
                    APPROVED BY LIZA ARCHITECT 🎨
                         FINAL REVISION v3.0
==============================================================================
```
