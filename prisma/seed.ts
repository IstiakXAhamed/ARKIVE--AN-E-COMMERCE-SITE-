/**
 * Prisma Seed Script for ARKIVE E-commerce
 * 
 * Usage: npx prisma db seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Women", slug: "women", image: "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=400" },
  { name: "Men", slug: "men", image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400" },
  { name: "Unisex", slug: "unisex", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400" },
  { name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=400" },
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
    description: "Stunning rose gold ring with simulated diamond center. Exquisite craftsmanship for special moments.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
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
    description: "Elegant chronograph watch with genuine leather strap. Water-resistant up to 50m.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
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
    description: "Genuine leather journal with refillable pages. Can be personalized with name engraving.",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400",
  },
];

async function main() {
  console.log("🌱 Starting ARKIVE database seed...\n");

  try {
    // 1. Create SUPERADMIN user
    console.log("👤 Creating user...");
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
          image: cat.image,
          isActive: true,
        },
      });
      categoryMap[cat.slug] = created.id;
      console.log(`   ✓ Category: ${cat.name}`);
    }
    console.log("");

    // 3. Create products
    console.log("📦 Creating products...");
    for (const product of PRODUCTS) {
      const categoryId = categoryMap[product.category];
      
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          stock: product.stock,
          image: product.image,
          images: [product.image],
          categoryId,
          isActive: true,
          isFeatured: true,
          productType: "physical",
          metaTitle: product.name,
          metaDescription: product.description.substring(0, 160),
        },
      });
      console.log(`   ✓ Product: ${product.name}`);
    }
    console.log("");

    // 4. Create site settings
    console.log("⚙️  Creating site settings...");
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
    console.log("   ✓ Store Settings created");

    console.log("\n✅ Seed completed successfully!");
    console.log("\n📝 Admin login credentials:");
    console.log("   Email: admin@arkive.com.bd");
    console.log("   Password: Admin@123\n");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
