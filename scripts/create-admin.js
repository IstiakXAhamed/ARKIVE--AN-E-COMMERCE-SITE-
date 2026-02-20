const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@arkive.com';
  const password = '123123123';
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.users.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'SUPERADMIN',
        name: 'Arkive Superadmin'
      },
      create: {
        email,
        password: hashedPassword,
        name: 'Arkive Superadmin',
        role: 'SUPERADMIN',
        provider: 'CREDENTIALS'
      },
    });
    console.log(`Created/Updated Superadmin: ${user.email}`);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
