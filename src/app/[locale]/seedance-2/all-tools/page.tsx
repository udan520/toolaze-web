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

export default async function Seedance2AllToolsLocalePage({ params }: PageProps) {
  const { locale } = await params
  // Seedance 2.0 只保留模型页；旧 all-tools 子路径统一回模型页。
  permanentRedirect(locale === 'en' ? '/model/seedance-2' : `/${locale}/model/seedance-2`)
}
