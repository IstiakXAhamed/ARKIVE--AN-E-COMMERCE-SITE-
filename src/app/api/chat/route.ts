import { NextRequest, NextResponse } from "next/server";
import { chatWithSilk } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback response when API key is not configured
      return NextResponse.json({
        reply: "I'm Silk, your ARKIVE shopping assistant! I'm currently being set up. Please check back soon, or browse our beautiful collection in the meantime. 💎",
      });
    }

    const reply = await chatWithSilk(message, history || []);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Silk chat error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
