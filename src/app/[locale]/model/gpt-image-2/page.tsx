import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'en-US' },
    { locale: 'de' },
    { locale: 'ja' },
    { locale: 'es' },
    { locale: 'zh-TW' },
    { locale: 'zh-tw' },
    { locale: 'zh' },
    { locale: 'zh-CN' },
    { locale: 'zh-cn' },
    { locale: 'zh-HK' },
    { locale: 'zh-hk' },
    { locale: 'pt' },
    { locale: 'fr' },
    { locale: 'ko' },
    { locale: 'it' },
  ]
}

export default async function LocalizedGptImage2Page({ params }: PageProps) {
  await params
  redirect('/model/gpt-image-2')
}

