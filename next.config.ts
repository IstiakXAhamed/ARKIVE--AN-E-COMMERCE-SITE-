const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize page loading
  poweredByHeader: false,
  
  // Compression handled by Apache/Passenger — disable Node zlib to save threads
  compress: false,

  // Disable source maps to save memory/disk usage during build
  productionBrowserSourceMaps: false,

  experimental: {
    // Limit Next.js to 1 CPU core to survive NPROC limits
    cpus: 1,
    // Disable worker threads
    workerThreads: false,
    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Disable type checking during build to save memory/resource
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Increase timeout for static page generation to survive shared hosting limits
  staticPageGenerationTimeout: 300,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    // Disable built-in image optimization to save server processes/memory
    // Cloudinary already handles this via URL parameters.
    unoptimized: true,
    // Optimize images with lower quality for faster loading
    minimumCacheTTL: 31536000, // 1 year
  },
  
  // Custom headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Security headers
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ]
      },
      // Cache static assets aggressively
      {
        source: '/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ]
      },
      // Cache images for 30 days
      {
        source: '/_next/image/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' },
        ]
      },
      // Cache fonts for 1 year
      {
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ]
      },
      // Cache static JS/CSS bundles for 1 year
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ]
      },
    ]
  }
};

export default nextConfig;
