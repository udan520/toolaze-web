import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'

export const metadata: Metadata = {
  title: 'Nano Banana Pro - Free AI Image Generator (Image to Image & Text to Image) | Toolaze',
  description: 'Generate stunning images with Nano Banana Pro AI. Free AI image generator with no sign up required. Transform photos with image-to-image or create art from text prompts. No registration, no credit card needed. Fast and high-quality image generation online.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/model/nano-banana-pro',
  },
}

export default async function NanoBananaProPage() {
  // 使用英语版本（model 路径不使用多语言）
  const locale = 'en'
  const content = await getL2SeoContent('nano-banana-pro', locale)
  
  return <ToolL2PageContent locale={locale} tool="nano-banana-pro" />
}
