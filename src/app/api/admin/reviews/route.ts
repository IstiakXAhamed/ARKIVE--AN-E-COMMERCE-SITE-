import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/admin/reviews - List all reviews
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;

    const where: any = {};
    if (status === "pending") where.isApproved = false;
    if (status === "approved") where.isApproved = true;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: { select: { name: true, email: true, image: true } },
          product: { select: { name: true, slug: true, images: { where: { isPrimary: true }, take: 1 } } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({ where }),
    ]);

    return NextResponse.json({
      reviews: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        isApproved: r.isApproved,
        isVerified: r.isVerified,
        createdAt: r.createdAt,
        user: r.user,
        product: {
          name: r.product.name,
          slug: r.product.slug,
          image: r.product.images[0]?.url || null,
        },
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// PATCH /api/admin/reviews - Approve/Reject review
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, isApproved } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    const review = await prisma.review.update({
      where: { id },
      data: { isApproved },
    });

    // Update product rating if approved
    if (isApproved) {
      const productReviews = await prisma.review.findMany({
        where: { productId: review.productId, isApproved: true },
        select: { rating: true },
      });
      const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      await prisma.product.update({
        where: { id: review.productId },
        data: { rating: Math.round(avgRating * 10) / 10, reviewsCount: productReviews.length },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH review error:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

// DELETE /api/admin/reviews
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    const review = await prisma.review.delete({ where: { id } });

    // Recalculate product rating
    const productReviews = await prisma.review.findMany({
      where: { productId: review.productId, isApproved: true },
      select: { rating: true },
    });
    const avgRating = productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
      : 0;
    await prisma.product.update({
      where: { id: review.productId },
      data: { rating: Math.round(avgRating * 10) / 10, reviewsCount: productReviews.length },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE review error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
