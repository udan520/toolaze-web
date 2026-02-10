import { NextRequest, NextResponse } from 'next/server'

const KIE_AI_BASE = 'https://api.kie.ai/api/v1/jobs'

// 本地开发用：与 functions/api/image-to-image.js 逻辑一致
// 注意：静态导出构建时会报错，但开发模式可以运行
// 生产环境使用 Cloudflare Pages Functions (functions/api/image-to-image.js)

// 静态导出模式配置
export const dynamic = 'force-static'

function getDailyCap(): number | undefined {
  const cap = process.env.NANO_BANANA_DAILY_CAP
  if (cap === undefined || cap === '') return undefined
  const n = parseInt(cap, 10)
  return Number.isFinite(n) && n > 0 ? n : undefined
}

const dailyCount = { date: '', count: 0 }

function checkAndIncrementDaily(): boolean {
  const cap = getDailyCap()
  if (cap === undefined) return true
  const today = new Date().toISOString().slice(0, 10)
  if (dailyCount.date !== today) {
    dailyCount.date = today
    dailyCount.count = 0
  }
  if (dailyCount.count >= cap) return false
  dailyCount.count += 1
  return true
}

function getApiKey(): string | undefined {
  return process.env.KIE_AI_API_KEY ?? process.env.DASHSCOPE_API_KEY
}

function mapOutputFormat(format: string): string | undefined {
  const f = format?.toLowerCase()
  if (f === 'auto') return undefined
  if (f === 'jpg' || f === 'jpeg') return 'jpg'
  if (f === 'png') return 'png'
  return 'png'
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File | null
    const imageUrl = (formData.get('imageUrl') as string)?.trim() || ''
    const imageUrlsJson = formData.get('imageUrls') as string | null
    const prompt = (formData.get('prompt') as string)?.trim() || ''
    const aspectRatio = (formData.get('aspectRatio') as string) || '1:1'
    const outputFormat = (formData.get('outputFormat') as string) || 'Auto'
    const resolution = (formData.get('resolution') as string) || '1K'
    const isImageToImage = formData.get('isImageToImage') === 'true'

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }
    
    let imageUrls: string[] = []
    if (imageUrlsJson) {
      try {
        imageUrls = JSON.parse(imageUrlsJson)
        if (!Array.isArray(imageUrls)) {
          imageUrls = []
        }
      } catch {
        imageUrls = []
      }
    }
    if (imageUrl && imageUrls.length === 0) {
      imageUrls = [imageUrl]
    }
    
    if (isImageToImage && !imageFile && imageUrls.length === 0) {
      return NextResponse.json({ error: 'At least one image URL is required for image-to-image' }, { status: 400 })
    }
    
    if (isImageToImage && imageUrls.length > 8) {
      return NextResponse.json({ error: 'Maximum 8 images allowed' }, { status: 400 })
    }

    const apiKey = getApiKey()
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured (KIE_AI_API_KEY)' }, { status: 500 })
    }

    if (!checkAndIncrementDaily()) {
      return NextResponse.json(
        { error: 'Daily generation limit reached. Please try again tomorrow.' },
        { status: 429 }
      )
    }

    const input: {
      prompt: string
      image_input?: string[]
      aspect_ratio: string
      resolution: string
      output_format?: string
    } = {
      prompt,
      aspect_ratio: aspectRatio,
      resolution: resolution === '2K' || resolution === '4K' ? resolution : '1K',
    }
    
    const mappedFormat = mapOutputFormat(outputFormat)
    if (mappedFormat) {
      input.output_format = mappedFormat
    }

    if (isImageToImage) {
      if (imageUrls.length > 0) {
        input.image_input = imageUrls.slice(0, 8)
      } else if (imageFile && imageFile.size > 0) {
        return NextResponse.json(
          {
            error:
              'Image-to-image requires a public image URL. Please set NEXT_PUBLIC_IMAGE_UPLOAD_URL in .env.local (e.g. your Cloudflare Worker upload URL) so the image is uploaded to R2 first.',
          },
          { status: 400 }
        )
      }
    }

    const response = await fetch(`${KIE_AI_BASE}/createTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'nano-banana-pro',
        input,
      }),
    })

    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      const msg = result?.message ?? result?.msg ?? await response.text()
      console.error('Kie AI createTask error:', response.status, msg)
      return NextResponse.json({ error: msg || 'Failed to create task' }, { status: response.status })
    }

    if (result?.code === 200 && result?.data?.taskId) {
      return NextResponse.json({ taskId: result.data.taskId })
    }

    return NextResponse.json({
      error: result?.message ?? result?.msg ?? 'Unexpected response format',
    }, { status: 500 })
  } catch (error: any) {
    console.error('Image generation error:', error)
    return NextResponse.json({ error: error?.message ?? 'Internal server error' }, { status: 500 })
  }
}
