# Cloudflare 免费图片上传（R2 + Worker）

图生图需要把用户图片变成**公网 URL** 再传给 Kie AI。用 Cloudflare **R2 + Worker** 可免费实现。

## 免费额度（无需信用卡）

| 产品 | 免费额度 |
|------|----------|
| **R2 存储** | 10 GB/月、100 万次 Class A（写入）、1000 万次 Class B（读取）、出口流量免费 |
| **Worker** | 每天 10 万次请求（免费套餐） |

个人或小流量完全够用。

---

## 一、在 Cloudflare 创建 R2 桶

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com) → 左侧 **R2**。
2. **Create bucket**，名称例如：`toolaze-uploads`。
3. 创建好后进入桶 → **Settings** → **Public access**：
   - 开启 **Allow Access**，并记下 **R2.dev subdomain**（例如 `https://pub-xxxxx.r2.dev`），或绑定自定义域名。

这样桶内对象会得到公网 URL：`https://pub-xxxxx.r2.dev/toolaze-uploads/<key>`。

---

## 二、创建上传用 Worker

1. 左侧 **Workers & Pages** → **Create** → **Worker**，名称例如：`toolaze-image-upload`。
2. **Quick Edit** 里用下面「Worker 脚本」替换默认代码并保存、**Deploy**。
3. **Settings** → **Variables and Secrets**：
   - 添加 **R2 bucket binding**：Variable name = `MY_BUCKET`，R2 bucket = 上面建的 `toolaze-uploads`。
4. **Triggers** 里确认路由，例如：`https://toolaze-image-upload.<你的子域>.workers.dev/upload`（或你绑的自定义域名）。

---

## 三、Worker 脚本（复制整段替换）

```js
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }
    try {
      const contentType = request.headers.get('Content-Type') || '';
      let blob;
      let ext = 'png';
      if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        const file = formData.get('file') || formData.get('image');
        if (!file || !(file instanceof Blob)) {
          return new Response(JSON.stringify({ error: 'No file in form (use field: file or image)' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...CORS },
          });
        }
        blob = file;
        const name = file.name || '';
        if (name.endsWith('.jpg') || name.endsWith('.jpeg')) ext = 'jpg';
        else if (name.endsWith('.webp')) ext = 'webp';
      } else if (contentType.includes('application/octet-stream') || contentType.includes('image/')) {
        blob = await request.blob();
        if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = 'jpg';
        else if (contentType.includes('webp')) ext = 'webp';
      } else {
        return new Response(JSON.stringify({ error: 'Send multipart/form-data with file or image' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...CORS },
        });
      }
      // 文件名随机化（UUID），避免第三方从 URL 猜出业务逻辑
      const randomId = crypto.randomUUID().replace(/-/g, '');
      const key = `uploads/${randomId}.${ext}`;
      await env.MY_BUCKET.put(key, blob, {
        httpMetadata: { contentType: blob.type || 'image/png' },
      });
      const base = (env.MY_BUCKET_PUBLIC_URL || '').replace(/\/$/, '');
      const publicUrl = base ? `${base}/${key}` : null;
      if (!publicUrl) {
        return new Response(JSON.stringify({ error: 'Set MY_BUCKET_PUBLIC_URL in Worker env (e.g. https://pub-xxx.r2.dev)' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...CORS },
        });
      }
      return new Response(JSON.stringify({ url: publicUrl, key }), {
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e.message) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }
  },
};
```

**重要**：在 Worker 的 **Settings → Variables** 里添加 **Environment Variable**：  
`MY_BUCKET_PUBLIC_URL` = `https://pub-xxxxx.r2.dev`（换成你在 R2 桶 Settings → Public access 里看到的 R2.dev 地址，或自定义域名）。

---

## 三（B）、用 Pages Function（与 toolaze-web 同域，无需单独 Worker）

你如果只有 **https://toolaze-web.pages.dev**、没有单独 Worker，可以用项目里的 **Pages Function** 做上传，接口在同一域名下。

1. **代码已就绪**：项目根目录已有 `functions/api/upload.js`，部署后地址为 **https://toolaze-web.pages.dev/api/upload**。
2. **在 Cloudflare 绑定 R2**：  
   - 打开 **Workers & Pages** → 点进 **toolaze-web** → **Settings** → **Functions**。  
   - 在 **R2 bucket bindings** 里 **Add binding**：  
     - Variable name: `MY_BUCKET`  
     - R2 bucket: 选择你用来存上传图片的桶（如 `toolaze` 或 `toolaze-uploads`）。  
   - 在 **Environment variables**（Functions 用）里添加（可选，不填则用默认 R2 公网域名）：  
     - name: `R2_PUBLIC_BASE_URL`，value: `https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev`
3. **本地上传地址**：在 `.env.local` 里设：
   ```bash
   NEXT_PUBLIC_IMAGE_UPLOAD_URL=https://toolaze-web.pages.dev/api/upload
   ```
4. **部署**：推送代码后 Pages 会自动构建；`functions` 会一起部署，无需单独建 Worker。

这样上传接口就是 **https://toolaze-web.pages.dev/api/upload**，与站点同域，无需单独 Worker。

