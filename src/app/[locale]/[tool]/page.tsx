import { redirect, notFound } from 'next/navigation'

// 支持的所有语言列表（仅用于非法 locale 校验；本页不再生成 locale×工具 的静态路径）
const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

interface PageProps {
  params: Promise<{
    locale: string
    tool: string
  }>
}

export const dynamic = 'force-static'
export const dynamicParams = false

/**
 * 仅生成 /api/* 占位路径，供 next dev 下避免误匹配；真实工具页由 `[locale]/<tool>/page.tsx` 等专用路由提供。
 * 切勿再为 image-compressor / emoji-copy-and-paste 等与专用路由相同的 URL 生成参数，否则静态导出会产出
 * 重复的 out/<locale>/<tool>.html，后写入的 notFound 页会覆盖正常落地页（线上 404）。
 */
const API_TOOLS = [
  'flux-dev',
  'flux-kontext',
  'upload',
  'image-to-image',
  'generate-alt',
  'download-image',
  'save-image-to-r2',
  'qwen-image-edit',
] as const

export async function generateStaticParams(): Promise<Array<{ locale: string; tool: string }>> {
  return API_TOOLS.map((tool) => ({ locale: 'api', tool }))
}

export default async function ToolPage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const tool = resolvedParams.tool

  if (!tool) {
    redirect('/')
    return null
  }

  if (locale === 'api') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold text-slate-800 mb-2">API</h1>
          <p className="text-slate-600 mb-4">
            API 由 Cloudflare Pages Functions 提供，<code className="text-sm bg-slate-200 px-1 rounded">next dev</code> 下不可用。
          </p>
          <p className="text-sm text-slate-500">
            本地测试：<code className="bg-slate-200 px-1 rounded">npm run build</code> 后运行{' '}
            <code className="bg-slate-200 px-1 rounded">npx wrangler pages dev out</code>
          </p>
        </div>
      </div>
    )
  }

  if (!SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number])) {
    notFound()
    return null
  }

  notFound()
  return null
}
