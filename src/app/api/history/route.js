import { proxyToPagesFunctions } from '../_shared/backend-proxy'

export async function GET(request) {
  return proxyToPagesFunctions(request, '/api/history')
}

export async function DELETE(request) {
  return proxyToPagesFunctions(request, '/api/history')
}
