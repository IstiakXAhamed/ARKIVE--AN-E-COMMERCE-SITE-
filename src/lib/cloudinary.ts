import Cloudinary from 'cloudinary';

const cloudinary = Cloudinary.v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(
  file: string,
  folder: string = 'arkive'
): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image');
  }
}

export function getPublicIdFromUrl(url: string): string | null {
  const regex = /\/v\d+\/(.+)\./;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export default cloudinary;
