export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { createHash, createHmac } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { proxyToPagesFunctions } from '../_shared/backend-proxy.js'

function proxy(request) {
  return proxyToPagesFunctions(request, '/api/upload')
}

const R2_ENV_KEYS = [
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_ENDPOINT_URL',
  'R2_BUCKET',
  'R2_PUBLIC_BASE_URL',
]

function isLocalhost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '[::1]'
}

async function readLocalEnvFallback() {
  try {
    const text = await readFile('.env.local', 'utf8')
    return Object.fromEntries(
      R2_ENV_KEYS
        .map((key) => {
          const match = text.match(new RegExp(`^(?:export\\s+)?${key}=[\\"']?([^\\"'\\n]+)[\\"']?`, 'm'))
          return [key, match?.[1]?.trim() || '']
        })
        .filter(([, value]) => value)
    )
  } catch {
    return {}
  }
}

async function getR2Config() {
  const fallback = await readLocalEnvFallback()
  return {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || fallback.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || fallback.R2_SECRET_ACCESS_KEY || '',
    endpointUrl: (process.env.R2_ENDPOINT_URL || fallback.R2_ENDPOINT_URL || '').replace(/\/+$/, ''),
    bucket: process.env.R2_BUCKET || fallback.R2_BUCKET || 'toolaze',
    publicBaseUrl: (process.env.R2_PUBLIC_BASE_URL || fallback.R2_PUBLIC_BASE_URL || '').replace(/\/+$/, ''),
  }
}

function sha256Hex(value) {
  return createHash('sha256').update(value).digest('hex')
}

function hmac(key, value, encoding) {
  return createHmac('sha256', key).update(value).digest(encoding)
}

function getSigningKey(secretAccessKey, dateStamp) {
  const dateKey = hmac(`AWS4${secretAccessKey}`, dateStamp)
  const regionKey = hmac(dateKey, 'auto')
  const serviceKey = hmac(regionKey, 's3')
  return hmac(serviceKey, 'aws4_request')
}

function getExtension(file) {
  const type = file?.type || ''
  const name = file?.name || ''
  if (type.includes('jpeg') || type.includes('jpg') || /\.jpe?g$/i.test(name)) return 'jpg'
  if (type.includes('webp') || /\.webp$/i.test(name)) return 'webp'
  return 'png'
}

function json(body, status = 200) {
  return Response.json(body, { status })
}

async function uploadToR2(file, config) {
  if (!config.accessKeyId || !config.secretAccessKey || !config.endpointUrl || !config.publicBaseUrl) {
    throw new Error('R2 upload is not configured for local development.')
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  const ext = getExtension(file)
  const key = `uploads/${crypto.randomUUID().replace(/-/g, '')}.${ext}`
  const endpoint = new URL(config.endpointUrl)
  const objectPath = `/${config.bucket}/${key}`
  const uploadUrl = `${endpoint.origin}${objectPath}`
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dateStamp = amzDate.slice(0, 8)
  const payloadHash = sha256Hex(bytes)
  const contentType = file.type || 'image/png'
  const canonicalHeaders = [
    `host:${endpoint.host}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${amzDate}`,
  ].join('\n') + '\n'
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date'
  const canonicalRequest = [
    'PUT',
    objectPath,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n')
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join('\n')
  const signingKey = getSigningKey(config.secretAccessKey, dateStamp)
  const signature = hmac(signingKey, stringToSign, 'hex')
  const authorization = [
    `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}`,
    `SignedHeaders=${signedHeaders}`,
    `Signature=${signature}`,
  ].join(', ')

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      Authorization: authorization,
      'Content-Type': contentType,
      'Content-Length': String(bytes.length),
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amzDate,
    },
    body: bytes,
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `R2 upload failed with status ${response.status}`)
  }

  return {
    key,
    url: `${config.publicBaseUrl}/${key}`,
  }
}

export async function OPTIONS(request) {
  return proxy(request)
}

export async function POST(request) {
  const url = new URL(request.url)
  if (isLocalhost(url.hostname)) {
    try {
      const formData = await request.formData()
      const file = formData.get('image') || formData.get('file')
      if (!file || !(file instanceof Blob)) {
        return json({ error: 'No file in form (use field: image or file)' }, 400)
      }

      const result = await uploadToR2(file, await getR2Config())
      return json(result)
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : 'Local upload failed' }, 500)
    }
  }

  return proxy(request)
}
