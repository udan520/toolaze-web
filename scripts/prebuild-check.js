#!/usr/bin/env node

/**
 * Prebuild 脚本
 * 
 * 此脚本在 npm run build 时自动运行（通过 npm 的 prebuild hook）
 * 
 * 功能：
 * 1. 标准 Next.js runtime（Vercel 默认）保留 API 路由
 * 2. 静态导出构建时临时移除 API 路由（Cloudflare Pages 静态托管不支持）
 */

const fs = require('fs');
const path = require('path');

const isStaticExport =
  process.env.NEXT_OUTPUT_EXPORT === 'true' ||
  process.env.DEPLOY_TARGET === 'cloudflare-pages' ||
  Boolean(process.env.CF_PAGES);

if (!isStaticExport) {
  console.log('📦 构建模式：标准 Next.js runtime，保留 API 路由');
  process.exit(0);
}

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

console.log('⏭️  跳过部署前检查（构建模式）');
process.exit(0);
