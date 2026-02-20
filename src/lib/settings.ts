import { prisma } from '@/lib/prisma';

export async function getSiteSettings(): Promise<any> {
  try {
    // Fetch from new SiteSettings model (singleton)
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'main' }
    });
    
    if (!settings) {
       // Create default if missing (optional, or just return defaults)
       // We'll return defaults here to avoid write on read if strict
       return {
         storeName: 'Arkive',
         storeEmail: 'support@arkive.com',
         // ... defaults
       };
    }

    return settings;
  } catch (error) {
    console.error('Settings fetch error:', error);
    return { storeName: 'Arkive' };
  }
}
