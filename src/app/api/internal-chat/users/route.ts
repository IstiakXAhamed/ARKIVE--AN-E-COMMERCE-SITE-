import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || ''

  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
             { id: { not: session.user.id } }, // Exclude self
             {
                 OR: [
                     { name: { contains: query } }, // removed mode: insensitive for now as it depends on DB provider
                     { email: { contains: query } }
                 ]
             }
        ]
      },
      take: 20,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true
      }
    })

    return NextResponse.json({ users })
  } catch (error: any) {
    console.error('Search users error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
