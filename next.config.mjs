/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production-friendly configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },
  // Add output configuration for better compatibility
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blob.v0.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  // Optimize for production deployment
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  // Enable static optimization
  output: 'standalone',
  // Compress images
  compress: true,
  // Enable SWC minification
  swcMinify: true,
}

export default nextConfig
