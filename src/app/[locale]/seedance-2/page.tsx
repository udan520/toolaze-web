import { permanentRedirect } from 'next/navigation'

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
  const { locale } = await params
  // 英语无 /en 前缀；其它语言旧入口永久归并到对应模型页。
  permanentRedirect(locale === 'en' ? '/model/seedance-2' : `/${locale}/model/seedance-2`)
}
