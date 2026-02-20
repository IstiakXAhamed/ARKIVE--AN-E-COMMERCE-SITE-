import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET single order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = await prisma.orders.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        order_items: {
          include: {
            products: {
              select: {
                id: true,
                name: true,
                slug: true,
                product_images: {
                  where: { isPrimary: true },
                  take: 1,
                  select: { url: true }
                }
              }
            }
          }
        },
        addresses: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Get order error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update order status and payment status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, paymentStatus, trackingNumber, trackingUrl, adminNotes } = body;

    // Get existing order
    const existingOrder = await prisma.orders.findUnique({
      where: { id: params.id }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    };

    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (trackingUrl !== undefined) updateData.trackingUrl = trackingUrl;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    // Set timestamps based on status changes
    if (status === 'SHIPPED' && existingOrder.status !== 'SHIPPED') {
      updateData.shippedAt = new Date();
    }
    if (status === 'DELIVERED' && existingOrder.status !== 'DELIVERED') {
      updateData.deliveredAt = new Date();
    }
    if (status === 'CANCELLED' && existingOrder.status !== 'CANCELLED') {
      updateData.cancelledAt = new Date();
    }

    // Update order
    const order = await prisma.orders.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        order_items: {
          include: {
            products: {
              select: {
                id: true,
                name: true,
                slug: true,
                product_images: {
                  where: { isPrimary: true },
                  take: 1,
                  select: { url: true }
                }
              }
            }
          }
        },
        addresses: true
      }
    });

    return NextResponse.json({
      order,
      message: 'Order updated successfully'
    });
  } catch (error: any) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
