/** @type {import('next').NextConfig} */
const nextConfig = {
  // 仅在构建时启用静态导出，开发模式下禁用
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
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
      
      // 排除 heic2any 从 SSR，因为它只在客户端运行
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
