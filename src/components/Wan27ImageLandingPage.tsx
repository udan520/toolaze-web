import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AiImageGenerationTool from '@/components/AiImageGenerationTool'
import PromptCopyButton from '@/components/PromptCopyButton'
import RedditMediaCarousel from '@/components/RedditMediaCarousel'
import { loadCommonTranslations } from '@/lib/seo-loader'
import { getWan27ImageLandingCopy } from '@/lib/wan-2-7-image-landing-copy'

const pageUrl = 'https://toolaze.com/model/wan-2-7-image'
const fourLineClampStyle = {
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
} as const

const redditImage = (id: string, extension = 'png') => ({
  image: `https://i.redd.it/${id}.${extension}`,
  displayImage: `https://images.weserv.nl/?url=i.redd.it/${id}.${extension}&w=640&output=webp`,
})

const xImage = (url: string, width = 640) => `https://images.weserv.nl/?url=${encodeURIComponent(url)}&output=webp&w=${width}`

const redditDiscussions = [
  {
    id: 'wan-27-budgetpixel-models-available',
    href: 'https://www.reddit.com/r/budgetpixel/comments/1sa65s0/wan_27_and_wan_27_pro_image_models_are_now/',
    source: 'r/budgetpixel',
    media: [
      {
        alt: 'Wan 2.7 Image model availability preview from Reddit',
        ...redditImage('2blopm1h3psg1'),
      },
      {
        alt: 'Wan 2.7 Image Pro availability preview from Reddit',
        ...redditImage('4btbvb9h3psg1'),
      },
    ],
  },
  {
    id: 'wan-27-atlascloudai-tested',
    href: 'https://www.reddit.com/r/AtlasCloudAI/comments/1sa93qw/wan_27_image_is_out_any_one_tested_it_yet/',
    source: 'r/AtlasCloudAI',
    media: [
      {
        alt: 'Wan 2.7 Image test question preview from Reddit',
        ...redditImage('73zbpt73vpsg1'),
      },
    ],
  },
  {
    id: 'wan-27-artificialinteligence-dropped',
    href: 'https://www.reddit.com/r/ArtificialInteligence/comments/1s9dtyc/wan_27image_just_dropped_when_will_wan_27_video/',
    source: 'r/ArtificialInteligence',
    media: [
      {
        alt: 'Wan 2.7 Image launch discussion preview from Reddit',
        ...redditImage('ws9zcbka9jsg1'),
      },
    ],
  },
  {
    id: 'wan-27-aicuriosity-launch',
    href: 'https://www.reddit.com/r/aicuriosity/comments/1s9oyaj/alibaba_launches_new_wan_27_image_ai_model_built/',
    source: 'r/aicuriosity',
    media: [
      {
        alt: 'Wan 2.7 Image launch article preview from Reddit',
        ...redditImage('doctsj71slsg1', 'jpeg'),
      },
    ],
  },
]

