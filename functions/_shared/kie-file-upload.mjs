export const KIE_FILE_STREAM_UPLOAD_URL = 'https://kieai.redpandaai.co/api/file-stream-upload';

export class KieFileUploadValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'KieFileUploadValidationError';
    this.status = 400;
  }
}

const KIE_UPLOAD_FORMAT_PROFILES = {
  'kling-motion-control': {
    image: {
      mimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
      extensions: ['jpg', 'jpeg', 'png'],
      message: 'Use JPG or PNG for the Kling 2.6 Motion Control character image.',
    },
    video: {
      mimeTypes: ['video/mp4', 'video/quicktime', 'video/x-matroska'],
      extensions: ['mp4', 'mov', 'mkv'],
      message: 'Use MP4, QuickTime (.mov), or Matroska (.mkv) for the Kling 2.6 Motion Control reference video.',
    },
  },
};

function getFileExtension(file) {
  return String(file?.name || '').split('.').pop()?.trim().toLowerCase() || '';
}

function matchesFileRule(file, rule) {
  const type = String(file?.type || '').toLowerCase();
  const extension = getFileExtension(file);
  return rule.mimeTypes.includes(type) || rule.extensions.includes(extension);
}

function getMediaKind(file) {
  const type = String(file?.type || '').toLowerCase();
  const extension = getFileExtension(file);
  if (type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp'].includes(extension)) return 'image';
  if (type.startsWith('video/') || ['mp4', 'mov', 'mkv', 'webm'].includes(extension)) return 'video';
  return 'file';
}

function validateUploadFormatProfile(file, formatProfile) {
  const profile = KIE_UPLOAD_FORMAT_PROFILES[formatProfile];
  if (!profile) return;

  const mediaKind = getMediaKind(file);
  const rule = profile[mediaKind];
  if (rule && matchesFileRule(file, rule)) return;

  if (rule) {
    throw new KieFileUploadValidationError(rule.message);
  }

  throw new KieFileUploadValidationError('Use a supported JPG, PNG, MP4, QuickTime, or Matroska file for Kling 2.6 Motion Control.');
}

function getExtension(file) {
  const type = (file?.type || '').toLowerCase();
  const name = (file?.name || '').toLowerCase();
  if (type.includes('jpeg') || type.includes('jpg') || /\.jpe?g$/i.test(name)) return 'jpg';
  if (type.includes('webp') || /\.webp$/i.test(name)) return 'webp';
  if (type.includes('png') || /\.png$/i.test(name)) return 'png';
  if (type.includes('video/mp4') || /\.mp4$/i.test(name)) return 'mp4';
  if (type.includes('quicktime') || /\.mov$/i.test(name)) return 'mov';
  if (type.includes('matroska') || /\.mkv$/i.test(name)) return 'mkv';
  return 'bin';
}

function getSafeBaseName(file) {
  const rawName = String(file?.name || 'upload').replace(/\.[^.]+$/, '');
  return rawName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'upload';
}

function getProviderMessage(result, fallback) {
  return String(
    result?.message
    ?? result?.msg
    ?? result?.error
    ?? result?.data?.message
    ?? result?.data?.msg
    ?? fallback
  );
}

function hasBusinessError(result) {
  if (result?.code === undefined || result?.code === null) return false;
  return Number(result.code) !== 200;
}

export async function uploadFileToKie(file, { apiKey, uploadPath = 'toolaze/uploads', formatProfile } = {}) {
  if (!apiKey) {
    throw new Error('Motion-control media upload is not configured.');
  }
  if (!file || !(file instanceof Blob)) {
    throw new Error('No file in form (use field: file or image)');
  }
  validateUploadFormatProfile(file, formatProfile);

  const ext = getExtension(file);
  const fileName = `${getSafeBaseName(file)}-${crypto.randomUUID().replace(/-/g, '')}.${ext}`;
  const formData = new FormData();
  formData.set('file', file, fileName);
  formData.set('fileName', fileName);
  formData.set('uploadPath', uploadPath);

  const response = await fetch(KIE_FILE_STREAM_UPLOAD_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || hasBusinessError(result)) {
    throw new Error(getProviderMessage(result, `Media upload failed with status ${response.status}`));
  }

  const data = result?.data || result;
  const fileUrl = String(data?.fileUrl || data?.url || data?.downloadUrl || '').trim();
  if (!fileUrl) {
    throw new Error(getProviderMessage(result, 'Media upload did not return a usable file URL.'));
  }

  return {
    url: fileUrl,
    key: String(data?.filePath || data?.fileName || fileName),
  };
}
