import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// Helper to generate simple unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

async function main() {
  console.log("Start seeding...")

  // Create default site settings
  const settings = await prisma.site_settings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      key: "store_name",
      value: "𝓐𝓡𝓚𝓘𝓥𝓔",
      type: "string",
      group: "general",
      label: "Store Name",
      updatedAt: new Date(),
    },
  })
  console.log("Created site settings:", settings.id)

  // Create additional site settings
  await Promise.all([
    prisma.site_settings.upsert({
      where: { key: "store_tagline" },
      update: {},
      create: {
        id: "tagline",
        key: "store_tagline",
        value: "Curated Collections for Every Style",
        type: "string",
        group: "general",
        label: "Store Tagline",
        updatedAt: new Date(),
      },
    }),
    prisma.site_settings.upsert({
      where: { key: "store_email" },
      update: {},
      create: {
        id: "email",
        key: "store_email",
        value: "contact@arkivee.com",
        type: "string",
        group: "general",
        label: "Store Email",
        updatedAt: new Date(),
      },
    }),
    prisma.site_settings.upsert({
      where: { key: "store_phone" },
      update: {},
      create: {
        id: "phone",
        key: "store_phone",
        value: "+8801339705214",
        type: "string",
        group: "general",
        label: "Store Phone",
        updatedAt: new Date(),
      },
    }),
  ])
  console.log("Created additional site settings")

  // Create categories
  const categories = await Promise.all([
    prisma.categories.upsert({
      where: { slug: "women" },
      update: {},
      create: {
        id: generateId(),
        name: "Women",
        slug: "women",
        description: "Elegant fashion for women",
        sortOrder: 1,
        isActive: true,
        updatedAt: new Date(),
      },
    }),
    prisma.categories.upsert({
      where: { slug: "men" },
      update: {},
      create: {
        id: generateId(),
        name: "Men",
        slug: "men",
        description: "Stylish accessories for men",
        sortOrder: 2,
        isActive: true,
        updatedAt: new Date(),
      },
    }),
    prisma.categories.upsert({
      where: { slug: "jewelry" },
      update: {},
      create: {
        id: generateId(),
        name: "Jewelry",
        slug: "jewelry",
        description: "Beautiful jewelry collection",
        sortOrder: 3,
        isActive: true,
        updatedAt: new Date(),
      },
    }),
    prisma.categories.upsert({
      where: { slug: "accessories" },
      update: {},
      create: {
        id: generateId(),
        name: "Accessories",
        slug: "accessories",
        description: "Fashion accessories",
        sortOrder: 4,
        isActive: true,
        updatedAt: new Date(),
      },
    }),
  ])
  console.log("Created categories:", categories.length)

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@arkivee.com" },
    update: {},
    create: {
      id: generateId(),
      name: "Super Admin",
      email: "admin@arkivee.com",
      password: hashedPassword,
      role: "SUPERADMIN",
      provider: "CREDENTIALS",
      emailVerified: new Date(),
      updatedAt: new Date(),
    },
  })
  console.log("Created admin user:", admin.email)

  console.log("Seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
