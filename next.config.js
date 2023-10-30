/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
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
