import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!process.env.GOOGLE_AI_API_KEY) {
      return new NextResponse("Google AI API Key not configured", { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are Arkive's helpful AI assistant. You help customers find jewelry, watches, and accessories. Be polite, concise, and helpful." }],
        },
        {
          role: "model",
          parts: [{ text: "Hello! I am Arkive's AI assistant. How can I help you find the perfect jewelry or accessory today?" }],
        },
      ],
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ role: 'assistant', content: text });
  } catch (error) {
    console.error('[CHAT_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
