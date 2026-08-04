import { proxyToPagesFunctions } from '../../_shared/backend-proxy.js'

function proxy(request) {
  return proxyToPagesFunctions(request, '/api/media-library/assets')
}

export async function OPTIONS(request) {
  return proxy(request)
}

export async function GET(request) {
  return proxy(request)
}
