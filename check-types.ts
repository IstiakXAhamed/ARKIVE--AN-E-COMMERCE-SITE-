
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const product = await prisma.product.findFirst({
    include: {
      variants: true
    }
  })
  
  if (product?.variants) {
    console.log("Variants found")
  }
}
