import { NextRequest, NextResponse } from "next/server";

// POST /api/upload - Upload image to Cloudinary
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check for Cloudinary config
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      // Demo mode - return placeholder
      console.warn("Cloudinary not configured, using placeholder");
      return NextResponse.json({
        url: `https://via.placeholder.com/400x400/10b981/ffffff?text=${encodeURIComponent(file.name)}`,
        publicId: `demo-${Date.now()}`,
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file: dataURI,
        upload_preset: uploadPreset,
        folder: "arkive",
      }),
    });

    if (!response.ok) {
      throw new Error("Cloudinary upload failed");
    }

    const data = await response.json();

    return NextResponse.json({
      url: data.secure_url,
      publicId: data.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
