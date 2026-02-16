const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  const users = await prisma.user.findMany({
    where: { email: { contains: 'admin' } }, // Adjust search as needed
    select: { email: true, role: true }
  });
  console.log(users);
}

checkUser()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
