const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.users.findUnique({
    where: { email: 'admin@arkive.com' }
  });
  console.log('Admin User:', user ? 'EXISTS' : 'MISSING');
  if (user) console.log('Role:', user.role);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
