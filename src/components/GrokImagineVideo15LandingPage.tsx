import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AiVideoGeneratorTool from '@/components/AiVideoGeneratorTool'
import PromptCopyButton from '@/components/PromptCopyButton'
import { loadCommonTranslations } from '@/lib/seo-loader'
import { getGrokImagineVideo15LandingCopy } from '@/lib/grok-imagine-video-1-5-landing-copy'

const pageUrl = 'https://toolaze.com/model/grok-imagine-video-1-5'

function SectionHeader({ title, text, inverse = false }: { title: string; text?: string; inverse?: boolean }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <h2 className={`text-[36px] font-extrabold leading-tight tracking-tight ${inverse ? 'text-white' : 'text-slate-950'}`}>
        {title}
      </h2>
      {text ? (
        <p className={`mx-auto mt-4 text-base leading-8 md:text-lg ${inverse ? 'text-indigo-100' : 'text-slate-600'}`}>
          {text}
        </p>
      ) : null}
    </div>
  )
}
function VideoPlaceholder({
  slot,
  label,
  visual,
  compact = false,
}: {
  slot: string
  label: string
  visual: ReturnType<typeof getGrokImagineVideo15LandingCopy>['visual']
  compact?: boolean
}) {
  return (
    <div
      data-video-slot={slot}
      aria-label={label}
      className={`flex ${compact ? 'min-h-[220px]' : 'min-h-[320px]'} items-center justify-center overflow-hidden rounded-[1.5rem] border border-indigo-100 bg-[radial-gradient(circle_at_20%_18%,rgba(99,102,241,0.22),transparent_34%),radial-gradient(circle_at_82%_22%,rgba(14,165,233,0.18),transparent_30%),linear-gradient(135deg,#F8FAFF,#EEF2FF)] p-5 shadow-sm shadow-indigo-100`}
    >
      <div className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-white bg-slate-950 shadow-xl shadow-indigo-200/60">
        <div className="flex aspect-video flex-col justify-between bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(79,70,229,0.72)),radial-gradient(circle_at_74%_28%,rgba(34,211,238,0.34),transparent_32%)] p-5 text-white">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-bold text-indigo-50">{visual.badge}</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-950">{visual.duration}</span>
          </div>
          <div>
            <p className="text-sm font-extrabold tracking-tight text-white">{label}</p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {visual.cues.map((item) => (
                <div key={item} className="rounded-xl bg-white/12 p-3 ring-1 ring-white/10">
                  <p className="text-[10px] font-bold tracking-[0.08em] text-indigo-100">{item}</p>
                  <div className="mt-5 h-1 rounded-full bg-indigo-100/80" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DemoVideoAsset({
  slot,
  src,
  label,
}: {
  slot: string
  src: string
  label: string
}) {
  return (
    <div
      data-video-slot={slot}
      className="overflow-hidden rounded-[1.5rem] border border-indigo-100 bg-slate-950 shadow-sm shadow-indigo-100"
    >
      <video
        data-grok-demo-video
        src={src}
        aria-label={label}
        className="aspect-video h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    </div>
  )
}

export async function GrokImagineVideo15LandingPage({ locale = 'en' }: { locale?: string } = {}) {
  const t = await loadCommonTranslations(locale)
  const copy = getGrokImagineVideo15LandingCopy(locale)
  const heroTitleHtml = `<span class="text-gradient">${copy.hero.modelName}</span> ${copy.hero.suffix}`
  const faqs = copy.faq.items
  const howToSteps = copy.howTo.steps
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
        description: copy.metadata.description,
        url: pageUrl,
        isPartOf: {
          '@type': 'WebSite',
          name: 'Toolaze',
          url: 'https://toolaze.com',
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: copy.schema.appName,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        publisher: {
          '@type': 'Organization',
          name: 'Toolaze',
        },
      },
      {
        '@type': 'HowTo',
        name: copy.schema.howToName,
        step: howToSteps.map((step) => ({
          '@type': 'HowToStep',
          text: step,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: copy.breadcrumbs.home, item: 'https://toolaze.com' },
          { '@type': 'ListItem', position: 2, name: copy.breadcrumbs.model, item: 'https://toolaze.com/model' },
          { '@type': 'ListItem', position: 3, name: copy.breadcrumbs.current, item: pageUrl },
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
        <section id="grok-imagine-video-1-5-generator" className="bg-[#F8FAFF] pb-12 pl-0 pr-2 md:pl-0 md:pr-4 xl:pl-0 xl:pr-6 2xl:pl-0 2xl:pr-8">
          <AiVideoGeneratorTool
            modelId="grok-1-5-video"
            allowModelSelect
            heroBreadcrumbItems={[
              { label: copy.breadcrumbs.home, href: '/' },
              { label: copy.breadcrumbs.model, href: '/model' },
              { label: copy.breadcrumbs.current },
            ]}
            heroTitleHtml={heroTitleHtml}
            heroDescription={copy.hero.description}
            demoVideo={copy.hero.demoVideo}
            initialTranslations={t}
          />
        </section>

        <section data-section="what-is" className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">{copy.whatIs.title}</h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-slate-700">
                {copy.whatIs.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="mt-10 rounded-[1.75rem] border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100 md:p-7">
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">{copy.whatIs.specsTitle}</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {copy.whatIs.specs.map((item) => (
                  <div key={item.label} className="rounded-[1.25rem] bg-[#F8FAFF] p-4 ring-1 ring-indigo-100">
                    <p className="text-xs font-bold tracking-[0.08em] text-indigo-600">{item.label}</p>
                    <p className="mt-2 text-sm font-extrabold leading-6 text-slate-950">{item.value}</p>
                  </div>
                ))}
              </div>
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
                  {item.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={paragraph} className={`${paragraphIndex === 0 ? 'mt-5' : 'mt-4'} text-base leading-8 text-slate-700`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              )
              const visualBlock = (
                <div
                  data-grok-feature-image={item.slot}
                  className="relative aspect-video overflow-hidden rounded-[1.5rem] border border-indigo-100 bg-slate-950 shadow-sm shadow-indigo-100"
                >
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )

              return (
                <div key={item.slot} className="grid gap-8 lg:grid-cols-2 lg:items-center">
                  {index % 2 === 0 ? (
                    <>
                      {textBlock}
                      {visualBlock}
                    </>
                  ) : (
                    <>
                      {visualBlock}
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
              {copy.gallery.examples.map((item) => (
                <article key={item.slot} className="overflow-hidden rounded-[1.75rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-100">
                  <div data-grok-use-case-image={item.slot} className="relative aspect-video overflow-hidden bg-slate-100">
                    <Image
                      src={item.imageSrc!}
                      alt={item.imageAlt!}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="compare" className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.comparison.title} text={copy.comparison.text} />
            <div className="overflow-x-auto rounded-[1.75rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-100">
              <table className="min-w-[1120px] text-left text-sm">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    <th className="w-[190px] px-5 py-4 font-extrabold">{copy.comparison.capabilityHeader}</th>
                    <th className="px-5 py-4 font-extrabold">Grok Imagine Video 1.5</th>
                    <th className="px-5 py-4 font-extrabold">Seedance 2.0</th>
                    <th className="px-5 py-4 font-extrabold">Kling 3.0</th>
                    <th className="px-5 py-4 font-extrabold">Veo 3.1</th>
                  </tr>
                </thead>
                <tbody>
                  {copy.comparison.rows.map((row) => (
                    <tr key={row.capability} className="border-t border-indigo-100">
                      <th className="bg-[#F8FAFF] px-5 py-4 align-top font-extrabold text-slate-950">{row.capability}</th>
                      <td className="px-5 py-4 align-top leading-7 text-slate-600">{row.grok}</td>
                      <td className="px-5 py-4 align-top leading-7 text-slate-600">{row.seedance}</td>
                      <td className="px-5 py-4 align-top leading-7 text-slate-600">{row.kling}</td>
                      <td className="px-5 py-4 align-top leading-7 text-slate-600">{row.veo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {copy.comparison.note ? (
              <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-7 text-slate-600">{copy.comparison.note}</p>
            ) : null}
          </div>
        </section>

        <section id="how-to" className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.howTo.title} />
            <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              {howToSteps.map((step, index) => (
                <li key={step} className="relative min-h-[190px] rounded-[1.5rem] border border-indigo-100 bg-[#F8FAFF] p-6 pt-14 shadow-sm shadow-indigo-100">
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
            <section data-section="prompt-formula" className="mb-14">
              <SectionHeader title={copy.promptFormula.title} text={copy.promptFormula.text} />
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {copy.promptFormula.items.map((item) => (
                  <article key={item.title} className="rounded-[1.5rem] border border-indigo-100 bg-white p-6 shadow-sm shadow-indigo-100">
                    <h3 className="text-xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  </article>
                ))}
              </div>
            </section>
            <SectionHeader title={copy.prompts.title} text={copy.prompts.text} />
            <div className="space-y-6">
              {copy.prompts.examples.map((item) => (
                <article key={item.id} className="grid gap-6 rounded-[1.75rem] border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
                  <div className="p-1 md:p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                      <PromptCopyButton prompt={item.prompt} copyLabel={copy.prompts.copyButton} copiedLabel={copy.prompts.copiedButton} />
                    </div>
                    <p className="mt-4 rounded-[1.25rem] border border-indigo-100 bg-[#F8FAFF] p-5 text-sm leading-7 text-slate-700">
                      {item.prompt}
                    </p>
                  </div>
                  <DemoVideoAsset slot={item.slot} src={item.videoSrc} label={item.videoLabel} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section data-section="common-problems" className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-[1500px]">
            <SectionHeader title={copy.quality.title} text={copy.quality.text} />
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {copy.quality.items.map((item) => (
                <article key={item.title} className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100 transition hover:-translate-y-1 hover:border-indigo-300">
                  <p className="text-xs font-extrabold text-indigo-600">{copy.quality.badge}</p>
                  <h3 className="mt-4 text-base font-extrabold leading-snug tracking-tight text-slate-950">{item.title}</h3>
                  <p className="mt-3 flex-1 text-xs leading-6 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section data-section="related" className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.related.title} text={copy.related.text} />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {copy.related.links.map((item) => (
                <Link key={item.href} href={item.href} className="group rounded-[1.5rem] border border-indigo-100 bg-[#F8FAFF] p-6 shadow-sm shadow-indigo-100 transition hover:-translate-y-1 hover:border-indigo-300">
                  <h3 className="text-xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  <p className="mt-5 text-sm font-extrabold text-indigo-700 group-hover:text-indigo-900">{copy.related.tryNow}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-4xl">
            <SectionHeader title={copy.faq.title} />
            <div className="divide-y divide-indigo-100 rounded-[1.75rem] border border-indigo-100 bg-white px-6 shadow-sm shadow-indigo-100">
              {faqs.map((item, index) => (
                <details key={item.q} open={index === 0} className="group py-5">
                  <summary className="cursor-pointer list-none text-base font-extrabold text-slate-950">{item.q}</summary>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section data-section="final-cta" className="bg-[radial-gradient(circle_at_12%_20%,rgba(139,92,246,0.22),transparent_34%),radial-gradient(circle_at_85%_12%,rgba(196,181,253,0.28),transparent_30%),linear-gradient(135deg,#F5F0FF,#FFFFFF_48%,#EEF2FF)] px-4 py-14 text-slate-950 md:px-6 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <h2 className="max-w-3xl text-[36px] font-extrabold leading-tight tracking-tight">{copy.cta.title}</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700">{copy.cta.text}</p>
              <a
                href="#grok-imagine-video-1-5-generator"
                className="mt-7 inline-flex rounded-full bg-indigo-700 px-7 py-3 text-sm font-extrabold text-white shadow-sm shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-800"
              >
                {copy.cta.button}
              </a>
            </div>
            <VideoPlaceholder slot="final-cta" label={copy.cta.label} visual={copy.visual} />
          </div>
        </section>
      </main>
      <Footer initialTranslations={t} />
    </>
  )
}
