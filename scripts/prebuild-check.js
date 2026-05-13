#!/usr/bin/env node

/**
 * Prebuild 脚本
 * 
 * 此脚本在 npm run build 时自动运行（通过 npm 的 prebuild hook）
 * 
 * 功能：
 * 1. 在 CI/CD 环境中跳过部署前检查（避免递归构建）
 * 2. 临时移除 API 路由（静态导出不支持动态 API 路由）
 *    生产环境使用 Cloudflare Pages Functions，不需要 Next.js API 路由
 */

const fs = require('fs');
const path = require('path');

// 检测 CI/CD 环境（包括 Cloudflare Pages, Vercel 等）
const isCI = process.env.CI === 'true' || 
             process.env.CF_PAGES ||  // Cloudflare Pages 设置此变量
             process.env.CF_PAGES_BRANCH || 
             process.env.VERCEL === '1' ||
             process.env.VERCEL ||  // Vercel 也可能设置此变量
             process.env.SKIP_PREBUILD === 'true';

// Next `output: 'export'` 仅在 NODE_ENV=production 时启用。若在 Pages 环境变量里误设 NODE_ENV=development，不会生成 out/ →「No deployment available」
if ((process.env.CF_PAGES || process.env.CF_PAGES_BRANCH) && process.env.NODE_ENV === 'development') {
  console.error('')
  console.error('❌ Cloudflare Pages: NODE_ENV is "development". Static export is disabled, so no `out/` folder is produced.')
  console.error('   Fix: Pages → Settings → Environment variables — remove NODE_ENV or set it to "production".')
  console.error('   Do not set NODE_ENV=development for Next.js static export builds.')
  console.error('')
  process.exit(1)
}

// prebuild 脚本只在构建时运行，所以总是应该移除 API 路由
// 静态导出不支持动态 API 路由，生产环境使用 Cloudflare Pages Functions
console.log('📦 构建模式：临时移除 API 路由（静态导出不支持动态 API 路由）');

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');
const backupDir = path.join(__dirname, '..', '.api-backup');

if (fs.existsSync(apiDir)) {
  console.log('📦 临时移除 src/app/api...');
  
  // 如果备份目录已存在，先删除
  if (fs.existsSync(backupDir)) {
    try {
      fs.rmSync(backupDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
    } catch (e) {
      console.warn('⚠️  无法删除旧的备份目录，继续尝试...');
    }
  }
  
  // 将 API 目录移动到备份目录（使用重试机制）
  try {
    // 尝试直接重命名
    fs.renameSync(apiDir, backupDir);
    console.log('✅ API 路由已临时移除');
  } catch (e) {
    // 如果重命名失败（可能是文件被锁定），尝试复制后删除
    console.warn('⚠️  重命名失败，尝试复制后删除...');
    try {
      fs.cpSync(apiDir, backupDir, { recursive: true, force: true });
      fs.rmSync(apiDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
      console.log('✅ API 路由已临时移除（使用复制方式）');
    } catch (e2) {
      console.error('❌ 无法移除 API 路由目录，可能被其他进程占用');
      console.error('   请确保没有开发服务器或其他进程正在使用该目录');
      console.error('   错误信息:', e2.message);
      // 不退出，让构建继续，但会警告
    }
  }
} else {
  console.log('ℹ️  API 路由目录不存在，跳过移除');
}

if (isCI) {
  console.log('⏭️  在 CI/CD 环境中跳过部署前检查（避免递归构建）');
  process.exit(0);
} else {
  // 在本地构建时，移除 API 后直接退出（避免运行检查导致递归）
  console.log('⏭️  跳过部署前检查（构建模式）');
  process.exit(0);
}
