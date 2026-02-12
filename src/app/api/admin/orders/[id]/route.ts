import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/admin/orders/[id] - Get order details
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        address: true,
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        paymentRef: order.paymentRef,
        subtotal: Number(order.subtotal),
        shippingCost: Number(order.shippingCost),
        discount: Number(order.discount),
        total: Number(order.total),
        couponCode: order.couponCode,
        notes: order.notes,
        adminNotes: order.adminNotes,
        trackingNumber: order.trackingNumber,
        createdAt: order.createdAt.toISOString(),
        customer: {
          name: order.user?.name || "Guest",
          email: order.user?.email || null,
          phone: order.user?.phone || null,
        },
        shippingAddress: order.address
          ? {
              fullName: order.address.fullName,
              phone: order.address.phone,
              division: order.address.division,
              district: order.address.district,
              area: order.address.area,
              address: order.address.address,
            }
          : null,
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          image: item.image,
        })),
      },
    });
  } catch (error) {
    console.error("GET order error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

// PATCH /api/admin/orders/[id] - Update order status
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, adminNotes, trackingNumber, trackingUrl } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
      updateData.trackingUrl = trackingUrl || null;
    }
    if (status === "SHIPPED") updateData.shippedAt = new Date();
    if (status === "DELIVERED") updateData.deliveredAt = new Date();
    if (status === "CANCELLED") updateData.cancelledAt = new Date();

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch (error) {
    console.error("PATCH order error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
