/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*', // requests to /api/... will be proxied
        destination: 'http://213.199.54.41:8000/:path*', // internal HTTP target
      },
    ];
  },
}

export default nextConfig
