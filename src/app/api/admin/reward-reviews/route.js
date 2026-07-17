import { blockNonLocalAdminRequest } from '../../_shared/admin-route-guard.js'
import { proxyToPagesFunctions } from '../../_shared/backend-proxy.js'

function proxy(request) {
  const blockedResponse = blockNonLocalAdminRequest(request)
  if (blockedResponse) return blockedResponse

  return proxyToPagesFunctions(request, '/api/admin/reward-reviews')
}

export async function OPTIONS(request) {
  return proxy(request)
}

export async function GET(request) {
  return proxy(request)
}

export async function POST(request) {
  return proxy(request)
}
