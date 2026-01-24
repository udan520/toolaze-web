# 404 错误检查脚本

## 功能

自动检查网站所有页面的HTTP状态码，找出404错误和其他问题。

## 使用方法

### 基本用法

```bash
# 检查生产环境 (默认 https://toolaze.com)
npm run check-404

# 或直接运行
node scripts/check-404-errors.js
```

### 检查本地开发环境

```bash
# 先启动开发服务器
npm run dev

# 在另一个终端运行检查脚本（检查本地服务器）
BASE_URL=http://localhost:3006 node scripts/check-404-errors.js
```

### 检查其他环境

```bash
BASE_URL=https://staging.toolaze.com node scripts/check-404-errors.js
```

## 脚本功能

1. **自动获取所有URL**：
   - 从 `seo-loader.ts` 获取所有工具页面
   - 支持所有语言版本（en, de, ja, es, zh-TW, pt, fr, ko, it）
   - 包括首页、静态页面、L2页面、L3页面

2. **并发检查**：
   - 默认最大并发数：10
   - 请求超时：10秒
   - 使用HEAD请求（更快）

3. **详细报告**：
   - 显示检查进度
   - 统计各状态码数量
   - 列出所有404和错误页面
   - 按状态码分组显示

## 输出示例

```
🔍 开始检查网站404错误...

基础URL: https://toolaze.com
最大并发数: 10
请求超时: 10000ms

================================================================================

📋 正在获取所有页面URL...
✅ 找到 523 个页面

🔍 开始检查页面状态...

检查进度: 523/523 (错误: 3)

================================================================================

📊 检查结果统计:

总页面数: 523
成功 (200-399): 520
错误 (400+): 3
异常/超时: 0

状态码分布:
  200: 520
  404: 3

================================================================================

❌ 发现 3 个错误:

404 (3 个):
  - https://toolaze.com/de/font-generator/invalid-page
  - https://toolaze.com/ja/image-compressor/old-slug
  - https://toolaze.com/es/image-converter/missing-page
```

## 配置选项

可以在脚本中修改以下配置：

```javascript
const maxConcurrent = 10  // 最大并发请求数
const timeout = 10000     // 请求超时时间（毫秒）
```

## 注意事项

1. **网络连接**：需要能够访问目标网站
2. **速率限制**：某些服务器可能有速率限制，可以降低 `maxConcurrent`
3. **本地服务器**：检查本地服务器时，确保服务器正在运行
4. **HTTPS证书**：如果使用自签名证书，可能需要修改脚本忽略证书错误

## 退出码

- `0`: 所有页面正常，没有404错误
- `1`: 发现404错误或其他问题

## 集成到CI/CD

可以在CI/CD流程中使用：

```yaml
# GitHub Actions 示例
- name: Check for 404 errors
  run: npm run check-404
  continue-on-error: true
```
