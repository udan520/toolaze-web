#!/usr/bin/env node

/**
 * 检查所有 API 路由是否包含静态导出配置
 * 在 Next.js 静态导出模式下，所有 API 路由必须包含 export const dynamic = 'force-static'
 */

const fs = require('fs');
const path = require('path');

let hasError = false;
const errors = [];
const apiRoutes = [];

/**
 * 递归查找所有 API 路由文件
 */
function findApiRoutes(dir, baseDir = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      findApiRoutes(fullPath, baseDir);
    } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
      apiRoutes.push({
        path: fullPath,
        relativePath: relativePath,
      });
    }
  }
}

/**
 * 检查文件是否包含必要的静态导出配置
 */
function checkApiRoute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 检查是否包含 export const dynamic
  const hasDynamicExport = /export\s+const\s+dynamic\s*=\s*['"]force-static['"]/.test(content);
  
  // 检查是否包含 export const revalidate（替代方案）
  const hasRevalidate = /export\s+const\s+revalidate\s*=/.test(content);
  
  // 检查是否使用了 request.url（在静态导出模式下会导致构建失败）
  // 排除注释中的使用，只检查实际代码
  const codeWithoutComments = content
    .replace(/\/\/.*$/gm, '') // 移除单行注释
    .replace(/\/\*[\s\S]*?\*\//g, ''); // 移除多行注释
  
  const usesRequestUrl = /new\s+URL\s*\(\s*request\.url\s*\)/.test(codeWithoutComments) || 
                         (/\brequest\.url\b/.test(codeWithoutComments) && !/request\.nextUrl/.test(codeWithoutComments));
  
  // 检查是否使用了 request.nextUrl（推荐方式）
  const usesNextUrl = /\brequest\.nextUrl\b/.test(codeWithoutComments);
  
  return {
    hasDynamicExport,
    hasRevalidate,
    hasConfig: hasDynamicExport || hasRevalidate,
    usesRequestUrl,
    usesNextUrl,
  };
}

// 主函数
function main() {
  console.log('🔍 检查 API 路由静态导出配置...\n');

  const apiDir = path.join(process.cwd(), 'src', 'app', 'api');
  
  if (!fs.existsSync(apiDir)) {
    console.log('   ℹ️  未找到 API 目录，跳过检查');
    return;
  }

  // 查找所有 API 路由
  findApiRoutes(apiDir);

  if (apiRoutes.length === 0) {
    console.log('   ℹ️  未找到任何 API 路由文件');
    return;
  }

  console.log(`   找到 ${apiRoutes.length} 个 API 路由文件\n`);

  // 检查每个路由
  for (const route of apiRoutes) {
    const check = checkApiRoute(route.path);
    let routeHasError = false;
    const routeErrors = [];
    
    // 检查静态导出配置
    if (!check.hasConfig) {
      routeErrors.push('缺少 export const dynamic = \'force-static\' 配置');
      routeHasError = true;
    }
    
    // 检查是否使用了 request.url（会导致构建失败）
    if (check.usesRequestUrl) {
      routeErrors.push('使用了 request.url，应改用 request.nextUrl.searchParams');
      routeHasError = true;
    }
    
    if (routeHasError) {
      errors.push({
        file: route.relativePath,
        path: route.path,
        errors: routeErrors,
      });
      hasError = true;
      console.log(`   ❌ ${route.relativePath}`);
      routeErrors.forEach(err => console.log(`      - ${err}`));
    } else {
      const configType = check.hasDynamicExport ? 'dynamic' : 'revalidate';
      const urlNote = check.usesNextUrl ? ' (使用 request.nextUrl)' : '';
      console.log(`   ✅ ${route.relativePath} (已配置 ${configType}${urlNote})`);
    }
  }

  // 输出结果
  console.log('\n' + '='.repeat(60));
  
  if (hasError) {
    console.log('\n❌ 检查失败！以下 API 路由缺少静态导出配置：\n');
    
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.file}`);
      console.log(`   文件路径: ${error.path}`);
      console.log(`   问题：`);
      error.errors.forEach(err => console.log(`     - ${err}`));
      console.log(`   修复方法：`);
      if (error.errors.some(e => e.includes('缺少 export const dynamic'))) {
        console.log(`     1. 在文件开头添加：export const dynamic = 'force-static'`);
      }
      if (error.errors.some(e => e.includes('request.url'))) {
        console.log(`     2. 将 new URL(request.url) 改为 request.nextUrl.searchParams`);
        console.log(`        例如：const url = request.nextUrl.searchParams.get('url')`);
      }
      console.log('');
    });

    console.log('\n💡 提示：');
    console.log('   在 Next.js 静态导出模式（output: export）下，');
    console.log('   所有 API 路由必须包含 export const dynamic = "force-static"');
    console.log('   否则构建会失败。\n');
    
    process.exit(1);
  } else {
    console.log('\n✅ 所有 API 路由都已正确配置静态导出！\n');
    process.exit(0);
  }
}

// 运行检查
main();
