import Link from 'next/link'
import Script from 'next/script'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AiImageGenerationTool from '@/components/AiImageGenerationTool'
import PromptCopyButton from '@/components/PromptCopyButton'
import RedditMediaCarousel from '@/components/RedditMediaCarousel'
import { loadCommonTranslations } from '@/lib/seo-loader'
import { getSeedream50LiteLandingCopy } from '@/lib/seedream-5-0-lite-landing-copy'

const pageUrl = 'https://toolaze.com/model/seedream-5-0-lite'
const imageBaseUrl = 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/seedream-5-0-lite'

const seedream50LiteDemoImages = [
  {
    url: `${imageBaseUrl}/gallery-search-grounded-product.webp`,
    title: 'Seedream 5.0 Lite campaign poster sample',
    width: 1200,
    height: 900,
  },
]

const imageAssets: Record<string, string> = {
  'feature-deep-thinking': `${imageBaseUrl}/feature-deep-thinking.webp`,
  'feature-online-search': `${imageBaseUrl}/feature-online-search.webp`,
  'feature-reference-aware': `${imageBaseUrl}/feature-reference-aware.webp`,
  'feature-layouts': `${imageBaseUrl}/feature-layouts.webp`,
  'feature-multimodal-briefs': `${imageBaseUrl}/feature-multimodal-briefs.webp`,
  'gallery-search-grounded-product': `${imageBaseUrl}/gallery-search-grounded-product.webp`,
  'gallery-reference-poster-edit': `${imageBaseUrl}/gallery-reference-poster-edit.webp`,
  'gallery-reasoned-infographic': `${imageBaseUrl}/gallery-reasoned-infographic.webp`,
  'gallery-character-continuity': `${imageBaseUrl}/gallery-character-continuity.webp`,
  'gallery-editorial-brief': `${imageBaseUrl}/gallery-editorial-brief.webp`,
  'gallery-ui-diagram': `${imageBaseUrl}/gallery-ui-diagram.webp`,
  'gallery-interior-architecture': `${imageBaseUrl}/gallery-interior-architecture.webp`,
  'gallery-multilingual-layout': `${imageBaseUrl}/gallery-multilingual-layout.webp`,
  'prompt-search-grounded-campaign': `${imageBaseUrl}/prompt-search-grounded-campaign.webp`,
  'prompt-reference-product-redesign': `${imageBaseUrl}/prompt-reference-product-redesign.webp`,
  'prompt-reasoned-information-graphic': `${imageBaseUrl}/prompt-reasoned-information-graphic.webp`,
  'prompt-character-reference-continuity': `${imageBaseUrl}/prompt-character-reference-continuity.webp`,
  'prompt-event-poster-clear-text-zones': `${imageBaseUrl}/prompt-event-poster-clear-text-zones.webp`,
  'prompt-interior-redesign-reference': `${imageBaseUrl}/prompt-interior-redesign-reference.webp`,
  'final-cta': `${imageBaseUrl}/final-cta.webp`,
}

const redditImage = (id: string, extension = 'png') =>
  `https://images.weserv.nl/?url=i.redd.it/${id}.${extension}&w=640&output=webp`

