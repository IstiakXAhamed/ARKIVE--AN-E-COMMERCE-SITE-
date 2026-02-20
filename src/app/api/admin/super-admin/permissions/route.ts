import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdmin, unauthorized, forbidden } from '@/lib/admin-auth'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
  const { authorized, user: adminUser } = await checkAdmin()
  if (!authorized || !adminUser?.email) return unauthorized()

  try {
    const { targetUserId, permissions, password } = await request.json()

    if (!targetUserId || !Array.isArray(permissions) || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Verify Admin Password
    const currentAdmin = await prisma.user.findUnique({
      where: { email: adminUser.email }
    })

    if (!currentAdmin || !currentAdmin.password) {
      return unauthorized()
    }

    const isPasswordValid = await bcrypt.compare(password, currentAdmin.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 403 })
    }

    // Update target user
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        permissions: JSON.stringify(permissions)
      }
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error: any) {
    console.error('Update permissions error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
