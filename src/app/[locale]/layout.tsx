import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { generateHreflangAlternates } from '@/lib/hreflang'

interface LayoutProps {
  children: ReactNode
  params: Promise<{
    locale: string
  }>
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const hreflang = generateHreflangAlternates(locale)
  
  return {
    metadataBase: new URL('https://toolaze.com'),
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  
  return <>{children}</>
}
