/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 开启静态导出
  images: {
    unoptimized: true, // 静态导出必须禁用 Next.js 的默认图片优化
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 确保 vendor chunks 在客户端正确打包
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
