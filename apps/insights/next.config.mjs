/** @type {import('next').NextConfig} */
const nextConfig = {
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
