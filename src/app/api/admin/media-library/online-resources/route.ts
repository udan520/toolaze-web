import { getOnlineMediaResourcesResponse } from './handler'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function GET(request: Request) {
  return getOnlineMediaResourcesResponse(request)
}
