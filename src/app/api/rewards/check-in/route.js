import { proxyToPagesFunctions } from '../../_shared/backend-proxy.js'

function proxy(request) {
  return proxyToPagesFunctions(request, '/api/rewards/check-in')
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
