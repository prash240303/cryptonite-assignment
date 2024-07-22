/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['coin-images.coingecko.com'],
  },
  reactStrictMode: true,
  swcMinify: true,
  //  rewrites configuration
  async rewrites() {
    return [
      {
        source: '/api/coingecko/:path*',
        destination: 'https://api.coingecko.com/api/v3/:path*',
      },
    ];
  },
};

export default nextConfig;