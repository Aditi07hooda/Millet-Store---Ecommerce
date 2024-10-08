/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ms-profiles.objectstore.e2enetworks.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
