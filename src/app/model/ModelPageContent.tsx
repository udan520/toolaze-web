import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import { getModelPageCopy } from './copy'

function localizeHref(href: string, locale: string) {
  return locale === 'en' ? href : `/${locale}${href}`
}

function ModelIcon({ icon }: { icon: ReturnType<typeof getModelPageCopy>['cards'][number]['icon'] }) {
  if (icon === 'chart') {
    return (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <path d="M7 15l3-3 2 2 5-5" />
      </>
    )
  }

  if (icon === 'text') {
    return (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <path d="M7 8h10M7 12h7M7 16h10" />
        <path d="M17 5l1.5 3L21 9.5 18.5 11 17 14l-1.5-3L13 9.5 15.5 8 17 5Z" />
      </>
    )
  }

  if (icon === 'list') {
    return (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <path d="M8 8h8M8 12h6M8 16h4" />
        <circle cx="18" cy="6" r="1.5" />
      </>
    )
  }

  if (icon === 'plainText') {
    return (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <path d="M7 8h10M7 12h6M7 16h10" />
      </>
    )
  }

  return (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </>
  )
}

export function ModelPageContent({
  locale = 'en',
  initialTranslations,
  pageCopy,
}: {
  locale?: string
  initialTranslations?: any
  pageCopy?: ReturnType<typeof getModelPageCopy>
}) {
  const copy = pageCopy || getModelPageCopy(locale)

  return (
    <>
      <Navigation initialTranslations={initialTranslations} />
      <main className="bg-[#F8FAFF] min-h-screen">
        <section className="bg-white py-16 px-6 border-b border-indigo-50/50">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb
              items={[
                { label: copy.breadcrumbs.home, href: locale === 'en' ? '/' : `/${locale}` },
                { label: copy.breadcrumbs.current },
              ]}
            />
            <h1 className="text-[40px] font-extrabold text-slate-900 mt-8 mb-4">
              {copy.hero.title}
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">
              {copy.hero.description}
            </p>
          </div>
        </section>

        <section className="bg-[#F8FAFF] py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {copy.cards.map((card) => (
                <Link
                  key={card.href}
                  href={localizeHref(card.href, locale)}
                  className="group bg-white rounded-2xl border border-[#E0E7FF] shadow-lg shadow-[#4F46E5]/8 p-8 hover:shadow-xl hover:shadow-[#4F46E5]/12 transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-100">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <ModelIcon icon={card.icon} />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {card.title}
                      </h2>
                      <p className="text-slate-600 leading-relaxed mb-4">
                        {card.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {card.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>{card.cta}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 px-6 border-t border-indigo-50/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{copy.about.title}</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              {copy.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer initialTranslations={initialTranslations} />
    </>
  )
}
