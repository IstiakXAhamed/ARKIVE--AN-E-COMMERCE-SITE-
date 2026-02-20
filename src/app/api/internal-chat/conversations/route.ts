import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const currentUserId = session.user.id

  try {
    // Fetch all messages involving the current user
    const messages = await prisma.internalMessage.findMany({
      where: {
        OR: [
          { senderId: currentUserId },
          { receiverId: currentUserId }
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: { id: true, name: true, email: true, role: true, image: true }
        },
        receiver: {
          select: { id: true, name: true, email: true, role: true, image: true }
        }
      }
    })

    // Group by conversation partner
    const conversationMap = new Map<string, any>()

    for (const msg of messages) {
      const isSender = msg.senderId === currentUserId
      const partner = isSender ? msg.receiver : msg.sender
      const partnerId = partner.id

      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          user: partner,
          lastMessage: {
            content: msg.content,
            createdAt: msg.createdAt,
            isRead: msg.isRead,
            amISender: isSender
          },
          unreadCount: 0
        })
      }

      // Count unread messages from this partner
      if (!isSender && !msg.isRead) {
        conversationMap.get(partnerId).unreadCount++
      }
    }

    const conversations = Array.from(conversationMap.values())

    return NextResponse.json({ conversations })
  } catch (error: any) {
    console.error('Fetch conversations error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
