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

export default async function Kling3LocalePage({ params }: PageProps) {
  await params
  // 英语无 /en 前缀，重定向到 /model/kling-3
  redirect('/model/kling-3')
}
