import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function notifyNewChatMessage(customerName: string, sessionId: string) {
  try {
    // Find admins to notify
      const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' }, // Use 'ADMIN' enum string if schema uses enum, or string
      select: { id: true }
    });

    if (admins.length === 0) return;

    // Create notifications for each admin
    const notifications = admins.map((admin: { id: string }) => ({
      id: uuidv4(),
      userId: admin.id,
      type: 'CHAT',
      title: 'New Chat Message',
      message: `${customerName} sent a message.`,
      isRead: false
    }));

    await prisma.notifications.createMany({
      data: notifications
    });
  } catch (error) {
    console.error('Failed to notify admins of new chat:', error);
  }
}
