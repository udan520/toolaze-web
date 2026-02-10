# Cloudflare Pages 环境变量配置指南

## 问题

如果遇到错误：
```
Generation failed: Image-to-image requires uploading the image to R2 first to get a public URL. Please set NEXT_PUBLIC_IMAGE_UPLOAD_URL in .env.local to your Cloudflare Worker upload URL.
```

这是因为在生产环境中没有设置 `NEXT_PUBLIC_IMAGE_UPLOAD_URL` 环境变量。

## 解决方案

### 方法 1：在 Cloudflare Pages Dashboard 中设置环境变量（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → 选择你的项目（如 `toolaze-web`）
3. 点击 **Settings** → **Environment variables**
4. 添加以下环境变量：

   **Production 环境：**
   ```
   NEXT_PUBLIC_IMAGE_UPLOAD_URL = https://toolaze-web.pages.dev/api/upload
   ```

   **Preview 环境（可选）：**
   ```
   NEXT_PUBLIC_IMAGE_UPLOAD_URL = https://toolaze-web.pages.dev/api/upload
   ```

5. 点击 **Save**
6. 重新部署项目（或等待下次自动部署）

### 方法 2：确保 Pages Function 已正确部署

1. 确认 `functions/api/upload.js` 文件存在于项目根目录
2. 在 Cloudflare Dashboard → 项目 → **Settings** → **Functions**
3. 确认 **R2 bucket bindings** 已配置：
   - Variable name: `MY_BUCKET`
   - R2 bucket: 选择你的 R2 桶（如 `toolaze`）
4. 确认 **Environment variables** 中设置了：
   - `R2_PUBLIC_BASE_URL` = `https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev`（替换为你的 R2 公网域名）

### 方法 3：使用单独的 Cloudflare Worker（备选）

如果 Pages Function 不可用，可以创建一个单独的 Worker：

1. 在 Cloudflare Dashboard → **Workers & Pages** → **Create** → **Worker**
2. 使用文档 `docs/CLOUDFLARE_IMAGE_UPLOAD.md` 中的 Worker 脚本
3. 部署 Worker 后，在 Pages 环境变量中设置：
   ```
   NEXT_PUBLIC_IMAGE_UPLOAD_URL = https://your-worker-name.xxx.workers.dev/upload
   ```

## 验证配置

1. 部署完成后，访问你的网站
2. 打开浏览器开发者工具 → **Network** 标签
3. 尝试上传图片进行图生图
4. 检查网络请求：
   - 应该看到对 `/api/upload` 或你配置的 Worker URL 的 POST 请求
   - 请求应该返回 200 状态码和 `{ url: "..." }` 响应

## 常见问题

### Q: 为什么 `.env.local` 中的配置不生效？

A: `.env.local` 只在本地开发时生效。在生产环境（Cloudflare Pages）中，必须在 Dashboard 中设置环境变量。

### Q: 如何知道环境变量是否生效？

A: 在浏览器控制台运行：
```javascript
console.log(process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL)
```
如果返回 `undefined`，说明环境变量未正确设置。

### Q: 部署后仍然报错怎么办？

A: 
1. 确认环境变量已保存并重新部署
2. 检查 Pages Function 是否正确部署（访问 `https://toolaze-web.pages.dev/api/upload` 应该返回 405，而不是 404）
3. 检查 R2 bucket binding 是否正确配置
4. 查看 Cloudflare Dashboard 中的部署日志，确认是否有错误

## 相关文档

- [Cloudflare 图片上传配置指南](./CLOUDFLARE_IMAGE_UPLOAD.md)
- [Cloudflare Pages 自动部署设置](./CLOUDFLARE_AUTO_DEPLOY.md)
