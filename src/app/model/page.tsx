import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Models - Image Generation Tools | Toolaze',
  description: 'Explore our collection of AI image generation models. Transform images with advanced AI models including Nano Banana Pro for image-to-image and text-to-image generation.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/model',
  },
}

export default function ModelPage() {
  return (
    <>
      <Navigation />
      <main className="bg-[#F8FAFF] min-h-screen">
        <section className="bg-white py-16 px-6 border-b border-indigo-50/50">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb items={[
              { label: 'Home', href: '/' },
              { label: 'Model' },
            ]} />
            <h1 className="text-[40px] font-extrabold text-slate-900 mt-8 mb-4">
              AI Models
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">
              Explore our collection of advanced AI image generation models. Transform your images or create new ones from text prompts with cutting-edge AI technology.
            </p>
          </div>
        </section>

        <section className="bg-[#F8FAFF] py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {/* Nano Banana Pro Card */}
              <Link 
                href="/model/nano-banana-pro"
                className="group bg-white rounded-2xl border border-[#E0E7FF] shadow-lg shadow-[#4F46E5]/8 p-8 hover:shadow-xl hover:shadow-[#4F46E5]/12 transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      Nano Banana Pro
                    </h2>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      Advanced AI image generation model supporting both image-to-image and text-to-image generation. Transform your photos or create stunning artwork from text descriptions.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">Image to Image</span>
                      <span className="px-3 py-1 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">Text to Image</span>
                      <span className="px-3 py-1 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">High Quality</span>
                    </div>
                    <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:gap-2 transition-all">
                      <span>Try Nano Banana Pro</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 px-6 border-t border-indigo-50/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">About AI Models</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                Our AI models are powered by cutting-edge machine learning technology, enabling you to transform images and create new artwork with ease. Each model is optimized for specific use cases and delivers high-quality results.
              </p>
              <p>
                All models process your images locally when possible, ensuring your privacy and data security. Use our free tools to explore the capabilities of AI-powered image generation.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
