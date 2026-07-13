/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["pdf-to-img", "pdfjs-dist", "sharp"],
  },
};
module.exports = nextConfig