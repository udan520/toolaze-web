import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import PromptGallery from '@/components/prompts/PromptGallery'
import type { PromptGalleryCopy } from '@/components/prompts/PromptGallery'
import { getPromptDataManifest, getPromptItems } from '@/lib/prompts'
import { loadCommonTranslations } from '@/lib/seo-loader'
import type { PromptLandingConfig } from './promptLandingConfigs'
import { getPromptCategoryLabels, getPromptIndexTranslations, type PromptLandingUiCopy } from './promptTranslations'

const baseUrl = 'https://toolaze.com'

type PromptLandingPageProps = {
  config: PromptLandingConfig
  locale?: string
  uiCopy?: PromptLandingUiCopy
  galleryCopy?: Partial<PromptGalleryCopy>
}

export function getPromptLandingPath(config: PromptLandingConfig) {
  return config.kind === 'model' ? `/prompts/models/${config.slug}` : `/prompts/categories/${config.slug}`
}

export function getPromptLandingPathForLocale(config: PromptLandingConfig, locale = 'en') {
  const path = getPromptLandingPath(config)
  return locale === 'en' ? path : `/${locale}${path}`
}

export function getPromptLandingUrl(config: PromptLandingConfig, locale = 'en') {
  return `${baseUrl}${getPromptLandingPathForLocale(config, locale)}`
}

