import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent, hasLocaleL2JsonFile } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { redirect } from 'next/navigation'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

// 为静态导出生成所有语言版本的参数
export async function generateStaticParams() {
  const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  return locales.filter((locale) => locale !== 'en').map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const pathWithoutLocale = '/image-converter'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  
  const content = await getL2SeoContent('image-converter', locale)
  
  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Free Image Converter - Batch Convert Images Online | Toolaze',
    fallbackDescription: 'Convert images between JPG, PNG, and WebP formats. Batch convert up to 100 images. Fast, private, 100% free. No sign-up required.',
  })
}

export default async function ImageConverterPage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  
  if (locale !== 'en' && !hasLocaleL2JsonFile('image-converter', locale)) {
    redirect('/image-converter')
  }

  return <ToolL2PageContent locale={locale} tool="image-converter" />
}
