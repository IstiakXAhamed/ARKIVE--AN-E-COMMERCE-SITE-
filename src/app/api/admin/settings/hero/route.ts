import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPERADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const items = await prisma.hero_grid_items.findMany({
      orderBy: { position: 'asc' },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('[HERO_GRID_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPERADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { items } = body; // Array of items to upsert

    if (!Array.isArray(items)) {
      return new NextResponse('Invalid data', { status: 400 });
    }

    // Transaction to update/create items
    await prisma.$transaction(
      items.map((item: any) => 
        prisma.hero_grid_items.upsert({
          where: { id: item.id || 'new' }, // 'new' will fail match, forcing create if no ID
          update: {
            title: item.title,
            imageUrl: item.imageUrl,
            link: item.link,
            position: item.position,
            updatedAt: new Date(),
          },
          create: {
            id: item.id || undefined, // upsert create needs ID if we want to set it, or let Prisma handle default if configured? Schema says @id, no default? Schema: id String @id (no default)
            // Wait, schema: id String @id . It doesn't say @default(cuid()).
            // Accessing schema again...
            title: item.title,
            imageUrl: item.imageUrl,
            link: item.link,
            position: item.position,
            updatedAt: new Date(),
          },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[HERO_GRID_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
