import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  parseAIJSON,
  callGeminiAI,
  generateAdvancedDescription,
  analyzeProductForSuggestions,
  getSmartSuggestions,
  rewriteContent,
} from "@/lib/gemini-ai";

export const dynamic = "force-dynamic";

// Check admin access
async function checkAdmin(req: NextRequest) {
  const session = await auth();
  if (
    !session?.user ||
    !["ADMIN", "SUPERADMIN"].includes(session.user.role)
  ) {
    return null;
  }
  return session.user;
}

export async function POST(req: NextRequest) {
  try {
    const admin = await checkAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, productName, category, description, tone, language } =
      await req.json();

    if (!productName) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    // Fetch site settings for store name
    let storeName = "ARKIVE";
    try {
      const settings = await prisma.storeSettings.findUnique({
        where: { id: "main" },
      });
      if (settings?.storeName) storeName = settings.storeName;
    } catch (e) {
      console.warn("Failed to fetch settings for product assist:", e);
    }

    let result: any = {};

    try {
      switch (action) {
        case "description":
          const descRes = await generateAdvancedDescription(productName, {
            category,
            tone,
            language,
            storeName,
          });
          if (descRes.success) result.suggestion = descRes.result;
          else throw new Error(descRes.error);
          break;

        case "tags":
          const tagsRes = await getSmartSuggestions(productName, "tags");
          if (tagsRes.success) result.suggestion = tagsRes.result.join(", ");
          else throw new Error(tagsRes.error);
          break;

        case "seo":
          const seoRes = await getSmartSuggestions(productName, "product_name");
          if (seoRes.success)
            result.suggestion = `${productName} | Premium Quality | ${storeName}`;
          else throw new Error(seoRes.error);
          break;

        case "analyze":
          const analyzeRes = await analyzeProductForSuggestions(
            productName,
            storeName
          );
          if (analyzeRes.success) result = analyzeRes.result;
          else throw new Error(analyzeRes.error);
          break;

        case "complete":
          const compRes = await callGeminiAI(
            `Generate complete product details for "${productName}" in the context of "${storeName}" in JSON format including price, description, and features...`
          );
          result = parseAIJSON(compRes, {});
          break;

        case "rewrite":
          const rewriteRes = await rewriteContent(description, {
            tone,
            language,
            storeName,
          });
          if (rewriteRes.success) result.suggestion = rewriteRes.result;
          else throw new Error(rewriteRes.error);
          break;

        default:
          return NextResponse.json({ error: "Invalid action" }, { status: 400 });
      }

      return NextResponse.json({ success: true, ...result });
    } catch (aiError: any) {
      console.error("AI Assist Error:", aiError);
      return NextResponse.json(
        {
          success: false,
          error: aiError.message,
          fallback: true,
          suggestion:
            action === "description"
              ? `Discover our premium ${productName} at ${storeName}.`
              : productName,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Product Assist Fatal Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
