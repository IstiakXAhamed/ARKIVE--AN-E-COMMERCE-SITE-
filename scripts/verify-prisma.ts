
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Checking Prisma Client properties...')
  
  const userProp = (prisma as any).user
  const usersProp = (prisma as any).users
  
  console.log('prisma.user:', userProp ? 'Exists' : 'Undefined')
  console.log('prisma.users:', usersProp ? 'Exists' : 'Undefined')
  
  const siteSettingsProp = (prisma as any).siteSettings
  const site_settingsProp = (prisma as any).site_settings
  
  console.log('prisma.siteSettings:', siteSettingsProp ? 'Exists' : 'Undefined')
  console.log('prisma.site_settings:', site_settingsProp ? 'Exists' : 'Undefined')
  
  if (userProp) console.log('Recommendation: Use prisma.user')
  else if (usersProp) console.log('Recommendation: Use prisma.users')
  
  if (siteSettingsProp) console.log('Recommendation: Use prisma.siteSettings')
  else if (site_settingsProp) console.log('Recommendation: Use prisma.site_settings')
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
