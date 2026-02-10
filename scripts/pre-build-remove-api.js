#!/usr/bin/env node

/**
 * 构建前脚本：临时移除 src/app/api 目录（静态导出不支持 API 路由）
 * 构建完成后，这些路由会在开发模式恢复
 */

const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');
const backupDir = path.join(__dirname, '..', '.api-backup');

// 只在 CI/CD 环境或明确要求时移除
const shouldRemove = process.env.CI === 'true' || 
                     process.env.CF_PAGES === '1' || 
                     process.env.CF_PAGES_BRANCH ||
                     process.env.VERCEL === '1' ||
                     process.env.REMOVE_API_FOR_BUILD === 'true';

if (shouldRemove && fs.existsSync(apiDir)) {
  console.log('📦 构建模式：临时移除 src/app/api（静态导出不支持 API 路由）');
  
  // 备份到临时目录（可选，如果需要恢复）
  if (fs.existsSync(backupDir)) {
    fs.rmSync(backupDir, { recursive: true, force: true });
  }
  fs.renameSync(apiDir, backupDir);
  console.log('✅ API 路由已临时移除');
} else if (!shouldRemove) {
  console.log('💻 开发模式：保留 src/app/api（本地开发需要）');
}
