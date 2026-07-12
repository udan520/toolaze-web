import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import NanoBananaTool from '@/components/NanoBananaTool'
import { loadCommonTranslations } from '@/lib/seo-loader'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'AI Image to Image Generator | Toolaze',
  description:
    'Upload an image and edit it with AI prompts. Use Toolaze AI Image to Image Generator online for reference-guided image editing.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/ai-image-to-image-generator',
  },
}

export default async function AiImageToImageGeneratorPage() {
  const t = await loadCommonTranslations('en')

  return (
    <>
      <Navigation initialTranslations={t} />
      <main className="min-h-screen bg-[#F8FAFF]">
        <section className="border-b border-indigo-50/70 bg-white px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'AI Image to Image Generator' },
              ]}
            />
            <div className="mt-8 max-w-3xl">
              <h1 className="text-[40px] font-extrabold leading-tight tracking-tight text-slate-950">
                AI Image to Image Generator
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Upload a reference image, describe the edit you want, and generate a new AI image from the original.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-10">
          <div className="mx-auto max-w-7xl">
            <NanoBananaTool initialTranslations={t} />
          </div>
        </section>
      </main>
      <Footer initialTranslations={t} />
    </>
  )
}
