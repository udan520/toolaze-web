# 部署前检查清单

在每次部署到 Cloudflare Pages 之前，请完成以下检查项，以避免部署错误。

## 🔍 自动化检查

运行以下命令进行自动检查：

```bash
npm run pre-deploy
```

这会自动检查所有关键配置项。

## 📋 手动检查清单

### ✅ 1. Next.js 配置检查

- [ ] `next.config.js` 中包含 `output: 'export'`
- [ ] `next.config.js` 中包含 `images.unoptimized: true`
- [ ] 没有使用 Next.js 静态导出不支持的功能：
  - [ ] ❌ 没有 `middleware.ts` 文件
  - [ ] ❌ 没有使用 API Routes (`/app/api/`)
  - [ ] ❌ 没有使用 Server Components 的动态功能
  - [ ] ❌ 没有使用 `getServerSideProps` 或 `getInitialProps`

### ✅ 2. 构建测试

在本地运行构建测试：

```bash
npm run build
```

检查项：
- [ ] 构建成功完成
- [ ] 生成了 `out/` 目录
- [ ] `out/` 目录不为空
- [ ] 没有 TypeScript 类型错误
- [ ] 没有 ESLint 错误（至少没有关键错误）

### ✅ 3. 依赖检查

- [ ] `package.json` 中的 `engines.node` 指定了版本要求（>=20.0.0）
- [ ] 所有依赖都是最新且兼容的版本
- [ ] `package-lock.json` 已更新

### ✅ 4. 代码检查

- [ ] TypeScript 编译无错误：`npx tsc --noEmit`
- [ ] ESLint 检查通过：`npm run lint`
- [ ] 没有控制台错误或警告

### ✅ 5. 功能测试

- [ ] 本地开发服务器运行正常：`npm run dev`
- [ ] 主要功能页面可以正常访问
- [ ] 多语言路由正常工作
- [ ] 图片压缩/转换功能正常

### ✅ 6. 静态资源检查

- [ ] 所有静态资源（图片、字体等）都在 `public/` 目录下
- [ ] 没有使用 Next.js Image 组件的优化功能
- [ ] 所有外部链接都使用 `https://`

### ✅ 7. 环境变量检查

- [ ] 确认 Cloudflare Pages 环境变量配置正确
- [ ] 没有在代码中硬编码敏感信息
- [ ] 所有必需的环境变量都已设置

### ✅ 8. Git 检查

- [ ] 代码已提交到本地仓库
- [ ] 提交信息清晰明确
- [ ] 没有未提交的敏感文件

## 🚀 部署流程

### 标准部署流程

1. **运行检查**
   ```bash
   npm run pre-deploy
   ```

2. **提交代码**
   ```bash
   git add .
   git commit -m "feat: 描述你的更改"
   ```

3. **推送到 GitHub**
   ```bash
   git push origin main
   ```

4. **监控部署**
   - 访问 Cloudflare Dashboard
   - 查看部署状态
   - 如果失败，查看构建日志

### 如果检查失败

如果 `npm run pre-deploy` 失败：

1. **查看错误信息**：脚本会显示具体的错误项
2. **修复问题**：根据错误提示修复配置
3. **重新检查**：运行 `npm run pre-deploy` 确认问题已解决
4. **再次部署**：确认检查通过后再推送代码

## 🐛 常见部署错误及解决方案

### 错误 1: 构建失败 - Middleware 不支持

**错误信息：**
```
Error: Middleware is not supported for static exports
```

**解决方案：**
- 确认 `middleware.ts` 不存在或被重命名为 `middleware.ts.bak`
- 如果项目需要路由功能，使用客户端路由或其他替代方案

### 错误 2: 静态导出未启用

**错误信息：**
```
Error: next export is deprecated
```

**解决方案：**
- 确认 `next.config.js` 中包含 `output: 'export'`
- 运行 `npm run pre-deploy` 检查配置

### 错误 3: 图片优化错误

**错误信息：**
```
Error: Image Optimization requires Next.js server
```

**解决方案：**
- 确认 `next.config.js` 中包含 `images.unoptimized: true`
- 不要使用 `<Image>` 组件，使用普通的 `<img>` 标签

### 错误 4: Node.js 版本不匹配

**错误信息：**
```
Error: Unsupported Node.js version
```

**解决方案：**
- 确认 `package.json` 中指定了 `engines.node`
- 在 Cloudflare Pages 环境变量中设置 `NODE_VERSION=20`

## 📝 最佳实践

1. **每次部署前运行检查**：使用 `npm run pre-deploy` 自动检查
2. **本地构建测试**：在推送前确保本地构建成功
3. **小步提交**：频繁提交小改动，避免大范围修改导致的问题
4. **查看日志**：部署失败时仔细查看 Cloudflare 构建日志
5. **测试环境**：如果可能，使用预览部署测试更改

## 🔗 相关文档

- [Cloudflare Pages 部署指南](./CLOUDFLARE_AUTO_DEPLOY.md)
- [Next.js 静态导出文档](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

---

**提示**：将此清单保存为书签，每次部署前快速查阅！
