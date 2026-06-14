import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import NanoBananaTool from '@/components/NanoBananaTool'
import PromptCopyButton from '@/components/PromptCopyButton'
import { loadCommonTranslations } from '@/lib/seo-loader'
import { getSeedream45LandingCopy } from '@/lib/seedream-4-5-landing-copy'

const pageUrl = 'https://toolaze.com/model/seedream-4-5'

const features = [
  {
    slot: 'feature-reference-consistency',
    title: 'Reference Consistency for Multi-Image Editing',
    label: 'Reference-guided edit board',
    paragraphs: [
      'Seedream 4.5 is especially useful when a prompt needs to keep visual identity stable across multiple references. Use it for product variants, character references, packaging changes, material swaps, and scenes where the uploaded image should still feel like the same subject after editing.',
      'Toolaze supports Seedream 4.5 image editing with reference inputs, including JPEG, PNG, and WEBP files. That makes the model a strong fit for reference-guided edits where consistency matters more than one-off visual exploration.',
    ],
  },
  {
    slot: 'feature-4k-output',
    title: '4K High Quality Output',
    label: '4K campaign image board',
    paragraphs: [
      'Toolaze exposes Seedream 4.5 quality modes for fast drafts and 4K output. That gives creators a clear path: draft quickly in a lighter mode, then choose higher quality when the image needs to work for posters, product pages, thumbnails, ads, or presentation visuals.',
      'Use 4K when layout detail, small typography, product texture, and large-format composition matter. For quick ideation, a lighter output can be enough before you refine the prompt.',
    ],
  },
  {
    slot: 'feature-typography',
    title: 'Typography and Dense Text Layouts',
    label: 'Typography-rich poster layout',
    paragraphs: [
      'ByteDance Seed highlights stronger typography, dense text rendering, poster layout, and design-oriented output for Seedream 4.5. This makes it useful for menu boards, event posters, product labels, social cards, invitation concepts, and multilingual layout drafts.',
      'Seedream 4.5 is strong for text-rich design drafts, but generated text should still be reviewed before publishing.',
    ],
  },
  {
    slot: 'feature-commercial-design',
    title: 'Commercial Poster and Product Design',
    label: 'Commercial product design sheet',
    paragraphs: [
      'Official Seedream 4.5 examples include e-commerce product displays, poster layouts, beauty key visuals, fragrance detail pages, SaaS-style promotional images, and wedding invitation designs. Those examples map well to the jobs users bring to Toolaze: selling, explaining, launching, and testing creative directions.',
      'For marketers and shop owners, the practical value is speed. Generate several layout directions, compare readability and product focus, then refine the best one before moving it into production.',
    ],
  },
  {
    slot: 'feature-prompt-adherence',
    title: 'Prompt Adherence and Layout Control',
    label: 'Structured prompt control canvas',
    paragraphs: [
      'ByteDance Seed says Seedream 4.5 improves prompt adherence, alignment, and aesthetics compared with Seedream 4.0 in its MagicBench framing. In practical terms, this matters when the prompt contains exact layout instructions, subject placement, background rules, and style constraints.',
      'Use structured prompts that name the asset type, subject, exact text, layout, lighting, background, ratio, and what must stay unchanged. Seedream 4.5 is strongest when the task is specific rather than vague.',
    ],
  },
]

