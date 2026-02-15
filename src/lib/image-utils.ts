/**
 * Image Optimization Utilities for ARKIVE
 * Handles optimization for Cloudinary and Unsplash URLs
 */

export function getOptimizedImageUrl(
  url: string,
  width: number = 600,
  quality: string = "auto"
): string {
  if (!url) return "/placeholder-product.jpg";

  // Handle Unsplash images
  if (url.includes("images.unsplash.com")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}w=${width}&q=${quality}&auto=format&fit=crop`;
  }

  // Handle Cloudinary images
  if (url.includes("res.cloudinary.com")) {
    // Cloudinary URL format: https://res.cloudinary.com/<cloud_name>/image/upload/<transformations>/<version>/<public_id>
    // We want to insert transformations after "upload/"
    if (url.includes("/upload/")) {
      const parts = url.split("/upload/");
      const transformations = `w_${width},q_${quality},f_auto`;
      
      // Check if there are existing transformations
      if (parts[1].startsWith("v")) {
        // No existing transformations (starts with version)
        return `${parts[0]}/upload/${transformations}/${parts[1]}`;
      } else {
        // Existing transformations might be present, but we'll prepend ours or replace if simple
        // For safety, let's just prepend to the existing path if it doesn't look like a version
        return `${parts[0]}/upload/${transformations}/${parts[1]}`;
      }
    }
  }

  // Return original URL for other sources
  return url;
}
