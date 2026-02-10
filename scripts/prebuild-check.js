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

// prebuild 脚本只在构建时运行，所以总是应该移除 API 路由
// 静态导出不支持动态 API 路由，生产环境使用 Cloudflare Pages Functions
console.log('📦 构建模式：临时移除 API 路由（静态导出不支持动态 API 路由）');

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');
const backupDir = path.join(__dirname, '..', '.api-backup');

if (fs.existsSync(apiDir)) {
  console.log('📦 临时移除 src/app/api...');
  
  // 如果备份目录已存在，先删除
  if (fs.existsSync(backupDir)) {
    fs.rmSync(backupDir, { recursive: true, force: true });
  }
  
  // 将 API 目录移动到备份目录
  fs.renameSync(apiDir, backupDir);
  console.log('✅ API 路由已临时移除');
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
