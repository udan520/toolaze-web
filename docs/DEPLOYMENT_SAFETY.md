# 部署安全指南

本指南说明如何防止部署错误，确保每次部署都能成功。

## 🛡️ 三层防护机制

### 第一层：本地自动检查（推送前）

在每次推送代码前，系统会自动运行检查：

```bash
npm run pre-deploy
```

这个脚本会检查：
- ✅ Next.js 静态导出配置是否正确
- ✅ 是否包含不兼容的 middleware
- ✅ 构建是否能成功完成
- ✅ 构建输出是否正确生成

**注意**：`prebuild` 脚本会自动运行 `pre-deploy`，所以直接运行 `npm run build` 也会先检查。

### 第二层：GitHub Actions CI（推送后）

每次推送到 `main` 分支时，GitHub Actions 会自动运行：

- ✅ 配置文件检查
- ✅ 代码 Lint 检查
- ✅ 完整构建测试
- ✅ 输出目录验证

**查看 CI 状态**：
- GitHub 仓库页面会显示 CI 状态
- 如果 CI 失败，部署会被阻止（如果配置了保护规则）

### 第三层：Cloudflare Pages 构建（最终部署）

即使前两层通过，Cloudflare Pages 也会进行最终构建验证。

**如果失败**：
- 查看 Cloudflare Dashboard 中的构建日志
- 根据错误信息修复问题
- 使用本指南的故障排查部分

## 📋 标准部署流程

### 1. 开发完成后

```bash
# 1. 运行自动检查
npm run pre-deploy

# 2. 如果检查通过，提交代码
git add .
git commit -m "feat: 你的功能描述"

# 3. 推送代码
git push origin main
```

### 2. 监控部署状态

- **GitHub Actions**：在仓库页面查看 CI 状态
- **Cloudflare Pages**：在 Dashboard 中查看部署状态

### 3. 如果失败

参考 [部署前检查清单](./DEPLOYMENT_CHECKLIST.md) 中的故障排查部分。

## 🚫 禁止的操作

为了避免部署错误，**永远不要**：

1. ❌ **添加 `middleware.ts`**：静态导出不支持 middleware
2. ❌ **使用 API Routes**：`/app/api/` 路由在静态导出中不工作
3. ❌ **移除 `output: 'export'`**：这是 Cloudflare Pages 必需的
4. ❌ **使用 Next.js Image 优化**：必须设置 `images.unoptimized: true`
5. ❌ **使用 Server Components 动态功能**：如 `cookies()`, `headers()` 等
6. ❌ **直接推送未测试的代码**：总是先运行 `npm run pre-deploy`

## ✅ 允许的操作

以下操作是安全的：

1. ✅ 修改页面组件和内容
2. ✅ 添加新的工具页面
3. ✅ 更新多语言内容
4. ✅ 修改样式和布局
5. ✅ 添加客户端组件
6. ✅ 使用静态数据

## 🔧 快速故障排查

### 问题：检查脚本失败

```bash
# 查看详细错误
npm run pre-deploy

# 常见问题：
# 1. middleware.ts 存在 -> 重命名或删除
# 2. next.config.js 配置错误 -> 检查 output: 'export'
# 3. 构建失败 -> 查看构建错误信息
```

### 问题：GitHub Actions 失败

1. 点击 GitHub 仓库中的 ❌ 状态图标
2. 查看详细的错误日志
3. 根据错误信息修复代码
4. 重新提交并推送

### 问题：Cloudflare Pages 部署失败

1. 访问 Cloudflare Dashboard
2. 进入你的 Pages 项目
3. 查看失败的部署日志
4. 参考 [常见部署错误](./DEPLOYMENT_CHECKLIST.md#-常见部署错误及解决方案)

## 📚 相关文档

- [部署前检查清单](./DEPLOYMENT_CHECKLIST.md) - 详细的手动检查步骤
- [Cloudflare 部署指南](./CLOUDFLARE_AUTO_DEPLOY.md) - Cloudflare Pages 配置说明
- [Next.js 静态导出](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) - 官方文档

## 💡 最佳实践

1. **小步提交**：频繁提交小的改动，而不是一次性大改动
2. **本地测试**：在推送前确保本地构建成功
3. **使用检查脚本**：养成运行 `npm run pre-deploy` 的习惯
4. **查看日志**：部署失败时仔细阅读错误日志
5. **文档更新**：如果发现新的问题或解决方案，更新本文档

## 🆘 需要帮助？

如果遇到无法解决的问题：

1. 检查所有相关文档
2. 查看 GitHub Issues（如果有）
3. 检查 Cloudflare Pages 和 Next.js 官方文档
4. 查看构建日志中的具体错误信息

---

**记住**：预防胜于修复！使用自动化检查工具可以避免 90% 的部署错误。
