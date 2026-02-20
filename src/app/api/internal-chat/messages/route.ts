import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET - Fetch messages with a specific user
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const otherUserId = searchParams.get('userId')

  if (!otherUserId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  try {
    const messages = await prisma.internalMessage.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: session.user.id }
        ]
      },
      orderBy: { createdAt: 'asc' }
    })

    // Mark received messages as read
    await prisma.internalMessage.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: session.user.id,
        isRead: false
      },
      data: { isRead: true }
    })

    return NextResponse.json({ messages })
  } catch (error: any) {
    console.error('Fetch messages error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Send a message
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { receiverId, content } = await request.json()

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const message = await prisma.internalMessage.create({
      data: {
        senderId: session.user.id,
        receiverId,
        content
      }
    })

    return NextResponse.json({ message })
  } catch (error: any) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