const seedream50LiteRedditDiscussions = [
  {
    id: 'seedream-50-lite-freepik-live',
    href: 'https://www.reddit.com/r/Freepik_AI/comments/1rdf3vd/seedream_50_lite_is_now_live_unlimited_up_to_14/',
    source: 'r/Freepik_AI',
    media: [
      {
        alt: 'Seedream 5.0 Lite Freepik launch media from Reddit',
        image: 'https://i.redd.it/ee4z5xjyrflg1.png',
        displayImage: redditImage('ee4z5xjyrflg1'),
      },
      {
        alt: 'Second Seedream 5.0 Lite Freepik launch media from Reddit',
        image: 'https://i.redd.it/rhqlqvhozh4h1.jpg',
        displayImage: redditImage('rhqlqvhozh4h1', 'jpg'),
      },
      {
        alt: 'Third Seedream 5.0 Lite Freepik launch media from Reddit',
        image: 'https://i.redd.it/39652ya4kiig1.png',
        displayImage: redditImage('39652ya4kiig1'),
      },
      {
        alt: 'Fourth Seedream 5.0 Lite Freepik launch media from Reddit',
        image: 'https://i.redd.it/nrkawy7gkfig1.png',
        displayImage: redditImage('nrkawy7gkfig1'),
      },
    ],
  },
  {
    id: 'seedream-50-lite-pricing-breakdown',
    href: 'https://www.reddit.com/r/Bard/comments/1rdfp6l/seedream_50_lite_api_pricing_breakdown/',
    source: 'r/Bard',
    media: [
      {
        alt: 'Seedream 5.0 Lite pricing breakdown media from Reddit',
        image: 'https://i.redd.it/rksqpbi7yflg1.jpeg',
        displayImage: redditImage('rksqpbi7yflg1', 'jpeg'),
      },
    ],
  },
  {
    id: 'seedream-50-lite-model-comparison',
    href: 'https://www.reddit.com/r/ArtificialInteligence/comments/1rdy69y/i_tried_seedream_50_lite_seedream_45_and_nano/',
    source: 'r/ArtificialInteligence',
    media: [
      {
        alt: 'Seedream 5.0 Lite model comparison media from Reddit',
        image: 'https://i.redd.it/yajddmfy8mpg1.png',
        displayImage: redditImage('yajddmfy8mpg1'),
      },
    ],
  },
]

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

function ImagePlaceholder({
  slot,
  label,
  containerLabel = 'Image placeholder',
  compact = false,
}: {
  slot: string
  label: string
  containerLabel?: string
  compact?: boolean
}) {
  const imageSrc = imageAssets[slot]

  if (imageSrc) {
    return (
      <figure
        data-image-slot={slot}
        className={`overflow-hidden rounded-[1.5rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-100 ${compact ? 'min-h-[220px]' : 'min-h-[320px]'}`}
      >
        <img
          src={imageSrc}
          alt={label}
          decoding="async"
          className="aspect-[4/3] h-full w-full object-cover"
        />
      </figure>
    )
  }

  return (
    <figure
      data-image-slot={slot}
      aria-label={label}
      className={`flex ${compact ? 'min-h-[220px]' : 'min-h-[320px]'} items-center justify-center rounded-[1.5rem] border border-dashed border-indigo-300 bg-[linear-gradient(135deg,#EEF2FF,#FFFFFF_48%,#E0F2FE)] p-6 text-center shadow-inner shadow-indigo-100`}
    >
      <div>
        <p className="text-xs font-extrabold tracking-[0.08em] text-indigo-500">{containerLabel}</p>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{label}</p>
        <p className="mt-2 text-xs text-slate-400">{slot}</p>
      </div>
    </figure>
  )
}

