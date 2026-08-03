import { onRequest } from '../../../../functions/api/ai-video-generator.js'
import { isLocalRequest } from '../_shared/local-dev-auth.js'
import { proxyToPagesFunctions } from '../_shared/backend-proxy.js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function run(request) {
  if (!isLocalRequest(request)) {
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