const xCommunityExamples = [
  {
    title: 'Official Wan2.7-Image announcement',
    name: 'Wan',
    handle: '@Alibaba_Wan',
    avatar: 'https://pbs.twimg.com/profile_images/1955825038210555905/xtkxHg06_200x200.jpg',
    displayAvatar: xImage('https://pbs.twimg.com/profile_images/1955825038210555905/xtkxHg06_200x200.jpg', 200),
    href: 'https://x.com/Alibaba_Wan/status/2039329029241872767',
    image: 'https://pbs.twimg.com/media/HE0m711bAAEugIS.jpg?name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HE0m711bAAEugIS.jpg?name=orig'),
    time: '9:08 PM',
    likes: '1.1K',
    replies: '67',
    body:
      'The official Wan account introduces Wan2.7-Image as a unified model for image generation, editing, text rendering, color control, and image sets.',
  },
  {
    title: 'Creator test with reference faces',
    name: 'Browncat AI',
    handle: '@browncatro1',
    avatar: 'https://pbs.twimg.com/profile_images/1647590193820737538/h1diIoPv_200x200.jpg',
    displayAvatar: xImage('https://pbs.twimg.com/profile_images/1647590193820737538/h1diIoPv_200x200.jpg', 200),
    href: 'https://x.com/browncatro1/status/2039702292522537326',
    image: 'https://pbs.twimg.com/media/HE555Qsa0AA7otC.jpg?name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HE555Qsa0AA7otC.jpg?name=orig'),
    time: '9:53 PM',
    likes: '103',
    replies: '7',
    body:
      'A creator test in Japanese noting natural reference-face behavior and comparing detail against other image models.',
  },
  {
    title: 'Wan 2.7 model mode summary',
    name: 'VORTEX',
    handle: '@VORTEX_Promos',
    avatar: 'https://pbs.twimg.com/profile_images/2048881737225433088/Z1_FvgiV_200x200.jpg',
    displayAvatar: xImage('https://pbs.twimg.com/profile_images/2048881737225433088/Z1_FvgiV_200x200.jpg', 200),
    href: 'https://x.com/VORTEX_Promos/status/2039817954448093695',
    image: 'https://pbs.twimg.com/media/HE7jhmKbEAANmE4.jpg?name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HE7jhmKbEAANmE4.jpg?name=orig'),
    time: '5:32 AM',
    likes: '6',
    replies: '1',
    body:
      'A public X post summarizing Wan 2.7 text-to-image, image edit, Pro text-to-image, and Pro edit modes.',
  },
  {
    title: 'Wan 2.7 Image on Poe',
    name: 'Poe',
    handle: '@poe_platform',
    avatar: 'https://pbs.twimg.com/profile_images/1779895040577585153/Zdq0M-gM_200x200.jpg',
    displayAvatar: xImage('https://pbs.twimg.com/profile_images/1779895040577585153/Zdq0M-gM_200x200.jpg', 200),
    href: 'https://x.com/poe_platform/status/2039721013001306451',
    image: 'https://pbs.twimg.com/media/HE6HmeJbQAAE2n-.jpg?name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HE6HmeJbQAAE2n-.jpg?name=orig'),
    time: '11:06 PM',
    likes: '35',
    replies: '27',
    body:
      'Poe announces Wan 2.7 Image availability and highlights cohesive image sets, consistent characters, style, context, and bounding box editing.',
  },
  {
    title: 'Early creator evaluation',
    name: 'Brent Lynch',
    handle: '@BrentLynch',
    avatar: 'https://pbs.twimg.com/profile_images/2058052329140789249/mw-_1kqC_200x200.jpg',
    displayAvatar: xImage('https://pbs.twimg.com/profile_images/2058052329140789249/mw-_1kqC_200x200.jpg', 200),
    href: 'https://x.com/BrentLynch/status/2039384555103416683',
    image: 'https://pbs.twimg.com/media/HE1XTCFaYAALUVU.jpg?name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HE1XTCFaYAALUVU.jpg?name=orig'),
    time: '12:49 AM',
    likes: '30',
    replies: '7',
    body:
      'A creator shares early Wan 2.7 Image tests and compares where it may sit against Nano Banana and Seedream-style image models.',
  },
  {
    title: 'Feature breakdown from Alisa Qian',
    name: 'Alisa Qian',
    handle: '@alisaqqt',
    avatar: 'https://pbs.twimg.com/profile_images/2003270053760839683/9hBSUfAY_200x200.jpg',
    displayAvatar: xImage('https://pbs.twimg.com/profile_images/2003270053760839683/9hBSUfAY_200x200.jpg', 200),
    href: 'https://x.com/alisaqqt/status/2039241737592574255',
    image: 'https://pbs.twimg.com/media/HEzWX9LboAA2kri.jpg?name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HEzWX9LboAA2kri.jpg?name=orig'),
    time: '3:21 PM',
    likes: '200',
    replies: '13',
    body:
      'A concise feature breakdown covering facial control, palette-based color control, multilingual text rendering, and interactive editing.',
  },
  {
    title: 'Wan2.7-Image on Design Arena',
    name: 'Design Arena',
    handle: '@Designarena',
    avatar: 'https://pbs.twimg.com/profile_images/1988401101797027844/yZ6rC4I7_200x200.jpg',
    displayAvatar: xImage('https://pbs.twimg.com/profile_images/1988401101797027844/yZ6rC4I7_200x200.jpg', 200),
    href: 'https://x.com/Designarena/status/2040869623546122697',
    image: 'https://pbs.twimg.com/media/HFKgDASbAAAjnJT.jpg?name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HFKgDASbAAAjnJT.jpg?name=orig'),
    time: '3:10 AM',
    likes: '151',
    replies: '4',
    body:
      'Design Arena announces Wan2.7-Image availability with notes on detail, prompt alignment, stylistic control, and model variants.',
  },
  {
    title: 'WaveSpeed output set',
    name: 'WaveSpeedAI',
    handle: '@wavespeed_ai',
    avatar: 'https://pbs.twimg.com/profile_images/2033905443446394884/ThbaPGQZ_200x200.jpg',
    displayAvatar: xImage('https://pbs.twimg.com/profile_images/2033905443446394884/ThbaPGQZ_200x200.jpg', 200),
    href: 'https://x.com/wavespeed_ai/status/2039351955462758567',
    image: 'https://pbs.twimg.com/media/HE07pqQa4AAbnHh.jpg?name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HE07pqQa4AAbnHh.jpg?name=orig'),
    time: '10:39 PM',
    likes: '3',
    replies: '1',
    body:
      'A WaveSpeedAI post showing Wan 2.7 Image outputs in a multi-image example set, useful for checking generation range.',
  },
  {
    title: 'Wan 2.7 Image on fal',
    name: 'Mark Kretschmann',
    handle: '@mark_k',
    avatar: 'https://pbs.twimg.com/profile_images/1923114794804039680/HMfSchLD_200x200.jpg',
    displayAvatar: xImage('https://pbs.twimg.com/profile_images/1923114794804039680/HMfSchLD_200x200.jpg', 200),
    href: 'https://x.com/mark_k/status/2039413277965324342',
    image: 'https://pbs.twimg.com/media/HE1zcaFaoAA5CTU.jpg?name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HE1zcaFaoAA5CTU.jpg?name=orig'),
    time: '2:43 AM',
    likes: '45',
    replies: '5',
    body:
      'A fal-related post testing Wan 2.7 Image on a complex city scene and noting realistic faces, color extraction, multilingual text, and visual editing.',
  },
  {
    title: 'Wan2.7 creator webinar',
    name: 'Wan',
    handle: '@Alibaba_Wan',
    avatar: 'https://pbs.twimg.com/profile_images/1955825038210555905/xtkxHg06_200x200.jpg',
    displayAvatar: xImage('https://pbs.twimg.com/profile_images/1955825038210555905/xtkxHg06_200x200.jpg', 200),
    href: 'https://x.com/Alibaba_Wan/status/2041081738907283541',
    image: 'https://pbs.twimg.com/media/HFNg8KxbAAA9NcV.jpg?name=orig',
    displayImage: xImage('https://pbs.twimg.com/media/HFNg8KxbAAA9NcV.jpg?name=orig'),
    time: '5:13 PM',
    likes: '33',
    replies: '3',
    body:
      'The official Wan account promotes a Wan2.7 creator webinar about next-generation workflows and AI-agent-assisted creativity.',
  },
]

