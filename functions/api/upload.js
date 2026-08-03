/**
 * Cloudflare Pages Function: 接收图片上传，写入 R2，返回公网 URL。
 * 部署后地址：https://toolaze-web.pages.dev/api/upload
 * 需在 Pages 项目 Settings → Functions → Bindings 中绑定 R2（MY_BUCKET）并设置 R2_PUBLIC_BASE_URL。
 * 使用单一 onRequest 确保该路径由本 Function 处理，避免被静态或其它逻辑返回 405。
 */
import { uploadFileToKie } from '../_shared/kie-file-upload.mjs';
import {
  createUploadReference,
  getUploadReferenceMediaType,
} from '../_shared/upload-reference.mjs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const MOTION_CONTROL_UPLOAD_PURPOSE = 'kling-motion-control';
const MOTION_CONTROL_UPLOAD_OPTIONS = {
  uploadPath: 'toolaze/kling-motion-control',
  formatProfile: 'kling-motion-control',
};

function getMotionControlUploadOptions(formData) {
  const uploadPurpose = String(formData.get('uploadPurpose') || '').trim();
  if (uploadPurpose !== MOTION_CONTROL_UPLOAD_PURPOSE) return null;
  return MOTION_CONTROL_UPLOAD_OPTIONS;
}

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed', allow: 'POST, OPTIONS' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST, OPTIONS', ...CORS },
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
      const motionControlUploadOptions = getMotionControlUploadOptions(formData);
      if (motionControlUploadOptions) {
        const result = await uploadFileToKie(file, {
          apiKey: env.KIE_AI_API_KEY,
          ...motionControlUploadOptions,
        });
        return new Response(JSON.stringify({
          uploadRef: await createUploadReference({
            ...result,
            mediaType: getUploadReferenceMediaType(file),
          }, env.KIE_AI_API_KEY),
        }), {
          headers: { 'Content-Type': 'application/json', ...CORS },
        });
      }
      blob = file;
      const name = (file.name || '').toLowerCase();
      const type = (file.type || '').toLowerCase();
      if (name.endsWith('.jpg') || name.endsWith('.jpeg') || type.includes('jpeg') || type.includes('jpg')) ext = 'jpg';
      else if (name.endsWith('.webp') || type.includes('webp')) ext = 'webp';
      else if (name.endsWith('.mp4') || type.includes('video/mp4')) ext = 'mp4';
      else if (name.endsWith('.mp3') || type.includes('mpeg')) ext = 'mp3';
      else if (name.endsWith('.wav') || type.includes('wav')) ext = 'wav';
      else if (name.endsWith('.m4a') || type.includes('audio/mp4') || type.includes('x-m4a')) ext = 'm4a';
      else if (name.endsWith('.ogg') || type.includes('ogg')) ext = 'ogg';
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
    const msg = e instanceof Error ? e.message : String(e);
    const status = Number.isFinite(e?.status) ? e.status : 500;
    const hint = msg.includes('MY_BUCKET') || msg.includes('undefined')
      ? 'Bind R2 bucket (MY_BUCKET) in Cloudflare Pages → Functions → R2 bucket bindings'
      : undefined;
    return new Response(JSON.stringify({
      error: msg,
      ...(hint && { hint }),
    }), {
      status,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
}
