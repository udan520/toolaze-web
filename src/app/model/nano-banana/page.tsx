import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import NanoBananaTool from '@/components/NanoBananaTool'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nano Banana - Image to Image | Toolaze',
  description: 'Transform images with Nano Banana model. Image to image generation online.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/model/nano-banana',
  },
}

export default function NanoBananaPage() {
  return (
    <>
      {/* 第一屏：高度 = 100vh，左侧生图参数 + 右侧示例/生成中/历史 */}
      <div className="h-screen flex flex-col overflow-hidden bg-[#F8FAFF]">
        <Navigation />
        <NanoBananaTool />
      </div>

      {/* 第一屏以下：SEO 板块 */}
      <main className="bg-[#F8FAFF]">
        <section className="bg-white py-16 px-6 border-t border-indigo-50/50">
          <div className="max-w-4xl mx-auto">
            <Breadcrumb items={[
              { label: 'Home', href: '/' },
              { label: 'Model', href: '/model' },
              { label: 'Nano Banana' },
            ]} />
            <h2 className="text-3xl font-extrabold text-slate-900 mt-8 mb-4">
              Nano Banana – Image to Image
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Transform your images with the Nano Banana model. Upload a photo, describe the changes you want, and generate a new image. Supports multiple aspect ratios and output formats.
            </p>
            <p className="text-slate-600 leading-relaxed">
              All processing respects your privacy. Use the sample images to explore results, then try your own images and check the history tab for past generations.
            </p>
          </div>
        </section>

        <section className="bg-[#F8FAFF] py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Why use Nano Banana?</h2>
            <ul className="grid gap-4 text-slate-600">
              <li className="flex gap-3">
                <span className="text-indigo-500 font-bold">·</span>
                Fast image-to-image generation with optional text prompts.
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-500 font-bold">·</span>
                Choose output aspect ratio (3:2, 2:3, 1:1) and format (Auto, PNG, JPEG, WEBP).
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-500 font-bold">·</span>
                View sample outputs and browse your generation history in one place.
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-white py-16 px-6 border-t border-indigo-50/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">FAQ</h2>
            <div className="space-y-6 text-slate-600">
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">What file types are supported?</h3>
                <p>JPG, JPEG, PNG, and WEBP up to 10 MB.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">What is Image to Image?</h3>
                <p>You upload an image and optionally add a text prompt. The model generates a new image based on your input and description.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
