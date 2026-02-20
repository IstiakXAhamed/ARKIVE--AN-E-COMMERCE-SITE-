# Product Creation API Documentation

## Overview

The `/api/products` endpoint provides both listing and creation capabilities for products with robust validation, authentication, and atomic transactions.

## GET /api/products - List Products

Retrieves all active products with optional filtering.

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category slug |
| `featured` | boolean | Filter featured products only (pass `"true"`) |
| `search` | string | Search by name or description |

### Example Request

```bash
GET /api/products?category=electronics&featured=true&search=laptop
```

### Response (200 OK)

```json
{
  "products": [
    {
      "id": "uuid-string",
      "name": "Product Name",
      "slug": "product-slug",
      "price": 99.99,
      "compareAtPrice": 149.99,
      "description": "Product description",
      "images": [
        {
          "url": "https://...",
          "alt": "Product image",
          "isPrimary": true
        }
      ],
      "variants": [
        {
          "id": "uuid",
          "name": "Size M",
          "sku": "SKU123",
          "price": 99.99,
          "stock": 10,
          "options": "size:M"
        }
      ],
      "category": {
        "id": "cat-id",
        "name": "Electronics",
        "slug": "electronics"
      },
      "_count": {
        "variants": 3,
        "images": 2
      }
    }
  ]
}
```

---

## POST /api/products - Create Product

Creates a new product with images and variants in an atomic transaction.

### Authentication

**Required**: ADMIN or SUPERADMIN role

### Request Body

```typescript
{
  // Required fields
  name: string                    // 1-255 characters
  slug: string                    // 1-255 characters (auto-unique if collision)
  categoryId: string              // Must exist in database
  price: number                   // > 0

  // Optional fields
  description?: string            // Product description
  shortDesc?: string              // Max 500 characters
  compareAtPrice?: number         // Sale price
  costPrice?: number              // Cost to business
  sku?: string                    // Unique SKU
  stock?: number                  // Default: 0
  lowStockAlert?: number          // Default: 5
  weight?: number
  subcategory?: string
  tags?: string                   // Comma-separated
  specs?: string                  // Long text (JSON or markdown)
  badge?: string                  // "NEW", "SALE", etc.
  isFeatured?: boolean            // Default: false
  metaTitle?: string              // Max 160 chars (SEO)
  metaDescription?: string        // Max 320 chars (SEO)

  // Nested arrays (optional)
  images?: Array<{
    url: string                   // Valid URL (required)
    alt?: string                  // Alt text for accessibility
    isPrimary?: boolean           // First image defaults to true
  }>

  variants?: Array<{
    name: string                  // E.g., "Size L", "Color Red"
    sku?: string                  // Variant SKU
    price: number                 // > 0
    stock: number                 // >= 0
    options: string               // E.g., "size:L,color:red"
  }>
}
```

### Example Request

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Laptop",
    "slug": "premium-laptop",
    "categoryId": "cat-electronics",
    "price": 999.99,
    "compareAtPrice": 1299.99,
    "description": "High-performance laptop with...",
    "shortDesc": "Premium laptop for professionals",
    "sku": "LAP-PREM-001",
    "stock": 50,
    "lowStockAlert": 10,
    "isFeatured": true,
    "metaTitle": "Premium Laptop | ARKIVE",
    "metaDescription": "Buy premium laptop with 24/7 support",
    "images": [
      {
        "url": "https://example.com/image1.jpg",
        "alt": "Front view",
        "isPrimary": true
      },
      {
        "url": "https://example.com/image2.jpg",
        "alt": "Side view"
      }
    ],
    "variants": [
      {
        "name": "8GB RAM / 256GB SSD",
        "sku": "LAP-PREM-001-8GB",
        "price": 999.99,
        "stock": 20,
        "options": "ram:8gb,storage:256gb"
      },
      {
        "name": "16GB RAM / 512GB SSD",
        "sku": "LAP-PREM-001-16GB",
        "price": 1199.99,
        "stock": 30,
        "options": "ram:16gb,storage:512gb"
      }
    ]
  }'
