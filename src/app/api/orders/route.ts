import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/orders - List all orders (admin) or user orders
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    
    let where: any = {}
    
    // If not admin, only show user's orders (default to user-only mode if role is undefined for safety)
    if (!session?.user || session.user.role === "CUSTOMER") {
      where.userId = session?.user?.id
    }
    
    if (status && status !== "all") {
      where.status = status
    }

    const orders = await prisma.orders.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        order_items: {
          include: {
            products: { select: { name: true } }
          }
        },
        addresses: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Orders GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create new order
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const body = await req.json()

    const order = await prisma.orders.create({
      data: {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        orderNumber: `ARK-${Date.now()}`,
        userId: session?.user?.id || "",
        addressId: body.addressId,
        subtotal: body.subtotal,
        shippingCost: body.shippingCost,
        discount: body.discount || 0,
        total: body.total,
        couponCode: body.couponCode,
        paymentMethod: body.paymentMethod,
        notes: body.notes,
        updatedAt: new Date(),
        order_items: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        },
      },
      include: {
        order_items: { include: { products: true } },
        addresses: true,
      },
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error("Orders POST error:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}
