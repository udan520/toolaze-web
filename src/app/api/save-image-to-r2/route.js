export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { proxyToPagesFunctions } from '../_shared/backend-proxy.js'

function proxy(request) {
  return proxyToPagesFunctions(request, '/api/save-image-to-r2')
}

export async function OPTIONS(request) {
  return proxy(request)
}

export async function POST(request) {
  return proxy(request)
}
