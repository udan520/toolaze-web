import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import { getAiToolsPageCopy } from './copy'
import AiToolsGrid from './AiToolsGrid'

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

  return (
    <>
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
