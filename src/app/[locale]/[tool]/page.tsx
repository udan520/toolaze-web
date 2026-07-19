import { redirect, notFound } from 'next/navigation'
import { ENGLISH_ONLY_ROOT_ROUTES, isEnglishOnlyRootRoute } from '@/lib/localized-route-fallbacks'

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

export async function generateStaticParams(): Promise<Array<{ locale: string; tool: string }>> {
  // output: 'export' 要求动态路由至少返回一个静态参数；真实多语言工具页由显式路由负责。
  return [
    { locale: 'en', tool: 'not-found' },
    ...SUPPORTED_LOCALES.flatMap((locale) =>
      ENGLISH_ONLY_ROOT_ROUTES.map((tool) => ({ locale, tool }))
    ),
  ]
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

  if (isEnglishOnlyRootRoute(tool)) {
    redirect(`/${tool}`)
    return null
  }

  notFound()
  return null
}
