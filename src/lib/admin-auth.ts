import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function checkAdmin() {
  const session = await auth()
  
  if (!session?.user) {
    return { authorized: false, user: null }
  }

  const userRole = session.user.role?.toUpperCase()
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN'

  if (!isAdmin) {
    return { authorized: false, user: null }
  }

  return { authorized: true, user: session.user }
}

export function unauthorized() {
  return NextResponse.json(
    { error: 'Unauthorized. Admin access required.' },
    { status: 401 }
  )
}

export function forbidden() {
  return NextResponse.json(
    { error: 'Forbidden. Insufficient permissions.' },
    { status: 403 }
  )
}