const galleryExamples = [
  {
    slot: 'gallery-ecommerce-product',
    title: 'E-commerce Product Image',
    text: 'Create clean marketplace visuals with product focus, controlled background, readable selling points, and room for badges or promotional text.',
  },
  {
    slot: 'gallery-poster-layout',
    title: 'Poster Layout',
    text: 'Build event posters, campaign boards, launch announcements, and title-led visuals where composition and typography matter.',
  },
  {
    slot: 'gallery-fragrance-detail',
    title: 'Fragrance Detail Page',
    text: 'Explore premium product scenes with bottle texture, ingredient cues, layout hierarchy, and polished commercial lighting.',
  },
  {
    slot: 'gallery-saas-promo',
    title: 'SaaS Promo Visual',
    text: 'Generate product-led software ads, feature explainers, launch graphics, and clean interface-inspired campaign images.',
  },
  {
    slot: 'gallery-wedding-invitation',
    title: 'Wedding Invitation Concept',
    text: 'Create elegant invitation visuals, event cards, decorative borders, readable names, and refined layout directions.',
  },
  {
    slot: 'gallery-beauty-kv',
    title: 'Beauty Key Visual',
    text: 'Make skincare, cosmetics, salon, or fragrance visuals with product texture, premium color, and editorial composition.',
  },
  {
    slot: 'gallery-character-reference',
    title: 'Character Reference Edit',
    text: 'Use references to keep a character, mascot, or styled subject consistent while changing clothing, pose, scene, or mood.',
  },
  {
    slot: 'gallery-multilingual-layout',
    title: 'Multilingual Text Layout',
    text: 'Test dense English, Chinese, Japanese, or mixed-language visual layouts for posters, labels, menus, and information cards.',
  },
]

const audiences = [
  'Marketing teams: Create campaign visuals, product launch posters, paid social concepts, and fast creative variants before production design.',
  'E-commerce sellers: Generate product detail images, listing visuals, bundle graphics, seasonal promotions, and cleaner commercial backgrounds.',
  'Designers: Explore typography, layout hierarchy, poster directions, brand key visuals, and reference-based visual systems.',
  'Content creators: Make thumbnails, social graphics, educational cards, event images, and creator product visuals with clearer text direction.',
  'Product teams: Create SaaS feature images, onboarding visuals, announcement boards, and early concept graphics for product storytelling.',
  'Educators: Build readable explainers, classroom posters, process diagrams, and multilingual information graphics.',
]

const comparisonRows = [
  {
    capability: 'Best for',
    seedream: 'Reference editing, commercial layouts, typography, product and poster visuals',
    nano: 'Fast image workflows, reference edits, high-resolution design assets',
    gpt: 'Text-rich images, structured layouts, image editing, UI-style visuals',
    midjourney: 'Stylized art direction, cinematic imagery, aesthetic exploration',
  },
  {
    capability: 'Text rendering',
    seedream: 'Strong official focus on typography and dense text layouts',
    nano: 'Strong for text-heavy design in newer Gemini-style workflows',
    gpt: 'Strong for short readable text and structured UI-like labels',
    midjourney: 'Improved, but publishing text still needs careful review',
  },
  {
    capability: 'Image editing',
    seedream: 'Supports Seedream 4.5 Edit with reference image inputs',
    nano: 'Good reference-guided editing and fast iteration',
    gpt: 'Strong for natural-language image edits and layout changes',
    midjourney: 'Better for variation and style exploration than precise edits',
  },
  {
    capability: 'High resolution',
    seedream: 'Supports fast draft quality and 4K high quality output',
    nano: 'Supports high-resolution workflows depending on model and settings',
    gpt: 'Supports 4K output when selected settings allow it',
    midjourney: 'High-quality outputs with upscale/export workflows',
  },
  {
    capability: 'Commercial visuals',
    seedream: 'Strong fit for product boards, posters, invitations, and key visuals',
    nano: 'Strong for product visuals and flexible image generation',
    gpt: 'Strong for commercial drafts with text and layout requirements',
    midjourney: 'Strong for polished mood and art direction',
  },
  {
    capability: 'Limitations',
    seedream: 'Exact text and edit details still need review before publishing',
    nano: 'Model behavior varies by reference quality and prompt clarity',
    gpt: 'Best results still need prompt iteration and detail review',
    midjourney: 'Less ideal for precise editable production layouts',
  },
]

