import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import Navigation from '@/components/Navigation'
import PricingCheckoutButton from './PricingCheckoutButton'
import PricingCheckoutResult from './PricingCheckoutResult'
import {
  PRICING_PLANS,
  formatPricePerCredit,
  getBonusPercent,
  getPricingPageCopy,
} from './pricing-copy'

type PricingPageContentProps = {
  locale?: string
  initialTranslations?: any
}

function formatPricingCopy(template: string, replacements: Record<string, string | number>): string {
  return Object.entries(replacements).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  )
}

export default function PricingPageContent({
  locale = 'en',
  initialTranslations,
}: PricingPageContentProps = {}) {
  const copy = getPricingPageCopy(locale)
  const homeHref = locale === 'en' ? '/' : `/${locale}`

  return (
    <>
      <Navigation initialTranslations={initialTranslations} />

      <Breadcrumb items={[
        { label: copy.breadcrumbHome, href: homeHref },
        { label: copy.breadcrumbPricing },
      ]} />

      <main className="overflow-hidden bg-[#F8FAFF] px-6 py-14 md:py-16">
        <PricingCheckoutResult />

        <section className="mx-auto max-w-6xl">
          <div className="mx-auto w-full max-w-3xl text-center">
            <h1 className="mx-auto max-w-[21rem] text-[32px] font-extrabold leading-tight tracking-tight text-slate-800 sm:max-w-3xl sm:text-[40px] md:text-[46px]">
              {copy.title}
            </h1>
            <p className="mx-auto mt-4 max-w-[20rem] text-base leading-7 text-slate-600 sm:max-w-3xl md:text-lg">
              {copy.subtitle}
            </p>
          </div>

          <div className="mt-10 grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {PRICING_PLANS.map((plan) => {
              const isFeatured = plan.badge === 'Most Popular'
              const bonusPercent = getBonusPercent(plan)
              const bonusBadge = bonusPercent > 0
                ? formatPricingCopy(copy.bonusPercentLabel, { percent: bonusPercent })
                : null

              return (
                <article
                  key={plan.name}
                  className={`group relative flex min-h-full min-w-0 flex-col rounded-[1.75rem] p-[1px] transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-200/70 ${
                    isFeatured
                      ? 'bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 shadow-xl shadow-indigo-200/80'
                      : 'bg-gradient-to-br from-indigo-100 via-violet-100 to-purple-100 shadow-sm shadow-indigo-50/70'
                  }`}
                >
                  <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-[1.7rem] bg-white transition duration-300 group-hover:bg-[#FCFBFF]">
                    <div className="relative bg-gradient-to-br from-[#F7F3FF] via-white to-[#EEF2FF] p-5 pb-5">
                      <div className="mb-3 flex min-h-8 items-start justify-between gap-2">
                        {bonusBadge ? (
                          <span className="rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-500 px-3 py-1.5 text-sm font-extrabold text-white shadow-md shadow-indigo-100/80 ring-1 ring-white/70">
                            {bonusBadge}
                          </span>
                        ) : null}

                        {plan.badge ? (
                          <span className="ml-auto rounded-full bg-amber-100 px-3 py-1.5 text-sm font-extrabold text-amber-700 shadow-lg shadow-amber-100/80 ring-1 ring-amber-200">
                            {copy.mostPopularBadge}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-2xl font-extrabold text-slate-800">{plan.name}</h2>
                      </div>

                      <div className="mt-5 flex items-center justify-center gap-2 text-center">
                        <span className="text-5xl font-extrabold tracking-tight text-slate-800 tabular-nums">
                          {plan.credits.toLocaleString('en-US')}
                        </span>
                        <img
                          src="/credits-icons/diamond-3d-indigo.svg"
                          alt=""
                          aria-hidden="true"
                          className="h-8 w-8 shrink-0 drop-shadow-sm"
                        />
                      </div>

                      <div className="mt-2 text-center">
                        {plan.bonusCredits > 0 ? (
                          <p className="inline-flex items-center justify-center px-1 py-1 text-sm font-extrabold text-slate-600">
                            <span>{plan.baseCredits.toLocaleString('en-US')}</span>
                            <span className="ml-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 bg-clip-text text-sm text-transparent">
                              +{plan.bonusCredits.toLocaleString('en-US')} {copy.bonusLabel}
                            </span>
                          </p>
                        ) : (
                          <p className="inline-flex items-center justify-center px-1 py-1 text-sm font-extrabold text-slate-600">
                            {formatPricingCopy(copy.creditsIncludedLabel, {
                              credits: plan.credits.toLocaleString('en-US'),
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5 pt-4">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                        <span className="text-3xl font-extrabold tracking-tight text-slate-800">{plan.price}</span>
                        <span className="text-sm font-bold text-indigo-600 sm:pb-1">
                          {formatPricePerCredit(plan, copy.pricePerCreditUnit)}
                        </span>
                      </div>

                      <PricingCheckoutButton
                        planId={plan.id}
                        credits={plan.credits}
                        price={plan.price}
                        enabled={plan.checkoutEnabled}
                        isFeatured={isFeatured}
                        copy={copy.checkout}
                      />
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-4xl rounded-[2rem] border border-indigo-100 bg-white p-6 shadow-sm shadow-indigo-50/70 md:p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-800">{copy.faqTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {copy.faqIntro}
            </p>
          </div>

          <div className="space-y-4">
            {copy.faq.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-indigo-100 bg-[#F8FAFF] p-5 transition duration-200 open:bg-white">
                <summary className="cursor-pointer list-none text-sm font-extrabold text-slate-800">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-4xl text-center">
          <p className="text-sm leading-6 text-slate-600">
            {copy.supportPrefix}{' '}
            <Link href="mailto:support@toolaze.com" className="font-extrabold text-indigo-600 underline">
              {copy.supportLink}
            </Link>
            {copy.supportSuffix}
          </p>
        </section>
      </main>

      <Footer initialTranslations={initialTranslations} />
    </>
  )
}
