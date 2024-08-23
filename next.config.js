//next.config.js
/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
    reactStrictMode: false, // Désactive le mode strict de React pour la flexibilité
    poweredByHeader: false, // Désactive l'en-tête "X-Powered-By: Next.js"
    async rewrites() {
        return [
            {
                source: '/',
                destination: '/signin',
            },
            {
                source: '/api/:path*',
                destination: 'https://avis-pp.bib.umontreal.ca/api/:path*',
            },
            {
                source: '/:path*',
                destination: '/not-found',
            },
        ];
    },
    env: {
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://avis-pp.bib.umontreal.ca',
    },
};

module.exports = nextConfig;
