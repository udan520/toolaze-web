import Image from 'next/image'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AiImageGenerationTool from '@/components/AiImageGenerationTool'
import PromptCopyButton from '@/components/PromptCopyButton'
import { getHomeModelCardImage } from '@/lib/home-model-card-images'
import { loadCommonTranslations } from '@/lib/seo-loader'
import {
  type AiImageGeneratorPageCopy,
  getAiImageGeneratorPageCopy,
} from '@/app/ai-image-generator/copy'

function SectionHeading({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div>
      <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          {description}
        </p>
      ) : null}
    </div>
  )
}

function PromptSectionHeader({
  title,
  text,
}: {
  title: string
  text?: string
}) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">
        {title}
      </h2>
      {text ? (
        <p className="mx-auto mt-4 text-base leading-8 text-slate-600 md:text-lg">
          {text}
        </p>
      ) : null}
    </div>
  )
}

function TextCard({ title, text, surface = 'white' }: { title: string; text: string; surface?: 'white' | 'tint' }) {
  return (
    <article
      className={`flex min-h-[220px] flex-col rounded-3xl border border-indigo-100 p-6 transition duration-200 hover:-translate-y-1 hover:border-indigo-300 ${
        surface === 'white' ? 'bg-white' : 'bg-[#F8FAFF]'
      }`}
    >
      <h3 className="text-xl font-extrabold leading-tight text-slate-950">{title}</h3>
      <p className="mt-4 line-clamp-5 min-h-[8.75rem] text-sm leading-7 text-slate-600">
        {text}
      </p>
    </article>
  )
}

function ImageExampleCard({
  title,
  text,
  image,
  alt,
  width,
  height,
}: {
  title: string
  text: string
  image: string
  alt: string
  width: number
  height: number
}) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-100">
      <figure className="overflow-hidden rounded-[1.5rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-100">
        <Image
          src={image}
          alt={alt}
          width={width}
          height={height}
          className="aspect-video h-full w-full object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
        />
      </figure>
      <div className="p-6">
        <h3 className="text-xl font-extrabold tracking-tight text-slate-950">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
      </div>
    </article>
  )
}

function FeatureCard({
  title,
  text,
  image,
  alt,
  width,
  height,
  href,
  label,
  reversed = false,
}: {
  title: string
  text: string
  image: string
  alt: string
  width: number
  height: number
  href?: string
  label?: string
  reversed?: boolean
}) {
  return (
    <article className="grid overflow-hidden rounded-[1.75rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-100 lg:grid-cols-[0.9fr_1fr]">
      <figure className={`aspect-video overflow-hidden bg-slate-50 ${reversed ? 'lg:order-2' : ''}`}>
        <Image
          src={image}
          alt={alt}
          width={width}
          height={height}
          className="h-full w-full object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </figure>
      <div className="flex flex-col justify-center p-6 md:p-8">
        <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">{title}</h3>
        <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base md:leading-8">
          {text}
        </p>
        {href && label ? (
          <Link
            href={href}
            className="mt-6 inline-flex w-fit rounded-full border border-indigo-200 px-4 py-2 text-sm font-bold text-indigo-700 transition hover:border-indigo-400 hover:bg-[#F8FAFF]"
          >
            {label}
          </Link>
        ) : null}
      </div>
    </article>
  )
}

