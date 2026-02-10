# R2 图片上传指南

本文档说明如何将图片上传到 Cloudflare R2 存储。

## 方式一：通过 API 接口上传（推荐）

### 1. 前端代码中调用上传接口

项目已提供上传 API：`/api/upload`（部署后为 `https://toolaze-web.pages.dev/api/upload`）

**JavaScript/TypeScript 示例：**

```typescript
async function uploadImageToR2(file: File): Promise<string | null> {
  try {
    const formData = new FormData()
    formData.append('image', file) // 或使用 'file' 字段名
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      const error = await response.json()
      console.error('上传失败:', error)
      return null
    }
    
    const data = await response.json()
    return data.url // 返回 R2 公网 URL，例如：https://pub-xxxxx.r2.dev/uploads/xxx.jpg
  } catch (error) {
    console.error('上传错误:', error)
    return null
  }
}

// 使用示例
const fileInput = document.querySelector('input[type="file"]')
fileInput?.addEventListener('change', async (e) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const url = await uploadImageToR2(file)
    if (url) {
      console.log('上传成功，URL:', url)
      // 现在可以使用这个 URL，例如传给 SiteImage 组件
    }
  }
})
```

**React 组件示例：**

```tsx
'use client'
import { useState } from 'react'
import SiteImage from '@/components/SiteImage'

export default function ImageUploader() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('上传失败')
      }

      const data = await response.json()
      setImageUrl(data.url)
    } catch (error) {
      console.error('上传错误:', error)
      alert('上传失败，请重试')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p>上传中...</p>}
      {imageUrl && (
        <SiteImage
          src={imageUrl}
          alt="上传的图片"
          width={800}
          height={600}
        />
      )}
    </div>
  )
}
```

### 2. 使用 curl 命令行上传

```bash
# 上传图片文件
curl -X POST https://toolaze-web.pages.dev/api/upload \
  -F "image=@/path/to/your/image.jpg"

# 响应示例：
# {"url":"https://pub-xxxxx.r2.dev/uploads/abc123.jpg","key":"uploads/abc123.jpg"}
```

---

## 方式二：使用 Python 脚本上传（适合批量上传）

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

### 3. 使用脚本上传

```bash
# 上传单个图片（自动生成随机文件名）
python3 scripts/r2_upload.py /path/to/image.jpg

# 指定文件名
python3 scripts/r2_upload.py /path/to/image.jpg my_custom_name.jpg
```

### 4. 在 Python 代码中使用

```python
from scripts.r2_upload import upload_and_get_url

# 随机文件名（推荐，增加隐私性）
url = upload_and_get_url("local_image.jpg", content_type="image/jpeg")
print(f"上传成功，URL: {url}")

# 指定文件名
url = upload_and_get_url("local_image.jpg", "my_image.jpg", content_type="image/png")
```

---

## 方式三：保存远程图片到 R2

如果你有一个远程图片 URL，想保存到自己的 R2：

```typescript
async function saveRemoteImageToR2(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch('/api/save-image-to-r2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('保存失败:', error)
      return null
    }

    const data = await response.json()
    return data.url // 返回 R2 公网 URL
  } catch (error) {
    console.error('保存错误:', error)
    return null
  }
}

// 使用示例
const remoteUrl = 'https://example.com/image.jpg'
const r2Url = await saveRemoteImageToR2(remoteUrl)
if (r2Url) {
  console.log('已保存到 R2:', r2Url)
}
```

---

## 配置要求

### 1. Cloudflare Pages 配置

确保在 Cloudflare Dashboard → Workers & Pages → toolaze-web → Settings → Functions 中：

- **R2 bucket binding**：
  - Variable name: `MY_BUCKET`
  - R2 bucket: 选择你的 R2 桶（如 `toolaze` 或 `toolaze-uploads`）

- **Environment variables**：
  - `R2_PUBLIC_BASE_URL`: `https://pub-xxxxx.r2.dev`（你的 R2 公网域名）

### 2. R2 桶配置

确保 R2 桶已开启公共访问：
- Cloudflare Dashboard → R2 → 你的桶 → Settings → Public access
- 开启 **Allow Access**
- 记下 **R2.dev subdomain**（如 `https://pub-xxxxx.r2.dev`）

---

## 上传后的使用

上传成功后，你会得到一个 R2 公网 URL，例如：
```
https://pub-xxxxx.r2.dev/uploads/abc123def456.jpg
```

可以在 `SiteImage` 组件中使用：

```tsx
<SiteImage
  src="https://pub-xxxxx.r2.dev/uploads/abc123def456.jpg"
  alt="我的图片"
  width={800}
  height={600}
/>
```

---

## 常见问题

### Q: 上传接口返回 405 Method Not Allowed？
A: 确保：
1. 使用 POST 方法
2. Cloudflare Pages Functions 已正确部署
3. 检查 `functions/api/upload.js` 文件是否存在

### Q: 上传失败，提示 CORS 错误？
A: 确保 Cloudflare Pages Function 已正确配置 CORS 响应头（代码中已包含）

### Q: 如何批量上传多张图片？
A: 可以循环调用上传接口，或使用 Python 脚本批量处理：

```python
import os
from scripts.r2_upload import upload_and_get_url

image_dir = "/path/to/images"
for filename in os.listdir(image_dir):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
        filepath = os.path.join(image_dir, filename)
        url = upload_and_get_url(filepath)
        print(f"{filename} -> {url}")
```

### Q: 上传的图片文件名是随机的吗？
A: 是的，API 接口会自动使用 UUID 生成随机文件名，增加隐私性。Python 脚本也支持随机文件名（不传第二个参数时）。

---

## 相关文档

- [Cloudflare 图片上传完整配置](./CLOUDFLARE_IMAGE_UPLOAD.md)
- [SiteImage 组件使用说明](../src/components/SiteImage.tsx)
