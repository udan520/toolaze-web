/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 开启静态导出
  images: {
    unoptimized: true, // 静态导出必须禁用 Next.js 的默认图片优化
  },
};

module.exports = nextConfig;
