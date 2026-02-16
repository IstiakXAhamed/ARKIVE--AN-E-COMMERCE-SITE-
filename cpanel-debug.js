
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

    if (categoryCount > 0) {
      const sampleCats = await prisma.category.findMany({ take: 3 });
      console.log("3. Sample Categories slugs:", sampleCats.map(c => c.slug));
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