const promptExamples = [
  {
    slot: 'prompt-product-poster',
    title: 'Product Launch Poster',
    prompt:
      'Create a 4K product launch poster for a premium sparkling tea can. Use a clean vertical composition, large readable headline text "Bright Citrus Tea", smaller subtitle "zero sugar, real fruit aroma", fresh citrus slices, condensation, soft studio lighting, and a polished commercial layout with clear negative space.',
  },
  {
    slot: 'prompt-character-reference-edit',
    title: 'Character Reference Edit',
    prompt:
      'Use the uploaded character reference. Preserve the same face shape, hairstyle, eye color, and outfit details. Place the character in a cinematic rainy street scene at night, with reflective pavement, soft neon light, natural pose, and the same recognizable identity across the new image.',
  },
  {
    slot: 'prompt-education-infographic',
    title: 'Educational Infographic',
    prompt:
      'Design a clean educational infographic titled "How Solar Energy Works". Include four clearly separated steps, readable labels, simple flat diagrams, arrows, concise captions, blue and yellow accents, and a balanced classroom-friendly layout with no clutter.',
  },
  {
    slot: 'prompt-interior-redesign',
    title: 'Interior Redesign From Reference',
    prompt:
      'Use the uploaded room photo as a reference. Keep the camera angle, window placement, and room layout unchanged. Redesign the room in a warm Japandi style with oak furniture, linen textures, soft indirect lighting, neutral walls, and tidy styling suitable for an interior design proposal.',
  },
  {
    slot: 'prompt-event-poster',
    title: 'Event Poster With Dense Text',
    prompt:
      'Create a modern event poster for "Future Design Week 2026". Include readable schedule text for three sessions, speaker names, date, venue, ticket note, and a bold abstract visual system. Use strong hierarchy, generous spacing, and a polished editorial poster style.',
  },
]

const relatedLinks = [
  {
    title: 'GPT Image 2 AI Image Generator',
    href: '/model/gpt-image-2',
    text: 'Compare another strong image model for text-rich visuals, editing, UI mockups, and commercial drafts.',
  },
  {
    title: 'GPT Image 2.0 Generator',
    href: '/model/gpt-image-2-0',
    text: 'Try the alternate GPT image model route for text-to-image and image-to-image workflows.',
  },
  {
    title: 'Nano Banana Pro Generator',
    href: '/model/nano-banana-pro',
    text: 'Explore a Gemini image workflow for high-resolution design assets and reference-guided edits.',
  },
  {
    title: 'Nano Banana 2 Generator',
    href: '/model/nano-banana-2',
    text: 'Use another fast image model for common creative formats, product visuals, and image editing.',
  },
  {
    title: 'Nano Banana Image to Image',
    href: '/model/nano-banana',
    text: 'Use a dedicated image-to-image workflow when uploaded references are your main priority.',
  },
  {
    title: 'AI Models Hub',
    href: '/model',
    text: 'Browse Toolaze image and video model pages when you want broader model comparison.',
  },
]

const faqs = [
  {
    q: 'What is Seedream 4.5?',
    a: 'Seedream 4.5 is ByteDance Seed\'s AI image generation and editing model for creating and refining images from prompts and reference images. It is useful for product visuals, posters, typography-rich layouts, multi-image editing, and commercial creative drafts.',
  },
  {
    q: 'Is Seedream 4.5 free on Toolaze?',
    a: 'Yes. Toolaze lets you try Seedream 4.5 online for free. Free usage may vary by quota, model availability, or selected quality settings.',
  },
  {
    q: 'Can I use Seedream 4.5 without signup?',
    a: 'Yes. Toolaze AI image model pages are designed for free no-signup access. Some advanced settings, higher limits, downloads, or continued usage may require signing in if the access policy changes.',
  },
  {
    q: 'Does Seedream 4.5 support 4K output?',
    a: 'Yes. Toolaze supports Seedream 4.5 4K output through its high quality mode. Use 4K for product posters, campaign visuals, detail images, and typography-heavy layouts that need more room for visual detail.',
  },
  {
    q: 'Can Seedream 4.5 edit images?',
    a: 'Yes. Toolaze supports Seedream 4.5 image editing with reference inputs, including JPEG, PNG, and WEBP files. Use it for product updates, reference-guided edits, background changes, layout revisions, and multi-image composition.',
  },
  {
    q: 'Is Seedream 4.5 better than Nano Banana or GPT Image 2?',
    a: 'It depends on the task. Seedream 4.5 is attractive for reference consistency, typography, product visuals, and poster layouts. GPT Image 2 is strong for structured text-rich images and editing, while Nano Banana models are useful for fast image workflows and reference-based generation.',
  },
  {
    q: 'What prompts work best with Seedream 4.5?',
    a: 'Use prompts that describe the asset type, subject, exact visible text, layout, ratio, lighting, background, and what should stay unchanged from references. For edits, specify what to preserve before describing what to change.',
  },
]

