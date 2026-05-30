/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['@prisma/client', 'pg'],
};

export default nextConfig;
