/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [],
  },
  // Allow the generate-image route up to 110s (Nano Banana is async + polling)
  serverExternalPackages: [],
};

export default nextConfig;
