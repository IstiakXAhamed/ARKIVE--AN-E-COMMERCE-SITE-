import { GoogleGenerativeAI } from "@google/generative-ai";

// Use the correct environment variable name from .env
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

const SILK_SYSTEM_PROMPT = `You are Silk, the AI shopping assistant for ARKIVE — a premium jewelry and accessories store in Bangladesh.

Your personality:
- Warm, elegant, and knowledgeable about jewelry
- You speak in a friendly but refined tone
- You use BDT (৳) for all prices
- You know about women's jewelry, men's accessories, couple items, and stationery
- You can help with product recommendations, size guides, care tips, gifting advice, and order questions

Guidelines:
- Keep responses concise (2-3 sentences for simple questions, more for detailed advice)
- Always be helpful and suggest relevant products when appropriate
- If asked about orders or account-specific info, politely direct them to the Account page
- Never make up specific product prices — suggest they check the website for current pricing
- For complaints, empathize first then suggest contacting support via email or phone
- You can answer questions about jewelry materials, care, styling, and gifting

Store info:
- Free shipping on orders over ৳3,000
- Flat rate shipping: ৳120
- Payment methods: bKash, Nagad, Cash on Delivery
- Delivery across all 8 divisions of Bangladesh
- Categories: Women (earrings, rings, bracelets, necklaces, bags), Men (watches, rings, perfumes), Couple/Unisex (couple rings, chains, bracelets), Stationery (notebooks, accessories)`;

export async function chatWithSilk(
  message: string,
  history: { role: "user" | "model"; parts: { text: string }[] }[] = []
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SILK_SYSTEM_PROMPT,
  });

  const chat = model.startChat({
    history,
    generationConfig: {
      maxOutputTokens: 500,
      temperature: 0.7,
    },
  });

  const result = await chat.sendMessage(message);
  const response = result.response;
  return response.text();
}

export async function generateProductDescription(
  name: string,
  category: string,
  material?: string,
  keywords?: string[]
) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Write a compelling product description for an e-commerce jewelry store (ARKIVE, Bangladesh).

Product: ${name}
Category: ${category}
${material ? `Material: ${material}` : ""}
${keywords?.length ? `Keywords: ${keywords.join(", ")}` : ""}

Requirements:
- 2-3 short paragraphs
- Elegant, premium tone
- Mention craftsmanship and quality
- Include a subtle call to action
- Do NOT include prices
- Keep under 150 words`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateSEOContent(
  productName: string,
  category: string,
  description: string
) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Generate SEO metadata for this jewelry product listing.

Product: ${productName}
Category: ${category}
Description: ${description}

Return a JSON object with:
- "title": SEO title (max 60 chars, include "ARKIVE" brand)
- "description": Meta description (max 155 chars)
- "keywords": Array of 8-10 relevant keywords

Return ONLY the JSON, no markdown formatting.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(text);
}

export async function analyzeReviewSentiment(reviews: string[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analyze the sentiment of these customer reviews for a jewelry store.

Reviews:
${reviews.map((r, i) => `${i + 1}. "${r}"`).join("\n")}

Return a JSON object with:
- "overall": "positive" | "neutral" | "negative"
- "score": number from 0-100
- "summary": 1-2 sentence summary of customer sentiment
- "highlights": array of positive themes mentioned
- "concerns": array of negative themes mentioned

Return ONLY the JSON, no markdown formatting.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(text);
}
