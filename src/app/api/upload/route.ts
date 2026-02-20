import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { auth } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

// Configure upload limits
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
];

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required for uploads' },
        { status: 401 }
      );
    }

    // 2. Verify Admin/SuperAdmin Role (UPPERCASE)
    if (
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'SUPERADMIN'
    ) {
      return NextResponse.json(
        { error: 'Only admins can upload files' },
        { status: 403 }
      );
    }

    // 3. Parse Form Data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large (max 10MB)' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }

    // 4. Sanitize folder path
    const safeFolder = folder.replace(/[^a-zA-Z0-9-_/]/g, '');
    const finalFolder = `arkive/${safeFolder}`;

    // 5. Try Cloudinary first
    const useCloudinary =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    if (useCloudinary) {
      try {
        // Convert file to buffer then base64
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

        console.log('[Upload] Using Cloudinary...');
        const url = await uploadImage(base64, finalFolder);

        return NextResponse.json({
          success: true,
          url,
          fileName: file.name,
          size: file.size,
          type: file.type,
        });
      } catch (cloudinaryError) {
        console.error('[Upload] Cloudinary failed:', cloudinaryError);
        // Fall through to local storage
      }
    }

    // 6. Local Fallback (Dev/No-Cloudinary)
    console.log('[Upload] Using local storage...');
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${originalName}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', finalFolder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${finalFolder}/${fileName}`,
      fileName,
      type: file.type,
      warning: 'Using local storage (Ephemeral). Configure Cloudinary for production.',
    });
  } catch (error: any) {
    console.error('[Upload] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

// GET - List files in a folder (Secure & Scoped)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins can list uploads
    if (
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'SUPERADMIN'
    ) {
      return NextResponse.json(
        { error: 'Only admins can list uploads' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || '';

    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9-_/]/g, '');
    const targetFolder = `arkive/${sanitizedFolder}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', targetFolder);
    if (!existsSync(uploadDir)) {
      return NextResponse.json({ files: [] });
    }

    const fs = require('fs');
    const files = fs.readdirSync(uploadDir).map((name: string) => {
      const filePath = path.join(uploadDir, name);
      const stats = fs.statSync(filePath);
      return {
        name,
        url: `/uploads/${targetFolder}/${name}`,
        size: stats.size,
        createdAt: stats.birthtime,
      };
    });

    return NextResponse.json({ files });
  } catch (error: any) {
    console.error('[Upload] List error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list files' },
      { status: 500 }
    );
  }
}
