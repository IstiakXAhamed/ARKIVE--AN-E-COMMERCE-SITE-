
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  console.log("---------------------------------------------------");
  console.log("Starting Database Connection Test...");
  console.log("---------------------------------------------------");
  
  try {
    console.log("1. Attempting to connect to Prisma...");
    await prisma.$connect();
    console.log("✅ Prisma connected successfully!");

    console.log("2. Checking row counts...");
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    const imageCount = await prisma.productImage.count();
    
    console.log(`✅ Users: ${userCount}`);
    console.log(`✅ Products: ${productCount}`);
    console.log(`✅ Categories: ${categoryCount}`);
    console.log(`✅ Images: ${imageCount}`);

    if (productCount > 0) {
      console.log("\n3. Inspecting a sample Product...");
      const sampleProduct = await prisma.product.findFirst();
      console.log("Sample Product:", JSON.stringify({
        id: sampleProduct.id,
        name: sampleProduct.name,
        slug: sampleProduct.slug,
        isActive: sampleProduct.isActive,
        isFeatured: sampleProduct.isFeatured,
        categoryId: sampleProduct.categoryId
      }, null, 2));
    }

    if (categoryCount > 0) {
      console.log("\n4. Inspecting a sample Category...");
      const sampleCategory = await prisma.category.findFirst();
      console.log("Sample Category:", JSON.stringify({
        id: sampleCategory.id,
        name: sampleCategory.name,
        slug: sampleCategory.slug,
        isActive: sampleCategory.isActive
      }, null, 2));
    }
    const result = await prisma.$queryRaw`SHOW TABLES`;
    console.log("✅ Tables found:", result);

  } catch (error) {
    console.error("❌ CONNECTION FAILED!");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    if (error.code) console.error("Error Code:", error.code);
  } finally {
    await prisma.$disconnect();
    console.log("---------------------------------------------------");
    console.log("Test Finished.");
    console.log("---------------------------------------------------");
  }
}

testConnection();
