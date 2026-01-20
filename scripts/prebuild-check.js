#!/usr/bin/env node

/**
 * Prebuild 包装脚本
 * 检查环境变量，避免在构建过程中递归调用
 * 
 * 在 CI/CD 环境中（Cloudflare Pages, Vercel 等）跳过检查，
 * 因为这些平台会直接运行构建，不需要额外的检查
 */

const isCI = process.env.CI === 'true' || 
             process.env.CF_PAGES === '1' || 
             process.env.CF_PAGES_BRANCH || 
             process.env.VERCEL === '1' ||
             process.env.SKIP_PREBUILD === 'true';

if (isCI) {
  console.log('⏭️  在 CI/CD 环境中跳过部署前检查（避免递归构建）');
  process.exit(0);
} else {
  // 在本地开发环境中运行检查
  require('./pre-deploy-check.js');
}
