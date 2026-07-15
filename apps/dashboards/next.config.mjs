/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['*.*.*.*'],
  transpilePackages: ['@workspace/ui'],
};

export default nextConfig;
