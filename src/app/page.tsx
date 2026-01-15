import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getAllTools, loadToolData } from '@/lib/seo-loader'

export default async function HomePage() {
  let toolList: Array<{ tool: string; slug: string; title: string; description: string; component?: string }> = []
  
  try {
    const tools = await getAllTools()
    
    // Load basic info for each tool to display
    if (tools && tools.length > 0) {
      toolList = await Promise.all(
        tools.map(async ({ tool, slug }) => {
          try {
            const data = await loadToolData(tool, slug)
            if (!data) {
              return {
                tool,
                slug,
                title: `${tool}/${slug}`,
                description: '',
                component: undefined,
              }
            }
            return {
              tool,
              slug,
              title: data?.hero?.h1 || `${tool}/${slug}`,
              description: data?.hero?.sub || '',
              component: data?.component,
            }
          } catch (error) {
            // Silently handle individual tool loading errors
            return {
              tool,
              slug,
              title: `${tool}/${slug}`,
              description: '',
              component: undefined,
            }
          }
        })
      )
    }
  } catch (error) {
    // Silently handle errors and use fallback
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in HomePage:', error)
    }
    toolList = []
  }

  return (
    <>
      <Navigation />

      <header className="pt-10 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-widest uppercase mb-4 border border-indigo-100">v1.0 Now Live</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6" style={{ lineHeight: '1.3' }}>
            Free Lightweight <br /> <span className="text-gradient">Image Tools Platform.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Professional image processing tools that run entirely in your browser. No uploads, no limits, forever free.
          </p>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          {toolList.length > 0 ? (
            <Link href={`/${toolList[0].tool}/${toolList[0].slug}`} className="inline-block px-8 py-4 bg-gradient-brand text-white text-lg font-bold rounded-full shadow-lg shadow-indigo-200 hover:shadow-indigo-400 transition-all hover:scale-105">
              Try Image Compressor Now →
            </Link>
          ) : (
            <Link href="/image-compressor/png-to-100kb" className="inline-block px-8 py-4 bg-gradient-brand text-white text-lg font-bold rounded-full shadow-lg shadow-indigo-200 hover:shadow-indigo-400 transition-all hover:scale-105">
              Try Image Compressor Now →
            </Link>
          )}
        </div>
      </header>

      <section id="tools" className="py-20 px-6 bg-white border-t border-indigo-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">All Available Tools</h2>
              <p className="text-slate-500 mt-2">One suite. Infinite lazy possibilities.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolList.length > 0 ? (
              toolList.map((item, index) => (
                <Link 
                  key={`${item.tool}-${item.slug}`}
                  href={`/${item.tool}/${item.slug}`}
                  className="p-6 rounded-3xl bg-[#F8FAFF] border-2 border-indigo-100 hover:border-indigo-300 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Live</div>
                  <div className="w-12 h-12 bg-gradient-brand rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M8 10L12 7L16 10V17H8V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="9" cy="12" r="1" fill="currentColor"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">
                    {(item.title || '').replace(/<[^>]*>/g, '').substring(0, 50)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {(item.description || '').substring(0, 100)}
                    {(item.description || '').length > 100 ? '...' : ''}
                  </p>
                </Link>
              ))
            ) : (
              <Link href="/image-compressor/png-to-100kb" className="p-6 rounded-3xl bg-[#F8FAFF] border-2 border-indigo-100 hover:border-indigo-300 transition-all group relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Live</div>
                <div className="w-12 h-12 bg-gradient-brand rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 10L12 7L16 10V17H8V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="12" r="1" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900">Image Compressor</h3>
                <p className="text-xs text-slate-500 mt-2">Smart lossy compression for JPG/PNG.</p>
              </Link>
            )}

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 opacity-60 grayscale cursor-not-allowed relative">
              <div className="absolute top-4 right-4 bg-slate-200 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Coming Soon</div>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl mb-4 text-slate-300">🔄</div>
              <h3 className="font-bold text-slate-400">Format Converter</h3>
              <p className="text-xs text-slate-400 mt-2">HEIC to JPG, PNG to WEBP.</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 opacity-60 grayscale cursor-not-allowed relative">
              <div className="absolute top-4 right-4 bg-slate-200 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Coming Soon</div>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl mb-4 text-slate-300">📐</div>
              <h3 className="font-bold text-slate-400">Image Resize</h3>
              <p className="text-xs text-slate-400 mt-2">Resize images to exact dimensions.</p>
            </div>
            
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 opacity-60 grayscale cursor-not-allowed relative">
              <div className="absolute top-4 right-4 bg-slate-200 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Coming Soon</div>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl mb-4 text-slate-300">🎬</div>
              <h3 className="font-bold text-slate-400">Video Compressor</h3>
              <p className="text-xs text-slate-400 mt-2">Compress videos without quality loss.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white border-t border-indigo-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-purple-500 uppercase tracking-widest bg-purple-50 px-4 py-2 rounded-full inline-block mb-6">Why Toolaze?</span>
            <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">Built for Privacy & Performance</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">Everything you need to know about why Toolaze is the smart choice for creators who value privacy and quality.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#F8FAFF] p-8 rounded-3xl border border-indigo-50 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">1</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">Privacy First Architecture</h4>
                  <p className="text-base text-slate-600 leading-relaxed">Unlike other tools, we don&apos;t send your images to a remote server. Everything happens right here in your browser using WebAssembly. Your files never leave your device, ensuring complete privacy and security.</p>
                </div>
              </div>
            </div>
            <div className="bg-[#F8FAFF] p-8 rounded-3xl border border-indigo-50 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-2xl">2</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">Unlimited & Free</h4>
                  <p className="text-base text-slate-600 leading-relaxed">Compress as many images as you want. No daily limits, no paywalls, no watermarks. All tools are completely free forever with no hidden costs or premium tiers.</p>
                </div>
              </div>
            </div>
            <div className="bg-[#F8FAFF] p-8 rounded-3xl border border-indigo-50 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">3</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">Lossless Quality Control</h4>
                  <p className="text-base text-slate-600 leading-relaxed">Our advanced compression algorithms reduce file sizes by up to 90% while maintaining visual quality. You control the compression level to balance size and quality perfectly.</p>
                </div>
              </div>
            </div>
            <div className="bg-[#F8FAFF] p-8 rounded-3xl border border-indigo-50 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-2xl">4</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">No Registration Required</h4>
                  <p className="text-base text-slate-600 leading-relaxed">Start using our tools immediately without creating an account. No email signup, no personal information collection. Just open the tool and get started.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#F8FAFF] border-t border-indigo-50/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="bg-white p-6 rounded-2xl border border-indigo-50 hover:shadow-md transition-shadow">
              <summary className="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                <span>How does Toolaze compress images without uploading them?</span>
                <span className="text-indigo-600 text-xl">+</span>
              </summary>
              <p className="text-sm text-slate-500 mt-4">Toolaze uses WebAssembly and browser-based image processing APIs to compress images directly in your browser. Your files are processed locally on your device, never sent to any server. This ensures complete privacy and faster processing.</p>
            </details>
            <details className="bg-white p-6 rounded-2xl border border-indigo-50 hover:shadow-md transition-shadow">
              <summary className="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                <span>What image formats does Toolaze support?</span>
                <span className="text-indigo-600 text-xl">+</span>
              </summary>
              <p className="text-sm text-slate-500 mt-4">Currently, our Image Compressor supports JPG, PNG, and WEBP formats. We&apos;re working on adding support for more formats including HEIC, BMP, and TIFF in future updates.</p>
            </details>
            <details className="bg-white p-6 rounded-2xl border border-indigo-50 hover:shadow-md transition-shadow">
              <summary className="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                <span>Is there a file size limit?</span>
                <span className="text-indigo-600 text-xl">+</span>
              </summary>
              <p className="text-sm text-slate-500 mt-4">There&apos;s no theoretical file size limit. However, very large images may cause browser slowdown depending on your device&apos;s performance and available memory. We recommend processing large files in smaller batches for the best experience.</p>
            </details>
            <details className="bg-white p-6 rounded-2xl border border-indigo-50 hover:shadow-md transition-shadow">
              <summary className="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                <span>Will Toolaze always be free?</span>
                <span className="text-indigo-600 text-xl">+</span>
              </summary>
              <p className="text-sm text-slate-500 mt-4">Yes! Toolaze is committed to providing free tools forever. We believe in making powerful image processing tools accessible to everyone without any cost barriers or premium subscriptions.</p>
            </details>
            <details className="bg-white p-6 rounded-2xl border border-indigo-50 hover:shadow-md transition-shadow">
              <summary className="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                <span>How much can I compress my images?</span>
                <span className="text-indigo-600 text-xl">+</span>
              </summary>
              <p className="text-sm text-slate-500 mt-4">Compression results vary depending on the original image quality and format. Typically, you can achieve 50-90% size reduction while maintaining acceptable visual quality. You can adjust compression settings to find the perfect balance for your needs.</p>
            </details>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
