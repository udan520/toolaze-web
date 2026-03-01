import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { loadCommonTranslations, getAllSlugs, getSeoContent } from '@/lib/seo-loader'
import ToolCard from '@/components/ToolCard'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const pathWithoutLocale = '/seedance-2/all-tools'
  const hreflang = generateHreflangAlternates('en', pathWithoutLocale)
  
  return {
    title: 'All Seedance 2.0 AI Video Tools - Toolaze',
    description: 'Browse all Seedance 2.0 AI video generation tools. Text to video, image to video, and more. Free online. No sign-up required.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function Seedance2AllToolsPage() {
  const locale = 'en'
  const t = await loadCommonTranslations(locale)
  const commonT = t?.common || {}
  
  const allSlugs = await getAllSlugs('seedance-2', locale)
  const allTools = await Promise.all(
    allSlugs.map(async (slug) => {
      try {
        const toolData = await getSeoContent('seedance-2', slug, locale)
        const title = toolData?.hero?.h1 ? toolData.hero.h1.replace(/<[^>]*>/g, '').trim() : slug
        const description = toolData?.hero?.desc || toolData?.metadata?.description || ''
        const shortDesc = description.length > 120 ? description.substring(0, 120) + '...' : description
        
        return {
          slug,
          title,
          description: shortDesc,
          href: `/seedance-2/${slug}`,
        }
      } catch {
        return null
      }
    })
  )
  
  const filteredTools = allTools.filter((tool): tool is { slug: string; title: string; description: string; href: string } => 
    tool !== null && tool.title !== undefined && tool.href !== undefined
  )
  
  return (
    <>
      <Navigation />
      
      <Breadcrumb items={[
        { label: t?.breadcrumb?.home || 'Home', href: '/' },
        { label: 'Seedance 2.0', href: '/seedance-2' },
        { label: commonT.allTools || 'All Tools' },
      ]} />

      <main className="min-h-screen bg-[#F8FAFF]">
        <header className="bg-[#F8FAFF] pb-12 px-6">
          <div className="max-w-4xl mx-auto text-center pt-8 mb-12">
            <h1 className="text-[40px] font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
              All <span className="text-gradient">Seedance 2.0</span> AI Video Tools
            </h1>
            <p className="desc-text text-lg md:text-xl max-w-2xl mx-auto">
              Browse all Seedance 2.0 AI video generation tools. Text to video, image to video, and more. Free online.
            </p>
          </div>
        </header>

        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool, idx) => {
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