**把 Kie 生成图存到 R2（便于直接下载）**：项目里还有 **functions/api/save-image-to-r2.js**。部署后地址为 **https://toolaze-web.pages.dev/api/save-image-to-r2**。前端在拿到 Kie 返回的图片 URL 后会请求该接口，由服务端拉取图片并写入 R2，返回 R2 公网 URL。这样展示和下载都用自己的 R2 地址，下载可直接进浏览器、无需新开标签。该接口复用同一 R2 绑定（MY_BUCKET、R2_PUBLIC_BASE_URL），无需额外配置。

**若 POST /api/upload 仍返回 405**：说明请求可能没有命中 Pages Function（例如项目用了「Build output directory = out」且 Pages 只部署了静态产物）。请到 **Dashboard → Workers & Pages → toolaze-web → Settings → Builds & deployments** 确认：
- **Build output directory** 为 `out`（与 next build 一致）；
- 不要设 **Root directory** 把项目根目录改掉（`functions` 必须在项目根下才会被识别）。
若确认无误仍 405，可改用文档「二、创建上传用 Worker」单独建一个 Worker，把 `NEXT_PUBLIC_IMAGE_UPLOAD_URL` 改为该 Worker 的地址。

**隐私说明**：返回给前端的图片地址是 `R2_PUBLIC_BASE_URL`（即 R2 公网子域，如 `https://pub-xxx.r2.dev/...`）。前端把该 URL 发给 Kie AI 时，Kie 只能看到 R2 域名，**拿不到 toolaze 域名**；只有当你把 `R2_PUBLIC_BASE_URL` 设成自己的域名时，Kie 才会从图片 URL 里看到你的品牌域。

---

## 四、在本项目里使用

1. **环境变量**  
   在 `.env.local`（或部署环境）里增加：
   ```bash
   # 若用 Pages Function（与站点同域，推荐）：
   NEXT_PUBLIC_IMAGE_UPLOAD_URL=https://toolaze-web.pages.dev/api/upload
   # 若用单独 Worker：
   # NEXT_PUBLIC_IMAGE_UPLOAD_URL=https://toolaze-image-upload.xxx.workers.dev/upload
   ```
   把上面的地址换成你实际使用的上传接口（Pages 用 `https://toolaze-web.pages.dev/api/upload`，单独 Worker 用其完整 URL）。  
   配置后，图生图会先上传图片到 Cloudflare，再用返回的公网 URL 调用 Kie AI；不配置则沿用当前逻辑（后端把图片转成 base64 发给 Kie AI，部分 API 可能不支持）。

**若出现 “Failed to fetch” 或 “图片上传请求失败”**：  
1. 确认 `NEXT_PUBLIC_IMAGE_UPLOAD_URL` 为 **https** 且无拼写错误，例如 `https://你的worker名.子域.workers.dev`（不要漏写 `https://`）。  
2. 到 Cloudflare **Workers & Pages** 里确认该 Worker 已 **Deploy**，且 **Triggers** 里能看到默认的 `*.workers.dev` 地址。  
3. 在浏览器新标签页打开该 URL，若返回 405 Method Not Allowed 属正常（只接受 POST）；若无法打开或连接被拒绝，说明地址错误或未部署。  
4. 打开浏览器开发者工具 → **Network**，重试上传，看该请求是 **CORS 报错**还是 **net::ERR_**：若是 CORS，确认 Worker 脚本里已包含文档中的 CORS 响应头（含 `OPTIONS` 预检）。

2. **图生图流程**  
   用户选择图片 → 若有 `NEXT_PUBLIC_IMAGE_UPLOAD_URL`，前端先 POST 到该地址（字段名 `image`）→ 响应 `{ url }` → 请求 createTask 时传 `imageUrl`；否则仍传 `image` 文件由后端转 base64。

这样图片就通过 **Cloudflare 免费 R2 + Worker** 上传，并得到公网 URL 供 Kie AI 使用。

---

## 五、用 Python（boto3）直传 R2（可选）

若你在本地或后端用 Python 上传到 R2，可用项目里的 `scripts/r2_upload.py`。需先安装：`pip install boto3`。

**环境变量**（在 `.env.local` 或 shell 里配置，勿提交）：

```bash
export R2_ACCESS_KEY_ID="你的 R2 Access Key ID"
export R2_SECRET_ACCESS_KEY="你的 R2 Secret Access Key"
export R2_ENDPOINT_URL="https://<account_id>.r2.cloudflarestorage.com"
export R2_BUCKET="toolaze"
export R2_PUBLIC_BASE_URL="https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev"
```

R2 的 Access Key 在 **Cloudflare Dashboard → R2 → Manage R2 API Tokens** 里创建；Endpoint 在桶所在账号的 R2 概览页可见。

**使用示例**（不传第二参数时自动用 UUID 作为文件名，增加隐私性）：

```bash
python3 scripts/r2_upload.py local_image.jpg
# 或指定对象名：python3 scripts/r2_upload.py local_image.jpg my_name.jpg
```

或在代码里：

```python
from scripts.r2_upload import upload_and_get_url
# 随机文件名（推荐）
url = upload_and_get_url("local_image.jpg", content_type="image/png")
# 或指定对象名
url = upload_and_get_url("local_image.jpg", "api_temp_001.jpg", content_type="image/png")
```
