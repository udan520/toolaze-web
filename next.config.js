/** @type {import('next').NextConfig} */
const nextConfig = {
  // 强制启用静态导出（Cloudflare Pages 需要）
  // Cloudflare Pages 使用静态文件托管，必须启用静态导出
  output: 'export',
  images: {
    unoptimized: true, // 静态导出必须禁用 Next.js 的默认图片优化
    // 允许从 Cloudflare R2 加载远程图片
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.dev', // 匹配所有 R2 子域名（如 pub-xxxxx.r2.dev）
      },
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com', // R2 自定义域名（如果使用）
      },
    ],
  },
  // 注意：静态导出模式下无法使用 rewrites，所以无法代理 Hugging Face 请求
  // Transformers.js 需要直接从 Hugging Face 加载模型文件
  // 如果遇到 CORS 问题，用户需要：
  // 1. 检查网络连接和防火墙设置
  // 2. 使用支持 CORS 的浏览器
  // 3. 或者使用 VPN/代理来访问 Hugging Face
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
