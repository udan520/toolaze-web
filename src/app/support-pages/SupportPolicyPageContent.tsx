import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import Navigation from '@/components/Navigation'
import type { SupportPolicyCopy } from './support-page-copy'

type SupportPolicyPageContentProps = {
  copy: SupportPolicyCopy
  initialTranslations?: any
  locale?: string
}

function getHomeHref(locale = 'en') {
  return locale === 'en' ? '/' : `/${locale}`
}

function LinkedSupportEmail({ text }: { text: string }) {
  const email = 'support@toolaze.com'
  const parts = text.split(email)

  if (parts.length === 1) return <>{text}</>

  return (
    <>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 ? (
            <a href={`mailto:${email}`} className="font-medium text-indigo-600 underline hover:text-purple-600">
              {email}
            </a>
          ) : null}
        </span>
      ))}
    </>
  )
}

export default function SupportPolicyPageContent({
  copy,
  initialTranslations,
  locale = 'en',
}: SupportPolicyPageContentProps) {
  const breadcrumbT = initialTranslations?.breadcrumb || { home: 'Home' }

  return (
    <>
      <Navigation initialTranslations={initialTranslations} />

      <Breadcrumb
        items={[
          { label: breadcrumbT.home, href: getHomeHref(locale) },
          { label: copy.breadcrumb },
        ]}
      />

      <main className="border-t border-indigo-50/50 bg-white px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-[40px] font-extrabold text-slate-900">{copy.title}</h1>

          <p className="mb-12 text-base leading-relaxed text-slate-500">
            <strong className="text-slate-900">{copy.lastUpdated}</strong> {copy.date}
          </p>

          <div className="space-y-8 text-base leading-relaxed text-slate-600">
            <p>{copy.intro}</p>

            {copy.sections.map((section) => (
              <section key={section.title} className="space-y-4">
                <h2 className="mb-4 mt-12 text-2xl font-extrabold text-slate-900 md:text-3xl">
                  {section.title}
                </h2>
                <p>
                  <LinkedSupportEmail text={section.body} />
                </p>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer initialTranslations={initialTranslations} />
    </>
  )
}
