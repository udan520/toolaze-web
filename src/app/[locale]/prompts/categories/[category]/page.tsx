import type { Metadata } from 'next'
import PromptLandingPage, { getPromptLandingUrl } from '@/app/prompts/_components/PromptLandingPage'
import { promptLandingConfigs } from '@/app/prompts/_components/promptLandingConfigs'
import { getPromptGalleryCopy, getPromptIndexTranslations, getPromptLandingTranslation } from '@/app/prompts/_components/promptTranslations'
import { SITE_LOCALES } from '@/lib/site-language-switch'
import { notFound, redirect } from 'next/navigation'

const CATEGORY_CONFIG_KEYS = ['advertising', 'fashion-beauty', 'film-trailer'] as const

type PageProps = {
  params: Promise<{ locale: string; category: string }>
}

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return SITE_LOCALES
    .filter((locale) => locale.code !== 'en')
    .flatMap((locale) => CATEGORY_CONFIG_KEYS.map((category) => ({ locale: locale.code, category })))
}

function getLocalizedConfig(category: string, locale: string) {
  if (!CATEGORY_CONFIG_KEYS.includes(category as (typeof CATEGORY_CONFIG_KEYS)[number])) return null
  const sourceConfig = promptLandingConfigs[category]
  const translated = getPromptLandingTranslation(`categories-${category}`, locale)
  return translated
    ? {
        ...sourceConfig,
        ...translated,
        slug: sourceConfig.slug,
        kind: sourceConfig.kind,
        filterValue: sourceConfig.filterValue,
        defaultModel: sourceConfig.defaultModel,
        defaultCategory: sourceConfig.defaultCategory,
      }
    : null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, category } = await params
  const config = getLocalizedConfig(category, locale)
  if (!config) return {}
  const pageUrl = getPromptLandingUrl(config, locale)

  return {
    title: config.title,
    description: config.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: config.title.replace(' | Toolaze', ''),
      description: config.description,
      url: pageUrl,
      siteName: 'Toolaze',
      type: 'website',
    },
  }
}

export default async function LocalizedPromptCategoryPage({ params }: PageProps) {
  const { locale, category } = await params
  const config = getLocalizedConfig(category, locale)

  if (!config) notFound()
  if (locale === 'en') redirect(`/prompts/categories/${category}`)

  const copy = getPromptIndexTranslations(locale)
  return (
    <PromptLandingPage
      config={config}
      locale={locale}
      uiCopy={copy.landingUi}
      galleryCopy={getPromptGalleryCopy(locale)}
    />
  )
}
