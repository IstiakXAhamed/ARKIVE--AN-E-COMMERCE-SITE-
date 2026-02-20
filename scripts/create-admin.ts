import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
        name: 'Arkive Superadmin',
        provider: 'CREDENTIALS'
      },
      create: {
        email,
        password: hashedPassword,
        name: 'Arkive Superadmin',
        role: 'SUPERADMIN',
        provider: 'CREDENTIALS'
      },
    });
    console.log(`SUCCESS: Superadmin created/updated: ${user.email}`);
  } catch (e) {
    console.error('ERROR creating superadmin:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
