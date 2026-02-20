import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessions = await (prisma as any).chatSession.findMany({
      where: { status: 'active' },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    return NextResponse.json({ sessions });
  } catch (error: any) {
    console.error('Chat sessions error:', error);
    return NextResponse.json({ sessions: [], error: 'Database Error' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, customerName, customerEmail } = body;

    const session = await auth();
    let userId = session?.user?.id || null;

    let chatSession = await (prisma as any).chatSession.findUnique({
      where: { sessionId }
    });

    if (!chatSession) {
      chatSession = await (prisma as any).chatSession.create({
        data: {
          sessionId,
          userId,
          customerName: customerName || 'Guest',
          customerEmail,
          status: 'active'
        }
      });
    }

    return NextResponse.json({ session: chatSession });
  } catch (error: any) {
    console.error('Create session error:', error);
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}
