import { NextRequest, NextResponse } from "next/server";
import {
  generateProductDescription,
  generateSEOContent,
  analyzeReviewSentiment,
} from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 503 }
      );
    }

    switch (action) {
      case "generate-description": {
        const { name, category, material, keywords } = body;
        const description = await generateProductDescription(
          name,
          category,
          material,
          keywords
        );
        return NextResponse.json({ result: description });
      }

      case "generate-seo": {
        const { productName, category, description } = body;
        const seo = await generateSEOContent(productName, category, description);
        return NextResponse.json({ result: seo });
      }

      case "analyze-sentiment": {
        const { reviews } = body;
        const sentiment = await analyzeReviewSentiment(reviews);
        return NextResponse.json({ result: sentiment });
      }

      default:
        return NextResponse.json(
          { error: "Unknown action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Admin AI error:", error);
    return NextResponse.json(
      { error: "AI processing failed. Please try again." },
      { status: 500 }
    );
  }
}