export async function Seedream50LiteLandingPage({ locale = 'en' }: { locale?: string } = {}) {
  const [copy, t] = await Promise.all([
    Promise.resolve(getSeedream50LiteLandingCopy(locale)),
    loadCommonTranslations(locale),
  ])
  const howToSteps = copy.howTo.steps
  const promptExamples = copy.prompts.examples
  const faqs = copy.faq.items
  const localizedRedditDiscussions = seedream50LiteRedditDiscussions.map((item, index) => {
    const localizedItem = {
      ...item,
      ...(copy.reddit.items[index] || {}),
    }

    return {
      ...localizedItem,
      media: item.media.map((media) => ({
        ...media,
        alt: `${localizedItem.title} ${copy.reddit.communityDiscussion}`,
      })),
    }
  })
  const localizedPageUrl = locale === 'en' ? pageUrl : `https://toolaze.com/${locale}/model/seedream-5-0-lite`

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
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
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'HowTo',
        name: copy.schema.howToName,
        step: howToSteps.map((text) => ({ '@type': 'HowToStep', text })),
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
      <Script src="https://platform.twitter.com/widgets.js" strategy="afterInteractive" />
      <Navigation initialTranslations={t} />
      <main className="min-h-screen overflow-x-hidden bg-[#F8FAFF] text-slate-950">
        <section id="seedream-5-0-lite-generator" className="bg-[#F8FAFF] px-0 pb-12">
          <div className="w-full max-w-full">
            <AiImageGenerationTool
              modelId="seedream-5-0-lite"
              modelName="Seedream 5.0 Lite"
              dailyLimitStorageKey="seedream_5_0_lite_last_used_date"
              sampleImages={seedream50LiteDemoImages}
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
                  {(item.paragraphs || [item.text]).map((paragraph, paragraphIndex) => (
                    <p key={paragraph} className={`${paragraphIndex === 0 ? 'mt-5' : 'mt-4'} text-base leading-8 text-slate-700`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              )
              const imageBlock = (
                <ImagePlaceholder
                  slot={item.slot || `feature-${index + 1}`}
                  label={item.label || item.title}
                  containerLabel={copy.image.container}
                />
              )

              return (
                <div key={item.slot || item.title} className="grid gap-8 lg:grid-cols-2 lg:items-center">
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

        <section id="examples" className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.gallery.title} text={copy.gallery.text} />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {copy.gallery.examples.map((item, index) => (
                <article key={item.slot || item.title} className="overflow-hidden rounded-[1.75rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-100">
                  <ImagePlaceholder
                    slot={item.slot || `gallery-${index + 1}`}
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

        <section className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.audiences.title} text={copy.audiences.text} />
            <div className="grid gap-4 md:grid-cols-2">
              {copy.audiences.items.map((item) => (
                <p key={item} className="rounded-[1.25rem] border border-indigo-100 bg-[#F8FAFF] p-5 text-sm leading-7 text-slate-700">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section id="compare" className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.comparison.title} text={copy.comparison.text} />
            <div className="overflow-hidden rounded-[1.75rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-100">
              <div className="overflow-x-auto">
                <table className="min-w-[920px] w-full text-left text-sm">
                  <thead className="bg-slate-950 text-white">
                    <tr>
                      <th className="px-5 py-4">{copy.comparison.capabilityHeader}</th>
                      <th className="px-5 py-4">Seedream 5.0 Lite</th>
                      <th className="px-5 py-4">Seedream 4.5</th>
                      <th className="px-5 py-4">GPT Image 2</th>
                      <th className="px-5 py-4">Nano Banana Pro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {copy.comparison.rows.map((row) => (
                      <tr key={row.capability} className="border-t border-indigo-100">
                        <td className="bg-[#F8FAFF] px-5 py-4 align-top font-extrabold text-slate-950">{row.capability}</td>
                        <td className="px-5 py-4 align-top leading-7 text-slate-600">{row.seedream50}</td>
                        <td className="px-5 py-4 align-top leading-7 text-slate-600">{row.seedream45}</td>
                        <td className="px-5 py-4 align-top leading-7 text-slate-600">{row.gpt}</td>
                        <td className="px-5 py-4 align-top leading-7 text-slate-600">{row.nano}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {copy.comparison.note ? (
              <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-7 text-slate-600">
                {copy.comparison.note}
              </p>
            ) : null}
          </div>
        </section>

        <section id="how-to" className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.howTo.title} />
            <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              {howToSteps.map((step, index) => (
                <li key={step} className="relative min-h-[180px] rounded-[1.5rem] border border-indigo-100 bg-[#F8FAFF] p-6 pt-14 shadow-sm shadow-indigo-100">
                  <span className="absolute right-5 top-4 text-5xl font-extrabold leading-none tracking-tight text-indigo-100">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="relative text-sm font-semibold leading-7 text-slate-700">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="prompts" className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.prompts.title} text={copy.prompts.text} />
            <div className="space-y-6">
              {promptExamples.map((item, index) => (
                <article key={item.id || item.title} className="grid gap-6 rounded-[1.75rem] border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
                  <div className="p-1 md:p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                      <PromptCopyButton prompt={item.prompt} copyLabel={copy.prompts.copyButton} copiedLabel={copy.prompts.copiedButton} />
                    </div>
                    <p className="mt-4 rounded-[1.25rem] border border-indigo-100 bg-[#F8FAFF] p-5 text-sm leading-7 text-slate-700">{item.prompt}</p>
                  </div>
                  <ImagePlaceholder
                    slot={item.slot || `prompt-${index + 1}`}
                    label={`${copy.hero.modelName} ${item.title}`}
                    containerLabel={copy.image.container}
                    compact
                  />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.youtube.title} text={copy.youtube.text} />
            <div className="grid gap-5 md:grid-cols-3">
              {copy.youtube.examples.map((item) => (
                <article key={item.slot} className="overflow-hidden rounded-[1.5rem] border border-indigo-100 bg-[#F8FAFF] shadow-sm shadow-indigo-100">
                  {item.embedUrl ? (
                    <div data-image-slot={item.slot} className="aspect-video overflow-hidden bg-slate-950">
                      <iframe
                        className="h-full w-full"
                        src={item.embedUrl}
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  ) : item.thumbnailUrl ? (
                    <a
                      data-image-slot={item.slot}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block aspect-video overflow-hidden bg-slate-950"
                    >
                      <img src={item.thumbnailUrl} alt={item.title} className="h-full w-full object-cover" />
                    </a>
                  ) : (
                    <ImagePlaceholder slot={item.slot} label={item.title} containerLabel={copy.image.container} compact />
                  )}
                  <div className="p-6">
                    <p className="text-xs font-extrabold text-indigo-600">{item.creator}</p>
                    <h3 className="mt-3 text-xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full bg-indigo-700 px-4 text-center text-sm font-extrabold text-white transition hover:bg-indigo-800">
                        {copy.youtube.watch}
                      </a>
                    ) : (
                      <p className="mt-5 text-sm font-extrabold text-indigo-700">{copy.youtube.watch}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-[1500px]">
            <SectionHeader title={copy.reddit.title} text={copy.reddit.text} />
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {localizedRedditDiscussions.map((item) => (
                <article key={item.id} className="flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-100">
                  <div className="flex items-center justify-between gap-3 bg-white px-4 py-4">
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-indigo-600">{item.source}</p>
                      <p className="mt-1 truncate text-xs font-semibold text-slate-500">{copy.reddit.communityDiscussion}</p>
                    </div>
                    <span className="text-xl font-black text-[#ff4500]">reddit</span>
                  </div>
                  <RedditMediaCarousel media={item.media} title={item.title} />
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-base font-extrabold leading-snug tracking-tight text-slate-950">{item.title}</h3>
                    <p className="mt-3 flex-1 text-xs leading-6 text-slate-600">{item.text}</p>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="mt-4 text-xs font-extrabold text-indigo-700">
                      {copy.reddit.openDiscussion}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1f1f25] px-4 py-14 text-white md:px-6 md:py-20">
          <div className="mx-auto max-w-[1500px]">
            <SectionHeader title={copy.x.title} text={copy.x.text} inverse />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {copy.x.items.map((item) => (
                <article key={item.slot} data-image-slot={item.slot} className="flex h-full flex-col rounded-[1.75rem] bg-white p-4 text-slate-950 shadow-2xl shadow-black/25">
                  {item.href ? (
                    <blockquote className="twitter-tweet m-0 min-h-[460px]" data-dnt="true" data-theme="light">
                      <p lang="en" dir="ltr">
                        {item.body || item.text}
                      </p>
                      <a href={item.href}>{item.title}</a>
                    </blockquote>
                  ) : null}
                  <div className="mt-auto border-t border-slate-100 pt-4">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-100 text-xs font-extrabold text-slate-500">
                        X
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-extrabold">{item.name}</p>
                        <p className="truncate text-sm text-slate-500">{item.handle}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex w-full min-h-11 items-center justify-center rounded-full bg-sky-500 px-4 py-3 text-center text-sm font-extrabold text-white transition hover:bg-sky-600"
                      >
                        {copy.x.read} · {copy.x.watch}
                      </a>
                    ) : null}
                  </div>
                </article>
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

        <section className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">{copy.faq.title}</h2>
            <div className="mt-8 space-y-4">
              {faqs.map((item) => (
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
                href="#seedream-5-0-lite-generator"
                className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-indigo-700 px-7 text-center text-sm font-extrabold text-white shadow-sm shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-800"
              >
                {copy.cta.button}
              </Link>
            </div>
            <ImagePlaceholder slot="final-cta" label={copy.cta.label} containerLabel={copy.image.container} />
          </div>
        </section>
      </main>
      <Footer initialTranslations={t} />
    </>
  )
}
