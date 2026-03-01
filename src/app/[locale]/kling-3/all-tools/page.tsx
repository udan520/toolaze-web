import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export async function generateStaticParams() {
  const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  return locales.map((locale) => ({ locale }))
}

export default async function Kling3AllToolsLocalePage({ params }: PageProps) {
  await params
  // 英语无 /en 前缀，重定向到 /kling-3/all-tools
  redirect('/kling-3/all-tools')
}
