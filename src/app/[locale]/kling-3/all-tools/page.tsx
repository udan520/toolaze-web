import { permanentRedirect } from 'next/navigation'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export async function generateStaticParams() {
  const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  return locales.filter((locale) => locale !== 'en').map((locale) => ({ locale }))
}

export default async function Kling3AllToolsLocalePage({ params }: PageProps) {
  await params
  permanentRedirect('/model/kling-3')
}
