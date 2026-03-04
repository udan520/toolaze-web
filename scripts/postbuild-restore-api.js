#!/usr/bin/env node

/**
 * Postbuild 脚本：恢复 src/app/api 供 next dev 使用
 * 构建时 prebuild 会移除 api，构建完成后恢复，以便本地开发时 /api/* 有占位响应
 */
const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');
const backupDir = path.join(__dirname, '..', '.api-backup');

if (fs.existsSync(backupDir) && !fs.existsSync(apiDir)) {
  try {
    fs.renameSync(backupDir, apiDir);
    console.log('✅ API 路由已恢复（供 next dev 使用）');
  } catch (e) {
    try {
      fs.cpSync(backupDir, apiDir, { recursive: true, force: true });
      fs.rmSync(backupDir, { recursive: true, force: true });
      console.log('✅ API 路由已恢复（使用复制方式）');
    } catch (e2) {
      console.warn('⚠️  无法恢复 API 路由:', e2.message);
    }
  }
}
