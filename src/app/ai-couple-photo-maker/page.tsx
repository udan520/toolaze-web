import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import NanoBananaTool from '@/components/NanoBananaTool'
import Intro from '@/components/blocks/Intro'
import HowToUse from '@/components/blocks/HowToUse'
import Features from '@/components/blocks/Features'
import Scenarios from '@/components/blocks/Scenarios'
import FAQ from '@/components/blocks/FAQ'
import Comparison from '@/components/blocks/Comparison'
import Rating from '@/components/blocks/Rating'

export const metadata: Metadata = {
  title: 'AI Couple Photo Maker Online Free - Upload One Photo, Pick a Scene | Toolaze',
  description:
    'Use AI Couple Photo Maker online free with Toolaze. Upload one or two couple photos, choose a preset scene like wedding, travel, or studio, and generate realistic couple images in seconds.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/ai-couple-photo-maker',
  },
}

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'AI Tools', href: '/ai-tools' },
  { label: 'AI Couple Photo Maker' },
]

const featureItems = [
  {
    icon: '📷',
    iconType: 'quality',
    title: 'One or Two Photo Input',
    desc: 'Upload one or two reference photos to keep identity and couple chemistry in every generated scene.',
  },
  {
    icon: '🎭',
    iconType: 'multimodal',
    title: 'Preset Scene Templates',
    desc: 'Pick from curated templates like rainy Paris, rooftop night, red carpet, sunset beach, and more.',
  },
  {
    icon: '🖼️',
    iconType: 'quality',
    title: 'Auto Ratio, 1K PNG Output',
    desc: 'Output settings are tuned for this workflow: Auto aspect ratio, PNG format, and 1K resolution.',
  },
  {
    icon: '⚡',
    iconType: 'speed',
    title: 'Fast Couple Photo Generation',
    desc: 'Generate realistic editorial-style couple photos quickly from the browser-based workflow.',
  },
  {
    icon: '🧩',
    iconType: 'quality',
    title: 'Style and Custom Templates',
    desc: 'Use ready-made style prompts or custom presets like Proposal, Beach, and Kitchen for faster iteration.',
  },
  {
    icon: '💎',
    iconType: 'free',
    title: 'Simple Credit Rule',
    desc: 'Every generation uses 40 credits with fixed settings, so users get a predictable and consistent workflow.',
  },
]

const scenarioItems = [
  {
    icon: '💍',
    title: 'Wedding & Proposal',
    desc: 'Create romantic scenes for proposals, engagement announcements, and wedding-style portraits.',
  },
  {
    icon: '🌆',
    title: 'City Date Night',
    desc: 'Generate rooftop, night street, or red carpet vibes for premium lifestyle couple visuals.',
  },
  {
    icon: '🏖️',
    title: 'Travel & Holiday',
    desc: 'Turn a regular couple photo into sunset beach, mountain, or vacation-inspired memories.',
  },
]

const faqItems = [
  {
    q: 'How does AI Couple Photo Maker work?',
    a: 'Upload one or two couple photos, select a scene template, then generate. The prompt and settings are optimized for realistic editorial-style output.',
  },
  {
    q: 'Can I upload one photo or do I need two?',
    a: 'Both are supported. You can upload a single couple photo or two reference photos depending on your source material.',
  },
  {
    q: 'What settings are used for output?',
    a: 'This page uses fixed settings: Nano Banana 2 model, Auto aspect ratio, PNG format, and 1K resolution.',
  },
  {
    q: 'Can users switch models on this page?',
    a: 'No. Model switching is hidden to keep the couple-photo workflow consistent for this landing page.',
  },
  {
    q: 'How many credits does one generation cost?',
    a: 'Each generation costs 40 credits. The credit rule is shown directly above the Generate button.',
  },
  {
    q: 'Do templates include both preset and custom options?',
    a: 'Yes. The template area includes Style presets and Custom presets such as Proposal, Beach, and Kitchen.',
  },
]

export default function AiCouplePhotoMakerPage() {
  return (
    <>
      <Navigation />
      <Breadcrumb items={breadcrumbItems} />
      <main className="min-h-screen bg-[#F8FAFF] overflow-x-hidden">
        <header className="bg-[#F8FAFF] pb-6 md:pb-12 w-full px-2 md:px-6">
          <div className="w-full max-w-full text-center pt-6 md:pt-8 mb-6 md:mb-12">
            <h1 className="text-[40px] font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
              Free <span className="text-gradient">AI Couple Photo Maker</span> Online
            </h1>
            <p className="desc-text text-lg md:text-xl max-w-4xl mx-auto">
              Upload one or two couple photos, choose a preset romantic scene, and generate realistic cinematic
              couple portraits in seconds with Toolaze.
            </p>
          </div>
          <div className="w-full max-w-full">
            <div className="flex flex-col md:h-screen md:overflow-hidden">
              <NanoBananaTool
                modelId="nano-banana-2"
                modelName="Nano Banana 2"
                dailyLimitStorageKey="ai_couple_photo_maker_last_used_date"
                presetMode="ai-couple-photo-maker"
              />
            </div>
          </div>
        </header>

        <Intro
          title="Why Use Toolaze AI Couple Photo Maker?"
          description="Most image tools need complex prompts to get romantic, high-quality couple results. Toolaze simplifies this flow with scene-first templates, fixed generation settings, and a visual process designed for fast success."
          bgClass="bg-white"
        />

        <HowToUse
          title="How to Make Couple AI Photos"
          steps={[
            { title: 'Upload Photos', desc: 'Upload one or two couple photos (JPG, PNG, or WebP).' },
            { title: 'Select a Template', desc: 'Choose Style or Custom presets such as Rainy Paris, Proposal, or Beach.' },
            { title: 'Generate & Download', desc: 'Click Generate to create your 1K PNG couple photo and download the best result.' },
          ]}
          bgClass="bg-[#F8FAFF]"
        />

        <Features title="Key Features" features={featureItems} bgClass="bg-white" />

        <Comparison
          title="Toolaze vs Other AI Couple Photo Makers"
          compare={{
            toolaze:
              'One/two photo upload, Scene-first presets, Fixed optimized settings, Consistent romantic style workflow, Predictable 40-credit usage, Fast generation flow',
            others:
              'Prompt-heavy setup, Limited scene guidance, Inconsistent parameter defaults, More trial-and-error, Unclear credit expectations, Slower iteration',
          }}
          labels={{
            smartChoice: 'Smart Choice',
            toolaze: 'Toolaze',
            vs: 'VS',
            otherTools: 'Other Tools',
          }}
          bgClass="bg-[#F8FAFF]"
        />

        <Scenarios title="Use Cases" scenarios={scenarioItems} bgClass="bg-white" />

        <Rating
          title="AI Couple Photo Maker"
          rating="4.9/5 FROM 10K+ CREATORS"
          description="Create romantic couple photos with fixed quality settings and curated scene templates. Toolaze helps creators generate polished couple visuals quickly."
          bgClass="bg-[#F8FAFF]"
        />

        <FAQ title="Frequently Asked Questions" items={faqItems} bgClass="bg-white" />
      </main>
      <Footer />
    </>
  )
}
