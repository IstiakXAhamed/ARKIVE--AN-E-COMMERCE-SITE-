import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'main' }
    });
    
    if (!settings) {
       // Return defaults if not set up
       return NextResponse.json({
         storeName: 'Arkive',
         storeTagline: 'Premium Store'
       });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}
