import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import NanoBananaTool from '@/components/NanoBananaTool'
import PromptCopyButton from '@/components/PromptCopyButton'
import { loadCommonTranslations } from '@/lib/seo-loader'
import { getSeedream50ProLandingCopy } from '@/lib/seedream-5-0-pro-landing-copy'

const pageUrl = 'https://toolaze.com/model/seedream-5-0-pro'
const assetBaseUrl = '/model-assets/seedream-5-0-pro'

const seedream50ProDemoImages = [
  {
    url: `${assetBaseUrl}/prompt-product-ad.webp`,
    title: 'Seedream 5.0 Pro citrus beverage ad sample',
    width: 960,
    height: 720,
  },
]

const imageAssets: Record<string, string> = {
  'feature-cinematic-generation': `${assetBaseUrl}/feature-cinematic-generation.webp`,
  'feature-precision-editing': `${assetBaseUrl}/feature-precision-editing.webp`,
  'feature-multilayer-control': `${assetBaseUrl}/feature-multilayer-control.webp`,
  'feature-reasoning-composition': `${assetBaseUrl}/feature-reasoning-composition.webp`,
  'gallery-ad-campaign': `${assetBaseUrl}/gallery-ad-campaign.webp`,
  'gallery-ecommerce-branding': `${assetBaseUrl}/gallery-ecommerce-branding.webp`,
  'gallery-social-key-visual': `${assetBaseUrl}/gallery-social-key-visual.webp`,
  'gallery-video-frame': `${assetBaseUrl}/gallery-video-frame.webp`,
  'prompt-product-ad': `${assetBaseUrl}/prompt-product-ad.webp`,
  'prompt-scene-edit': `${assetBaseUrl}/prompt-scene-edit.webp`,
  'prompt-brand-system': `${assetBaseUrl}/prompt-brand-system.webp`,
  'final-cta': `${assetBaseUrl}/final-cta.webp`,
}

function SectionHeader({ title, text, inverse = false }: { title: string; text?: string; inverse?: boolean }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <h2 className={`text-[36px] font-extrabold leading-tight tracking-tight ${inverse ? 'text-white' : 'text-slate-950'}`}>
        {title}
      </h2>
      {text ? (
        <p className={`mt-4 text-base leading-8 ${inverse ? 'text-indigo-100' : 'text-slate-600'}`}>
          {text}
        </p>
      ) : null}
    </div>
  )
}

function PageImage({
  slot,
  label,
  containerLabel,
  compact = false,
}: {
  slot: string
  label: string
  containerLabel: string
  compact?: boolean
}) {
  const imageSrc = imageAssets[slot]

  return (
    <figure
      data-image-slot={slot}
      className={`overflow-hidden rounded-[1.5rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-100 ${compact ? 'min-h-[220px]' : 'min-h-[320px]'}`}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={label}
          decoding="async"
          className="aspect-[4/3] h-full w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[4/3] h-full w-full items-center justify-center bg-[linear-gradient(135deg,#EEF2FF,#FFFFFF_48%,#E0F2FE)] p-6 text-center">
          <div>
            <p className="text-xs font-extrabold tracking-[0.08em] text-indigo-500">{containerLabel}</p>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{label}</p>
            <p className="mt-2 text-xs text-slate-400">{slot}</p>
          </div>
        </div>
      )}
    </figure>
  )
}

