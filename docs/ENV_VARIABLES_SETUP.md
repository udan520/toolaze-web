# Cloudflare Pages 环境变量配置指南

## 问题说明

如果遇到以下错误：
```
Generation failed: Image-to-image requires uploading the image to R2 first to get a public URL. Please set NEXT_PUBLIC_IMAGE_UPLOAD_URL in .env.local to your Cloudflare Worker upload URL.
```

这说明在生产环境中缺少必要的环境变量配置。

## 解决方案

### 方法 1：在 Cloudflare Pages Dashboard 中设置环境变量（推荐）

**详细步骤**：

1. **登录 Cloudflare Dashboard**
   - 访问：https://dash.cloudflare.com/
   - 使用你的账号登录

2. **进入 Pages 项目**
   - 在左侧菜单栏，点击 **"Workers & Pages"**
   - 在页面中找到并点击你的项目名称（如 `toolaze-web`）

3. **找到 Settings（设置）**
   - 进入项目后，你会看到顶部有几个标签页：**Overview**、**Deployments**、**Settings** 等
   - 点击 **"Settings"** 标签页

4. **找到 Environment variables（环境变量）**
   - 在 Settings 页面中，向下滚动
   - 找到 **"Builds & deployments"** 部分
   - 在这个部分中，你会看到 **"Environment variables"** 选项
   - 点击 **"Environment variables"** 旁边的 **"Add variable"** 或直接点击该部分展开

   **如果找不到，尝试以下位置**：
   - Settings 页面 → **"Builds & deployments"** → **"Environment variables"**
   - 或者 Settings 页面 → 直接查找 **"Environment variables"** 部分
   - 有些界面版本可能在 Settings 页面的顶部或底部

5. **添加环境变量**
   - 点击 **"Add variable"** 按钮
   - 选择环境：**Production**（生产环境）
   - 输入变量名：`NEXT_PUBLIC_IMAGE_UPLOAD_URL`
   - 输入变量值：`https://toolaze-web.pages.dev/api/upload`
     - ⚠️ **重要**：将 `toolaze-web.pages.dev` 替换为你实际的 Pages 域名
     - 如果使用自定义域名，使用自定义域名（如 `https://toolaze.com/api/upload`）
   - 点击 **"Save"** 保存

6. **（可选）为 Preview 环境也添加**
   - 再次点击 **"Add variable"**
   - 选择环境：**Preview**（预览环境）
   - 输入相同的变量名和值
   - 点击 **"Save"** 保存

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

### Flux 生图（可选）

如需使用 Flux API（去水印等），需配置：

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `ZHEN_AI_API_KEY` | 是 | Flux 的 API Key（Bearer 认证） |
| `ZHEN_AI_FLUX_BASE_URL` | 是 | API 基础地址，从平台获取 |

- `/api/flux-dev`：文生图 / 图生图（flux-dev，支持 `input_image` 时走图生图）
- `/api/flux-dev/status`：查询任务状态（GET /bfl/v1/get_result）

**使用 gpt-best（对齐 Bfl 官方格式）**：在 [gpt-best 文档](https://gpt-best.apifox.cn/) 获取 Base URL 和 API Key：
```
ZHEN_AI_API_KEY=sk-xxxx
ZHEN_AI_FLUX_BASE_URL=https://你的Base_URL
```

示例（使用 OpenAi-HK）：
```
ZHEN_AI_API_KEY=hk-your-key
ZHEN_AI_FLUX_BASE_URL=https://api.openai-hk.com
```

---

## 去水印功能：额外配置

去水印使用 **qwen-image-edit** 接口（`POST /v1/images/edits`，OpenAI DALL-E 格式），**无需 R2**，图片直接随请求发送。

**需配置**（Functions → Environment variables）：

| 变量名 | 说明 |
|--------|------|
| `ZHEN_AI_API_KEY` | API Key（如 ai.t8star.cn、gpt-best 等平台） |
| `ZHEN_AI_FLUX_BASE_URL` | Base URL（如 `https://ai.t8star.cn`，默认 `https://ai.t8star.cn`） |

接口文档：[gpt-best qwen-image-edit](https://gpt-best.apifox.cn/api-338005095)

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

## 本地开发：启用真实 API（next dev）

在 `npm run dev` 下，`/api/qwen-image-edit` 会代理到真实 API，可直接使用 `.env.local` 中的 API Key 测试去水印。

### 1. 配置 .env.local

```bash
# 去水印（qwen-image-edit 接口）
ZHEN_AI_API_KEY=sk-xxxx
ZHEN_AI_FLUX_BASE_URL=https://ai.t8star.cn   # 或 gpt-best 等平台 Base URL
```

去水印**无需 R2**，图片直接随请求发送，本地只需配置上述两项即可测试。

### 2. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3006/watermark-remover`，上传图片即可测试。每次调用会消耗 Flux API 额度。

---

## 500 错误排查

去水印流程涉及三个接口，任一失败都可能返回 500：

| 接口 | 常见原因 | 处理方式 |
|------|----------|----------|
| `/api/upload` | R2 未绑定、`MY_BUCKET` 缺失 | 在 Functions → R2 bucket bindings 中绑定 `MY_BUCKET` |
| `/api/flux-dev` | `ZHEN_AI_API_KEY` 未配置 | 在 Functions → Environment variables 中配置 |
| `/api/flux-dev` | Base URL 错误（404） | 检查 `ZHEN_AI_FLUX_BASE_URL` 是否为 gpt-best 的 Base URL |
| `/api/flux-dev` | API Key 无效（401） | 检查 `ZHEN_AI_API_KEY` 是否正确 |
| `/api/flux-dev` | 上游返回异常格式 | 确认 gpt-best 支持 flux-dev 图生图 |

**查看具体错误**：浏览器 Network 面板中点击失败的请求 → Response，查看 `error` 和 `hint` 字段。

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
