import { prisma } from './src/lib/prisma'

async function main() {
  console.log('--- Hero Items ---')
  const heroItems = await prisma.hero_grid_items.findMany()
  console.dir(heroItems, { depth: null })

  console.log('\n--- Categories ---')
  const categories = await prisma.categories.findMany({
    select: { name: true, image: true }
  })
  console.dir(categories, { depth: null })
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
