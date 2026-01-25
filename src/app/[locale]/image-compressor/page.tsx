import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

// 为静态导出生成所有语言版本的参数
export async function generateStaticParams() {
  const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const pathWithoutLocale = '/image-compressor'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  
  const content = await getL2SeoContent('image-compressor', locale)
  
  return {
    title: content?.metadata?.title || 'Free Image Compressor - Batch Compress Images Online | Toolaze',
    description: content?.metadata?.description || 'Batch compress up to 100 images at once. Set exact target size. Fast, private, 100% free. No sign-up required.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function ImageCompressorPage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  
  // 检查内容是否存在，如果不存在且不是英语，重定向到英语版本
  const content = await getL2SeoContent('image-compressor', locale)
  if (!content && locale !== 'en') {
    // 重定向到英语版本的 image-compressor L2 页面
    redirect('/image-compressor')
  }
  
  return <ToolL2PageContent locale={locale} tool="image-compressor" />
}
