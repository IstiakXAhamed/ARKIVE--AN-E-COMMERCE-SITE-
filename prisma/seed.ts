/**
 * Prisma Seed Script for ARKIVE E-commerce
 * 
 * Usage: npx prisma db seed
 * 
 * This script creates:
 * - 1 SUPERADMIN user (admin@arkive.com.bd / Admin@123)
 * - 5 categories (Women, Men, Unisex, Stationery, Combos)
 * - 12 sample products with images
 * - Site settings
 * - Welcome coupon
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

const CATEGORIES = [
  { name: "Women", slug: "women", icon: "👠", sortOrder: 1 },
  { name: "Men", slug: "men", icon: "⌚", sortOrder: 2 },
  { name: "Unisex", slug: "unisex", icon: "💍", sortOrder: 3 },
  { name: "Stationery", slug: "stationery", icon: "📓", sortOrder: 4 },
  { name: "Combos", slug: "combos", icon: "🎁", sortOrder: 5 },
];

const PRODUCTS = [
  // Women
  {
    name: "Elegant Pearl Earrings",
    slug: "elegant-pearl-earrings",
    price: 890,
    compareAtPrice: 1200,
    stock: 25,
    subcategory: "Earrings",
    badge: "flash",
    rating: 4.8,
    reviewsCount: 24,
    description: "Beautiful freshwater pearl earrings with sterling silver hooks. Perfect for both casual and formal occasions.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
  },
  {
    name: "Rose Gold Diamond Ring",
    slug: "rose-gold-diamond-ring",
    price: 2450,
    compareAtPrice: 3200,
    stock: 15,
    subcategory: "Ring",
    badge: "sale",
    rating: 4.9,
    reviewsCount: 45,
    description: "Stunning rose gold ring with simulated diamond center. Exquisite craftsmanship for special moments.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
  },
  {
    name: "Crystal Charm Bracelet",
    slug: "crystal-charm-bracelet",
    price: 750,
    compareAtPrice: 950,
    stock: 30,
    subcategory: "Bracelet",
    badge: "new",
    rating: 4.7,
    reviewsCount: 18,
    description: "Elegant crystal bracelet with multiple charms. Adjustable length for perfect fit.",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400",
  },
  {
    name: "Designer Leather Handbag",
    slug: "designer-leather-handbag",
    price: 3500,
    compareAtPrice: 4500,
    stock: 10,
    subcategory: "Bag",
    badge: "sale",
    rating: 4.6,
    reviewsCount: 32,
    description: "Premium genuine leather handbag with gold-tone hardware. Multiple compartments for organization.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
  },
  {
    name: "Gold Pendant Necklace",
    slug: "gold-pendant-necklace",
    price: 1850,
    compareAtPrice: 2400,
    stock: 20,
    subcategory: "Necklace",
    badge: "flash",
    rating: 4.8,
    reviewsCount: 28,
    description: "Classic 18k gold-plated pendant on delicate chain. Comes with matching earrings.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
  },
  // Men
  {
    name: "Classic Chronograph Watch",
    slug: "classic-chronograph-watch",
    price: 4500,
    compareAtPrice: 5800,
    stock: 8,
    subcategory: "Watch",
    badge: "flash",
    rating: 4.9,
    reviewsCount: 56,
    description: "Elegant chronograph watch with genuine leather strap. Water-resistant up to 50m.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
  },
  {
    name: "Titanium Band Ring",
    slug: "titanium-band-ring",
    price: 1200,
    compareAtPrice: 1600,
    stock: 35,
    subcategory: "Ring",
    badge: "new",
    rating: 4.6,
    reviewsCount: 22,
    description: "Durable titanium wedding band with brushed finish. Hypoallergenic and lightweight.",
    image: "https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=400",
  },
  {
    name: "Oud Wood Perfume",
    slug: "oud-wood-perfume",
    price: 2800,
    compareAtPrice: 3500,
    stock: 12,
    subcategory: "Perfume",
    badge: "sale",
    rating: 4.8,
    reviewsCount: 38,
    description: "Luxurious oud wood fragrance with notes of sandalwood and amber. Long-lasting scent.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
  },
  // Unisex
  {
    name: "Minimalist Silver Bracelet",
    slug: "minimalist-silver-bracelet",
    price: 850,
    compareAtPrice: 1100,
    stock: 40,
    subcategory: "Bracelet",
    badge: "flash",
    rating: 4.7,
    reviewsCount: 34,
    description: "Sleek sterling silver bracelet with minimalist design. Perfect for everyday wear.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
  },
  {
    name: "Infinity Couple Rings",
    slug: "infinity-couple-rings",
    price: 1950,
    compareAtPrice: 2500,
    stock: 18,
    subcategory: "Couple Rings",
    badge: "flash",
    rating: 4.9,
    reviewsCount: 48,
    description: "Matching infinity symbol rings for couples. Made of surgical steel with gold plating.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400",
  },
  {
    name: "Heart Lock Couple Chain",
    slug: "heart-lock-couple-chain",
    price: 1450,
    compareAtPrice: 1800,
    stock: 22,
    subcategory: "Couple Chains",
    badge: "new",
    rating: 4.8,
    reviewsCount: 29,
    description: "Heart-shaped lock pendant on adjustable chain. Symbol of eternal love.",
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400",
  },
  // Stationery
  {
    name: "Personalized Leather Notebook",
    slug: "personalized-leather-notebook",
    price: 450,
    compareAtPrice: 600,
    stock: 50,
    subcategory: "Notebooks",
    badge: undefined,
    rating: 4.8,
    reviewsCount: 42,
    description: "Genuine leather journal with refillable pages. Can be personalized with name engraving.",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400",
  },
];

const SITE_SETTINGS = [
  { key: "site_name", value: "ARKIVE", type: "string", group: "general", label: "Site Name" },
  { key: "site_tagline", value: "Premium Jewelry & Accessories", type: "string", group: "general", label: "Tagline" },
  { key: "contact_email", value: "hello@arkive.com.bd", type: "string", group: "general", label: "Contact Email" },
  { key: "contact_phone", value: "+8801700000000", type: "string", group: "general", label: "Contact Phone" },
  { key: "shipping_flat_rate", value: "120", type: "number", group: "shipping", label: "Flat Shipping Rate (BDT)" },
];

async function main() {
  console.log("🌱 Starting ARKIVE database seed...\n");

  try {
    // 1. Create SUPERADMIN user
    console.log("👤 Creating SUPERADMIN user...");
    const hashedPassword = await bcrypt.hash("Admin@123", 12);
    const admin = await prisma.user.upsert({
      where: { email: "admin@arkive.com.bd" },
      update: {},
      create: {
        email: "admin@arkive.com.bd",
        name: "ARKIVE Admin",
        password: hashedPassword,
        role: "SUPERADMIN",
        provider: "CREDENTIALS",
      },
    });
    console.log(`   ✓ Admin created: ${admin.email}\n`);

    // 2. Create categories
    console.log("📁 Creating categories...");
    const categoryMap: Record<string, string> = {};
    for (const cat of CATEGORIES) {
      const created = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: {
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          sortOrder: cat.sortOrder,
          isActive: true,
        },
      });
      categoryMap[cat.slug] = created.id;
      console.log(`   ✓ Category: ${cat.name}`);
    }
    console.log("");

    // 3. Create products
    console.log("📦 Creating products...");
    const categorySlugs = ["women", "women", "women", "women", "women", "men", "men", "men", "unisex", "unisex", "unisex", "stationery"];
    for (let i = 0; i < PRODUCTS.length; i++) {
      const product = PRODUCTS[i];
      const categorySlug = categorySlugs[i];
      const categoryId = categoryMap[categorySlug];
      
      const created = await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          stock: product.stock,
          subcategory: product.subcategory,
          badge: product.badge || null,
          rating: product.rating || 0,
          reviewsCount: product.reviewsCount || 0,
          categoryId,
          isActive: true,
          isFeatured: i < 4, // First 4 products are featured
        },
      });

      // Create primary image
      await prisma.productImage.upsert({
        where: { id: `img-${product.slug}` },
        update: {},
        create: {
          id: `img-${product.slug}`,
          productId: created.id,
          url: product.image,
          alt: product.name,
          isPrimary: true,
          sortOrder: 0,
        },
      });

      console.log(`   ✓ Product: ${product.name}`);
    }
    console.log("");

    // 4. Create site settings
    console.log("⚙️  Creating site settings...");
    for (const setting of SITE_SETTINGS) {
      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: {},
        create: setting,
      });
      console.log(`   ✓ Setting: ${setting.key}`);
    }
    console.log("");

    // 5. Create welcome coupon
    console.log("🎫 Creating welcome coupon...");
    await prisma.coupon.upsert({
      where: { code: "WELCOME10" },
      update: {},
      create: {
        code: "WELCOME10",
        description: "Welcome discount - 10% off your first order!",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderValue: 1000,
        isActive: true,
      },
    });
    console.log("   ✓ Coupon: WELCOME10 (10% off, min ৳1000)\n");

    console.log("✅ Seed completed successfully!");
    console.log("\n📝 Admin login credentials:");
    console.log("   Email: admin@arkive.com.bd");
    console.log("   Password: Admin@123\n");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
