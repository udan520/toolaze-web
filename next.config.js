/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // 静态导出，用于 Cloudflare Pages
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
}

module.exports = nextConfig
