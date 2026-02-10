# 上传 Nano Banana Pro 示例图到 R2

本文档说明如何将示例图片上传到 R2，并在 Nano Banana Pro 工具中使用。

## 方法一：使用 Python 脚本（推荐）

### 1. 安装依赖

```bash
pip install boto3
```

### 2. 配置环境变量

在 `.env.local` 或 shell 中设置：

```bash
export R2_ACCESS_KEY_ID="你的 R2 Access Key ID"
export R2_SECRET_ACCESS_KEY="你的 R2 Secret Access Key"
export R2_ENDPOINT_URL="https://<account_id>.r2.cloudflarestorage.com"
export R2_BUCKET="toolaze"  # 你的 R2 桶名称
export R2_PUBLIC_BASE_URL="https://pub-xxxxx.r2.dev"  # R2 公网域名
```

**如何获取这些凭证：**
- **Access Key ID 和 Secret Access Key**：Cloudflare Dashboard → R2 → Manage R2 API Tokens → Create API token
- **Endpoint URL**：在 R2 概览页可见，格式为 `https://<account_id>.r2.cloudflarestorage.com`
- **R2_PUBLIC_BASE_URL**：R2 桶 Settings → Public access → R2.dev subdomain

### 3. 上传示例图

```bash
# 上传单个图片（会自动生成随机文件名）
python3 scripts/r2_upload.py /path/to/sample1.jpg

# 指定文件名（推荐使用 samples/ 前缀）
python3 scripts/r2_upload.py /path/to/sample1.jpg samples/nano-banana-pro-sample-1.jpg
python3 scripts/r2_upload.py /path/to/sample2.jpg samples/nano-banana-pro-sample-2.jpg
```

上传成功后会显示 R2 公网 URL，例如：
```
传给 KIE API 的地址是: https://pub-xxxxx.r2.dev/samples/nano-banana-pro-sample-1.jpg
```

### 4. 在代码中使用

打开 `src/components/NanoBananaTool.tsx`，找到 `sampleImages` 数组（约第 451 行），将占位符替换为真实 URL：

```typescript
const sampleImages: Array<{ 
  url?: string
  caption: string
  color?: string
}> = [
  { 
    url: 'https://pub-xxxxx.r2.dev/samples/nano-banana-pro-sample-1.jpg', 
    caption: 'Sample output 1' 
  },
  { 
    url: 'https://pub-xxxxx.r2.dev/samples/nano-banana-pro-sample-2.jpg', 
    caption: 'Sample output 2' 
  },
]
```

保存后，示例图就会在工具中显示。

---

## 方法二：使用 API 接口上传

### 1. 使用 curl 上传

```bash
# 上传示例图
curl -X POST https://toolaze-web.pages.dev/api/upload \
  -F "image=@/path/to/sample1.jpg"

# 响应示例：
# {"url":"https://pub-xxxxx.r2.dev/uploads/abc123.jpg","key":"uploads/abc123.jpg"}
```

### 2. 使用 JavaScript/TypeScript

```typescript
async function uploadSampleImage(file: File): Promise<string | null> {
  const formData = new FormData()
  formData.append('image', file)
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })
  
  if (!response.ok) {
    console.error('上传失败')
    return null
  }
  
  const data = await response.json()
  return data.url
}

// 使用示例
const fileInput = document.querySelector('input[type="file"]')
fileInput?.addEventListener('change', async (e) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const url = await uploadSampleImage(file)
    if (url) {
      console.log('上传成功，URL:', url)
      // 复制这个 URL 到 sampleImages 数组中
    }
  }
})
```

### 3. 在代码中使用

将上传后得到的 URL 添加到 `sampleImages` 数组中（见方法一的第 4 步）。

---

## 方法三：使用 Node.js 脚本（需要安装依赖）

### 1. 安装依赖

```bash
npm install @aws-sdk/client-s3
```

### 2. 配置环境变量

同方法一第 2 步。

### 3. 运行上传脚本

```bash
node scripts/upload-sample-images.js /path/to/sample1.jpg /path/to/sample2.jpg
```

脚本会自动：
- 上传图片到 R2（保存到 `samples/` 目录）
- 显示上传后的 URL
- 生成可直接复制到代码中的 `sampleImages` 配置

---

## 图片要求

- **格式**：JPG、PNG、WebP
- **尺寸**：建议 4:3 比例（例如 800x600、1200x900）
- **大小**：建议每张图片不超过 5MB
- **内容**：展示 Nano Banana Pro 生成效果的示例图

---

## 验证上传结果

上传后，在浏览器中直接访问 R2 URL，确认图片可以正常显示：

```
https://pub-xxxxx.r2.dev/samples/nano-banana-pro-sample-1.jpg
```

如果图片可以正常显示，说明上传成功。

---

## 常见问题

### Q: 上传后图片无法显示？
A: 检查：
1. R2 桶是否开启了公共访问（Settings → Public access → Allow Access）
2. URL 是否正确（包含完整的域名和路径）
3. 图片格式是否支持（JPG、PNG、WebP）

### Q: 如何批量上传多张图片？
A: 使用 Python 脚本循环上传：

```bash
for i in {1..5}; do
  python3 scripts/r2_upload.py "/path/to/sample$i.jpg" "samples/nano-banana-pro-sample-$i.jpg"
done
```

### Q: 上传的图片文件名可以自定义吗？
A: 可以。Python 脚本支持指定文件名：
```bash
python3 scripts/r2_upload.py /path/to/image.jpg samples/my-custom-name.jpg
```

---

## 相关文档

- [R2 上传完整指南](./R2_UPLOAD_GUIDE.md)
- [Cloudflare 图片上传配置](./CLOUDFLARE_IMAGE_UPLOAD.md)
