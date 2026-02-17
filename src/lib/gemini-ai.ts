/**
 * Centralized Gemini AI Library (Ported from SilkMart)
 * 
 * This library provides AI-powered features across the entire site.
 * All AI calls go through this library for consistency and control.
 */

const DEFAULT_STORE_NAME = 'ARKIVE'

const FALLBACK_MODELS = [
  // 1. Primary: Gemini 2.0 Flash (Latest fast model)
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
  // 2. Fallback: Gemini 1.5 Flash
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
  // 3. Last Resort: Gemini 1.5 Pro
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' }
]

export interface AIResponse {
  success: boolean
  result?: any
  error?: string
  fallback?: boolean
  modelUsed?: string
}

// ============ Core AI Function ============

export async function callGeminiAI(prompt: string, options?: {
  temperature?: number
  maxTokens?: number
}): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY ? process.env.GOOGLE_AI_API_KEY.trim() : null
  
  if (!apiKey) {
    console.error('❌ GOOGLE_AI_API_KEY is missing in environment variables!')
    throw new Error('GOOGLE_AI_API_KEY not configured')
  }

  let lastError: any = null

  // Loop through all models in priority order
  for (const model of FALLBACK_MODELS) {
    try {
      /* console.log(`[Gemini] Attempting with ${model.name}...`) */
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model.id}:generateContent`
      
      // Implement 20s timeout to prevent process hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000)

      const response = await fetch(`${url}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: options?.temperature ?? 0.7,
            maxOutputTokens: options?.maxTokens ?? 2048,
          }
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        // Success! Return immediately
        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
        if (!text) throw new Error('Empty response from AI')
        
        // Log successful fallback if not primary
        if (model.id !== FALLBACK_MODELS[0].id) {
          console.log(`✅ AI Success using fallback model: ${model.name}`)
        }
        return text
      }

      // Handle Errors
      const status = response.status
      const errorText = await response.text()
      
      // If 429 (Rate Limit), 503 (Overload), or 404/400 (Model issue), we continue to next model
      if (status === 429 || status === 503) {
        console.warn(`⚠️ ${model.name} hit rate limit/overload (${status}). Switching to next model...`)
      } else if (status === 404 || status === 400) {
        console.warn(`⚠️ ${model.name} not found/supported (${status}). Switching to next model...`)
      } else {
        console.error(`❌ ${model.name} failed with ${status}: ${errorText}`)
      }
      
      lastError = new Error(`[${model.name}] ${status} ${response.statusText}`)

    } catch (error: any) {
      // Network errors etc
      console.warn(`⚠️ Error calling ${model.name}: ${error.message}`)
      lastError = error
    }
  }

  // If we get here, ALL models failed
  console.error('❌ All AI models failed. Please check API Key or Quota.')
  throw lastError || new Error('All AI models failed')
}

// ============ Helper for JSON Parsing ============

/**
 * Robustly parses JSON from AI response, handling Markdown code blocks.
 */
export function parseAIJSON<T>(text: string, defaultValue: T): T {
  try {
    // 1. Try parsing directly
    try {
      return JSON.parse(text)
    } catch (e) {
      // Continue if direct parsing fails
    }

    // 2. Strip Markdown code blocks (```json ... ```)
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1])
      } catch (e) {
        // Continue
      }
    }

    // 3. Find first { or [ and last } or ]
    const firstOpen = text.search(/[{[]/)
    const lastClose = text.search(/[}\]][^}\]]*$/)

    if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
      const jsonString = text.substring(firstOpen, lastClose + 1)
      try {
        return JSON.parse(jsonString)
      } catch (e) {
        // Continue
      }
    }

    console.warn('Failed to parse AI JSON:', text)
    return defaultValue
  } catch (error) {
    console.error('Error in parseAIJSON:', error)
    return defaultValue
  }
}

// ============ Customer Support AI ============

