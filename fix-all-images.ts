import { prisma } from './src/lib/prisma'

async function main() {
  console.log('Fixing Category and Hero images...')

  // 1. Fix Categories
  const categories = await prisma.categories.updateMany({
    data: {
      image: '/hero-image.jpg' // Using the known working image
    }
  })
  console.log(`Updated ${categories.count} categories to use placeholder image.`)

  // 2. Fix Hero Items
  // We want to ensure they use the placeholder too, just in case
  const heroItems = await prisma.hero_grid_items.updateMany({
    data: {
      imageUrl: '/hero-image.jpg'
    }
  })
  console.log(`Updated ${heroItems.count} hero items to use placeholder image.`)
  
  // 3. Verify
  const catSample = await prisma.categories.findFirst()
  console.log('Sample Category:', catSample)
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
