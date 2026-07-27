import { onRequest } from '../../../../functions/api/ai-video-generator.js'
import { isLocalhost } from '../_shared/local-dev-auth.js'
import { proxyToPagesFunctions } from '../_shared/backend-proxy.js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function run(request) {
  const url = new URL(request.url)
  if (!isLocalhost(url.hostname)) {
    return proxyToPagesFunctions(request, '/api/ai-video-generator')
  }

  return onRequest({ request, env: process.env })
}

export async function OPTIONS(request) {
  return run(request)
}

export async function POST(request) {
  return run(request)
}
