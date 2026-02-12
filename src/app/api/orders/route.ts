import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// POST /api/orders - Place new order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shippingAddress, paymentMethod, paymentRef, notes, couponCode } = body;

    // Validate required fields
    if (!items || !items.length || !shippingAddress || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get current user if authenticated
    const session = await auth();
    const userId = session?.user?.id || null;

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Get shipping cost from settings (default 120)
    const shippingCost = 120;
    const discount = 0;

    // Apply coupon if provided
    let finalTotal = subtotal + shippingCost - discount;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });
      
      if (coupon && coupon.isActive) {
        if (coupon.expiresAt && coupon.expiresAt < new Date()) {
          return NextResponse.json({ error: "Coupon expired" }, { status: 400 });
        }
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
          return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
        }
        if (coupon.minOrderValue && subtotal < Number(coupon.minOrderValue)) {
          return NextResponse.json({ error: `Minimum order ৳${coupon.minOrderValue}` }, { status: 400 });
        }

        if (coupon.discountType === "PERCENTAGE") {
          const discountAmount = (subtotal * Number(coupon.discountValue)) / 100;
          finalTotal = subtotal + shippingCost - discountAmount;
        } else {
          finalTotal = subtotal + shippingCost - Number(coupon.discountValue);
        }
      }
    }

    // Generate order number
    const orderNumber = `ARKIVE-${Date.now().toString(36).toUpperCase()}`;

    // Create address if user is authenticated
    let addressId = null;
    if (userId) {
      const address = await prisma.address.create({
        data: {
          userId,
          label: "Shipping",
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          division: shippingAddress.division,
          district: shippingAddress.district,
          area: shippingAddress.area,
          address: shippingAddress.address,
          isDefault: false,
        },
      });
      addressId = address.id;
    }

    // Create order with items
    const orderData: any = {
      orderNumber,
      status: "PENDING",
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
      paymentRef: paymentRef || null,
      subtotal,
      shippingCost,
      discount,
      total: finalTotal,
      couponCode: couponCode?.toUpperCase(),
      notes,
      items: {
        create: items.map((item: any) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      },
    };

    // Add optional fields
    if (userId) orderData.userId = userId;
    if (addressId) orderData.addressId = addressId;

    const order = await prisma.order.create({
      data: orderData,
    });

    // Update coupon usage
    if (couponCode) {
      await prisma.coupon.update({
        where: { code: couponCode.toUpperCase() },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Decrement stock for each item
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          salesCount: { increment: item.quantity },
        },
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: Number(order.total),
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// GET /api/orders - Get user's orders
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      orders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        total: Number(o.total),
        items: o.items.length,
        createdAt: o.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
