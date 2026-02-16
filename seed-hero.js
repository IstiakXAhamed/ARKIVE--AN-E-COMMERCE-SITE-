const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedHero() {
  const items = [
    {
      position: 1,
      title: "Premium Jewelry Sets",
      subtitle: "Starting from ৳1,500",
      imageUrl: "/images/jewelry-hero.png",
      link: "/category/jewelry",
    },
    {
      position: 2,
      title: "Watches",
      subtitle: "50+ Styles",
      imageUrl: "/images/watches-category.png",
      link: "/category/watches",
    },
    {
      position: 3,
      title: "Rings",
      subtitle: "100+ Designs",
      imageUrl: "/images/rings-category.png",
      link: "/category/rings",
    },
  ];

  for (const item of items) {
    await prisma.heroGridItem.upsert({
      where: { position: item.position },
      update: item,
      create: item,
    });
  }
  console.log('Hero Grid seeded!');
}

seedHero()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
