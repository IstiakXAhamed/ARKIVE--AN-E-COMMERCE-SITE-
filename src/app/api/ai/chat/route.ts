import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/gemini-ai';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth'; // Using auth() from v5
import { getSiteSettings } from '@/lib/settings';

// IN-MEMORY CACHE (V5 optimization)
const CHAT_CONTEXT_CACHE = new Map<string, { data: any; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getCachedContext() {
  const now = Date.now();
  const cached = CHAT_CONTEXT_CACHE.get('global_context');
  if (cached && now < cached.expires) return cached.data;
  return null;
}

function setCachedContext(data: any) {
  CHAT_CONTEXT_CACHE.set('global_context', {
    data,
    expires: Date.now() + CACHE_TTL
  });
}

export async function POST(request: NextRequest) {
  try {
    let { message, context, cartItems } = await request.json();
    
    // 1. Identify User
    const session = await auth();
    const user = session?.user;
    
    // Initialize context data object
    const contextData: any = { 
       orderStatus: context || '', 
       previousMessages: [],
       user: user ? { name: user.name, role: user.role } : null,
       cart: cartItems || []
    };
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // ==========================================
    // 2. ENHANCED CONTEXT GATHERING (V5 - Parallelized)
    // ==========================================
 
    // Check Cache First
    const cachedGlobal = await getCachedContext();
    
    // Define parallel tasks
    const fetchSettings = async () => {
      return await getSiteSettings();
    };
    
    // B. Trending / Categories (Cached)
    const fetchGlobalContext = async () => {
      if (cachedGlobal) return cachedGlobal;
      
      try {
        const [trendingProducts, categories] = await Promise.all([
          prisma.products.findMany({
            where: { isActive: true, isFeatured: true },
            take: 5,
            select: { name: true, slug: true, price: true, compareAtPrice: true }
          }),
          prisma.categories.findMany({
            where: { isActive: true }, // Arkive doesn't rely on parentId null for root always
            select: { name: true, slug: true },
            take: 12
          })
        ]);
        
        const data = {
          trending: trendingProducts.map(p => `- ${p.name} [SHOW:${p.slug}]`).join('\n'),
          categories: categories.map((c: any) => `- ${c.name} [CATEGORY:${c.slug}]`).join('\n')
        };
        setCachedContext(data);
        return data;
      } catch (e) {
        console.error("Global context fetch error", e);
        return { trending: '', categories: '' };
      }
    };
 
    // C. Active Coupons
    const fetchCoupons = async () => {
      try {
        const now = new Date();
        const activeCoupons = await prisma.coupons.findMany({
          where: {
            isActive: true,
            expiresAt: { gte: now } // Arkive schema uses expiresAt
          },
          select: { code: true, description: true, discountValue: true, discountType: true, minOrderValue: true },
          take: 5
        });
        return activeCoupons.map(c => `- ${c.code}: ${c.description} (${c.discountValue}${c.discountType === 'PERCENTAGE' ? '%' : ' BDT'} off)`).join('\n');
      } catch (e) {
        return 'No active coupons currently.';
      }
    };
 
    // Execute Parallel Context Fetching
    const [fetchedSettings, globalData, activeCoupons, pastOrders] = await Promise.all([
      fetchSettings(),
      fetchGlobalContext(),
      fetchCoupons(),
      user ? prisma.orders.findMany({
        where: { userId: user.id },
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { order_items: { include: { products: { select: { name: true, slug: true } } } } } // Arkive uses order_items
      }) : Promise.resolve([])
    ]);
 
    // Assign gathered data
    let settings = fetchedSettings;
    contextData.trending = globalData.trending;
    contextData.categories = globalData.categories;
    contextData.coupons = activeCoupons || 'None.';
    
    // Add site-wide promo code if available
    if (settings?.promoCode) {
      contextData.coupons = `Universal Code: ${settings.promoCode}\n${contextData.coupons}`;
    }
    
    if (user && Array.isArray(pastOrders) && pastOrders.length > 0) {
      contextData.pastOrders = (pastOrders as any[]).map(o => 
        `Order #${o.orderNumber} (Status: ${o.status}): ${o.order_items.map((i: any) => i.products.name).join(', ')}`
      ).join('\n');
    }

    // C. Universal Product Search & Best Offers
    const isPureGreeting = /^(hi|hello|hey|greetings|good morning|good evening|yo|hola|assalamu alaikum)$/i.test(message.trim());
    const isOfferRequest = /(offer|sale|deal|discount|promo|code|coupon)/i.test(message);

    if (!isPureGreeting || message.length > 10) {
      try {
        let finalProducts: any[] = [];

        // 1. BEST OFFER SEARCH
        if (isOfferRequest) {
           const onSaleProducts = await prisma.products.findMany({
             where: { 
               isActive: true,
               compareAtPrice: { not: null } // Only fetch items on sale
             },
             take: 5, 
             select: { 
                 name: true, price: true, compareAtPrice: true, slug: true,
                 stock: true
             }
           });

           finalProducts = onSaleProducts
             .map((p: any) => {
               // Must handle Decimal
               const price = Number(p.price);
               const compare = p.compareAtPrice ? Number(p.compareAtPrice) : 0;
               const discount = compare ? Math.round(((compare - price) / compare) * 100) : 0;
               return { ...p, discount, price, compare };
             })
             .filter((p: any) => p.discount >= 10)
             .sort((a: any, b: any) => b.discount - a.discount);
        } 
        
        // 2. STANDARD KEYWORD SEARCH 
        if (finalProducts.length === 0) {
           const stopWords = ['the', 'is', 'a', 'an', 'and', 'or', 'do', 'you', 'have', 'i', 'need', 'want', 'looking', 'for', 'show', 'me', 'price', 'of', 'what', 'are', 'best', 'offer'];
           const keywords = message.split(' ').filter((w: string) => !stopWords.includes(w.toLowerCase()) && w.length > 2).slice(0, 3).join(' | ');

           if (keywords) {
             finalProducts = await prisma.products.findMany({
               where: {
                 OR: [
                   { name: { contains: message } }, // Removed mode: insensitive (MySQL doesn't support it directly like Postgres without config, usually case insensitive by default)
                   { description: { contains: keywords.split(' | ')[0] } }
                 ],
                 isActive: true
               },
               take: 5,
               select: { 
                   name: true, price: true, compareAtPrice: true, slug: true,
                   stock: true
               }
             });
           }
        }

        if (finalProducts.length > 0) {
           contextData.foundProducts = finalProducts.map((p: any) => {
             const price = Number(p.price);
             const compare = p.compareAtPrice ? Number(p.compareAtPrice) : 0;
             const discount = compare ? Math.round(((compare - price) / compare) * 100) : 0;
             const priceDisplay = compare ? `৳${price} (Was ৳${compare})` : `৳${price}`;
             
             return `- ${p.name}: ${priceDisplay} ${discount > 0 ? `🔥 ${discount}% OFF!` : ''} [SHOW:${p.slug}]`;
           }).join('\n');
        }
      } catch (e) {
        console.log("Product search error", e);
      }
    }


    // E. Store Policies
    contextData.storePolicies = `
    - Shipping: ${settings.featureShippingTitle || 'Free shipping available'}.
    - Returns: ${settings.featureReturnDesc || 'Easy returns'}.
    - Payment: Cash on Delivery (COD) and Online Payment.
    `;

    // 3. Order Tracking Intent
    const orderMatch = message.match(/(?:order|track|tracking)\s*(?:#|no\.?|number)?\s*([a-zA-Z0-9-]+)/i);
    if (orderMatch && orderMatch[1]) {
       const orderId = orderMatch[1];
       try {
         const order = await prisma.orders.findUnique({
           where: { orderNumber: orderId },
           include: { order_items: { include: { products: { select: { name: true, slug: true } } } } }
         });
         
         if (order) {
           const itemsList = order.order_items.map((i: any) => `${i.products.name} (x${i.quantity})`).join(', ');
           const status = order.status;
           // Simple progress mapping
           const progress = status === 'DELIVERED' ? 100 : status === 'SHIPPED' ? 75 : status === 'PROCESSING' ? 40 : 15;
           contextData.orderStatus = `Order #${order.orderNumber} is ${status}.\nTotal: ৳${order.total}\nItems: ${itemsList}\n[ORDER_PROGRESS:${order.orderNumber}:${status}:${progress}]`;
         } else {
           contextData.orderStatus = `Customer asked for Order #${orderId} but it was NOT found.`;
         }
       } catch (e) { console.log("Order lookup error", e); }
    }
    
    const aiResponse = await generateChatResponse(message, contextData, settings);

    if (aiResponse.success) {
      // 4. MULTI-ACTION PARSING LOGIC
      let finalResponse = aiResponse.result;
      const actions: any[] = [];

      // A. [SHOW:slug]
      const showMatches = [...finalResponse.matchAll(/\[SHOW:(.+?)\]/g)];
      for (const match of showMatches) {
        const slug = match[1];
        finalResponse = finalResponse.replace(match[0], '').trim();
        try {
          const product = await prisma.products.findUnique({
             where: { slug },
             select: { id: true, name: true, slug: true, price: true, compareAtPrice: true, product_images: { take: 1, select: { url: true } } }
          });
          if (product) actions.push({ type: 'show_product', payload: product });
        } catch (e) { console.error("Product action fetch error:", e); }
      }

      // B. [CATEGORY:slug]
      const catMatches = [...finalResponse.matchAll(/\[CATEGORY:(.+?)\]/g)];
      for (const match of catMatches) {
        const slug = match[1];
        finalResponse = finalResponse.replace(match[0], '').trim();
        try {
          const category = await prisma.categories.findUnique({
             where: { slug },
             select: { name: true, slug: true, image: true }
          });
          if (category) actions.push({ type: 'show_category', payload: category });
        } catch (e) { console.error("Category action fetch error:", e); }
      }

      // E. [MISSING:...], [ACTION:HANDOFF], [URGENT_COMPLAINT]
      if (finalResponse.includes('[ACTION:HANDOFF]')) {
         finalResponse = finalResponse.replace('[ACTION:HANDOFF]', '').trim();
         actions.push({ type: 'open_live_chat', payload: { context: message } });
      }

      return NextResponse.json({ 
        response: finalResponse,
        actions: actions 
      });
    } else {
      return NextResponse.json({ error: aiResponse.error || 'Failed to generate response' }, { status: 500 });
    }
  } catch (error) {
    console.error('Chat API Fatal Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
