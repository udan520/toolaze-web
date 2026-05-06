import { NextRequest, NextResponse } from 'next/server'

const KIE_AI_BASE = 'https://api.kie.ai/api/v1/jobs'

function mapOutputFormat(format: FormDataEntryValue | null): string | undefined {
  if (!format) return undefined
  const f = String(format).toLowerCase()
  if (f === 'auto') return undefined
  if (f === 'jpg' || f === 'jpeg') return 'jpg'
  if (f === 'png') return 'png'
  return 'png'
}

function resolveModel(model: FormDataEntryValue | null): 'nano-banana-pro' | 'gpt-image-2' {
  const m = String(model || '').trim().toLowerCase()
  if (m === 'gpt-image-2') return 'gpt-image-2'
  return 'nano-banana-pro'
}

function getMaxImagesForModel(model: 'nano-banana-pro' | 'gpt-image-2'): number {
  return model === 'gpt-image-2' ? 16 : 8
}

function resolveProviderModelId(model: 'nano-banana-pro' | 'gpt-image-2'): string {
  if (model === 'gpt-image-2') {
    return process.env.KIE_GPT_IMAGE_2_MODEL || 'gpt-image-2'
  }
  return process.env.KIE_NANO_BANANA_MODEL || 'nano-banana-pro'
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const prompt = String(formData.get('prompt') || '').trim()
    const aspectRatio = String(formData.get('aspectRatio') || '1:1')
    const resolution = String(formData.get('resolution') || '1K')
    const outputFormat = formData.get('outputFormat')
    const isImageToImage = String(formData.get('isImageToImage')) === 'true'
    const model = resolveModel(formData.get('model'))
    const maxImages = getMaxImagesForModel(model)
    const providerModelId = resolveProviderModelId(model)

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    let imageUrls: string[] = []
    const imageUrl = String(formData.get('imageUrl') || '').trim()
    const imageUrlsJson = formData.get('imageUrls')

    if (imageUrlsJson) {
      try {
        const arr = JSON.parse(String(imageUrlsJson))
        imageUrls = Array.isArray(arr) ? arr : []
      } catch {
        imageUrls = []
      }
    }
    if (imageUrl && imageUrls.length === 0) {
      imageUrls = [imageUrl]
    }

    if (isImageToImage && imageUrls.length === 0) {
      return NextResponse.json(
        { error: 'Image-to-image requires uploaded image URLs.' },
        { status: 400 }
      )
    }
    if (isImageToImage && imageUrls.length > maxImages) {
      return NextResponse.json({ error: `Maximum ${maxImages} images allowed` }, { status: 400 })
    }

    const apiKey = process.env.KIE_AI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'KIE_AI_API_KEY is not configured' }, { status: 500 })
    }

    const input: Record<string, unknown> = {
      prompt,
      aspect_ratio: aspectRatio,
      resolution: resolution === '2K' || resolution === '4K' ? resolution : '1K',
    }

    const mappedFormat = mapOutputFormat(outputFormat)
    if (mappedFormat) input.output_format = mappedFormat

    if (isImageToImage && imageUrls.length > 0) {
      if (model === 'gpt-image-2') {
        input.input_urls = imageUrls.slice(0, maxImages)
      } else {
        input.image_input = imageUrls.slice(0, maxImages)
      }
    }

    const response = await fetch(`${KIE_AI_BASE}/createTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: providerModelId, input }),
      cache: 'no-store',
    })

    const result = await response.json().catch(() => ({}))
    const resultObj = result as { code?: number; message?: string; msg?: string; data?: { taskId?: string } }
    if (!response.ok || (typeof resultObj.code === 'number' && resultObj.code !== 200)) {
      let message = resultObj.message || resultObj.msg || 'Failed to create task'
      if (
        model === 'gpt-image-2' &&
        /model name you specified is not supported/i.test(message)
      ) {
        message =
          'Current KIE key does not support GPT Image 2. Set KIE_GPT_IMAGE_2_MODEL in .env.local to your account-enabled model id, then restart dev server.'
      }
      const status = response.ok ? 400 : response.status
      return NextResponse.json({ error: message }, { status })
    }

    const taskId = resultObj?.data?.taskId
    if (!taskId) {
      return NextResponse.json({ error: 'Unexpected response format' }, { status: 500 })
    }

    return NextResponse.json({ taskId })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

