import { proxyToPagesFunctions } from '../../_shared/backend-proxy.js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function OPTIONS(request) {
  return proxyToPagesFunctions(request, '/api/billing/creem-webhook')
}

export async function POST(request) {
  return proxyToPagesFunctions(request, '/api/billing/creem-webhook')
}
