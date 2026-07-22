import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import { getModelPageCopy } from './copy'
import ModelHubGrid from './ModelHubGrid'

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
        <section className="bg-white pt-8 pb-3 px-6 border-b border-indigo-50/50">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb
              items={[
                { label: copy.breadcrumbs.home, href: locale === 'en' ? '/' : `/${locale}` },
                { label: copy.breadcrumbs.current },
              ]}
            />
            <h1 className="text-[40px] font-extrabold text-slate-900 mt-4 mb-4">
              {copy.hero.title}
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed max-w-5xl">
              {copy.hero.description}
            </p>
          </div>
        </section>

        <section className="bg-[#F8FAFF] pt-3 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <ModelHubGrid locale={locale} existingCards={copy.cards} />
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
