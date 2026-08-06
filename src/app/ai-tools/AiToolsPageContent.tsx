import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import { getAiToolsPageCopy } from './copy'
import AiToolsGrid from './AiToolsGrid'

const AI_TOOLS_VIDEO_SCHEMA_META: Record<string, { duration: string; uploadDate: string }> = {
  'https://assets.toolaze.com/model-assets/ai-dance-generator/ai-dance-demo.mp4': {
    duration: 'PT8.042S',
    uploadDate: '2026-07-21T07:36:34.000Z',
  },
  'https://assets.toolaze.com/uploads/83a8c5b91a4945beb66275c38a731dbf.png': {
    duration: 'PT3.042S',
    uploadDate: '2026-07-24T00:27:57.000Z',
  },
  'https://assets.toolaze.com/landing-pages/talking-avatar-creator/demo.mp4': {
    duration: 'PT14.48S',
    uploadDate: '2026-07-31T07:08:59.000Z',
  },
  'https://assets.toolaze.com/landing-pages/ai-asmr-video-generator/demo.mp4': {
    duration: 'PT8.021S',
    uploadDate: '2026-07-29T04:40:40.000Z',
  },
  'https://assets.toolaze.com/model-assets/kling-2-6-pro-motion-control/motion-control-demo.mp4': {
    duration: 'PT7.9S',
    uploadDate: '2026-08-03T04:44:32.000Z',
  },
  'https://assets.toolaze.com/uploads/c07d1db481dd4e9b8e190ebb39611f08.png': {
    duration: 'PT5.01S',
    uploadDate: '2026-08-02T02:59:44.000Z',
  },
}

function toAbsoluteToolazeUrl(value: string): string {
  return value.startsWith('http://') || value.startsWith('https://')
    ? value
    : `https://toolaze.com${value.startsWith('/') ? value : `/${value}`}`
}

export function AiToolsPageContent({
  locale = 'en',
  initialTranslations,
  pageCopy,
}: {
  locale?: string
  initialTranslations?: any
  pageCopy?: ReturnType<typeof getAiToolsPageCopy>
}) {
  const copy = pageCopy || getAiToolsPageCopy(locale)
  const videoObjects = copy.cards.flatMap((card) => {
    if (!card.video || !card.image) return []
    const meta = AI_TOOLS_VIDEO_SCHEMA_META[card.video]
    if (!meta) return []
    return [{
      '@type': 'VideoObject',
      name: card.title,
      description: card.description,
      thumbnailUrl: toAbsoluteToolazeUrl(card.image),
      uploadDate: meta.uploadDate,
      duration: meta.duration,
      contentUrl: toAbsoluteToolazeUrl(card.video),
    }]
  })
  const pageSchema = {
    '@context': 'https://schema.org',
    '@graph': videoObjects,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <Navigation initialTranslations={initialTranslations} />
      <main className="min-h-screen bg-[#F8FAFF] px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb
            variant="inline"
            items={[
              { label: copy.breadcrumbs.home, href: locale === 'en' ? '/' : `/${locale}` },
              { label: copy.breadcrumbs.current },
            ]}
          />
          <h1 className="mt-4 text-[40px] font-extrabold tracking-tight text-slate-900 mb-4">
            {copy.hero.prefix}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {copy.hero.highlight}
            </span>
          </h1>
          <p className="text-slate-600 text-lg mb-5 max-w-5xl">
            {copy.hero.description}
          </p>
          <AiToolsGrid cards={copy.cards} filters={copy.filters} locale={locale} />
        </div>
      </main>
      <Footer initialTranslations={initialTranslations} />
    </>
  )
}