const imageAssets: Record<string, string> = {
  'feature-reference-consistency': '/model-assets/seedream-4-5/feature-reference-consistency.png',
  'feature-4k-output': '/model-assets/seedream-4-5/feature-4k-output.png',
  'feature-typography': '/model-assets/seedream-4-5/feature-typography.png',
  'feature-commercial-design': '/model-assets/seedream-4-5/feature-commercial-design.png',
  'feature-prompt-adherence': '/model-assets/seedream-4-5/feature-prompt-adherence.png',
  'gallery-ecommerce-product': '/model-assets/seedream-4-5/gallery-ecommerce-product.png',
  'gallery-poster-layout': '/model-assets/seedream-4-5/gallery-poster-layout.png',
  'gallery-fragrance-detail': '/model-assets/seedream-4-5/gallery-fragrance-detail.png',
  'gallery-saas-promo': '/model-assets/seedream-4-5/gallery-saas-promo.png',
  'gallery-wedding-invitation': '/model-assets/seedream-4-5/gallery-wedding-invitation.png',
  'gallery-beauty-kv': '/model-assets/seedream-4-5/gallery-beauty-kv.png',
  'gallery-character-reference': '/model-assets/seedream-4-5/gallery-character-reference.png',
  'gallery-multilingual-layout': '/model-assets/seedream-4-5/gallery-multilingual-layout.png',
  'prompt-product-poster': '/model-assets/seedream-4-5/prompt-product-poster.png',
  'prompt-character-reference-edit': '/model-assets/seedream-4-5/prompt-character-reference-edit.png',
  'prompt-education-infographic': '/model-assets/seedream-4-5/prompt-education-infographic.png',
  'prompt-interior-redesign': '/model-assets/seedream-4-5/prompt-interior-redesign.png',
  'prompt-event-poster': '/model-assets/seedream-4-5/prompt-event-poster.png',
  'final-cta': '/model-assets/seedream-4-5/final-cta.png',
}

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

function ImagePlaceholder({ slot, label }: { slot: string; label: string }) {
  const src = imageAssets[slot]

  return (
    <div
      data-image-src={src}
      className="min-h-[260px] overflow-hidden rounded-[1.5rem] border border-indigo-100 bg-[linear-gradient(135deg,#F8FAFF,#FFFFFF_46%,#EEF2FF)] shadow-sm shadow-indigo-100"
    >
      <img src={src} alt={label} className="h-full min-h-[260px] w-full object-cover" loading="lazy" />
    </div>
  )
}

