import { proxyToPagesFunctions } from '../../_shared/backend-proxy.js'

async function getAuthPath(paramsPromise) {
  const params = await paramsPromise
  const path = Array.isArray(params?.path) ? params.path.join('/') : ''
  return `/api/auth/${path}`
}

export async function GET(request, { params }) {
  return proxyToPagesFunctions(request, await getAuthPath(params))
}

export async function POST(request, { params }) {
  return proxyToPagesFunctions(request, await getAuthPath(params))
}