const imageAssets: Record<string, string> = {
  'thinking-mode': '/model-assets/wan-2-7-image/thinking-mode.webp',
  'text-rendering': '/model-assets/wan-2-7-image/text-rendering.webp',
  'image-editing': '/model-assets/wan-2-7-image/image-editing.webp',
  'multi-reference': '/model-assets/wan-2-7-image/multi-reference.webp',
  resolution: '/model-assets/wan-2-7-image/resolution.webp',
  'image-sets': '/model-assets/wan-2-7-image/image-sets.webp',
  'gallery-product-ad': '/model-assets/wan-2-7-image/gallery-product-ad.webp',
  'gallery-event-poster': '/model-assets/wan-2-7-image/gallery-event-poster.webp',
  'gallery-packaging': '/model-assets/wan-2-7-image/gallery-packaging.webp',
  'gallery-infographic': '/model-assets/wan-2-7-image/gallery-infographic.webp',
  'gallery-character': '/model-assets/wan-2-7-image/gallery-character.webp',
  'gallery-interior': '/model-assets/wan-2-7-image/gallery-interior.webp',
  'gallery-storyboard': '/model-assets/wan-2-7-image/gallery-storyboard.webp',
  'gallery-brand-board': '/model-assets/wan-2-7-image/gallery-brand-board.webp',
  'prompt-product-ad': '/model-assets/wan-2-7-image/prompt-product-ad.webp',
  'prompt-text-poster': '/model-assets/wan-2-7-image/prompt-text-poster.webp',
  'prompt-reference-fusion': '/model-assets/wan-2-7-image/prompt-reference-fusion.webp',
  'prompt-character-edit': '/model-assets/wan-2-7-image/prompt-character-edit.webp',
  'prompt-infographic': '/model-assets/wan-2-7-image/prompt-infographic.webp',
  'prompt-interior': '/model-assets/wan-2-7-image/prompt-interior.webp',
  'final-cta': '/model-assets/wan-2-7-image/final-cta.webp',
}

