import { prisma } from './src/lib/prisma'

async function main() {
  const items = [
    {
      id: "1",
      position: 1,
      title: "Women's Collection",
      subtitle: "New Arrivals",
      imageUrl: "/hero-image.jpg", // Placeholder - User needs to update via Admin or I can try generating later
      link: "/category/women",
      isActive: true
    },
    {
      id: "2",
      position: 2,
      title: "Bracelets",
      subtitle: "Elegant Designs",
      imageUrl: "/hero-image.jpg", // Placeholder
      link: "/category/women/bracelets", // Assuming subcategory structure
      isActive: true
    },
    {
      id: "3",
      position: 3,
      title: "Unisex Accessories",
      subtitle: "For Everyone",
      imageUrl: "/hero-image.jpg", // Placeholder
      link: "/category/unisex",
      isActive: true
    }
  ]

  console.log('Updating Hero Items...')

  // Using transaction to ensure atomic updates
  await prisma.$transaction(
    items.map(item => 
      prisma.hero_grid_items.upsert({
        where: { position: item.position },
        update: {
          title: item.title,
          subtitle: item.subtitle,
          imageUrl: item.imageUrl,
          link: item.link
        },
        create: {
          id: item.id,
          position: item.position,
          title: item.title,
          subtitle: item.subtitle,
          imageUrl: item.imageUrl,
          link: item.link,
          updatedAt: new Date()
        }
      })
    )
  )

  console.log('Hero Items Updated successfully!')
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
