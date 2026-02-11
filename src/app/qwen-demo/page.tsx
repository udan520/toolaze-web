import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image to Image - AI Image Editor | Toolaze',
  description: 'Transform images with AI. Image to image generation online.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/qwen-demo',
  },
}

export default function QwenDemoPage() {
  return (
    <>
      <Navigation />

      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Image to Image' },
      ]} />

      <main className="max-w-4xl mx-auto py-20 px-6">
        <div className="text-center mb-12">
          <h1 className="text-[40px] font-extrabold text-slate-900 mb-4 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Image to Image</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Transform your images with AI. (Page placeholder — add your UI here.)
          </p>
        </div>

        <div className="bg-white p-10 rounded-[2rem] border border-indigo-50 shadow-lg shadow-indigo-100/50 text-center">
          <p className="text-slate-500 mb-6">图生图功能占位页，可在此接入实际生成逻辑。</p>
          <Link href="/" className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity">
            Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </>
  )
}
