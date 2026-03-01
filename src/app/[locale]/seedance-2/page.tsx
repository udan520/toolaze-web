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

export default async function Seedance2LocalePage({ params }: PageProps) {
  await params
  // 英语无 /en 前缀，重定向到 /seedance-2
  redirect('/seedance-2')
}
