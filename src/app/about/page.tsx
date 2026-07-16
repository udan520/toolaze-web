import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - Toolaze',
  description: 'Learn why Toolaze exists: practical AI creative tools, supported model workflows, one-time credits, and clear usage policies.',
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

      <main className="mx-auto max-w-5xl px-6 py-20">
        <section className="mb-20 text-center">
          <h1 className="mb-6 text-[40px] font-extrabold leading-tight text-slate-900 md:text-[48px]">
            We Handle the <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Tool</span>.<br />
            You Handle the <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Laze</span>.
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-500">
            Productivity is not about doing every tiny task yourself. It is about knowing when the right tool can carry the boring part.
          </p>
        </section>

        <div className="space-y-20">
          <section className="relative overflow-hidden rounded-[2.5rem] border border-indigo-50 bg-white p-10 shadow-xl shadow-indigo-100/50 md:p-14">
            <div className="pointer-events-none absolute -right-10 -top-10 select-none text-[10rem] font-black text-slate-50 opacity-70">Zzz</div>

            <h2 className="relative z-10 mb-6 text-3xl font-bold text-slate-900">Why &quot;Toolaze&quot;?</h2>
            <div className="relative z-10 space-y-6 text-lg leading-relaxed text-slate-500">
              <p>
                The name comes from a simple philosophy: <strong className="text-slate-900">Tool + Laze</strong>.
              </p>
              <p>
                As a creator, your energy is finite. Every minute spent resizing images, converting formats, testing prompts, comparing model workflows, or checking usage rules is a minute stolen from the work that actually needs your taste.
              </p>
              <p>
                Toolaze brings practical media utilities and AI creative workflows into one place. AI generation runs through Toolaze interfaces for supported third-party AI workflows, integrations, and cloud infrastructure when a model workflow needs them.
              </p>
              <p className="font-bold text-indigo-600">
                So go ahead, be a little lazy. We&apos;ve got the tools covered.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <article className="group rounded-[2rem] border border-indigo-50 bg-white p-8 text-center transition-transform hover:-translate-y-1">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl transition-transform group-hover:scale-110">🧘</div>
              <h3 className="mb-3 text-lg font-bold text-slate-900">Laze on Busywork</h3>
              <p className="text-sm leading-6 text-slate-500">
                Compress, convert, restore, generate, and preview creative assets without stitching together a dozen separate workflows.
              </p>
            </article>
            <article className="group rounded-[2rem] border border-indigo-50 bg-white p-8 text-center transition-transform hover:-translate-y-1">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-3xl transition-transform group-hover:scale-110">🚀</div>
              <h3 className="mb-3 text-lg font-bold text-slate-900">Laze on Model Hopping</h3>
              <p className="text-sm leading-6 text-slate-500">
                Use a Toolaze interface for supported image and video model workflows instead of jumping between model sites for every task.
              </p>
            </article>
            <article className="group rounded-[2rem] border border-indigo-50 bg-white p-8 text-center transition-transform hover:-translate-y-1">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl transition-transform group-hover:scale-110">💎</div>
              <h3 className="mb-3 text-lg font-bold text-slate-900">Laze on Guesswork</h3>
              <p className="text-sm leading-6 text-slate-500">
                Toolaze uses one-time credits for supported AI generation, clear refund terms for unused credits, and credit returns for confirmed failed generations.
              </p>
            </article>
          </section>

          <section className="rounded-[2rem] border border-indigo-100 bg-[#F8FAFF] p-8 md:p-10">
            <h2 className="mb-4 text-2xl font-extrabold text-slate-900">How processing works</h2>
            <div className="space-y-4 text-base leading-7 text-slate-600">
              <p>
                Some utility tools may run in the browser where that makes sense. AI generation features may securely transmit prompts, uploaded media, generation settings, and outputs to third-party AI model providers and cloud infrastructure as required to deliver the requested result.
              </p>
              <p>
                Model and brand names identify supported third-party AI workflows available through Toolaze. Product names, trademarks, and model names belong to their respective owners.
              </p>
            </div>
          </section>

          <section className="py-10 text-center">
            <h3 className="mb-4 text-2xl font-bold text-slate-900">Ready to work less?</h3>
            <p className="mb-8 text-slate-500">Try Toolaze and reclaim more of your creative time.</p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/" className="inline-block rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-10 py-4 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1 hover:shadow-indigo-300">
                Start Being Lazy Now →
              </Link>
              <Link href="/contact" className="inline-block rounded-full border border-indigo-100 bg-white px-8 py-4 font-bold text-indigo-600 transition-all hover:-translate-y-1 hover:border-indigo-200 hover:bg-indigo-50">
                Contact Support
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
