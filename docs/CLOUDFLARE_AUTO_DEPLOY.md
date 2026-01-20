# Cloudflare Pages 自动部署设置指南

本指南将帮助你配置 Cloudflare Pages，实现代码推送到 GitHub 后自动构建和部署。

## 前置条件

- ✅ GitHub 仓库已创建：`https://github.com/udan520/toolaze-web`
- ✅ 代码已推送到 GitHub
- ✅ Cloudflare 账号（如果没有，访问 https://dash.cloudflare.com/sign-up 注册）

---

## 步骤 1：创建 Cloudflare Pages 项目

1. 登录 Cloudflare Dashboard：https://dash.cloudflare.com/
2. 在左侧菜单选择 **"Workers & Pages"**
3. 点击 **"Create application"** → **"Pages"** → **"Connect to Git"**
4. 选择 **"GitHub"** 作为 Git 提供商
5. 授权 Cloudflare 访问你的 GitHub 账号（如果首次使用）
6. 选择仓库：`udan520/toolaze-web`
7. 点击 **"Begin setup"**

---

## 步骤 2：配置构建设置

在项目设置页面，配置以下信息：

### 项目名称
- **Project name**: `toolaze-web`（或你喜欢的名称）

### 构建配置
- **Production branch**: `main`（你的主分支）
- **Framework preset**: `Next.js (Static HTML Export)`
- **Build command**: `npm run build`
- **Build output directory**: `out`（Next.js 静态导出默认输出目录）

### 环境变量（可选）
如果需要环境变量，点击 **"Environment variables"** 添加：
- `NODE_VERSION`: `20`（确保使用 Node.js 20+）

### 根目录
- **Root directory**: `/`（默认，项目根目录）

---

## 步骤 3：保存并部署

1. 点击 **"Save and Deploy"**
2. Cloudflare 会立即开始首次构建
3. 等待构建完成（通常 2-5 分钟）

---

## 步骤 4：验证自动部署

### 测试自动部署

1. 在本地做一些小改动（比如修改 README）
2. 提交并推送到 GitHub：
   ```bash
   git add .
   git commit -m "test: 测试 Cloudflare 自动部署"
   git push origin main
   ```
3. 回到 Cloudflare Dashboard → **Workers & Pages** → 你的项目
4. 在 **"Deployments"** 标签页，你应该会看到新的部署正在构建
5. 部署完成后，网站会自动更新

### 查看部署状态

- **成功**：部署状态显示 ✅，可以访问预览 URL
- **失败**：点击部署查看错误日志，检查构建配置

---

## 步骤 5：配置自定义域名（可选）

### 添加自定义域名

1. 在项目页面，点击 **"Custom domains"**
2. 点击 **"Set up a custom domain"**
3. 输入你的域名（例如：`toolaze.com`）
4. 按照提示配置 DNS 记录：
   - 类型：`CNAME`
   - 名称：`@` 或 `www`
   - 目标：Cloudflare 提供的 Pages 域名（例如：`toolaze-web.pages.dev`）

### DNS 配置示例

```
类型    名称    内容
CNAME   @       toolaze-web.pages.dev
CNAME   www     toolaze-web.pages.dev
```

---

## 步骤 6：配置构建优化（推荐）

### 构建命令优化

如果你的项目需要特定 Node.js 版本，可以在 `package.json` 中指定：

```json
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### 构建缓存（自动）

Cloudflare Pages 会自动缓存 `node_modules`，加速后续构建。

---

## 常见问题排查

### 问题 1：构建失败

**可能原因**：
- Node.js 版本不匹配
- 构建命令错误
- 依赖安装失败

**解决方法**：
1. 检查构建日志中的错误信息
2. 确认 `package.json` 中的 `engines.node` 版本
3. 在 Cloudflare 环境变量中设置 `NODE_VERSION=20`

### 问题 2：自动部署不触发

**可能原因**：
- GitHub webhook 未正确配置
- 分支名称不匹配

**解决方法**：
1. 检查 Cloudflare 项目设置中的 **"Production branch"** 是否为 `main`
2. 在 GitHub 仓库设置中检查 Webhooks（Cloudflare 会自动创建）
3. 手动触发部署：Cloudflare Dashboard → Deployments → **"Retry deployment"**

### 问题 3：静态资源加载失败

**可能原因**：
- `next.config.js` 中的 `output: 'export'` 配置问题
- 路径配置错误

**解决方法**：
1. 确认 `next.config.js` 中有 `output: 'export'`
2. 确认 `images.unoptimized: true` 已设置
3. 检查构建输出目录是否为 `out`

---

## 高级配置

### 预览部署

Cloudflare Pages 会为每个 Pull Request 自动创建预览部署：
- 在 GitHub 创建 PR
- Cloudflare 会自动构建预览版本
- PR 中会显示预览链接

### 回滚部署

如果需要回滚到之前的版本：
1. 进入 **"Deployments"** 标签页
2. 找到要回滚的部署
3. 点击 **"..."** → **"Retry deployment"**

### 环境变量管理

在 Cloudflare Dashboard → 项目设置 → **"Environment variables"** 中：
- 为不同环境（Production、Preview）设置不同的变量
- 敏感信息（API keys）建议使用环境变量，不要提交到代码库

---

## 验证清单

完成设置后，确认以下项目：

- [ ] GitHub 仓库已连接到 Cloudflare Pages
- [ ] 构建配置正确（命令：`npm run build`，输出：`out`）
- [ ] 首次部署成功
- [ ] 推送代码后自动触发新部署
- [ ] 自定义域名已配置（如需要）
- [ ] DNS 记录已正确设置（如使用自定义域名）

---

## 完成！

配置完成后，每次你执行 `git push origin main`，Cloudflare Pages 都会：
1. 自动检测代码变更
2. 触发构建流程
3. 部署最新版本
4. 更新网站内容

无需手动操作，完全自动化！🚀

---

## 参考链接

- Cloudflare Pages 文档：https://developers.cloudflare.com/pages/
- Next.js 静态导出：https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- Cloudflare Dashboard：https://dash.cloudflare.com/
