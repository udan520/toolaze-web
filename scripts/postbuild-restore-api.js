#!/usr/bin/env node

/**
 * Postbuild 脚本：恢复静态导出前临时移除的动态路由目录
 * 构建时 prebuild 会移除 api/admin，构建完成后恢复，以便本地开发继续使用
 */
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const temporaryBuildDirs = [
  {
    label: 'API 路由',
    sourceDir: path.join(projectRoot, 'src', 'app', 'api'),
    backupDir: path.join(projectRoot, '.api-backup'),
  },
  {
    label: '本地后台页',
    sourceDir: path.join(projectRoot, 'src', 'app', 'admin'),
    backupDir: path.join(projectRoot, '.admin-backup'),
  },
];

for (const item of temporaryBuildDirs) {
  restoreTemporaryBuildDir(item);
}

function restoreTemporaryBuildDir({ label, sourceDir, backupDir }) {
  if (!fs.existsSync(backupDir) || fs.existsSync(sourceDir)) {
    return;
  }

  try {
    fs.renameSync(backupDir, sourceDir);
    console.log(`✅ ${label}已恢复（供 next dev 使用）`);
  } catch (e) {
    try {
      fs.cpSync(backupDir, sourceDir, { recursive: true, force: true });
      fs.rmSync(backupDir, { recursive: true, force: true });
      console.log(`✅ ${label}已恢复（使用复制方式）`);
    } catch (e2) {
      console.warn(`⚠️  无法恢复 ${label}:`, e2.message);
    }
  }
}
