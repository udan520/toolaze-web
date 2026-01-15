import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import ImageConverter from '@/components/ImageConverter'
import Hero from '@/components/blocks/Hero'
import FAQ from '@/components/blocks/FAQ'
import Intro from '@/components/blocks/Intro'
import Specs from '@/components/blocks/Specs'
import Scenarios from '@/components/blocks/Scenarios'
import Comparison from '@/components/blocks/Comparison'
import HowToUse from '@/components/blocks/HowToUse'
import WhyToolaze from '@/components/blocks/WhyToolaze'
import Rating from '@/components/blocks/Rating'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Free Image Converter - Batch Convert Images Online | Toolaze',
    description: 'Convert images between JPG, PNG, and WebP formats. Batch convert up to 100 images. Fast, private, 100% free. No sign-up required.',
  }
}

export default function ImageConverterPage() {
  return (
    <>
      <Navigation />
      
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Image Converter' },
      ]} />

      <main className="min-h-screen bg-[#F8FAFF]">
        {/* 1. Hero 板块 - 包含标题、描述、工具卡片和信任条 */}
        <header className="bg-[#F8FAFF] pb-12 px-6">
          <div className="max-w-4xl mx-auto text-center pt-8 mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
              Free <span className="text-gradient">Image Converter</span>
            </h1>
            <p className="desc-text text-lg md:text-xl max-w-2xl mx-auto">
              Convert images between JPG, PNG, and WebP formats. Batch convert up to 100 images. Fast, private, 100% free. No sign-up required.
            </p>
          </div>
          <ImageConverter />
        </header>

        {/* 3. Why Toolaze 板块 */}
        <section className="bg-white py-24 px-6 border-t border-indigo-50/50">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-6">
              <span className="text-xs font-bold text-purple-500 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">Why Toolaze?</span>
              <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">Convert Images Without Quality Loss</h2>
              <p className="desc-text text-lg">Convert images between JPG, PNG, and WebP formats instantly. Our browser-based converter processes images locally, ensuring complete privacy and fast conversion. Perfect for web developers, designers, and content creators.</p>
            </div>
            <div className="grid gap-4">
              <div className="bg-[#F8FAFF] p-6 rounded-3xl border border-indigo-50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl">📂</div>
                <div>
                  <h4 className="font-bold text-slate-800">Batch Processing</h4>
                  <p className="text-xs text-slate-500">Convert up to 100 images at once</p>
                </div>
              </div>
              <div className="bg-[#F8FAFF] p-6 rounded-3xl border border-indigo-50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl">🎯</div>
                <div>
                  <h4 className="font-bold text-slate-800">Multiple Formats</h4>
                  <p className="text-xs text-slate-500">JPG, PNG, WebP, and HEIC support</p>
                </div>
              </div>
              <div className="bg-[#F8FAFF] p-6 rounded-3xl border border-indigo-50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">💎</div>
                <div>
                  <h4 className="font-bold text-slate-800">100% Free</h4>
                  <p className="text-xs text-slate-500">No ads forever.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. How To Use 板块 */}
        <section className="py-24 px-6 bg-[#F8FAFF]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-20">How to Use <span className="text-indigo-600">Toolaze?</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
              <div className="group">
                <div className="w-20 h-20 mb-8 mx-auto rounded-full bg-gradient-brand flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-white text-2xl font-bold">1</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Upload Images</h3>
                <p className="desc-text max-w-[240px] mx-auto">Drag and drop up to 100 images or folders. Supports JPG, PNG, WebP, BMP, and HEIC formats.</p>
              </div>
              <div className="group">
                <div className="w-20 h-20 mb-8 mx-auto rounded-full bg-gradient-brand flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-white text-2xl font-bold">2</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Choose Format</h3>
                <p className="desc-text max-w-[240px] mx-auto">Select your target format: JPG, PNG, or WebP. Our converter maintains quality during conversion.</p>
              </div>
              <div className="group">
                <div className="w-20 h-20 mb-8 mx-auto rounded-full bg-gradient-brand flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-white text-2xl font-bold">3</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Download Results</h3>
                <p className="desc-text max-w-[240px] mx-auto">Download individual converted images or all at once as a ZIP file. Fast and efficient.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Comparison 板块 */}
        <section className="py-24 px-6 bg-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 relative order-1">
              <div className="relative bg-white rounded-[2rem] p-10 shadow-2xl shadow-indigo-500/20 border border-white">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-brand text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg">Smart Choice</div>
                <h3 className="font-bold text-slate-900 text-xl mb-8 border-b border-indigo-50 pb-4">Toolaze 💎</h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✅</span>
                    <span>Batch up to 100 images</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✅</span>
                    <span>Multiple format support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✅</span>
                    <span>Quality preserved</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✅</span>
                    <span>100% private & free</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✅</span>
                    <span>No sign-up required</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="hidden md:flex md:col-span-2 justify-center order-2 font-black text-indigo-200 text-2xl">VS</div>
            <div className="md:col-span-5 bg-white/60 rounded-3xl p-8 border border-slate-200/60 opacity-80 grayscale order-3">
              <h3 className="font-bold text-slate-500 text-lg mb-8 border-b border-slate-200 pb-4">Other Tools</h3>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">❌</span>
                  <span>Limited batch size</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">❌</span>
                  <span>Format restrictions</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">❌</span>
                  <span>Quality loss</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">❌</span>
                  <span>Privacy concerns</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">❌</span>
                  <span>Registration required</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Scenarios 板块 */}
        <Scenarios data={[
          {
            icon: '💻',
            title: 'For Web Developers',
            description: 'Convert images to WebP for better performance. Optimize formats for faster page loads and improved SEO.'
          },
          {
            icon: '🎨',
            title: 'For Designers',
            description: 'Convert between formats for different design needs. Preserve transparency with PNG or optimize with JPG.'
          },
          {
            icon: '📱',
            title: 'For Content Creators',
            description: 'Batch convert images for social media and blogs. Ensure compatibility across all platforms.'
          }
        ]} />

        {/* 7. FAQ 板块 */}
        <FAQ items={[
              {
                q: "Which image formats are supported?",
                a: "Toolaze supports converting between JPG, PNG, and WebP formats. You can upload images in JPG, PNG, WebP, BMP, or HEIC format."
              },
              {
                q: "Is this tool really free?",
                a: "Yes! Toolaze is 100% free with no ads, no registration, and no hidden fees. All processing happens in your browser."
              },
              {
                q: "Can I convert more than 100 images?",
                a: "The maximum batch size is 100 files per session. For larger batches, simply process them in multiple sessions."
              },
              {
                q: "Are my images uploaded to a server?",
                a: "No! All image conversion happens locally in your browser using JavaScript. Your images never leave your device, ensuring complete privacy."
              },
              {
                q: "Will quality be preserved during conversion?",
                a: "Quality preservation depends on the target format. PNG is lossless, while JPG and WebP use lossy compression but maintain high visual quality."
              }
            ]} />

        {/* 8. Rating 板块 */}
        <Rating />
      </main>

      <Footer />
    </>
  )
}
