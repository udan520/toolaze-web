import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - Toolaze',
  description: 'Learn about Toolaze - Free AI image tools that run locally in your browser. Privacy-first, unlimited, forever free.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/about',
  },
}

export default function AboutPage() {
  return (
    <>
      <Navigation />
      
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'About Us' },
      ]} />

      <main className="max-w-4xl mx-auto py-20 px-6">
        <div className="text-center mb-20">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-6 leading-tight">
            We Handle the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Tool</span>.<br />
            You Handle the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Laze</span>.
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Productivity isn&apos;t about working harder. It&apos;s about being smart enough to let AI do the heavy lifting.
          </p>
        </div>

        <div className="space-y-20">
          <div className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-indigo-50 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 text-[10rem] font-black text-slate-50 opacity-50 select-none pointer-events-none">Zzz</div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-6 relative z-10">Why &quot;Toolaze&quot;?</h2>
            <div className="space-y-6 text-slate-500 leading-relaxed text-lg relative z-10">
              <p>
                The name comes from a simple philosophy: <strong className="text-slate-900">Tool + Laze</strong>.
              </p>
              <p>
                We believe that as a creator, your energy is finite. Every minute you spend resizing images, converting formats, or worrying about server privacy is a minute stolen from your creativity.
              </p>
              <p>
                We built <strong className="text-slate-900">Toolaze</strong> to be the ultimate &quot;lazy&quot; solution. We use advanced <strong className="text-indigo-600">Local AI</strong> to automate the boring technical stuff instantly in your browser. No uploads, no waiting, no friction.
              </p>
              <p className="font-bold text-indigo-600">
                So go ahead, be a little lazy. We&apos;ve got the tools covered.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2rem] border border-indigo-50 text-center hover:-translate-y-1 transition-transform group">
              <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🧘</div>
              <h3 className="font-bold text-slate-900 text-lg mb-3">Laze on Privacy</h3>
              <p className="text-sm text-slate-500">Relax. Your files never leave your device. Zero risk of data leaks means zero anxiety for you.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-indigo-50 text-center hover:-translate-y-1 transition-transform group">
              <div className="w-16 h-16 mx-auto bg-purple-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🚀</div>
              <h3 className="font-bold text-slate-900 text-lg mb-3">Laze on Waiting</h3>
              <p className="text-sm text-slate-500">Why wait for uploads? Our local WebAssembly engine processes files instantly. Done in a blink.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-indigo-50 text-center hover:-translate-y-1 transition-transform group">
              <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">💸</div>
              <h3 className="font-bold text-slate-900 text-lg mb-3">Laze on Cost</h3>
              <p className="text-sm text-slate-500">Keep your wallet shut. We don&apos;t have expensive server bills, so you don&apos;t have to pay subscription fees.</p>
            </div>
          </div>

          <div className="text-center py-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to work less?</h3>
            <p className="text-slate-500 mb-8">Try our tools and reclaim your creative time.</p>
            <Link href="/" className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-1">
              Start Being Lazy Now →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
