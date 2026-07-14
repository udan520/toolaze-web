import { proxyToPagesFunctions } from '../_shared/backend-proxy'

export async function GET(request) {
  return proxyToPagesFunctions(request, '/api/credits')
}
