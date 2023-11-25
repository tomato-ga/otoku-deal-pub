/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: ['m.media-amazon.com'],
//   },
// }

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
      },
    ],
  },
}

module.exports = nextConfig
