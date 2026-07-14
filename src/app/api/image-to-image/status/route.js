export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { onRequest as runLocalImageGenerationStatus } from '../../../../../functions/api/image-to-image/status.js'
import {
  hasLocalDevSession,
  isLocalhost,
  refundLocalDevCreditHold,
} from '../../_shared/local-dev-auth.js'
import { proxyToPagesFunctions } from '../../_shared/backend-proxy.js'

function shouldUseLocalGenerationStatus(request) {
  const url = new URL(request.url)
  return isLocalhost(url.hostname) && hasLocalDevSession(request)
}

function proxy(request) {
  if (shouldUseLocalGenerationStatus(request)) {
    return runLocalGenerationStatusWithCreditRefund(request)
  }

  return proxyToPagesFunctions(request, '/api/image-to-image/status')
}

async function runLocalGenerationStatusWithCreditRefund(request) {
  const body = await request.clone().json().catch(() => ({}))
  const response = await runLocalImageGenerationStatus({ request, env: process.env })
  const payload = await response.json().catch(() => ({}))

  if (
    response.ok &&
    payload?.status === 'FAILED' &&
    body?.creditHold?.provider === 'local-dev' &&
    body.creditHold.taskId === body.taskId
  ) {
    const refundResult = refundLocalDevCreditHold(body.taskId)
    return Response.json({
      ...payload,
      credits: refundResult.credits,
      refundedCredits: refundResult.refunded,
    })
  }

  return Response.json(payload, { status: response.status })
}

export async function OPTIONS(request) {
  return proxy(request)
}

export async function POST(request) {
  return proxy(request)
}
