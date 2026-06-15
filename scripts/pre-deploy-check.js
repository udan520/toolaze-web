#!/usr/bin/env node

/**
 * 部署前检查脚本
 * 用于在提交和部署前验证配置是否正确
 */

const fs = require('fs');
const path = require('path');

let hasError = false;
const errors = [];
const warnings = [];

console.log('🔍 开始部署前检查...\n');

// 1. 检查 next.config.js 中的静态导出配置
console.log('1. 检查 Next.js 配置...');
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  
  // 检查是否有静态导出配置；允许生产构建条件启用，避免本地 dev 样式/资源异常
  const hasStaticExportConfig =
    nextConfigContent.includes("output: 'export'") ||
    /output:\s*[^,\n]*\?\s*['"]export['"]\s*:\s*undefined/.test(nextConfigContent);

  if (!hasStaticExportConfig) {
    errors.push('❌ next.config.js 中缺少 output: "export" 配置（静态导出必需）');
    hasError = true;
  } else {
    console.log('   ✅ 静态导出配置正确');
  }
  
  // 检查 images.unoptimized
  if (!nextConfigContent.includes('unoptimized: true')) {
    warnings.push('⚠️  next.config.js 中建议设置 images.unoptimized: true（静态导出必需）');
  } else {
    console.log('   ✅ 图片优化配置正确');
  }
} else {
  errors.push('❌ 找不到 next.config.js 文件');
  hasError = true;
}

// 2. 检查是否存在 middleware.ts（静态导出不支持）
console.log('\n2. 检查 Middleware 配置...');
const middlewarePath = path.join(process.cwd(), 'middleware.ts');
if (fs.existsSync(middlewarePath)) {
  errors.push('❌ 检测到 middleware.ts 文件，静态导出不支持 middleware，请重命名或删除');
  hasError = true;
} else {
  console.log('   ✅ 未检测到 middleware.ts（静态导出兼容）');
}

// 3. 检查 API 路由静态导出配置
console.log('\n3. 检查 API 路由配置...');
const { execSync } = require('child_process');
try {
  execSync('node scripts/check-api-routes.js', {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
  console.log('   ✅ API 路由配置检查通过');
} catch (error) {
  errors.push('❌ API 路由静态导出配置检查失败，请修复后再试');
  hasError = true;
}

// 4. 检查 package.json 中的构建脚本
console.log('\n4. 检查 package.json 配置...');
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.scripts || !packageJson.scripts.build) {
    errors.push('❌ package.json 中缺少 build 脚本');
    hasError = true;
  } else {
    console.log('   ✅ 构建脚本存在:', packageJson.scripts.build);
  }
  
  // 检查 Node.js 版本要求
  if (packageJson.engines && packageJson.engines.node) {
    console.log('   ✅ Node.js 版本要求:', packageJson.engines.node);
  } else {
    warnings.push('⚠️  建议在 package.json 中指定 engines.node 版本要求');
  }
} else {
  errors.push('❌ 找不到 package.json 文件');
  hasError = true;
}

// 5. 检查是否有 TypeScript 错误（可选）
// 注意：在 CI/CD 环境中跳过构建测试，避免递归构建
console.log('\n5. 运行构建测试...');
const isCI = process.env.CI === 'true' || process.env.CF_PAGES === '1' || process.env.VERCEL === '1';
if (isCI) {
  console.log('   ⏭️  在 CI/CD 环境中跳过构建测试（避免递归）');
} else {
  const { execSync } = require('child_process');
  try {
    console.log('   正在测试构建...');
    // 使用 SKIP_PREBUILD 环境变量来避免递归
    execSync('SKIP_PREBUILD=true npm run build', { 
      stdio: 'inherit',
      cwd: process.cwd(),
      timeout: 300000 // 5 分钟超时
    });
    console.log('   ✅ 构建测试通过');
  } catch (error) {
    errors.push('❌ 构建测试失败，请检查构建错误');
    hasError = true;
    console.log('   ❌ 构建失败');
  }
}

// 6. 检查输出目录
console.log('\n6. 检查构建输出...');
const outDir = path.join(process.cwd(), 'out');
if (fs.existsSync(outDir)) {
  const files = fs.readdirSync(outDir);
  if (files.length === 0) {
    warnings.push('⚠️  out 目录为空，构建可能未正确完成');
  } else {
    console.log(`   ✅ 构建输出目录存在，包含 ${files.length} 项`);
  }
} else {
  warnings.push('⚠️  out 目录不存在，构建可能失败');
}

// 总结
console.log('\n' + '='.repeat(50));
if (hasError) {
  console.log('\n❌ 检查失败！发现以下错误：\n');
  errors.forEach(err => console.log(err));
  if (warnings.length > 0) {
    console.log('\n⚠️  警告：\n');
    warnings.forEach(warn => console.log(warn));
  }
  process.exit(1);
} else {
  console.log('\n✅ 所有检查通过！\n');
  if (warnings.length > 0) {
    console.log('⚠️  警告：\n');
    warnings.forEach(warn => console.log(warn));
  }
  console.log('🚀 可以安全部署到 Cloudflare Pages\n');
  process.exit(0);
}
