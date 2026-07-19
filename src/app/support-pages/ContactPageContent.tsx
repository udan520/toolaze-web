import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import Navigation from '@/components/Navigation'
import type { ContactPageCopy } from './support-page-copy'

type ContactPageContentProps = {
  copy: ContactPageCopy
  initialTranslations?: any
  locale?: string
}

function getLocalizedHref(href: string, locale = 'en') {
  if (href.startsWith('http') || href.startsWith('mailto:')) return href
  return locale === 'en' ? href : `/${locale}${href}`
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
            <a href={`mailto:${email}`} className="font-bold text-indigo-600 underline">
              {email}
            </a>
          ) : null}
        </span>
      ))}
    </>
  )
}

export default function ContactPageContent({
  copy,
  initialTranslations,
  locale = 'en',
}: ContactPageContentProps) {
  const breadcrumbT = initialTranslations?.breadcrumb || { home: 'Home' }
  const homeHref = locale === 'en' ? '/' : `/${locale}`

  return (
    <>
      <Navigation initialTranslations={initialTranslations} />

      <Breadcrumb
        items={[
          { label: breadcrumbT.home, href: homeHref },
          { label: copy.breadcrumb },
        ]}
      />

      <main className="bg-[#F8FAFF] px-6 py-20">
        <section className="mx-auto max-w-3xl rounded-[2rem] border border-indigo-100 bg-white p-8 shadow-sm shadow-indigo-50 md:p-10">
          <p className="mb-4 text-sm font-extrabold tracking-[0.14em] text-indigo-600">{copy.eyebrow}</p>
          <h1 className="mb-5 text-[36px] font-extrabold leading-tight text-slate-900">{copy.title}</h1>
          <p className="mb-8 text-base leading-7 text-slate-600">
            <LinkedSupportEmail text={copy.description} /> {copy.responseTime}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {copy.cards.map((card) => (
              <div key={card.title} className="rounded-2xl bg-indigo-50/70 p-5">
                <h2 className="mb-2 text-base font-extrabold text-slate-900">{card.title}</h2>
                <p className="text-sm leading-6 text-slate-600">
                  {card.body}
                  {card.linkHref && card.linkLabel ? (
                    <>
                      {' '}
                      <Link href={getLocalizedHref(card.linkHref, locale)} className="font-bold text-indigo-600 underline">
                        {card.linkLabel}
                      </Link>
                      .
                    </>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer initialTranslations={initialTranslations} />
    </>
  )
}