function SectionHeader({
  title,
  text,
  inverse = false,
}: {
  title: string
  text?: string
  inverse?: boolean
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <h2 className={`text-[36px] font-extrabold leading-tight tracking-tight ${inverse ? 'text-white' : 'text-slate-950'}`}>
        {title}
      </h2>
      {text ? (
        <p className={`mt-4 text-base leading-8 ${inverse ? 'text-indigo-100' : 'text-slate-700'}`}>
          {text}
        </p>
      ) : null}
    </div>
  )
}

function RedditLogo() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[#ff4500]" aria-label="Reddit">
      <svg viewBox="0 0 36 36" className="h-6 w-6" aria-hidden="true">
        <circle cx="18" cy="18" r="16" fill="currentColor" />
        <circle cx="12.5" cy="19" r="2.2" fill="white" />
        <circle cx="23.5" cy="19" r="2.2" fill="white" />
        <path
          d="M12.5 24.2c2.9 2 8.1 2 11 0"
          fill="none"
          stroke="white"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path d="M18 12.2l2.2-5.1 5.1 1.1" fill="none" stroke="white" strokeLinecap="round" strokeWidth="2" />
        <circle cx="27.2" cy="8.8" r="2.2" fill="white" />
      </svg>
    </span>
  )
}

function ImagePlaceholder({
  slot,
  label,
  variant = 'default',
}: {
  slot: string
  label: string
  variant?: 'default' | 'gallery'
}) {
  const src = imageAssets[slot]
  const isGallery = variant === 'gallery'

  return (
    <div
      data-image-src={src}
      className={`${isGallery ? 'aspect-[4/3]' : 'min-h-[260px]'} overflow-hidden rounded-[1.5rem] border border-indigo-100 bg-[linear-gradient(135deg,#F8FAFF,#FFFFFF_46%,#EEF2FF)] shadow-sm shadow-indigo-100`}
    >
      <img src={src} alt={label} className={`h-full w-full object-cover ${isGallery ? '' : 'min-h-[260px]'}`} loading="lazy" />
    </div>
  )
}