export async function Seedream50ProLandingPage({ locale = 'en' }: { locale?: string } = {}) {
  const [copy, t] = await Promise.all([
    Promise.resolve(getSeedream50ProLandingCopy(locale)),
    loadCommonTranslations(locale),
  ])
  const localizedPageUrl = locale === 'en' ? pageUrl : `https://toolaze.com/${locale}/model/seedream-5-0-pro`

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: copy.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: copy.schema.pageName,
        url: localizedPageUrl,
        description: copy.metadata.description,
      },
      {
        '@type': 'SoftwareApplication',
        name: copy.schema.appName,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
      },
      {
        '@type': 'HowTo',
        name: copy.schema.howToName,
        step: copy.howTo.steps.map((text) => ({ '@type': 'HowToStep', text })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: copy.breadcrumbs.home, item: 'https://toolaze.com' },
          { '@type': 'ListItem', position: 2, name: copy.breadcrumbs.model, item: 'https://toolaze.com/model' },
          { '@type': 'ListItem', position: 3, name: copy.schema.pageName, item: localizedPageUrl },
        ],
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navigation initialTranslations={t} />
      <main className="min-h-screen overflow-x-hidden bg-[#F8FAFF] text-slate-950">
        <section id="seedream-5-0-pro-generator" className="bg-[#F8FAFF] pb-12 pl-0 pr-2 md:pl-0 md:pr-4 xl:pl-0 xl:pr-6 2xl:pl-0 2xl:pr-8">
          <div className="w-full max-w-full">
            <NanoBananaTool
              modelId="seedream-5-0-pro"
              modelName="Seedream 5.0 Pro"
              dailyLimitStorageKey="seedream_5_0_pro_page_last_used_date"
              defaultMode="text-to-image"
              defaultPrompt={copy.prompts.examples[0]?.prompt}
              sampleImages={seedream50ProDemoImages}
              heroBreadcrumbItems={[
                { label: copy.breadcrumbs.home, href: '/' },
                { label: copy.breadcrumbs.model, href: '/model' },
                { label: copy.breadcrumbs.current },
              ]}
              heroTitle={
                <>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {copy.hero.modelName}
                </span>{' '}
                {copy.hero.suffix}
                </>
              }
              heroDescription={copy.hero.description}
              initialTranslations={t}
            />
          </div>
        </section>

        <section className="bg-white px-4 py-10 md:px-6">
          <div className="mx-auto max-w-5xl rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6 shadow-sm shadow-amber-100 md:p-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">{copy.notice.title}</h2>
            <p className="mt-4 text-base leading-8 text-slate-700">{copy.notice.text}</p>
          </div>
        </section>

        <section id="what-is" className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">{copy.whatIs.title}</h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-slate-700">
              {copy.whatIs.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl space-y-14">
            <SectionHeader title={copy.features.title} text={copy.features.text} />
            {copy.features.items.map((item, index) => {
              const textBlock = (
                <div>
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                  <p className="mt-5 text-base leading-8 text-slate-700">{item.text}</p>
                </div>
              )
              const imageBlock = (
                <PageImage slot={item.slot} label={item.label} containerLabel={copy.image.container} />
              )

              return (
                <div key={item.slot} className="grid gap-8 lg:grid-cols-2 lg:items-center">
                  {index % 2 === 0 ? (
                    <>
                      {textBlock}
                      {imageBlock}
                    </>
                  ) : (
                    <>
                      {imageBlock}
                      {textBlock}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section id="compare" className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.comparison.title} text={copy.comparison.text} />
            <div className="overflow-hidden rounded-[1.75rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-100">
              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full text-left text-sm">
                  <thead className="bg-slate-950 text-white">
                    <tr>
                      <th className="px-5 py-4">{copy.comparison.headers.capability}</th>
                      <th className="px-5 py-4">{copy.comparison.headers.pro}</th>
                      <th className="px-5 py-4">{copy.comparison.headers.lite}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {copy.comparison.rows.map((row) => (
                      <tr key={row.capability} className="border-t border-indigo-100">
                        <td className="bg-[#F8FAFF] px-5 py-4 align-top font-extrabold text-slate-950">{row.capability}</td>
                        <td className="px-5 py-4 align-top leading-7 text-slate-600">{row.pro}</td>
                        <td className="px-5 py-4 align-top leading-7 text-slate-600">{row.lite}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-7 text-slate-600">{copy.comparison.note}</p>
          </div>
        </section>

        <section id="examples" className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.gallery.title} text={copy.gallery.text} />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {copy.gallery.examples.map((item) => (
                <article key={item.slot} className="overflow-hidden rounded-[1.75rem] border border-indigo-100 bg-[#F8FAFF] shadow-sm shadow-indigo-100">
                  <PageImage
                    slot={item.slot}
                    label={`${copy.hero.modelName} ${item.title}`}
                    containerLabel={copy.image.container}
                    compact
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-to" className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.howTo.title} />
            <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              {copy.howTo.steps.map((step, index) => (
                <li key={step} className="relative min-h-[180px] rounded-[1.5rem] border border-indigo-100 bg-white p-6 pt-14 shadow-sm shadow-indigo-100">
                  <span className="absolute right-5 top-4 text-5xl font-extrabold leading-none tracking-tight text-indigo-100">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="relative text-sm font-semibold leading-7 text-slate-700">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="prompts" className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.prompts.title} text={copy.prompts.text} />
            <div className="space-y-6">
              {copy.prompts.examples.map((item) => (
                <article key={item.slot} className="grid gap-6 rounded-[1.75rem] border border-indigo-100 bg-[#F8FAFF] p-5 shadow-sm shadow-indigo-100 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
                  <div className="p-1 md:p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                      <PromptCopyButton prompt={item.prompt} copyLabel={copy.prompts.copyButton} copiedLabel={copy.prompts.copiedButton} />
                    </div>
                    <p className="mt-4 rounded-[1.25rem] border border-indigo-100 bg-white p-5 text-sm leading-7 text-slate-700">{item.prompt}</p>
                  </div>
                  <PageImage
                    slot={item.slot}
                    label={`${copy.hero.modelName} ${item.title}`}
                    containerLabel={copy.image.container}
                    compact
                  />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.useCases.title} text={copy.useCases.text} />
            <div className="grid gap-4 md:grid-cols-2">
              {copy.useCases.items.map((item) => (
                <p key={item} className="rounded-[1.25rem] border border-indigo-100 bg-white p-5 text-sm leading-7 text-slate-700 shadow-sm shadow-indigo-100">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.related.title} text={copy.related.text} />
            <div className="grid gap-5 md:grid-cols-3">
              {copy.related.links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex h-full flex-col rounded-[1.25rem] border border-indigo-100 bg-[#F8FAFF] p-6 shadow-sm shadow-indigo-100 transition hover:-translate-y-1 hover:border-indigo-300"
                >
                  <h3 className="text-xl font-extrabold tracking-tight text-slate-950 group-hover:text-indigo-700">{item.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{item.text}</p>
                  <span className="mt-5 text-sm font-extrabold text-indigo-700">{copy.related.tryNow}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">{copy.faq.title}</h2>
            <div className="mt-8 space-y-4">
              {copy.faq.items.map((item) => (
                <details key={item.q} className="group rounded-[1.25rem] border border-indigo-100 bg-white p-6 shadow-sm shadow-indigo-100">
                  <summary className="cursor-pointer list-none text-lg font-extrabold text-slate-950">
                    {item.q}
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[radial-gradient(circle_at_12%_20%,rgba(139,92,246,0.22),transparent_34%),radial-gradient(circle_at_85%_12%,rgba(196,181,253,0.28),transparent_30%),linear-gradient(135deg,#F5F0FF,#FFFFFF_48%,#EEF2FF)] px-4 py-14 text-slate-950 md:px-6 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <p className="text-sm font-extrabold text-indigo-600">{copy.cta.label}</p>
              <h2 className="mt-3 text-[36px] font-extrabold leading-tight tracking-tight">{copy.cta.title}</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">{copy.cta.text}</p>
              <Link
                href="#seedream-5-0-pro-generator"
                className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-indigo-700 px-7 text-center text-sm font-extrabold text-white shadow-sm shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-800"
              >
                {copy.cta.button}
              </Link>
            </div>
            <PageImage slot="final-cta" label={copy.cta.label} containerLabel={copy.image.container} />
          </div>
        </section>
      </main>
      <Footer initialTranslations={t} />
    </>
  )
}