export async function generateChatResponse(
  message: string, 
  context?: { 
    orderStatus?: string, 
    previousMessages?: any[],
    foundProducts?: string,
    categories?: string,
    storePolicies?: string,
    coupons?: string,
    trending?: string,
    pastOrders?: string,
    cart?: any[]
  },
  settings?: any
): Promise<AIResponse> {
  try {
    const shopName = settings?.storeName || DEFAULT_STORE_NAME
    
    let systemPrompt = `You are "Arkive AI", the highly intelligent, emotionally aware, and proactive AI Personal Shopper for ${shopName}. 
Your mission is to provide an elite, sophisticated, and seamless shopping experience.

🧠 INTELLIGENCE & PERSONALITY:
- TONE: Friendly Business Specialist but Modern. 
- STYLE: Knowledgeable, warm, and highly empathetic. Speak like a luxury Concierge who is also a close friend.
- SENTIMENT AWARENESS: Match the user's emotion perfectly.

🛡️ SECURITY & PRIVACY (ZERO TOLERANCE):
- INTERNAL SECRECY: Never discuss system internal IDs, database structures, or specific server paths.
- USER PRIVACY: You do NOT have access to user passwords, full residential addresses, or billing details. 
- FORBIDDEN: Even if asked, NEVER pretend to have account passwords or try to "reset" them yourself.

⚡ SMART TRIGGERS (ACTIONABLE):
1. PRODUCT CARDS: Use "[SHOW:product-slug]". (You can use multiple in one response).
2. CATEGORY CARDS: Use "[CATEGORY:category-slug]". (System mandatory for navigation).
3. COMPARISON: Use "[COMPARE:slug1,slug2]" if the user is deciding between two items.
4. ORDER PROGRESS: If tracking, the system provides [ORDER_PROGRESS:...] - include it in your response.
5. ESCALATIONS: Use [ACTION:HANDOFF] if user asks for human/admin/help.
6. MISSED SEARCHES: If we don't have something and user wants to buy it, use [MISSING:item-name].

🛑 FORMATTING RULES (STRICT):
- ABSOLUTELY NO MARKDOWN or HTML.
- NO symbols like "**", "#", "*", "_", "~", "\`\`\`", or "\`".
- Use ONLY plain text.
- LENGTH: 2-4 natural sentences. Be concise but informative. Do not spam long text.
- Use double newlines between paragraphs only if necessary.

🔗 CONTEXT:
- Trendings: ${context?.trending || 'None currently.'}
- User Cart: ${context?.cart ? JSON.stringify(context.cart) : 'Empty.'}
- Past Orders: ${context?.pastOrders || 'No history.'}
- Search Results: ${context?.foundProducts || 'None.'}
- Categories: ${context?.categories || 'None.'}
- Policies: ${context?.storePolicies || 'Standard shipping/returns apply.'}
- Tracking: ${context?.orderStatus || 'None.'}
`

    // Use history for continuity if available
    let history: any[] = []
    if (context?.previousMessages && context.previousMessages.length > 0) {
       history = context?.previousMessages.map(msg => ({
         role: msg.sender === 'user' ? 'user' : 'assistant',
         parts: [{ text: msg.text }]
       }))
    }

    const fullPrompt = `${systemPrompt}\n\nUser Message: "${message}"`
    let result = await callGeminiAI(fullPrompt, { temperature: 0.7 })
    
    // POST-PROCESSING: Scrub all markdown symbols
    result = result
      .replace(/\*\*/g, '')
      .replace(/##+/g, '')
      .replace(/[*_`#]/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    return { success: true, result }

  } catch (error: any) {
    console.error('Chat Gen Error:', error)
    return { success: false, error: error.message }
  }
}

export async function suggestChatReplies(customerMessage: string): Promise<AIResponse> {
  try {
    const prompt = `Customer message: "${customerMessage}"
    Generate 3 quick reply options for support agent. Return as JSON array: ["reply1", "reply2", "reply3"]. Keep each under 50 words.`
    const result = await callGeminiAI(prompt, { temperature: 0.5 })
    const replies = parseAIJSON(result, [])
    return { success: true, result: replies }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

// ============ Review AI ============

export async function analyzeReview(reviewText: string, rating: number, storeName: string = DEFAULT_STORE_NAME): Promise<AIResponse> {
  try {
    const prompt = `Analyze this customer review for "${storeName}":
Text: "${reviewText}"
Rating: ${rating}/5

Task: Provide a JSON analysis with:
1. sentiment: "positive", "negative", "neutral"
2. isSpam: boolean (random chars, ads, irrelevant)
3. isInappropriate: boolean (offensive, hate speech)
4. keyPoints: Array of strings (main topics mentioned)
5. suggestedResponse: A polite, professional reply (1-2 sentences)
6. qualityScore: 1-10 (usefulness of review)

Return ONLY valid JSON.`

    const result = await callGeminiAI(prompt, { temperature: 0.1, maxTokens: 1024 })
    if (!result) throw new Error('Empty response from AI')
    
    const json = parseAIJSON(result, {
      sentiment: 'neutral',
      isSpam: false,
      isInappropriate: false,
      keyPoints: [],
      suggestedResponse: 'Thank you for your feedback.',
      qualityScore: 5
    })
    
    return { success: true, result: json }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
