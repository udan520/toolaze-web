import { proxyToPagesFunctions } from '../../_shared/backend-proxy.js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function proxy(request) {
  return proxyToPagesFunctions(request, '/api/rewards/x-post')
}

export async function OPTIONS(request) {
  return proxy(request)
}

export async function POST(request) {
  return proxy(request)
}
