import { proxyToPagesFunctions } from '../../_shared/backend-proxy.js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function OPTIONS(request) {
  return proxyToPagesFunctions(request, '/api/billing/confirm')
}

export async function POST(request) {
  return proxyToPagesFunctions(request, '/api/billing/confirm')
}
