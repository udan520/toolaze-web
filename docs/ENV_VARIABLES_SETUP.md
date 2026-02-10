# Cloudflare Pages 环境变量配置指南

## 问题说明

如果遇到以下错误：
```
Generation failed: Image-to-image requires uploading the image to R2 first to get a public URL. Please set NEXT_PUBLIC_IMAGE_UPLOAD_URL in .env.local to your Cloudflare Worker upload URL.
```

这说明在生产环境中缺少必要的环境变量配置。

## 解决方案

### 方法 1：在 Cloudflare Pages Dashboard 中设置环境变量（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → 选择你的项目（如 `toolaze-web`）
3. 点击 **Settings** → **Environment variables**
4. 添加以下环境变量：

#### Production 环境变量

```
NEXT_PUBLIC_IMAGE_UPLOAD_URL = https://toolaze-web.pages.dev/api/upload
```

**注意**：
- 将 `toolaze-web.pages.dev` 替换为你的实际 Pages 域名
- 如果使用自定义域名，使用自定义域名（如 `https://toolaze.com/api/upload`）
- 如果使用单独的 Worker，使用 Worker 的完整 URL（如 `https://toolaze-image-upload.xxx.workers.dev/upload`）

#### Preview 环境变量（可选）

如果需要为预览部署也配置：
```
NEXT_PUBLIC_IMAGE_UPLOAD_URL = https://your-preview-branch.pages.dev/api/upload
```

5. 点击 **Save** 保存配置
6. 重新部署项目（或等待下次自动部署）

### 方法 2：使用 Pages Functions（已配置回退）

如果未设置 `NEXT_PUBLIC_IMAGE_UPLOAD_URL`，代码会自动回退到使用 `/api/upload`（Pages Function）。

**前提条件**：
- 确保 `functions/api/upload.js` 已部署
- 在 Cloudflare Pages 项目设置中配置了 R2 绑定：
  - **Settings** → **Functions** → **R2 bucket bindings**
  - Variable name: `MY_BUCKET`
  - R2 bucket: 选择你的 R2 桶（如 `toolaze`）
- 配置了环境变量（Functions 用）：
  - **Settings** → **Functions** → **Environment variables**
  - name: `R2_PUBLIC_BASE_URL`
  - value: `https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev`（替换为你的 R2 公网域名）

### 验证配置

1. **检查环境变量是否生效**：
   - 打开浏览器开发者工具 → Console
   - 运行：`console.log(process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL)`
   - 应该能看到配置的 URL（注意：Next.js 会在构建时注入，运行时可能看不到）

2. **测试图片上传**：
   - 访问图生图功能
   - 选择一张图片
   - 如果配置正确，图片应该能成功上传并生成

3. **检查网络请求**：
   - 打开浏览器开发者工具 → Network
   - 尝试上传图片
   - 查看是否有对 `/api/upload` 或配置的 URL 的请求
   - 检查响应状态码（应该是 200）

## 常见问题

### Q: 为什么本地开发正常，但生产环境报错？

A: `.env.local` 文件只在本地生效，不会上传到 Cloudflare Pages。必须在 Cloudflare Dashboard 中设置环境变量。

### Q: 设置环境变量后需要重新部署吗？

A: 是的，`NEXT_PUBLIC_*` 环境变量在构建时注入，需要重新构建才能生效。可以：
- 触发一次新的部署（推送代码或手动触发）
- 或者在 Cloudflare Dashboard 中点击 **Retry deployment**

### Q: 如何确认 Pages Functions 是否正常工作？

A: 
1. 检查 `functions/api/upload.js` 文件是否存在
2. 在 Cloudflare Dashboard → 项目 → **Functions** 标签页，确认 Functions 已部署
3. 尝试直接访问 `https://your-domain.pages.dev/api/upload`（应该返回 405 Method Not Allowed，这是正常的，因为只接受 POST）

### Q: 仍然报错怎么办？

1. **检查 R2 绑定**：
   - 确保在 Pages 项目设置中正确绑定了 R2 桶
   - Variable name 必须是 `MY_BUCKET`

2. **检查 R2 公网访问**：
   - 确保 R2 桶已开启 Public access
   - 记录 R2.dev subdomain（如 `https://pub-xxxxx.r2.dev`）

3. **检查 Functions 环境变量**：
   - 在 **Settings** → **Functions** → **Environment variables** 中
   - 确保设置了 `R2_PUBLIC_BASE_URL`

4. **查看构建日志**：
   - 在 Cloudflare Dashboard → 项目 → **Deployments** 中查看构建日志
   - 检查是否有错误信息

5. **查看浏览器控制台**：
   - 打开开发者工具 → Console 和 Network
   - 查看具体的错误信息

## 相关文档

- [Cloudflare 图片上传配置](./CLOUDFLARE_IMAGE_UPLOAD.md)
- [Cloudflare Pages 自动部署设置](./CLOUDFLARE_AUTO_DEPLOY.md)
