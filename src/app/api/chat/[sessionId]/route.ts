import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { notifyNewChatMessage } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    const { searchParams } = new URL(request.url);
    const after = searchParams.get('after');

    const session = await (prisma as any).chatSession.findUnique({
      where: { sessionId }
    });

    if (!session) {
      return NextResponse.json({ messages: [] });
    }

    let whereClause: any = { sessionId: session.id };
    if (after) {
      whereClause.createdAt = { gt: new Date(after) };
    }

    const messages = await (prisma as any).chatMessage.findMany({
      where: whereClause,
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error('Get messages error:', error);
    return NextResponse.json({ messages: [], error: 'Database Error' });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    const body = await request.json();
    const { message, senderType, senderName, customerEmail } = body;

    const authSession = await auth();
    let senderId = authSession?.user?.id || null;
    let actualSenderName = senderName;

    // Use authorized name if available
    if (authSession?.user?.name) {
       actualSenderName = authSession.user.name;
    }

    let chatSession = await (prisma as any).chatSession.findUnique({
      where: { sessionId }
    });

    if (!chatSession) {
      chatSession = await (prisma as any).chatSession.create({
        data: {
          sessionId,
          userId: senderId,
          customerName: actualSenderName || 'Guest',
          customerEmail: customerEmail || null,
          status: 'active'
        }
      });
    }

    const newMessage = await (prisma as any).chatMessage.create({
      data: {
        sessionId: chatSession.id,
        senderType,
        senderId,
        senderName: actualSenderName || 'Guest',
        message,
        isRead: false
      }
    });

    await (prisma as any).chatSession.update({
      where: { id: chatSession.id },
      data: { updatedAt: new Date() }
    });

    // Notify admins
    if (senderType === 'customer') {
      await notifyNewChatMessage(actualSenderName || 'Guest', sessionId);
    }

    return NextResponse.json({ message: newMessage });
  } catch (error: any) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}
