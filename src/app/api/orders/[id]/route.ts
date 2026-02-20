import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/orders/[id] - Get single order
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await auth()

    const order = await prisma.orders.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        order_items: {
          include: {
            products: { select: { name: true, slug: true } }
          }
        },
        addresses: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check permission
    if (session?.user?.role === "CUSTOMER" && order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Order GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    )
  }
}

// PATCH /api/orders/[id] - Update order status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { status, trackingNumber, paymentStatus } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    const order = await prisma.orders.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { name: true, email: true } },
        order_items: {
          include: {
            products: { select: { name: true } }
          }
        },
      },
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Order PATCH error:", error)
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    )
  }
}
