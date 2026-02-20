import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin, unauthorized } from '@/lib/admin-auth'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const { authorized } = await checkAdmin()
  if (!authorized) return unauthorized()

  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ valid: false, error: 'API Key missing' })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const result = await model.generateContent('Say hello')
    const response = await result.response
    const text = response.text()

    if (text) {
      return NextResponse.json({ valid: true })
    } else {
       return NextResponse.json({ valid: false, error: 'No response from AI' })
    }

  } catch (error: any) {
    console.error('AI Test Error:', error)
    return NextResponse.json({ valid: false, error: error.message })
  }
}
