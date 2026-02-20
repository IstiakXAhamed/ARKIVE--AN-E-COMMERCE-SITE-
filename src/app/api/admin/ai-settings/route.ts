import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdmin, unauthorized } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { authorized } = await checkAdmin()
  if (!authorized) return unauthorized()

  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'main' }
    })

    let aiConfig = {}
    if (settings && settings.aiConfig) {
       try {
         aiConfig = JSON.parse(settings.aiConfig)
       } catch (e) {}
    }

    return NextResponse.json(aiConfig)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { authorized } = await checkAdmin()
  if (!authorized) return unauthorized()

  try {
    const body = await request.json()

    // Retrieve existing to merge if needed, but usually we just overwrite the config blob
    // But we need to make sure siteSettings exists
    const settings = await prisma.siteSettings.upsert({
      where: { id: 'main' },
      update: {
        aiConfig: JSON.stringify(body)
      },
      create: {
        id: 'main',
        aiConfig: JSON.stringify(body)
      }
    })

    return NextResponse.json({ success: true, settings })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