export async function Wan27ImageLandingPage({ locale = 'en' }: { locale?: string } = {}) {
  const copy = getWan27ImageLandingCopy(locale)
  const t = await loadCommonTranslations(locale)
  const features = copy.features.items
  const galleryExamples = copy.gallery.examples
  const comparisonRows = copy.comparison.rows
  const promptExamples = copy.prompts.examples
  const youtubeExamples = copy.youtube.examples
  const localizedRedditDiscussions = redditDiscussions.map((item, index) => {
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
  const localizedXCommunityExamples = xCommunityExamples.map((item, index) => ({
    ...item,
    ...(copy.x.items[index] || {}),
  }))
  const relatedLinks = copy.related.links
  const howToSteps = copy.howTo.steps
  const faqs = copy.faq.items

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
        url: pageUrl,
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
          { '@type': 'ListItem', position: 3, name: copy.schema.pageName, item: pageUrl },
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
        <section id="wan-2-7-image-generator" className="bg-[#F8FAFF] pb-12 pl-0 pr-2 md:pl-0 md:pr-4 xl:pl-0 xl:pr-6 2xl:pl-0 2xl:pr-8">
          <div className="w-full max-w-full">
            <AiImageGenerationTool
              modelId="wan-2-7-image"
              modelName="Wan 2.7 Image"
              dailyLimitStorageKey="wan_2_7_image_last_used_date"
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

        <section className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
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
            {features.map((item, index) => {
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
              const imageBlock = <ImagePlaceholder slot={item.slot} label={item.title} />
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

        <section className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.gallery.title} text={copy.gallery.text} />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {galleryExamples.map((item) => (
                <article key={item.slot} className="rounded-[1.5rem] border border-indigo-100 bg-white p-4 shadow-sm shadow-indigo-100">
                  <ImagePlaceholder slot={item.slot} label={item.title} variant="gallery" />
                  <h3 className="mt-5 text-xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#111827] px-4 py-14 text-white md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.comparison.title} text={copy.comparison.text} inverse />
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px] text-left text-sm">
                  <thead className="bg-white/10 text-white">
                    <tr>
                      <th className="px-5 py-4">{copy.comparison.capabilityHeader}</th>
                      <th className="px-5 py-4">Wan 2.7 Image</th>
                      <th className="px-5 py-4">GPT Image 2</th>
                      <th className="px-5 py-4">Seedream 4.5</th>
                      <th className="px-5 py-4">Nano Banana Pro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-indigo-50">
                    {comparisonRows.map((row) => (
                      <tr key={row.capability}>
                        <td className="px-5 py-4 font-extrabold text-white">{row.capability}</td>
                        <td className="px-5 py-4">{row.wan}</td>
                        <td className="px-5 py-4">{row.gpt}</td>
                        <td className="px-5 py-4">{row.seedream}</td>
                        <td className="px-5 py-4">{row.nano}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">{copy.howTo.title}</h2>
            <ol className="mt-8 grid gap-4 text-base leading-8 text-slate-700">
              {howToSteps.map((step, index) => (
                <li key={step} className="flex gap-4 rounded-[1.25rem] border border-indigo-100 bg-[#F8FAFF] p-5">
                  <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-indigo-700 text-sm font-extrabold text-white">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.prompts.title} text={copy.prompts.text} />
            <div className="space-y-6">
              {promptExamples.map((item) => (
                <article key={item.slot} className="grid gap-6 rounded-[1.5rem] border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                      <PromptCopyButton prompt={item.prompt} copyLabel={copy.prompts.copyButton} copiedLabel={copy.prompts.copiedButton} />
                    </div>
                    <p className="mt-4 rounded-2xl bg-[#F8FAFF] p-5 text-sm leading-7 text-slate-700">{item.prompt}</p>
                  </div>
                  <ImagePlaceholder slot={item.slot} label={item.title} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.youtube.title} text={copy.youtube.text} />
            <div className="grid gap-5 md:grid-cols-3">
              {youtubeExamples.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-indigo-100 bg-[#F8FAFF] shadow-sm shadow-indigo-100 transition hover:-translate-y-1 hover:border-indigo-300"
                >
                  <div className="relative">
                    <iframe
                      src={`https://www.youtube.com/embed/${item.videoId}`}
                      title={item.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="aspect-video w-full border-0"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold text-white">
                      YouTube
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-extrabold text-indigo-600">{item.creator}</p>
                    <h3 className="mt-3 text-xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                    <p className="mt-3 min-h-[96px] overflow-hidden text-sm leading-6 text-slate-600" style={fourLineClampStyle}>{item.text}</p>
                    <p className="mt-auto pt-5 text-sm font-extrabold text-indigo-700 group-hover:text-indigo-900">{copy.youtube.watch}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-[1500px]">
            <SectionHeader title={copy.reddit.title} text={copy.reddit.text} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {localizedRedditDiscussions.map((item) => (
                <article
                  key={item.id}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-100 transition hover:-translate-y-1 hover:border-indigo-300"
                >
                  <div className="flex items-center justify-between gap-3 bg-white px-4 py-4">
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-indigo-600">{item.source}</p>
                      <p className="mt-1 truncate text-xs font-semibold text-slate-500">{copy.reddit.communityDiscussion}</p>
                    </div>
                    <RedditLogo />
                  </div>
                  <RedditMediaCarousel media={item.media} title={item.title} />
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-base font-extrabold leading-snug tracking-tight text-slate-950">{item.title}</h3>
                    <p className="mt-3 min-h-[96px] overflow-hidden text-xs leading-6 text-slate-600" style={fourLineClampStyle}>{item.text}</p>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto pt-4 text-xs font-extrabold text-indigo-700 transition hover:text-indigo-900"
                    >
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
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {localizedXCommunityExamples.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-[1.75rem] bg-white p-5 text-slate-950 shadow-2xl shadow-black/25 transition hover:-translate-y-1 hover:shadow-black/40"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.displayAvatar}
                      alt={`${item.name} ${copy.x.title}`}
                      loading="lazy"
                      decoding="async"
                      className="h-12 w-12 shrink-0 rounded-full border border-slate-200 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-extrabold">{item.name}</p>
                        <span className="rounded-full bg-sky-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                          {copy.x.verified}
                        </span>
                      </div>
                      <p className="truncate text-sm text-slate-500">{item.handle}</p>
                    </div>
                    <span className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-extrabold text-slate-950">
                      {copy.x.follow}
                    </span>
                    <span className="text-2xl font-black leading-none text-slate-950">X</span>
                  </div>

                  <p className="mt-5 min-h-[96px] overflow-hidden text-sm font-semibold leading-6 text-slate-900" style={fourLineClampStyle}>{item.body}</p>

                  <div className="relative mt-5 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-100">
                    <img
                      src={item.displayImage}
                      alt={`${item.title} ${item.handle}`}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                    <span className="absolute right-3 top-3 rounded-full bg-slate-950/85 px-3 py-1 text-xs font-extrabold text-white">
                      {copy.x.watch}
                    </span>
                  </div>

                  <div className="mt-4 border-b border-slate-200 pb-4 text-sm text-slate-500">
                    <span>{item.time}</span>
                    <span className="mx-2">.</span>
                    <span>{copy.x.monthYear}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-bold text-slate-600">
                    <span>{item.likes} {copy.x.likes}</span>
                    <span>{copy.x.reply}</span>
                    <span>{copy.x.copyLink}</span>
                  </div>

                  <div className="mt-auto pt-5">
                    <span className="inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-4 py-3 text-sm font-extrabold text-white transition group-hover:bg-sky-600">
                      {copy.x.read} {item.replies} {copy.x.replies}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.related.title} />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedLinks.map((item) => (
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

        <section className="bg-[radial-gradient(circle_at_12%_20%,rgba(139,92,246,0.22),transparent_34%),radial-gradient(circle_at_85%_12%,rgba(196,181,253,0.28),transparent_30%),linear-gradient(135deg,#F5F0FF,#FFFFFF_48%,#EEF2FF)] px-4 py-14 text-slate-950 md:px-6 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <h2 className="max-w-3xl text-[36px] font-extrabold leading-tight tracking-tight">{copy.cta.title}</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700">{copy.cta.text}</p>
              <a
                href="#wan-2-7-image-generator"
                className="mt-7 inline-flex rounded-full bg-indigo-700 px-7 py-3 text-sm font-extrabold text-white shadow-sm shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-800"
              >
                {copy.cta.button}
              </a>
            </div>
            <ImagePlaceholder slot="final-cta" label={copy.cta.label} />
          </div>
        </section>
      </main>
      <Footer initialTranslations={t} />
    </>
  )
}
