/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:8001/api/:path*'
          : '/api/:path*',
      },
    ]
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'platform-lookaside.fbsbx.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['socket.io-client'],
  },
}

module.exports = nextConfig
