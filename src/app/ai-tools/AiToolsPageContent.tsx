import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import { getAiToolsPageCopy } from './copy'

function localizeHref(href: string, locale: string) {
  return locale === 'en' ? href : `/${locale}${href}`
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

  return (
    <>
      <Navigation initialTranslations={initialTranslations} />
      <Breadcrumb
        items={[
          { label: copy.breadcrumbs.home, href: locale === 'en' ? '/' : `/${locale}` },
          { label: copy.breadcrumbs.current },
        ]}
      />
      <main className="min-h-screen bg-[#F8FAFF] px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-[40px] font-extrabold tracking-tight text-slate-900 mb-4">
            {copy.hero.prefix}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {copy.hero.highlight}
            </span>
          </h1>
          <p className="text-slate-600 text-lg mb-10 max-w-5xl">
            {copy.hero.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {copy.cards.map((card) => (
              <Link
                key={card.href}
                href={localizeHref(card.href, locale)}
                className="group bg-white rounded-3xl border border-indigo-100 shadow-sm overflow-hidden hover:border-indigo-200 transition-colors"
              >
                <div className="w-full aspect-[4/3] overflow-hidden">
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </h2>
                  <p className="text-sm text-slate-600">{card.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer initialTranslations={initialTranslations} />
    </>
  )
}
