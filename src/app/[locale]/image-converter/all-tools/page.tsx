import { getUtilityParentPath } from '@/lib/utility-seo-routes'
import { permanentRedirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  return locales.map((locale) => ({ locale }))
}

export default async function AllToolsPage({ params }: PageProps) {
  const { locale = 'en' } = await params
  permanentRedirect(getUtilityParentPath(locale, 'image-converter'))
}
