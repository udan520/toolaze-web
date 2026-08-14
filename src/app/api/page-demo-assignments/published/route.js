import { proxyToPagesFunctions } from '../../_shared/backend-proxy.js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

function proxy(request) {
  return proxyToPagesFunctions(request, '/api/page-demo-assignments/published')
}

export async function OPTIONS(request) {
  return proxy(request)
}

export async function GET(request) {
  return proxy(request)
}
