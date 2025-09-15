/** @type {import('next').NextConfig} */
const nextConfig = {
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
