/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['*.*.*.*'],
  transpilePackages: ['@workspace/ui'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/overview',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
