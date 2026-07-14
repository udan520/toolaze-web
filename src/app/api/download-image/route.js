export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { onRequest as downloadImage } from '../../../../functions/api/download-image.js'

function runDownloadImage(request) {
  return downloadImage({ request, env: process.env })
}

export async function OPTIONS(request) {
  return runDownloadImage(request)
}

export async function GET(request) {
  return runDownloadImage(request)
}
