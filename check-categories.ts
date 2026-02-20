import { prisma } from './src/lib/prisma'

async function main() {
  const categories = await prisma.categories.findMany({
    select: { name: true, slug: true }
  })
  console.log('Categories:', categories)
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
