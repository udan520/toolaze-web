/**
 * Cloudflare Pages Function: 接收图片上传，写入 R2，返回公网 URL。
 * 部署后地址：https://toolaze-web.pages.dev/api/upload
 * 需在 Pages 项目 Settings → Functions → Bindings 中绑定 R2（MY_BUCKET）并设置 R2_PUBLIC_BASE_URL。
 */
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestPost(context) {
  const { request, env } = context;
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
    const randomId = crypto.randomUUID().replace(/-/g, '');
    const key = `uploads/${randomId}.${ext}`;
    await env.MY_BUCKET.put(key, blob, {
      httpMetadata: { contentType: blob.type || 'image/png' },
    });
    const base = (env.R2_PUBLIC_BASE_URL || 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev').replace(/\/$/, '');
    const publicUrl = `${base}/${key}`;
    return new Response(JSON.stringify({ url: publicUrl, key }), {
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e.message) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}
