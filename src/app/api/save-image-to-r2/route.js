import { onRequest } from '../../../../functions/api/save-image-to-r2.js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function run(request) {
  return onRequest({ request, env: process.env })
}

export async function OPTIONS(request) {
  return run(request)
}

export async function POST(request) {
  return run(request)
}
