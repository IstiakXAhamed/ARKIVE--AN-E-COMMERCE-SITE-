/**
 * ARKIVE Database Seed Script (Plain JS — runs on server without ts-node)
 * Usage: node prisma/seed.js
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Women", slug: "women", image: "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=400" },
  { name: "Men", slug: "men", image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400" },
  { name: "Unisex", slug: "unisex", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400" },
  { name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=400" },
  { name: "Couple", slug: "couple", image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400" },
  { name: "Stationery", slug: "stationery", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400" },
];

const PRODUCTS = [
  // Women
  {
    name: "Elegant Pearl Earrings",
    slug: "elegant-pearl-earrings",
    price: 890,
    originalPrice: 1200,
    stock: 25,
    category: "women",
    rating: 4.8,
    reviewsCount: 24,
    isFeatured: true,
    isOnSale: true,
    badge: "NEW",
    description: "Beautiful freshwater pearl earrings with sterling silver hooks. Perfect for both casual and formal occasions.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
  },
  {
    name: "Rose Gold Diamond Ring",
    slug: "rose-gold-diamond-ring",
    price: 2450,
    originalPrice: 3200,
    stock: 15,
    category: "women",
    rating: 4.9,
    reviewsCount: 45,
    isFeatured: true,
    isOnSale: true,
    badge: "FLASH",
    description: "Stunning rose gold ring with simulated diamond center. Exquisite craftsmanship for special moments.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
  },
  {
    name: "Designer Leather Handbag",
    slug: "designer-leather-handbag",
    price: 1950,
    originalPrice: 2500,
    stock: 12,
    category: "women",
    rating: 4.7,
    reviewsCount: 38,
    isFeatured: true,
    isOnSale: true,
    badge: "SALE",
    description: "Premium genuine leather handbag with gold hardware. Spacious interior with multiple compartments.",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
  },
  {
    name: "Crystal Charm Bracelet",
    slug: "crystal-charm-bracelet",
    price: 650,
    originalPrice: 900,
    stock: 30,
    category: "women",
    rating: 4.6,
    reviewsCount: 29,
    isFeatured: true,
    isOnSale: true,
    description: "Delicate Swarovski crystal charm bracelet. Adjustable chain with lobster clasp.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
  },
  // Men
  {
    name: "Classic Chronograph Watch",
    slug: "classic-chronograph-watch",
    price: 4500,
    originalPrice: 5800,
    stock: 8,
    category: "men",
    rating: 4.9,
    reviewsCount: 56,
    isFeatured: true,
    isOnSale: true,
    badge: "FLASH",
    description: "Elegant chronograph watch with genuine leather strap. Water-resistant up to 50m.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
  },
  {
    name: "Titanium Cufflinks Set",
    slug: "titanium-cufflinks-set",
    price: 850,
    originalPrice: 1100,
    stock: 20,
    category: "men",
    rating: 4.5,
    reviewsCount: 18,
    isFeatured: true,
    isOnSale: true,
    description: "Premium titanium cufflinks with brushed finish. Perfect for formal occasions.",
    image: "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=400",
  },
  {
    name: "Leather Bifold Wallet",
    slug: "leather-bifold-wallet",
    price: 750,
    originalPrice: 950,
    stock: 35,
    category: "men",
    rating: 4.7,
    reviewsCount: 42,
    isFeatured: false,
    badge: "NEW",
    description: "Slim genuine leather bifold wallet with RFID blocking technology. 8 card slots.",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
  },
  // Unisex
  {
    name: "Heart Lock Couple Chain",
    slug: "heart-lock-couple-chain",
    price: 1450,
    originalPrice: 1800,
    stock: 18,
    category: "unisex",
    rating: 4.8,
    reviewsCount: 33,
    isFeatured: true,
    isOnSale: true,
    badge: "NEW",
    description: "Matching heart lock and key necklace set. Perfect gift for couples. Sterling silver plated.",
    image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=400",
  },
  {
    name: "Infinity Couple Rings",
    slug: "infinity-couple-rings",
    price: 1950,
    originalPrice: 2500,
    stock: 10,
    category: "unisex",
    rating: 4.9,
    reviewsCount: 67,
    isFeatured: true,
    isOnSale: true,
    badge: "FLASH",
    description: "Matching infinity symbol rings for couples. Available in silver and gold finish.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
  },
  {
    name: "Minimalist Silver Bracelet",
    slug: "minimalist-silver-bracelet",
    price: 850,
    originalPrice: 1100,
    stock: 22,
    category: "unisex",
    rating: 4.6,
    reviewsCount: 28,
    isFeatured: true,
    isOnSale: true,
    badge: "FLASH",
    description: "Simple yet elegant sterling silver bracelet. Adjustable size fits most wrists.",
    image: "https://images.unsplash.com/photo-1573408301185-9519f94815b1?w=400",
  },
  // Couple
  {
    name: "Couple Promise Lockets",
    slug: "couple-promise-lockets",
    price: 1200,
    originalPrice: 1600,
    stock: 15,
    category: "couple",
    rating: 4.8,
    reviewsCount: 41,
    isFeatured: true,
    isOnSale: true,
    badge: "NEW",
    description: "Matching heart lockets that fit together. Engrave your initials for a personal touch.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
  },
  {
    name: "Couple Magnetic Bracelets",
    slug: "couple-magnetic-bracelets",
    price: 980,
    originalPrice: 1300,
    stock: 20,
    category: "couple",
    rating: 4.7,
    reviewsCount: 35,
    isFeatured: true,
    isOnSale: true,
    description: "Magnetic couple bracelets that attract each other. Symbol of your bond.",
    image: "https://images.unsplash.com/photo-1573408301185-9519f94815b1?w=400",
  },
  // Accessories
  {
    name: "Personalized Leather Notebook",
    slug: "personalized-leather-notebook",
    price: 450,
    originalPrice: 600,
    stock: 50,
    category: "accessories",
    rating: 4.8,
    reviewsCount: 42,
    isFeatured: false,
    description: "Genuine leather journal with refillable pages. Can be personalized with name engraving.",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400",
  },
  {
    name: "Silk Scarf Collection",
    slug: "silk-scarf-collection",
    price: 1100,
    originalPrice: 1500,
    stock: 25,
    category: "accessories",
    rating: 4.6,
    reviewsCount: 19,
    isFeatured: true,
    isOnSale: true,
    badge: "NEW",
    description: "100% pure silk scarves with hand-rolled edges. Available in multiple patterns.",
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400",
  },
  // Stationery
  {
    name: "Luxury Fountain Pen Set",
    slug: "luxury-fountain-pen-set",
    price: 1850,
    originalPrice: 2400,
    stock: 12,
    category: "stationery",
    rating: 4.9,
    reviewsCount: 31,
    isFeatured: true,
    isOnSale: true,
    badge: "FLASH",
    description: "Premium brass fountain pen with gold-plated nib. Comes in elegant gift box with 2 ink cartridges.",
    image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400",
  },
  {
    name: "Washi Tape Gift Set",
    slug: "washi-tape-gift-set",
    price: 320,
    originalPrice: 450,
    stock: 60,
    category: "stationery",
    rating: 4.5,
    reviewsCount: 22,
    isFeatured: false,
    description: "Set of 12 decorative washi tapes in various patterns. Perfect for journaling and scrapbooking.",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400",
  },
];

async function main() {
  console.log("🌱 Starting ARKIVE database seed...\n");

  try {
    // 1. Create SUPERADMIN user
    console.log("👤 Creating admin user...");
    const hashedPassword = await bcrypt.hash("Admin@123", 12);
    const admin = await prisma.user.upsert({
      where: { email: "admin@arkive.com.bd" },
      update: {},
      create: {
        email: "admin@arkive.com.bd",
        name: "ARKIVE Admin",
        password: hashedPassword,
        role: "SUPERADMIN",
      },
    });
    console.log(`   ✓ Admin: ${admin.email}\n`);

    // 2. Create categories
    console.log("📁 Creating categories...");
    const categoryMap = {};
    for (const cat of CATEGORIES) {
      const created = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, image: cat.image },
        create: {
          name: cat.name,
          slug: cat.slug,
          image: cat.image,
          isActive: true,
        },
      });
      categoryMap[cat.slug] = created.id;
      console.log(`   ✓ ${cat.name}`);
    }
    console.log("");

    // 3. Create products
    console.log("📦 Creating products...");
    for (const product of PRODUCTS) {
      const categoryId = categoryMap[product.category];
      if (!categoryId) {
        console.log(`   ⚠ Skipping ${product.name} — category '${product.category}' not found`);
        continue;
      }
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice || null,
          stock: product.stock,
          image: product.image,
          images: JSON.stringify([{ url: product.image, alt: product.name, isPrimary: true }]),
          categoryId,
          isActive: true,
          isFeatured: product.isFeatured || false,
          isOnSale: product.isOnSale || false,
          isNew: true,
          badge: product.badge || null,
          rating: product.rating || 0,
          reviewsCount: product.reviewsCount || 0,
          productType: "physical",
          metaTitle: product.name,
          metaDescription: product.description.substring(0, 160),
        },
      });
      console.log(`   ✓ ${product.name}`);
    }
    console.log("");

    // 4. Create store settings
    console.log("⚙️  Creating store settings...");
    await prisma.storeSettings.upsert({
      where: { id: "main" },
      update: {},
      create: {
        id: "main",
        storeName: "ARKIVE",
        currency: "BDT",
        aiEnabled: true,
        aiModel: "gemini-2.0-flash",
      },
    });
    console.log("   ✓ Store Settings\n");

    console.log("✅ Seed completed successfully!");
    console.log("\n📝 Admin credentials:");
    console.log("   Email:    admin@arkive.com.bd");
    console.log("   Password: Admin@123\n");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
