import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*.*.*.*'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/support',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
