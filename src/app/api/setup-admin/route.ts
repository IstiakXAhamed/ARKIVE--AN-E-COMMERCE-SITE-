import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const email = 'admin@arkive.com';
    const password = '123123123';
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'SUPERADMIN',
        name: 'Arkive Superadmin',
        provider: 'CREDENTIALS',
        updatedAt: new Date()
      },
      create: {
        id: uuidv4(),
        email,
        password: hashedPassword,
        name: 'Arkive Superadmin',
        role: 'SUPERADMIN',
        provider: 'CREDENTIALS',
        updatedAt: new Date()
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Superadmin created successfully', 
      user: { email: user.email, role: user.role } 
    });
  } catch (error: any) {
    console.error('Setup Admin Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
