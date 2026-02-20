# Product API - Quick Reference

## Endpoint: POST /api/products

### Minimal Request
```json
{
  "name": "Product Name",
  "slug": "product-slug",
  "categoryId": "category-id-here",
  "price": 99.99
}
```

### Full Request with Images & Variants
```json
{
  "name": "Premium Laptop",
  "slug": "premium-laptop",
  "categoryId": "cat-123",
  "price": 999.99,
  "compareAtPrice": 1299.99,
  "stock": 50,
  "description": "High-performance laptop",
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
      "name": "8GB RAM",
      "price": 999.99,
      "stock": 30,
      "options": "ram:8gb"
    },
    {
      "name": "16GB RAM",
      "price": 1199.99,
      "stock": 20,
      "options": "ram:16gb"
    }
  ]
}
```

## Authentication
- **Requires**: ADMIN or SUPERADMIN role
- **Header**: Automatic via session

## Response on Success (201)
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "id": "uuid-here",
    "name": "Premium Laptop",
    "slug": "premium-laptop",
    "price": 999.99,
    "compareAtPrice": 1299.99,
    "images": [...],
    "variants": [...],
    "_count": {
      "images": 2,
      "variants": 2
    }
  }
}
```

## Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Invalid JSON | Check JSON syntax |
| 400 | Validation failed | Check field types/constraints |
| 401 | Unauthorized | Login as ADMIN/SUPERADMIN |
| 404 | Category not found | Verify categoryId exists |
| 409 | Already exists | Use different slug/SKU |
| 500 | Server error | Check logs |

## Field Rules

| Field | Required | Type | Rules |
|-------|----------|------|-------|
| name | Yes | string | 1-255 chars |
| slug | Yes | string | 1-255 chars, auto-unique |
| categoryId | Yes | string | Must exist in DB |
| price | Yes | number | > 0 |
| compareAtPrice | No | number | Optional sale price |
| stock | No | number | Default: 0 |
| lowStockAlert | No | number | Default: 5 |
| images | No | array | URL must be valid |
| variants | No | array | Need name, price, stock, options |

## Image Rules
- `url`: Required, must be valid HTTP/HTTPS
- `alt`: Optional, defaults to product name
- `isPrimary`: Optional, first image defaults to true
- Auto-sorted by upload order

## Variant Rules
- `name`: Required (e.g., "Size M", "Color Red")
- `sku`: Optional, auto-generated if missing
- `price`: Required, must be positive
- `stock`: Required, non-negative
- `options`: Required (e.g., "size:M", "color:red,size:L")

## Transaction Guarantee
- All or nothing: product + images + variants created together
- Automatic rollback on error
- No partial data in database

## UUID Usage
- Product ID: Generated automatically
- Image IDs: Generated for each image
- Variant IDs: Generated for each variant
- All uses uuid.v4() for uniqueness

## Slug Collision Handling
1. Check if slug exists
2. If yes, append 6-char random suffix
3. Retry up to 5 times
4. Fallback to UUID suffix if needed

---

## cURL Examples

### Simple Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "slug": "test-product",
    "categoryId": "cat-123",
    "price": 99.99
  }'
```

### With Images
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product",
    "slug": "product",
    "categoryId": "cat-123",
    "price": 99.99,
    "images": [
      {"url": "https://example.com/img.jpg", "alt": "Image"}
    ]
  }'
```

### With Variants
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "T-Shirt",
    "slug": "t-shirt",
    "categoryId": "cat-123",
    "price": 29.99,
    "variants": [
      {
        "name": "Size S",
        "price": 29.99,
        "stock": 10,
        "options": "size:S"
      },
      {
        "name": "Size M",
        "price": 29.99,
        "stock": 20,
        "options": "size:M"
      }
    ]
  }'
```

---

## Notes
- All timestamps in ISO 8601 format
- Prices as decimal numbers (not strings)
- Images auto-ordered by upload sequence
- Variant SKU auto-generated if not provided
- Primary image auto-marked (can override)
- Featured products for homepage promotion
- Low stock alerts for inventory management
- Meta tags for SEO optimization

