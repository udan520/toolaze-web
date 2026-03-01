import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { loadCommonTranslations } from '@/lib/seo-loader'
import ToolCard from '@/components/ToolCard'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const pathWithoutLocale = '/kling-3/all-tools'
  const hreflang = generateHreflangAlternates('en', pathWithoutLocale)

  return {
    title: 'All Kling 3.0 AI Video Tools - Toolaze',
    description: 'Browse all Kling 3.0 AI video generation tools. 4K output, 6-shot multi-shot, multilingual audio. Free online. No sign-up required.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function Kling3AllToolsPage() {
  const locale = 'en'
  const t = await loadCommonTranslations(locale)
  const commonT = t?.common || {}

  // Kling 3.0 目前仅有 L2 主页面，无 L3 子页面；展示主工具卡片
  const tools = [
    {
      slug: 'ai-video-generator',
      title: 'Kling 3.0 AI Video Generator',
      description: 'Create 4K AI videos with text, image, video, and audio inputs. Native 4K, 6-shot multi-shot, multilingual audio. Free online.',
      href: '/kling-3',
    },
  ]

  return (
    <>
      <Navigation />

      <Breadcrumb items={[
        { label: t?.breadcrumb?.home || 'Home', href: '/' },
        { label: 'Kling 3.0', href: '/kling-3' },
        { label: commonT.allTools || 'All Tools' },
      ]} />

      <main className="min-h-screen bg-[#F8FAFF]">
        <header className="bg-[#F8FAFF] pb-12 px-6">
          <div className="max-w-4xl mx-auto text-center pt-8 mb-12">
            <h1 className="text-[40px] font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
              All <span className="text-gradient">Kling 3.0</span> AI Video Tools
            </h1>
            <p className="desc-text text-lg md:text-xl max-w-2xl mx-auto">
              Browse all Kling 3.0 AI video generation tools. 4K output, 6-shot multi-shot, multilingual audio. Free online.
            </p>
          </div>
        </header>

        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, idx) => {
                const iconBgColors: Array<'indigo' | 'purple' | 'blue'> = ['indigo', 'purple', 'blue']
                const iconBgColor = iconBgColors[idx % 3] as 'indigo' | 'purple' | 'blue'

                return (
                  <ToolCard
                    key={tool.slug}
                    title={tool.title}
                    description={tool.description}
                    href={tool.href}
                    iconBgColor={iconBgColor}
                    tryNowText={commonT.tryNow || 'Try Now →'}
                    className="bg-[#F8FAFF]"
                  />
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
