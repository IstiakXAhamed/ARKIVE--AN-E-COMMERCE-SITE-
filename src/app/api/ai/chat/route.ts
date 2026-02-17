import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/gemini-ai";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getSiteSettings } from "@/lib/settings";

/**
 * Advanced AI Chat Route (Ported from SilkMart)
 * Handles context gathering, intent recognition, and action parsing.
 */
export async function POST(req: NextRequest) {
  try {
    const { message, context, cartItems } = await req.json();
    const session = await auth();
    const user = session?.user;

    // Initialize context data
    const contextData: any = {
      orderStatus: context || "",
      previousMessages: [],
      user: user ? { name: user.name, role: user.role } : null,
      cart: cartItems || [],
    };

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // ==========================================
    // 2. CONTEXT GATHERING (Parallelized)
    // ==========================================

    const fetchSettings = getSiteSettings();

    const fetchGlobalContext = async () => {
      try {
        const [trendingProducts, categories] = await Promise.all([
          prisma.product.findMany({
            where: { isActive: true, isFeatured: true },
            take: 5,
            select: { name: true, slug: true, price: true, originalPrice: true },
          }),
          prisma.category.findMany({
            where: { isActive: true, parentId: null },
            take: 12,
            select: { name: true, slug: true },
          }),
        ]);

        return {
          trending: trendingProducts
            .map((p) => `- ${p.name} [SHOW:${p.slug}]`)
            .join("\n"),
          categories: categories
            .map((c) => `- ${c.name} [CATEGORY:${c.slug}]`)
            .join("\n"),
        };
      } catch (e) {
        console.error("Global context fetch error", e);
        return { trending: "", categories: "" };
      }
    };

    const fetchPastOrders = async () => {
      if (!user?.email) return [];
      try {
        return await prisma.order.findMany({
          where: { email: user.email }, // Arkive uses email for linking currently
          take: 3,
          orderBy: { createdAt: "desc" },
          include: { items: { include: { product: { select: { name: true } } } } },
        });
      } catch (e) {
        return [];
      }
    };

    const [settings, globalData, pastOrders] = await Promise.all([
      fetchSettings,
      fetchGlobalContext(),
      fetchPastOrders(),
    ]);

    contextData.trending = globalData.trending;
    contextData.categories = globalData.categories;
    contextData.coupons = "No active coupons."; // Placeholder until Coupon system is ported
    
    if (pastOrders.length > 0) {
      contextData.pastOrders = pastOrders
        .map(
          (o) =>
            `Order #${o.orderNumber} (Status: ${o.status}): ${o.items
              .map((i) => i.name)
              .join(", ")}`
        )
        .join("\n");
    }

    // ==========================================
    // 3. INTENT RECOGNITION & SEARCH
    // ==========================================

    // Product Search Logic
    const isPureGreeting = /^(hi|hello|hey|greetings|good morning|yo)$/i.test(
      message.trim()
    );

    if (!isPureGreeting || message.length > 10) {
      try {
        const keywords = message
          .split(" ")
          .filter((w: string) => w.length > 3)
          .slice(0, 3)
          .join(" | ");

        if (keywords) {
          const products = await prisma.product.findMany({
            where: {
              OR: [
                { name: { contains: message } },
                { description: { contains: keywords.split(" | ")[0] } },
              ],
              isActive: true,
            },
            take: 5,
            select: { name: true, price: true, slug: true },
          });

          if (products.length > 0) {
            contextData.foundProducts = products
              .map(
                (p) => `- ${p.name}: ৳${p.price} [SHOW:${p.slug}]`
              )
              .join("\n");
          }
        }
      } catch (e) {
        console.log("Product search error", e);
      }
    }

    // Order Tracking Intent
    const orderMatch = message.match(
      /(?:order|track|tracking)\s*(?:#|no\.?|number)?\s*([a-zA-Z0-9-]+)/i
    );
    if (orderMatch && orderMatch[1]) {
      const orderId = orderMatch[1];
      try {
        const order = await prisma.order.findUnique({
          where: { orderNumber: orderId },
          include: { items: true },
        });

        if (order) {
          const itemsList = order.items
            .map((i) => `${i.name} (x${i.quantity})`)
            .join(", ");
          contextData.orderStatus = `Order #${order.orderNumber} is ${order.status}.\nTotal: ৳${order.total}\nItems: ${itemsList}\nPlaced on: ${order.createdAt.toLocaleDateString()}`;
        } else {
          contextData.orderStatus = `Customer asked for Order #${orderId} but it was NOT found.`;
        }
      } catch (e) {
        console.log("Order lookup error", e);
      }
    }

    // ==========================================
    // 4. GENERATE RESPONSE
    // ==========================================

    const aiResponse = await generateChatResponse(
      message,
      contextData,
      settings
    );

    if (aiResponse.success) {
      // 5. ACTION PARSING
      let finalResponse = aiResponse.result;
      const actions: any[] = [];

      // [SHOW:slug]
      const showMatches = [...finalResponse.matchAll(/\[SHOW:(.+?)\]/g)];
      for (const match of showMatches) {
        const slug = match[1];
        finalResponse = finalResponse.replace(match[0], "").trim();
        try {
          const product = await prisma.product.findUnique({
            where: { slug },
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              originalPrice: true,
              image: true,
            },
          });
          if (product) actions.push({ type: "show_product", payload: product });
        } catch (e) {}
      }

      // [CATEGORY:slug]
      const catMatches = [...finalResponse.matchAll(/\[CATEGORY:(.+?)\]/g)];
      for (const match of catMatches) {
        const slug = match[1];
        finalResponse = finalResponse.replace(match[0], "").trim();
        try {
          const category = await prisma.category.findUnique({
            where: { slug },
            select: { name: true, slug: true, image: true },
          });
          if (category)
            actions.push({ type: "show_category", payload: category });
        } catch (e) {}
      }

      return NextResponse.json({
        response: finalResponse,
        actions: actions,
      });
    } else {
      return NextResponse.json(
        { error: aiResponse.error || "Failed to generate response" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Chat API Fatal Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
