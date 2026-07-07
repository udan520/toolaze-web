const isProdBuild = process.env.NODE_ENV === 'production'
const isStaticExport =
  process.env.NEXT_OUTPUT_EXPORT === 'true' ||
  process.env.DEPLOY_TARGET === 'cloudflare-pages' ||
  Boolean(process.env.CF_PAGES)

/** 局域网用手机/另一台电脑访问 `next dev` 时，允许从该 Origin 拉取 `/_next/*`，避免样式/静态资源加载失败（可用 NEXT_DEV_ALLOWED_ORIGINS 覆盖，逗号分隔 hostname） */
const devAllowedOrigins = (process.env.NEXT_DEV_ALLOWED_ORIGINS || '127.0.0.1,localhost,192.168.101.9,192.168.101.3')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(!isProdBuild ? { allowedDevOrigins: devAllowedOrigins } : {}),
  // 默认使用标准 Next.js runtime，适配 Vercel 的 ISR / API Routes。
  // 如需继续构建 Cloudflare Pages 静态导出，显式设置 NEXT_OUTPUT_EXPORT=true。
  ...(isProdBuild && isStaticExport ? { output: 'export' } : {}),
  // 提高请求体限制，支持去水印上传大图（默认 1MB 会导致上传失败）
  experimental: {
    serverActions: {
      bodySizeLimit: '32mb',
    },
  },
  images: {
    unoptimized: isStaticExport,
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
