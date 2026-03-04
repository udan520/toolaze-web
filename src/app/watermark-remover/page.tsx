import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Watermark Remover - Remove Watermark from Images with AI | Toolaze',
  description: 'Remove watermark from image online free. Erase watermarks from photos instantly with AI. JPG, PNG, WebP support. No sign-up required.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/watermark-remover',
  },
}

export default async function WatermarkRemoverPage() {
  const locale = 'en'
  return <ToolL2PageContent locale={locale} tool="watermark-remover" />
}