export default async function PromptLandingPage({ config, locale = 'en', uiCopy, galleryCopy }: PromptLandingPageProps) {
  const defaultCopy = getPromptIndexTranslations(locale)
  const copy = uiCopy || defaultCopy.landingUi
  const commonTranslations = await loadCommonTranslations(locale)
  const allItems = getPromptItems()
  const manifest = getPromptDataManifest(allItems)
  const scopedItems = allItems.filter((item) =>
    config.kind === 'model' ? item.model === config.filterValue : item.category === config.filterValue
  )
  const pageUrl = getPromptLandingUrl(config, locale)
  const promptsPath = locale === 'en' ? '/prompts' : `/${locale}/prompts`

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: config.title.replace(' | Toolaze', ''),
    description: config.description,
    url: pageUrl,
    numberOfItems: scopedItems.length,
    itemListElement: scopedItems.slice(0, 30).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}/prompts/${item.tweetId}`,
      name: item.title,
    })),
  }
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: config.title.replace(' | Toolaze', ''),
    description: config.description,
    url: pageUrl,
    mainEntity: itemListJsonLd,
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: config.howToTitle,
    description: config.howToIntro,
    step: config.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.text,
    })),
  }
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: copy.prompts, item: `${baseUrl}${promptsPath}` },
      { '@type': 'ListItem', position: 3, name: config.filterValue, item: pageUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navigation initialTranslations={commonTranslations} />
      <main className="min-h-screen bg-[#F8FAFF]">
        <header className="relative overflow-hidden border-b border-indigo-100/70 bg-[#F8FAFF] px-6 py-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_86%_12%,rgba(99,102,241,0.20),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(238,242,255,0.72))]" />
          <div className="relative z-10 mx-auto max-w-6xl">
            <Link href={promptsPath} className="mb-8 inline-flex items-center gap-2 text-sm font-black text-indigo-600 hover:text-indigo-700">
              <span aria-hidden="true">&lt;</span>
              {copy.back}
            </Link>
            <div className="max-w-4xl">
              <h1 className="home-section-title mb-6 text-[42px] leading-[1.04] tracking-tight text-slate-950 md:text-[64px]">
                {config.heroTitle}
              </h1>
              <p className="max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">{config.heroDescription}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#templates" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-indigo-700">
                  {copy.browse}
                </a>
              </div>
            </div>
          </div>
        </header>

        <section id="templates">
          <PromptGallery
            items={scopedItems.slice(0, 48)}
            manifest={manifest}
            initialItemsComplete={scopedItems.length <= 48}
            defaultModel={config.defaultModel || 'all'}
            defaultCategory={config.defaultCategory || 'All'}
            copy={galleryCopy || defaultCopy.gallery}
            categoryLabels={getPromptCategoryLabels(locale)}
          />
        </section>

        <section id="how-to-use" className="bg-white px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="lg:pt-4">
              <h2 className="mb-5 text-3xl font-black tracking-tight text-slate-950 md:text-[34px]">{config.howToTitle}</h2>
              <p className="text-base leading-8 text-slate-600">{config.howToIntro}</p>
            </div>
            <ol className="divide-y divide-indigo-100 border-y border-indigo-100">
              {config.steps.map((item, index) => (
                <li key={item.title} className="grid gap-4 rounded-[1.5rem] px-4 py-6 transition duration-300 hover:-translate-y-1 hover:bg-[#F8FAFF] md:grid-cols-[72px_minmax(0,1fr)] md:items-start">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-black text-slate-900">{item.title}</h3>
                    <p className="text-sm leading-7 text-slate-600">{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[#F8FAFF] px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.35fr]">
            <div className="rounded-[2rem] bg-slate-950 p-8 text-white">
              <h2 className="mb-5 text-3xl font-black tracking-tight md:text-[34px]">{config.remixTitle}</h2>
              <p className="text-base leading-8 text-white/70">{config.remixText}</p>
            </div>
            <div className="space-y-4">
              {config.patterns.map((pattern) => (
                <article key={pattern.label} className="grid gap-4 border-b border-indigo-100 bg-white/60 px-4 py-5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/70 last:border-b-0 md:grid-cols-[170px_minmax(0,1fr)]">
                  <div>
                    <span className="inline-flex -skew-x-12 bg-slate-950 px-4 py-2 text-xs font-black text-white shadow-lg shadow-indigo-100">
                      <span className="skew-x-12">{pattern.label}</span>
                    </span>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-black text-slate-900">{pattern.heading}</h3>
                    <p className="text-sm leading-7 text-slate-600">{pattern.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">{config.chooserTitle}</h2>
              <p className="max-w-4xl text-base leading-8 text-slate-600">{config.chooserIntro}</p>
            </div>
            <div className="grid gap-4 md:hidden">
              {config.chooserRows.map((row) => (
                <article key={row.goal} className="rounded-[1.5rem] border border-indigo-100 bg-[#F8FAFF] p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/70">
                  <h3 className="mb-4 text-lg font-black text-slate-950">{row.goal}</h3>
                  <dl className="space-y-4 text-sm leading-7">
                    <div>
                      <dt className="font-black text-slate-900">{copy.startWith}</dt>
                      <dd className="text-slate-600">{row.startWith}</dd>
                    </div>
                    <div>
                      <dt className="font-black text-slate-900">{copy.bestFor}</dt>
                      <dd className="text-slate-600">{row.bestFor}</dd>
                    </div>
                    <div>
                      <dt className="font-black text-slate-900">{copy.replace}</dt>
                      <dd className="text-slate-600">{row.replace}</dd>
                    </div>
                    <div>
                      <dt className="font-black text-slate-900">{copy.keep}</dt>
                      <dd className="text-slate-600">{row.keep}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
            <div className="hidden overflow-hidden rounded-[2rem] border border-indigo-100 bg-[#F8FAFF] md:block">
              <table className="min-w-[860px] text-left text-sm">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    <th className="px-5 py-4 font-black">{copy.goal}</th>
                    <th className="px-5 py-4 font-black">{copy.startWith}</th>
                    <th className="px-5 py-4 font-black">{copy.bestFor}</th>
                    <th className="px-5 py-4 font-black">{copy.replace}</th>
                    <th className="px-5 py-4 font-black">{copy.keep}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-100">
                  {config.chooserRows.map((row) => (
                    <tr key={row.goal} className="align-top transition duration-200 hover:bg-white">
                      <td className="px-5 py-5 font-black text-slate-950">{row.goal}</td>
                      <td className="px-5 py-5 leading-7 text-slate-600">{row.startWith}</td>
                      <td className="px-5 py-5 leading-7 text-slate-600">{row.bestFor}</td>
                      <td className="px-5 py-5 leading-7 text-slate-600">{row.replace}</td>
                      <td className="px-5 py-5 leading-7 text-slate-600">{row.keep}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 px-6 py-16 text-white">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <h2 className="text-3xl font-black tracking-tight md:text-[34px]">{config.answerTitle}</h2>
            <p className="text-lg leading-9 text-white/70">{config.answerText}</p>
          </div>
        </section>

        <section className="bg-[#F8FAFF] px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-950 md:text-[34px]">{config.anatomyTitle}</h2>
              <p className="max-w-4xl text-base leading-8 text-slate-600">{config.anatomyIntro}</p>
            </div>
            <ol className="overflow-hidden rounded-[2rem] border border-indigo-100 bg-white">
              {config.anatomy.map((part) => (
                <li key={part.title} className="border-b border-indigo-100 p-6 transition duration-300 hover:bg-[#F8FAFF] last:border-b-0">
                  <h3 className="mb-2 text-lg font-black text-slate-900">{part.title}</h3>
                  <p className="text-sm leading-7 text-slate-600">{part.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-white px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">{config.trustTitle}</h2>
              <p className="text-base leading-8 text-slate-600">{config.trustText}</p>
            </div>
            <ul className="divide-y divide-indigo-100 rounded-[2rem] bg-[#F8FAFF] px-6">
              {config.trustRules.map((rule) => (
                <li key={rule} className="py-5 text-sm font-bold leading-7 text-slate-700 transition duration-300 hover:translate-x-1">
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[#F8FAFF] px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">{config.mistakesTitle}</h2>
              <p className="text-base leading-8 text-slate-600">{config.mistakesText}</p>
            </div>
            <div className="space-y-4">
              {config.mistakes.map((mistake) => (
                <article key={mistake.title} className="rounded-[1.5rem] bg-white p-5 shadow-sm shadow-indigo-100/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100/80">
                  <div className="mb-3 text-xs font-black text-slate-400">{copy.watchThis}</div>
                  <h3 className="mb-2 text-lg font-black text-slate-900">{mistake.title}</h3>
                  <p className="text-sm leading-7 text-slate-600">{mistake.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-3xl font-black tracking-tight text-slate-950">{config.faqTitle}</h2>
            <div className="space-y-4">
              {config.faqs.map((faq) => (
                <details key={faq.q} className="rounded-[1.5rem] border border-indigo-100 bg-[#F8FAFF] p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/70">
                  <summary className="cursor-pointer text-base font-black text-slate-900">{faq.q}</summary>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer initialTranslations={commonTranslations} />
    </>
  )
}