function ModelLinkCard({
  title,
  text,
  href,
  label,
  imageId,
}: {
  title: string
  text: string
  href: string
  label: string
  imageId?: string
}) {
  const image = imageId ? getHomeModelCardImage(imageId) : null

  return (
    <Link
      href={href}
      className="group flex min-h-[360px] flex-col rounded-3xl border border-indigo-100 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-indigo-300"
    >
      {image ? (
        <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-indigo-100">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col">
        <h3 className="text-xl font-extrabold text-slate-950 group-hover:text-indigo-600">
          {title}
        </h3>
        <p className="mt-3 line-clamp-4 min-h-[7rem] text-sm leading-7 text-slate-600">
          {text}
        </p>
        <span className="mt-auto pt-5 text-sm font-bold text-indigo-600 group-hover:text-purple-600">
          {label}
        </span>
      </div>
    </Link>
  )
}

function RelatedLinkCard({
  title,
  text,
  href,
  label,
}: {
  title: string
  text: string
  href: string
  label: string
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-[245px] flex-col rounded-3xl border border-indigo-100 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-indigo-300"
    >
      <h3 className="text-xl font-extrabold text-slate-950 group-hover:text-indigo-600">
        {title}
      </h3>
      <p className="mt-4 line-clamp-4 min-h-[7rem] text-sm leading-7 text-slate-600">
        {text}
      </p>
      <span className="mt-auto pt-5 text-sm font-bold text-indigo-600 group-hover:text-purple-600">
        {label}
      </span>
    </Link>
  )
}

function PromptExampleCard({
  title,
  prompt,
  image,
  alt,
  width,
  height,
  copyLabel,
  copiedLabel,
}: {
  title: string
  prompt: string
  image: string
  alt: string
  width: number
  height: number
  copyLabel: string
  copiedLabel: string
}) {
  return (
    <article className="grid gap-6 rounded-[1.75rem] border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
      <div className="p-1 md:p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">{title}</h3>
          <PromptCopyButton prompt={prompt} copyLabel={copyLabel} copiedLabel={copiedLabel} />
        </div>
        <p className="mt-4 rounded-[1.25rem] border border-indigo-100 bg-[#F8FAFF] p-5 text-sm leading-7 text-slate-700">
          {prompt}
        </p>
      </div>
      <figure className="overflow-hidden rounded-[1.5rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-100 min-h-[220px]">
        <Image
          src={image}
          alt={alt}
          width={width}
          height={height}
          className="aspect-video h-full w-full object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </figure>
    </article>
  )
}

export async function AiImageGeneratorPageContent({
  locale = 'en',
  pageCopy,
  toolId = 'ai-image-generator-tool',
  heroPrefix = 'Free ',
  dailyLimitStorageKey = 'ai_image_generator_last_used_date',
  pageUrl = 'https://toolaze.com/ai-image-generator',
  contentOrder = 'default',
}: {
  locale?: string
  pageCopy?: AiImageGeneratorPageCopy
  toolId?: string
  heroPrefix?: string
  dailyLimitStorageKey?: string
  pageUrl?: string
  contentOrder?: 'default' | 'text-to-image'
}) {
  const t = await loadCommonTranslations(locale)
  const copy = pageCopy || getAiImageGeneratorPageCopy(locale)
  const defaultToolMode = contentOrder === 'text-to-image'
    ? 'text-to-image'
    : toolId === 'ai-image-to-image-generator-tool'
      ? 'image-to-image'
      : undefined

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

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: copy.howTo.schemaName,
    step: copy.howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.text,
    })),
  }

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: copy.hero.highlight,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    url: pageUrl,
    description: copy.metadata.description,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Navigation initialTranslations={t} />
      <main className="min-h-screen bg-[#F8FAFF] text-slate-950">
        <section className="w-full pb-6 pl-0 pr-2 md:pb-12 md:pl-0 md:pr-6">
          <div className="w-full max-w-full">
            <div
              id={toolId}
              className="flex flex-col"
            >
              <AiImageGenerationTool
                modelId="gpt-image-2"
                modelName="GPT Image 2"
                dailyLimitStorageKey={dailyLimitStorageKey}
                defaultMode={defaultToolMode}
                sampleImages={copy.samples}
                heroBreadcrumbItems={[
                  { label: copy.breadcrumbs.home, href: '/' },
                  { label: copy.breadcrumbs.aiTools, href: '/ai-tools' },
                  { label: copy.breadcrumbs.current },
                ]}
                heroTitle={
                  <>
                    {heroPrefix}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                      {copy.hero.highlight}
                    </span>
                  </>
                }
                heroDescription={copy.hero.description}
                initialTranslations={t}
              />
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">
              {copy.whatIs.title}
            </h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-slate-600 md:text-lg">
              {copy.whatIs.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {contentOrder === 'text-to-image' ? (
          <>
            <section id="examples" className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
              <div className="mx-auto max-w-6xl">
                <PromptSectionHeader title={copy.gallery.title} text={copy.gallery.text} />
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {copy.gallery.examples.map((item) => (
                    <ImageExampleCard key={item.title} {...item} />
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-white px-6 py-16 md:py-20">
              <div className="mx-auto max-w-7xl">
                <SectionHeading title={copy.howTo.title} description={copy.howTo.description} />
                <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
                  {copy.howTo.steps.map((step, index) => (
                    <article
                      key={step.title}
                      className="flex min-h-[260px] flex-col rounded-3xl border border-indigo-100 bg-[#F8FAFF] p-6"
                    >
                      <p className="text-sm font-bold text-indigo-600">
                        {copy.howTo.stepLabel} {index + 1}
                      </p>
                      <h3 className="mt-4 text-xl font-extrabold text-slate-950">{step.title}</h3>
                      <p className="mt-4 line-clamp-5 min-h-[8.75rem] text-sm leading-7 text-slate-600">
                        {step.text}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="px-6 py-16 md:py-20">
              <div className="mx-auto max-w-7xl">
                <SectionHeading title={copy.useCases.title} description={copy.useCases.description} />
                <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {copy.useCases.cards.map((item) => (
                    <TextCard key={item.title} title={item.title} text={item.text} />
                  ))}
                </div>
              </div>
            </section>

            <section id="prompts" className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
              <div className="mx-auto max-w-6xl">
                <PromptSectionHeader title={copy.prompts.title} text={copy.prompts.text} />
                <div className="space-y-6">
                  {copy.prompts.examples.map((item) => (
                    <PromptExampleCard
                      key={item.title}
                      {...item}
                      copyLabel={copy.prompts.copyButton}
                      copiedLabel={copy.prompts.copiedButton}
                    />
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="px-6 py-16 md:py-20">
              <div className="mx-auto max-w-7xl">
                <SectionHeading title={copy.promise.title} description={copy.promise.text} />
                <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                  {copy.promise.cards.map((item) => (
                    <TextCard key={item.title} title={item.title} text={item.text} />
                  ))}
                </div>
              </div>
            </section>

            <section id="features" className="bg-white px-4 py-14 md:px-6 md:py-20">
              <div className="mx-auto max-w-6xl">
                <PromptSectionHeader title={copy.features.title} text={copy.features.text} />
                <div className="grid gap-6">
                  {copy.features.items.map((item, index) => (
                    <FeatureCard key={item.title} {...item} reversed={index % 2 === 1} />
                  ))}
                </div>
              </div>
            </section>

            <section id="examples" className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
              <div className="mx-auto max-w-6xl">
                <PromptSectionHeader title={copy.gallery.title} text={copy.gallery.text} />
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {copy.gallery.examples.map((item) => (
                    <ImageExampleCard key={item.title} {...item} />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        <section className={contentOrder === 'text-to-image' ? 'bg-white px-6 py-16 md:py-20' : 'px-6 py-16 md:py-20'}>
          <div className="mx-auto max-w-7xl">
            <SectionHeading title={copy.modes.title} description={copy.modes.description} />
            <div className="mt-10 overflow-x-auto rounded-3xl border border-indigo-100 bg-white">
              <div className="min-w-[860px]">
                <div className="grid grid-cols-[0.8fr_1fr_1fr_1fr] bg-[#EEF2FF] text-sm font-extrabold text-slate-950">
                  <div className="p-4">{copy.modes.headers.label}</div>
                  <div className="p-4">{copy.modes.headers.aiImageGenerator}</div>
                  <div className="p-4">{copy.modes.headers.textToImage}</div>
                  <div className="p-4">{copy.modes.headers.imageToImage}</div>
                </div>
                {copy.modes.rows.map((row) => (
                  <div key={row.label} className="grid grid-cols-[0.8fr_1fr_1fr_1fr] border-t border-indigo-100 text-sm">
                    <div className="p-4 font-extrabold text-slate-950">{row.label}</div>
                    <div className="p-4 leading-7 text-slate-600">{row.aiImageGenerator}</div>
                    <div className="p-4 leading-7 text-slate-600">{row.textToImage}</div>
                    <div className="p-4 leading-7 text-slate-600">{row.imageToImage}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {contentOrder === 'text-to-image' ? (
          <section id="features" className="bg-white px-4 py-14 md:px-6 md:py-20">
            <div className="mx-auto max-w-6xl">
              <PromptSectionHeader title={copy.features.title} text={copy.features.text} />
              <div className="grid gap-6">
                {copy.features.items.map((item, index) => (
                  <FeatureCard key={item.title} {...item} reversed={index % 2 === 1} />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section id="prompts" className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
            <div className="mx-auto max-w-6xl">
              <PromptSectionHeader title={copy.prompts.title} text={copy.prompts.text} />
              <div className="space-y-6">
                {copy.prompts.examples.map((item) => (
                  <PromptExampleCard
                    key={item.title}
                    {...item}
                    copyLabel={copy.prompts.copyButton}
                    copiedLabel={copy.prompts.copiedButton}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className={contentOrder === 'text-to-image' ? 'px-6 py-16 md:py-20' : 'bg-white px-6 py-16 md:py-20'}>
          <div className="mx-auto max-w-7xl">
            <SectionHeading title={copy.models.title} description={copy.models.description} />
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {copy.models.cards.map((item) => (
                <ModelLinkCard
                  key={item.href}
                  title={item.title}
                  text={item.text}
                  href={item.href}
                  label={item.label}
                  imageId={item.imageId}
                />
              ))}
            </div>

            <h3 className="mt-12 text-2xl font-extrabold tracking-tight text-slate-950">
              {copy.models.comparisonTitle}
            </h3>
            <div className="mt-6 overflow-x-auto rounded-3xl border border-indigo-100 bg-white">
              <div className="min-w-[1180px]">
                <div className="grid grid-cols-[0.8fr_1.15fr_1.25fr_1.05fr_1.25fr_1.05fr] bg-slate-950 text-sm font-extrabold text-white">
                  <div className="p-4">{copy.models.headers.model}</div>
                  <div className="p-4">{copy.models.headers.bestFor}</div>
                  <div className="p-4">{copy.models.headers.output}</div>
                  <div className="p-4">{copy.models.headers.references}</div>
                  <div className="p-4">{copy.models.headers.textAndEditing}</div>
                  <div className="p-4">{copy.models.headers.watchouts}</div>
                </div>
                {copy.models.rows.map((row) => (
                  <div key={row.model} className="grid grid-cols-[0.8fr_1.15fr_1.25fr_1.05fr_1.25fr_1.05fr] border-t border-indigo-100 text-sm">
                    <div className="p-4 font-extrabold text-slate-950">{row.model}</div>
                    <div className="p-4 leading-7 text-slate-600">{row.bestFor}</div>
                    <div className="p-4 leading-7 text-slate-600">{row.output}</div>
                    <div className="p-4 leading-7 text-slate-600">{row.references}</div>
                    <div className="p-4 leading-7 text-slate-600">{row.textAndEditing}</div>
                    <div className="p-4 leading-7 text-slate-600">{row.watchouts}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {contentOrder === 'default' ? (
          <>
            <section className="px-6 py-16 md:py-20">
              <div className="mx-auto max-w-7xl">
                <SectionHeading title={copy.howTo.title} description={copy.howTo.description} />
                <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
                  {copy.howTo.steps.map((step, index) => (
                    <article
                      key={step.title}
                      className="flex min-h-[260px] flex-col rounded-3xl border border-indigo-100 bg-[#F8FAFF] p-6"
                    >
                      <p className="text-sm font-bold text-indigo-600">
                        {copy.howTo.stepLabel} {index + 1}
                      </p>
                      <h3 className="mt-4 text-xl font-extrabold text-slate-950">{step.title}</h3>
                      <p className="mt-4 line-clamp-5 min-h-[8.75rem] text-sm leading-7 text-slate-600">
                        {step.text}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="px-6 py-16 md:py-20">
              <div className="mx-auto max-w-7xl">
                <SectionHeading title={copy.useCases.title} description={copy.useCases.description} />
                <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {copy.useCases.cards.map((item) => (
                    <TextCard key={item.title} title={item.title} text={item.text} />
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : null}

        <section className="bg-white px-6 py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading title={copy.related.title} description={copy.related.description} />
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {copy.related.cards.map((item) => (
                <RelatedLinkCard
                  key={item.href}
                  title={item.title}
                  text={item.text}
                  href={item.href}
                  label={item.label}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">
              {copy.faq.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-8 text-slate-600">
              {copy.faq.description}
            </p>
            <div className="mt-10 space-y-4">
              {copy.faq.items.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-indigo-100 bg-white p-6"
                >
                  <summary className="cursor-pointer list-none text-lg font-extrabold text-slate-950">
                    <span className="flex items-center justify-between gap-4">
                      {item.q}
                      <span className="text-indigo-600 transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-16 md:py-20">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-indigo-100 bg-[#F8FAFF] p-8 text-center shadow-xl shadow-indigo-100/60 md:p-12">
            <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">
              {copy.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
              {copy.cta.description}
            </p>
            <Link
              href={`#${toolId}`}
              className="mt-8 inline-flex rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.02]"
            >
              {copy.cta.button}
            </Link>
          </div>
        </section>
      </main>
      <Footer initialTranslations={t} />
    </>
  )
}
