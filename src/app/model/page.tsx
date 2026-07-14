import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Models - Image Generation Tools | Toolaze',
  description: 'Explore Toolaze AI image generation models including GPT Image 2, Wan 2.7 Image, Nano Banana Pro, Nano Banana 2, and Seedream 4.5 for image-to-image, text-to-image, and reference-guided image generation.',
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
              Compare Toolaze image models for text-to-image, image editing, reference inputs, and high-resolution output.
            </p>
          </div>
        </section>

        <section className="bg-[#F8FAFF] py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              <Link
                href="/model/gpt-image-2"
                className="group bg-white rounded-2xl border border-[#E0E7FF] shadow-lg shadow-[#4F46E5]/8 p-8 hover:shadow-xl hover:shadow-[#4F46E5]/12 transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <path d="M7 15l3-3 2 2 5-5" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      GPT Image 2
                    </h2>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      Use GPT Image 2 for text-to-image and image-to-image in one interface. Set aspect ratio and resolution, then generate and download online.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">Image to Image</span>
                      <span className="px-3 py-1 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">Text to Image</span>
                      <span className="px-3 py-1 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">4K Ready</span>
                    </div>
                    <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:gap-2 transition-all">
                      <span>Try GPT Image 2</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href="/model/wan-2-7-image"
                className="group bg-white rounded-2xl border border-[#E0E7FF] shadow-lg shadow-[#4F46E5]/8 p-8 hover:shadow-xl hover:shadow-[#4F46E5]/12 transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <path d="M7 8h10M7 12h7M7 16h10" />
                      <path d="M17 5l1.5 3L21 9.5 18.5 11 17 14l-1.5-3L13 9.5 15.5 8 17 5Z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      Wan 2.7 Image
                    </h2>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      Generate and edit images with Wan 2.7 Image, including thinking mode, multi-reference inputs, structured text layouts, and 2K to 4K creative workflows.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">Text to Image</span>
                      <span className="px-3 py-1 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">Image Editing</span>
                      <span className="px-3 py-1 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">Multi-Reference</span>
                    </div>
                    <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:gap-2 transition-all">
                      <span>Try Wan 2.7 Image</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

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
                      Generate images from text or edit uploaded references with Nano Banana Pro. Use it for product visuals, portraits, and campaign drafts.
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

              <Link
                href="/model/nano-banana-2"
                className="group bg-white rounded-2xl border border-[#E0E7FF] shadow-lg shadow-[#4F46E5]/8 p-8 hover:shadow-xl hover:shadow-[#4F46E5]/12 transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <path d="M8 8h8M8 12h6M8 16h4" />
                      <circle cx="18" cy="6" r="1.5" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      Nano Banana 2
                    </h2>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      Generate detailed images at high speed with Nano Banana 2. Create from text or edit from reference images with broad aspect ratios and flexible outputs.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">Image to Image</span>
                      <span className="px-3 py-1 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">Text to Image</span>
                      <span className="px-3 py-1 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">Fast Generation</span>
                    </div>
                    <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:gap-2 transition-all">
                      <span>Try Nano Banana 2</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href="/model/seedream-4-5"
                className="group bg-white rounded-2xl border border-[#E0E7FF] shadow-lg shadow-[#4F46E5]/8 p-8 hover:shadow-xl hover:shadow-[#4F46E5]/12 transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <path d="M7 8h10M7 12h6M7 16h10" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      Seedream 4.5
                    </h2>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      Create 4K product visuals, poster layouts, typography-rich designs, and reference-guided image edits with Seedream 4.5 on Toolaze.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">Text to Image</span>
                      <span className="px-3 py-1 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">Image Editing</span>
                      <span className="px-3 py-1 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">4K Output</span>
                    </div>
                    <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:gap-2 transition-all">
                      <span>Try Seedream 4.5</span>
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
                Each model on Toolaze fits a different image task, from text-heavy graphics and product visuals to reference-guided edits and quick concept drafts.
              </p>
              <p>
                Use the model pages to compare settings, try prompts, upload references when supported, and choose the best fit for your image workflow.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