```

### Response (201 Created)

```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Premium Laptop",
    "slug": "premium-laptop",
    "price": 999.99,
    "compareAtPrice": 1299.99,
    "costPrice": null,
    "description": "High-performance laptop with...",
    "shortDesc": "Premium laptop for professionals",
    "sku": "LAP-PREM-001",
    "stock": 50,
    "lowStockAlert": 10,
    "weight": null,
    "categoryId": "cat-electronics",
    "subcategory": null,
    "tags": null,
    "specs": null,
    "badge": null,
    "isActive": true,
    "isFeatured": true,
    "metaTitle": "Premium Laptop | ARKIVE",
    "metaDescription": "Buy premium laptop with 24/7 support",
    "rating": 0,
    "reviewsCount": 0,
    "salesCount": 0,
    "createdAt": "2024-02-20T10:30:00.000Z",
    "updatedAt": "2024-02-20T10:30:00.000Z",
    "images": [
      {
        "url": "https://example.com/image1.jpg",
        "alt": "Front view",
        "isPrimary": true
      },
      {
        "url": "https://example.com/image2.jpg",
        "alt": "Side view",
        "isPrimary": false
      }
    ],
    "variants": [
      {
        "id": "var-001",
        "name": "8GB RAM / 256GB SSD",
        "sku": "LAP-PREM-001-8GB",
        "price": 999.99,
        "stock": 20,
        "options": "ram:8gb,storage:256gb"
      },
      {
        "id": "var-002",
        "name": "16GB RAM / 512GB SSD",
        "sku": "LAP-PREM-001-16GB",
        "price": 1199.99,
        "stock": 30,
        "options": "ram:16gb,storage:512gb"
      }
    ],
    "category": {
      "id": "cat-electronics",
      "name": "Electronics",
      "slug": "electronics"
    },
    "_count": {
      "variants": 2,
      "images": 2
    }
  }
}
```

---

## Error Responses

### 400 Bad Request - Invalid JSON

```json
{
  "error": "Invalid JSON in request body"
}
```

### 400 Bad Request - Validation Error

```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": "price",
      "message": "Price must be positive"
    },
    {
      "path": "images.0.url",
      "message": "Invalid image URL"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized. Only ADMIN or SUPERADMIN can create products."
}
```

### 404 Not Found - Category

```json
{
  "error": "Category with ID 'invalid-id' does not exist"
}
```

### 409 Conflict - Duplicate

```json
{
  "error": "A product with this name or SKU already exists"
}
```

### 500 Server Error

```json
{
  "error": "Failed to create product. Please check your input and try again."
}
```

---

## Features

### ✅ Authentication

- Session validation required
- Role-based access control (ADMIN/SUPERADMIN)
- Returns 401 if unauthorized

### ✅ Validation

- Zod schema validation for all inputs
- Type-safe request handling
- Detailed validation error messages
- URL validation for images
- Positive number validation for prices

### ✅ Atomic Transactions

- Product creation guaranteed with images and variants
- All-or-nothing operation (no partial data)
- Rollback on any failure

### ✅ Slug Management

- Automatic uniqueness verification
- Collision handling with random suffix
- UUID fallback if needed
- Clean URL-friendly slugs

### ✅ ID Generation

- UUID v4 for all new records
- Consistent across product, images, and variants
- Database-agnostic approach

### ✅ Decimal Handling

- Automatic conversion from Prisma Decimal to plain numbers
- JSON-safe numeric values
- Precision maintained for financial data

### ✅ Image Ordering

- Sort order support
- Primary image marking
- Retrieved in sorted order for consistency

### ✅ Error Handling

- Comprehensive error messages
- Prisma constraint error detection
- Stack trace logging for debugging

---

## Implementation Details

### Database Schema Alignment

```prisma
model products {
  id              String           @id
  name            String
  slug            String           @unique
  description     String?          @db.Text
  shortDesc       String?          @db.VarChar(500)
  price           Decimal          @db.Decimal(10, 2)
  compareAtPrice  Decimal?         @db.Decimal(10, 2)
  costPrice       Decimal?         @db.Decimal(10, 2)
  sku             String?          @unique
  stock           Int              @default(0)
  lowStockAlert   Int              @default(5)
  weight          Decimal?         @db.Decimal(8, 2)
  categoryId      String
  subcategory     String?
  tags            String?          @db.Text
  specs           String?          @db.LongText
  badge           String?
  isActive        Boolean          @default(true)
  isFeatured      Boolean          @default(false)
  metaTitle       String?          @db.VarChar(160)
  metaDescription String?          @db.VarChar(320)
  // ... relations
}

model product_images {
  id        String   @id
  productId String
  url       String
  alt       String?
  sortOrder Int      @default(0)
  isPrimary Boolean  @default(false)
}

model product_variants {
  id        String  @id
  productId String
  name      String
  sku       String?
  price     Decimal @db.Decimal(10, 2)
  stock     Int     @default(0)
  options   String  @db.Text
}
```

### Transaction Flow

```typescript
await prisma.$transaction(async (tx) => {
  1. Create product
  2. Create images (if any)
  3. Create variants (if any)
  4. Fetch complete product with relations
  5. Return product
})
```

All operations are atomic - either all succeed or all fail.

---

## Best Practices

1. **Always validate category** before creating product
2. **Use descriptive slugs** for SEO (avoid random strings)
3. **Include at least one primary image** for product visibility
4. **Keep variant options consistent** (e.g., "size:L,color:red")
5. **Set appropriate low stock alerts** based on sales velocity
6. **Use meta tags** for search engine optimization
7. **Include detailed specs** in JSON format for complex products
8. **Test price combinations** (price vs compareAtPrice logic)

---

## Testing with cURL

```bash
# Create a simple product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "slug": "test-product",
    "categoryId": "your-category-id",
    "price": 99.99
  }'

# Create product with all fields
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d @product.json
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Ensure you're logged in as ADMIN/SUPERADMIN |
| 404 Category not found | Verify categoryId exists: `GET /api/categories` |
| Validation errors | Check field types and constraints in schema |
| Duplicate slug | Pass different slug (auto-generation appends suffix) |
| Image URL invalid | Ensure URLs are fully qualified and accessible |

