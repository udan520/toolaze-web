import { onRequest } from '../../../../functions/api/image-to-image.js'

export const runtime = 'nodejs'
export const dynamic = 'force-static'

function run(request) {
  return onRequest({ request, env: process.env })
}

export async function OPTIONS(request) {
  return run(request)
}

export async function POST(request) {
  return run(request)
}
