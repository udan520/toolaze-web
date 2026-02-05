import { NextRequest, NextResponse } from 'next/server'

const KIE_AI_BASE = 'https://api.kie.ai/api/v1/jobs'

// 每日全站生图次数上限（按自然日，进程内计数；多实例/持久化请用 KV 或 Redis，见 docs/DAILY_LIMIT.md）
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
  if (f === 'auto') return undefined // Auto: 不传 output_format，让 API 使用默认值
  if (f === 'jpg' || f === 'jpeg') return 'jpg'
  if (f === 'png') return 'png'
  return 'png' // 默认值
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File | null
    const imageUrl = (formData.get('imageUrl') as string)?.trim() || ''
    const prompt = (formData.get('prompt') as string)?.trim() || ''
    const aspectRatio = (formData.get('aspectRatio') as string) || '1:1'
    const outputFormat = (formData.get('outputFormat') as string) || 'Auto'
    const resolution = (formData.get('resolution') as string) || '1K'
    const isImageToImage = formData.get('isImageToImage') === 'true'

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }
    if (isImageToImage && !imageFile && !imageUrl) {
      return NextResponse.json({ error: 'Image file or imageUrl is required for image-to-image' }, { status: 400 })
    }

    const apiKey = getApiKey()
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured (KIE_AI_API_KEY)' }, { status: 500 })
    }

    if (!checkAndIncrementDaily()) {
      return NextResponse.json(
        { error: '今日全站生图次数已达上限，请明天再试。' },
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
    
    // output_format 是 Optional，只有非 "Auto" 时才传
    const mappedFormat = mapOutputFormat(outputFormat)
    if (mappedFormat) {
      input.output_format = mappedFormat
    }

    // Kie AI 的 image_input 只接受公网 URL，不支持 base64 data URL
    if (isImageToImage) {
      if (imageUrl) {
        input.image_input = [imageUrl]
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
