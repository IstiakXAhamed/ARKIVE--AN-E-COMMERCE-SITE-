/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Disable compression (handled by Apache/Passenger)
  compress: false,

  // Disable source maps to save memory
  productionBrowserSourceMaps: false,

  // Resource limits for shared hosting
  experimental: {
    // Limit CPU usage
    cpus: 1,
    // Disable worker threads
    workerThreads: false,
    // Disable optimized imports to save analysis time
    optimizePackageImports: [],
  },
  
  // Disable linting/type-checking during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Increase timeout for static generation
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
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
    // Disable server-side optimization (save CPU/RAM)
    unoptimized: true,
    minimumCacheTTL: 31536000,
  },
  
  // Custom headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ]
      },
      {
        source: '/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ]
      },
    ]
  }
};

export default nextConfig;
