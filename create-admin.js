const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// CONFIGURATION: Change these values!
const adminEmail = 'admin@arkive.com.bd';
const adminPassword = 'Admin@123'; // Set your desired password here

async function main() {
  console.log('--- Secure Admin Setup ---');
  
  try {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    const user = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: hashedPassword,
        role: 'SUPERADMIN'
      },
      create: {
        email: adminEmail,
        name: 'Super Admin',
        password: hashedPassword,
        role: 'SUPERADMIN',
        provider: 'CREDENTIALS'
      }
    });
    
    console.log(`✅ Success! User ${user.email} is now a SUPERADMIN.`);
    console.log(`🔑 Password has been securely hashed and updated.`);
  } catch (error) {
    console.error('❌ Error updating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
