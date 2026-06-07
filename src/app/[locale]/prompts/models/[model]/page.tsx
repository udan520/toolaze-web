import type { Metadata } from 'next'
import PromptLandingPage, { getPromptLandingUrl } from '@/app/prompts/_components/PromptLandingPage'
import { promptLandingConfigs } from '@/app/prompts/_components/promptLandingConfigs'
import { getPromptGalleryCopy, getPromptIndexTranslations, getPromptLandingTranslation } from '@/app/prompts/_components/promptTranslations'
import { SITE_LOCALES } from '@/lib/site-language-switch'
import { notFound, redirect } from 'next/navigation'

const MODEL_CONFIG_KEYS = ['seedance-2-0', 'kling', 'gpt-image-2', 'nano-banana'] as const

type PageProps = {
  params: Promise<{ locale: string; model: string }>
}

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return SITE_LOCALES
    .filter((locale) => locale.code !== 'en')
    .flatMap((locale) => MODEL_CONFIG_KEYS.map((model) => ({ locale: locale.code, model })))
}

function getLocalizedConfig(model: string, locale: string) {
  if (!MODEL_CONFIG_KEYS.includes(model as (typeof MODEL_CONFIG_KEYS)[number])) return null
  const sourceConfig = promptLandingConfigs[model]
  const translated = getPromptLandingTranslation(`models-${model}`, locale)
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
  const { locale, model } = await params
  const config = getLocalizedConfig(model, locale)
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

export default async function LocalizedPromptModelPage({ params }: PageProps) {
  const { locale, model } = await params
  const config = getLocalizedConfig(model, locale)

  if (!config) notFound()
  if (locale === 'en') redirect(`/prompts/models/${model}`)

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
