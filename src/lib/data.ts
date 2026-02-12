// Demo products for development
export interface Product {
  id: number | string;
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
  stock?: number;
}

export const demoProducts: Product[] = [
  // Women's Products
  {
    id: 1,
    name: "Elegant Pearl Earrings",
    slug: "elegant-pearl-earrings",
    price: 890,
    originalPrice: 1200,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
    category: "Women",
    categorySlug: "women",
    subcategory: "Earrings",
    badge: "flash",
    rating: 4.8,
    reviewsCount: 24,
  },
  {
    id: 2,
    name: "Rose Gold Diamond Ring",
    slug: "rose-gold-diamond-ring",
    price: 2450,
    originalPrice: 3200,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
    category: "Women",
    categorySlug: "women",
    subcategory: "Ring",
    badge: "sale",
    rating: 4.9,
    reviewsCount: 45,
  },
  {
    id: 3,
    name: "Crystal Charm Bracelet",
    slug: "crystal-charm-bracelet",
    price: 750,
    originalPrice: 950,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400",
    category: "Women",
    categorySlug: "women",
    subcategory: "Bracelet",
    badge: "new",
    rating: 4.7,
    reviewsCount: 18,
  },
  {
    id: 4,
    name: "Designer Leather Handbag",
    slug: "designer-leather-handbag",
    price: 3500,
    originalPrice: 4500,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
    category: "Women",
    categorySlug: "women",
    subcategory: "Bag",
    badge: "sale",
    rating: 4.6,
    reviewsCount: 32,
  },
  {
    id: 5,
    name: "Gold Pendant Necklace",
    slug: "gold-pendant-necklace",
    price: 1850,
    originalPrice: 2400,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
    category: "Women",
    categorySlug: "women",
    subcategory: "Necklace",
    badge: "flash",
    rating: 4.8,
    reviewsCount: 28,
  },
  // Men's Products
  {
    id: 6,
    name: "Classic Chronograph Watch",
    slug: "classic-chronograph-watch",
    price: 4500,
    originalPrice: 5800,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    category: "Men",
    categorySlug: "men",
    subcategory: "Watch",
    badge: "flash",
    rating: 4.9,
    reviewsCount: 56,
  },
  {
    id: 7,
    name: "Titanium Band Ring",
    slug: "titanium-band-ring",
    price: 1200,
    originalPrice: 1600,
    image: "https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=400",
    category: "Men",
    categorySlug: "men",
    subcategory: "Ring",
    badge: "new",
    rating: 4.6,
    reviewsCount: 22,
  },
  {
    id: 8,
    name: "Oud Wood Perfume",
    slug: "oud-wood-perfume",
    price: 2800,
    originalPrice: 3500,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
    category: "Men",
    categorySlug: "men",
    subcategory: "Perfume",
    badge: "sale",
    rating: 4.8,
    reviewsCount: 38,
  },
  // Unisex Products
  {
    id: 9,
    name: "Minimalist Silver Bracelet",
    slug: "minimalist-silver-bracelet",
    price: 850,
    originalPrice: 1100,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
    category: "Unisex",
    categorySlug: "unisex",
    subcategory: "Bracelet",
    badge: "flash",
    rating: 4.7,
    reviewsCount: 34,
  },
  {
    id: 10,
    name: "Infinity Couple Rings",
    slug: "infinity-couple-rings",
    price: 1950,
    originalPrice: 2500,
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400",
    category: "Unisex",
    categorySlug: "unisex",
    subcategory: "Couple Rings",
    badge: "flash",
    rating: 4.9,
    reviewsCount: 48,
  },
  {
    id: 11,
    name: "Heart Lock Couple Chain",
    slug: "heart-lock-couple-chain",
    price: 1450,
    originalPrice: 1800,
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400",
    category: "Unisex",
    categorySlug: "unisex",
    subcategory: "Couple Chains",
    badge: "new",
    rating: 4.8,
    reviewsCount: 29,
  },
  // Stationery
  {
    id: 12,
    name: "Personalized Leather Notebook",
    slug: "personalized-leather-notebook",
    price: 450,
    originalPrice: 600,
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400",
    category: "Stationery",
    categorySlug: "stationery",
    subcategory: "Notebooks",
    rating: 4.8,
    reviewsCount: 42,
  },
];

export const categories = [
  { name: "Women", slug: "women", icon: "👠", count: 150 },
  { name: "Men", slug: "men", icon: "⌚", count: 80 },
  { name: "Unisex", slug: "unisex", icon: "💍", count: 60 },
  { name: "Stationery", slug: "stationery", icon: "📓", count: 40 },
  { name: "Combos", slug: "combos", icon: "🎁", count: 25 },
];
