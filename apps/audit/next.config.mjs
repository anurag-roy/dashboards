/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['*.*.*.*'],
  transpilePackages: ['@workspace/ui'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/reports',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
