/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  experimental: {
    serverActions: true
  },
  async rewrites() {
    return [
      {
        source: '/site-web/important',
        destination: '/api/avis'
      }
    ]
  }
}

module.exports = nextConfig