export async function Seedream45LandingPage({ locale = 'en' }: { locale?: string } = {}) {
  const copy = getSeedream45LandingCopy(locale)
  const t = await loadCommonTranslations(locale)
  const features = copy.features.items
  const galleryExamples = copy.gallery.examples
  const audiences = copy.audiences.items
  const comparisonRows = copy.comparison.rows
  const promptExamples = copy.prompts.examples
  const youtubeExamples = copy.youtube.examples
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
      <Breadcrumb
        items={[
          { label: copy.breadcrumbs.home, href: '/' },
          { label: copy.breadcrumbs.model, href: '/model' },
          { label: copy.breadcrumbs.current },
        ]}
      />
      <main className="min-h-screen overflow-x-hidden bg-[#F8FAFF] text-slate-950">
        <section id="seedream-4-5-generator" className="bg-[#F8FAFF] px-6 pb-12">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-4xl pt-8 text-center">
              <h1 className="text-[40px] font-extrabold leading-tight tracking-tight text-slate-950">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {copy.hero.modelName}
                </span>{' '}
                {copy.hero.suffix}
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-700 md:text-lg">
                {copy.hero.description}
              </p>
            </div>
            <NanoBananaTool
              modelId="seedream-4-5"
              modelName="Seedream 4.5"
              dailyLimitStorageKey="seedream_4_5_last_used_date"
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
            <SectionHeader
              title={copy.features.title}
              text={copy.features.text}
            />
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
              const imageBlock = <ImagePlaceholder slot={item.slot} label={item.label} />
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
            <SectionHeader
              title={copy.gallery.title}
              text={copy.gallery.text}
            />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {galleryExamples.map((item) => (
                <article key={item.slot} className="rounded-[1.5rem] border border-indigo-100 bg-white p-4 shadow-sm shadow-indigo-100">
                  <ImagePlaceholder slot={item.slot} label={item.title} />
                  <h3 className="mt-5 text-xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.audiences.title} />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {audiences.map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-indigo-100 bg-[#F8FAFF] p-6 shadow-sm shadow-indigo-100">
                  <p className="text-sm leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#111827] px-4 py-14 text-white md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              title={copy.comparison.title}
              text={copy.comparison.text}
              inverse
            />
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
              <div className="overflow-x-auto">
                <table className="min-w-[920px] w-full text-left text-sm">
                  <thead className="bg-white/10 text-white">
                    <tr>
                      <th className="px-5 py-4">{copy.comparison.capabilityHeader}</th>
                      <th className="px-5 py-4">Seedream 4.5</th>
                      <th className="px-5 py-4">Nano Banana</th>
                      <th className="px-5 py-4">GPT Image 2</th>
                      <th className="px-5 py-4">Midjourney</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-indigo-50">
                    {comparisonRows.map((row) => (
                      <tr key={row.capability}>
                        <td className="px-5 py-4 font-extrabold text-white">{row.capability}</td>
                        <td className="px-5 py-4">{row.seedream}</td>
                        <td className="px-5 py-4">{row.nano}</td>
                        <td className="px-5 py-4">{row.gpt}</td>
                        <td className="px-5 py-4">{row.midjourney}</td>
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
            <h2 className="text-[36px] font-extrabold leading-tight tracking-tight text-slate-950">
              {copy.howTo.title}
            </h2>
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
            <SectionHeader
              title={copy.prompts.title}
              text={copy.prompts.text}
            />
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
            <SectionHeader
              title={copy.youtube.title}
              text={copy.youtube.text}
            />
            <div className="grid gap-5 md:grid-cols-3">
              {youtubeExamples.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-[1.5rem] border border-indigo-100 bg-[#F8FAFF] shadow-sm shadow-indigo-100 transition hover:-translate-y-1 hover:border-indigo-300"
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
                  <div className="p-6">
                    <p className="text-xs font-extrabold text-indigo-600">{item.creator}</p>
                    <h3 className="mt-3 text-xl font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                    <p className="mt-5 text-sm font-extrabold text-indigo-700 group-hover:text-indigo-900">{copy.youtube.watch}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFF] px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader title={copy.related.title} />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedLinks.map((item) => (
                <Link key={item.href} href={item.href} className="group rounded-[1.5rem] border border-indigo-100 bg-white p-6 shadow-sm shadow-indigo-100 transition hover:-translate-y-1 hover:border-indigo-300">
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
              <h2 className="max-w-3xl text-[36px] font-extrabold leading-tight tracking-tight">
                {copy.cta.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700">
                {copy.cta.text}
              </p>
              <a
                href="#seedream-4-5-generator"
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
