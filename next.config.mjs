/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
   async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://213.199.54.41:8000/api/:path*', 
      },
    ];
  },
}

export default nextConfig