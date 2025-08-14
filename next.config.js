/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'platform-lookaside.fbsbx.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['socket.io-client'],
  },
  trailingSlash: false,
  // Environment variables for production
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  },
}

module.exports = nextConfig
