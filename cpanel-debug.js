
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

    console.log("2. Attempting to fetch one user...");
    const userCount = await prisma.user.count();
    console.log(`✅ Success! Found ${userCount} users in the database.`);

    console.log("3. Attempting to list table names (raw query)...");
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
