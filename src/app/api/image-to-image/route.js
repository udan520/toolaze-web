export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { onRequest as runLocalImageGeneration } from '../../../../functions/api/image-to-image.js'
import {
  consumeLocalDevCredits,
  getLocalDevCreditSummary,
  hasLocalDevSession,
  isLocalhost,
  refundLocalDevCredits,
  registerLocalDevCreditHold,
} from '../_shared/local-dev-auth.js'
import { calculateImageGenerationCredits } from '../_shared/generation-credits.js'
import { proxyToPagesFunctions } from '../_shared/backend-proxy.js'
import {
  getImageGenerationCreditDescription,
  getImageGenerationCreditRefundDescription,
} from '../../../../functions/_shared/generation-credit-label.mjs'
import {
  createModerationExternalId,
  moderatePromptBeforeGeneration,
} from '../../../../functions/_shared/creem-moderation.mjs'

function shouldUseLocalGeneration(request) {
  const url = new URL(request.url)
  return isLocalhost(url.hostname) && hasLocalDevSession(request)
}

function proxy(request) {
  if (shouldUseLocalGeneration(request)) {
    return runLocalGenerationWithCredits(request)
  }

  return proxyToPagesFunctions(request, '/api/image-to-image')
}

async function runLocalGenerationWithCredits(request) {
  const formData = await request.clone().formData()
  const prompt = String(formData.get('prompt') || '').trim()
  const model = String(formData.get('model') || 'nano-banana-pro')
  const resolution = String(formData.get('resolution') || '1K')
  const isImageToImage = String(formData.get('isImageToImage') || '') === 'true'
  const requiredCredits = calculateImageGenerationCredits(model, resolution)
  const creditDescription = getImageGenerationCreditDescription(model, isImageToImage)
  const creditRefundDescription = getImageGenerationCreditRefundDescription(model, isImageToImage)
  const currentCredits = getLocalDevCreditSummary()

  if (currentCredits.balance < requiredCredits) {
    return Response.json(
      {
        error: 'Insufficient credits to generate this image.',
        credits: currentCredits,
        requiredCredits,
      },
      { status: 402 },
    )
  }

  const moderation = await moderatePromptBeforeGeneration({
    prompt,
    env: process.env,
    externalId: createModerationExternalId(`local-image-${model}`),
  })
  if (!moderation.allowed) {
    return Response.json(moderation.body, { status: moderation.status })
  }

  const creditResult = consumeLocalDevCredits(requiredCredits, creditDescription)
  if (!creditResult.ok) {
    return Response.json(
      {
        error: 'Insufficient credits to generate this image.',
        credits: creditResult.credits,
        requiredCredits,
      },
      { status: 402 },
    )
  }

  let response
  let payload
  try {
    response = await runLocalImageGeneration({ request, env: process.env })
    payload = await response.json().catch(() => ({}))
  } catch (error) {
    const refundResult = refundLocalDevCredits(requiredCredits, creditRefundDescription)
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
        credits: refundResult.credits,
        requiredCredits,
      },
      { status: 500 },
    )
  }

  if (!response.ok) {
    const refundResult = refundLocalDevCredits(requiredCredits, creditRefundDescription)
    return Response.json(
      {
        ...payload,
        credits: refundResult.credits,
        requiredCredits,
      },
      { status: response.status },
    )
  }

  const taskId = payload?.taskId
  const creditHold = taskId ? registerLocalDevCreditHold(taskId, requiredCredits, {
    model,
    isImageToImage,
  }) : null

  return Response.json({
    ...payload,
    credits: creditResult.credits,
    requiredCredits,
    creditHold,
  })
}

export async function OPTIONS(request) {
  return proxy(request)
}

export async function POST(request) {
  return proxy(request)
}
