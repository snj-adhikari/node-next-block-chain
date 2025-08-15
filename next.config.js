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
  // Exclude test files and cypress from build
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  webpack: (config, { isServer }) => {
    // Exclude cypress and test files from build
    config.module.rules.push({
      test: /\.(test|spec|cy)\.(js|jsx|ts|tsx)$/,
      use: 'ignore-loader',
    })
    
    return config
  },
}

module.exports = nextConfig
