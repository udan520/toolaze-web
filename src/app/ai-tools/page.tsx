import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: 'AI Tools - Watermark Remover & Photo Restoration | Toolaze',
  description:
    'Explore Toolaze AI tools with visual previews. Use AI Watermark Remover and Photo Restoration online for free.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/ai-tools',
  },
}

const AI_TOOL_CARDS = [
  {
    title: 'Watermark Remover',
    href: '/watermark-remover',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    description: 'Remove watermarks from photos online with AI in one click.',
  },
  {
    title: 'Photo Restoration',
    href: '/photo-restoration',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    description: 'Restore and colorize old photos with AI while improving detail.',
  },
]

export default function AIToolsPage() {
  return (
    <>
      <Navigation />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'AI Tools' }]} />
      <main className="min-h-screen bg-[#F8FAFF] px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-[40px] font-extrabold tracking-tight text-slate-900 mb-4">
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Tools</span>
          </h1>
          <p className="text-slate-600 text-lg mb-10 max-w-3xl">
            Use AI-powered image tools with clear visual previews. Choose a feature and start in seconds.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {AI_TOOL_CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group bg-white rounded-3xl border border-indigo-100 shadow-sm overflow-hidden hover:border-indigo-200 transition-colors"
              >
                <div className="w-full aspect-[4/3] overflow-hidden">
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </h2>
                  <p className="text-sm text-slate-600">{card.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
