import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdmin, unauthorized } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { authorized } = await checkAdmin()
  if (!authorized) return unauthorized()

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        permissions: true,
        // isActive: true // Assuming this field exists or we add it later. For now omit if not in schema.
      }
    })
    
    // Add isActive placeholder if not in DB yet
    const usersWithActive = users.map((u: typeof users[0]) => ({ ...u, isActive: true }))

    return NextResponse.json({ users: usersWithActive })
  } catch (error: any) {
    console.error('Fetch users error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
