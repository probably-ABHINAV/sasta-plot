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
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['nodemailer'],
    // The following line is often added for CSS optimization with Next.js
    // optimizeCss: true, // Note: This option is deprecated in favor of built-in PostCSS handling
  },
  // Ensure Tailwind CSS is processed correctly
  // Next.js automatically processes Tailwind CSS if `tailwind.config.js` is present
  // and the necessary imports are in your CSS file (e.g., `globals.css`).
  // No explicit configuration is usually needed in next.config.js for basic Tailwind setup.
}

export default nextConfig