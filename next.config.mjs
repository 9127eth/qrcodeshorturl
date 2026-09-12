/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Redirect non-www to www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'qrsui.io',
          },
        ],
        destination: 'https://www.qrsui.io/:path*',
        permanent: true,
      },
      // Redirect old domain to new domain
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'qrcodeshorturl.com',
          },
        ],
        destination: 'https://www.qrsui.io/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
