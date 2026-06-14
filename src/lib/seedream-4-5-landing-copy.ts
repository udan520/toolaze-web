import type { Metadata } from 'next'
import en from '@/data/seedream-4-5-landing-copy/en.json'
import de from '@/data/seedream-4-5-landing-copy/de.json'
import ja from '@/data/seedream-4-5-landing-copy/ja.json'
import es from '@/data/seedream-4-5-landing-copy/es.json'
import zhTW from '@/data/seedream-4-5-landing-copy/zh-TW.json'
import pt from '@/data/seedream-4-5-landing-copy/pt.json'
import fr from '@/data/seedream-4-5-landing-copy/fr.json'
import ko from '@/data/seedream-4-5-landing-copy/ko.json'
import it from '@/data/seedream-4-5-landing-copy/it.json'

export const SEEDREAM_4_5_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

export type Seedream45Locale = (typeof SEEDREAM_4_5_LOCALES)[number]

type FeatureItem = {
  slot: string
  title: string
  label: string
  paragraphs: string[]
}

type GalleryItem = {
  slot: string
  title: string
  text: string
}

type ComparisonRow = {
  capability: string
  seedream: string
  nano: string
  gpt: string
  midjourney: string
}

type PromptExample = {
  slot: string
  title: string
  prompt: string
}

type YoutubeExample = {
  title: string
  creator: string
  href: string
  videoId: string
  text: string
}

type RelatedLink = {
  title: string
  href: string
  text: string
}

type FaqItem = {
  q: string
  a: string
}

export type Seedream45LandingCopy = {
  metadata: {
    title: string
    description: string
    openGraphDescription: string
    twitterDescription: string
  }
  breadcrumbs: {
    home: string
    model: string
    current: string
  }
  schema: {
    pageName: string
    appName: string
    howToName: string
  }
  hero: {
    modelName: string
    suffix: string
    description: string
  }
  whatIs: {
    title: string
    paragraphs: string[]
  }
  features: {
    title: string
    text: string
    items: FeatureItem[]
  }
  gallery: {
    title: string
    text: string
    examples: GalleryItem[]
  }
  audiences: {
    title: string
    items: string[]
  }
  comparison: {
    title: string
    text: string
    capabilityHeader: string
    rows: ComparisonRow[]
  }
  howTo: {
    title: string
    steps: string[]
  }
  prompts: {
    title: string
    text: string
    copyButton: string
    copiedButton: string
    examples: PromptExample[]
  }
  youtube: {
    title: string
    text: string
    watch: string
    examples: YoutubeExample[]
  }
  related: {
    title: string
    tryNow: string
    links: RelatedLink[]
  }
  faq: {
    title: string
    items: FaqItem[]
  }
  cta: {
    title: string
    text: string
    button: string
    label: string
  }
}

const copies: Record<Seedream45Locale, Seedream45LandingCopy> = {
  en,
  de,
  ja,
  es,
  'zh-TW': zhTW,
  pt,
  fr,
  ko,
  it,
}

function normalizeLocale(locale: string): Seedream45Locale {
  if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') return 'zh-TW'
  return SEEDREAM_4_5_LOCALES.includes(locale as Seedream45Locale) ? (locale as Seedream45Locale) : 'en'
}

export function getSeedream45LandingCopy(locale: string): Seedream45LandingCopy {
  return copies[normalizeLocale(locale)]
}

export function getSeedream45PageMetadata(
  locale: string,
  canonicalUrl = 'https://toolaze.com/model/seedream-4-5',
): Metadata {
  const copy = getSeedream45LandingCopy(locale)

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: copy.metadata.title,
      description: copy.metadata.openGraphDescription,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.metadata.title,
      description: copy.metadata.twitterDescription,
    },
  }
}
