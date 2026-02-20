import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdmin, unauthorized } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// GET - Fetch all site settings (admin)
export async function GET(request: NextRequest) {
  const { authorized } = await checkAdmin()
  if (!authorized) return unauthorized()

  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'main' }
    })

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { id: 'main' }
      })
    }

    return NextResponse.json({ settings })
  } catch (error: any) {
    console.error('Fetch settings error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update site settings
export async function PUT(request: NextRequest) {
  const { authorized } = await checkAdmin()
  if (!authorized) return unauthorized()

  try {
    const body = await request.json()
    
    // Remove id/updatedAt from likely read-only fields if passed
    const { id, updatedAt, ...updateData } = body

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'main' },
      update: updateData,
      create: { id: 'main', ...updateData }
    })

    return NextResponse.json({ success: true, settings })
  } catch (error: any) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
