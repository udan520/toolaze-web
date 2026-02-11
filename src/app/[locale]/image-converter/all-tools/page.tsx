import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { loadCommonTranslations, getAllSlugs, getSeoContent } from '@/lib/seo-loader'
import ToolCard from '@/components/ToolCard'
import Link from 'next/link'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export async function generateStaticParams() {
  const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const pathWithoutLocale = '/image-converter/all-tools'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  
  const t = await loadCommonTranslations(locale)
  const breadcrumbT = t?.breadcrumb || { home: 'Home', imageConverter: 'Image Converter' }
  
  return {
    title: `All Image Converter Tools - ${breadcrumbT.imageConverter} | Toolaze`,
    description: 'Browse all image converter tools. Convert between JPG, PNG, WebP, and HEIC formats.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function AllToolsPage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const homeHref = locale === 'en' ? '/' : `/${locale}`
  
  const t = await loadCommonTranslations(locale)
  const breadcrumbT = t?.breadcrumb || { home: 'Home', imageConverter: 'Image Converter' }
  const commonT = t?.common || {}
  
  // 加载所有工具
  const allSlugs = await getAllSlugs('image-converter', locale)
  const allTools = await Promise.all(
    allSlugs.map(async (slug) => {
      try {
        const toolData = await getSeoContent('image-converter', slug, locale)
        const title = toolData?.hero?.h1 ? toolData.hero.h1.replace(/<[^>]*>/g, '').trim() : slug
        const description = toolData?.hero?.desc || toolData?.metadata?.description || ''
        const shortDesc = description.length > 120 ? description.substring(0, 120) + '...' : description
        const isInMenu = toolData?.in_menu !== false
        
        return {
          slug,
          title,
          description: shortDesc,
          href: locale === 'en' ? `/image-converter/${slug}` : `/${locale}/image-converter/${slug}`,
          inMenu: isInMenu,
        }
      } catch {
        return null
      }
    })
  )
  
  const filteredTools = allTools.filter((tool): tool is { slug: string; title: string; description: string; href: string; inMenu: boolean } => 
    tool !== null && tool.title !== undefined && tool.href !== undefined
  )
  
  // 分类：菜单中的工具和长尾页面
  const menuTools = filteredTools.filter(tool => tool.inMenu)
  const longTailTools = filteredTools.filter(tool => !tool.inMenu)
  
  return (
    <>
      <Navigation />
      
      <Breadcrumb items={[
        { label: breadcrumbT.home, href: homeHref },
        { label: breadcrumbT.imageConverter, href: locale === 'en' ? '/image-converter' : `/${locale}/image-converter` },
        { label: commonT.allTools || 'All Tools' },
      ]} />

      <main className="min-h-screen bg-[#F8FAFF]">
        {/* Hero 板块 */}
        <header className="bg-[#F8FAFF] pb-12 px-6">
          <div className="max-w-4xl mx-auto text-center pt-8 mb-12">
            <h1 className="text-2xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
              {commonT.allImageConverterTools ? (
                <>
                  {commonT.allImageConverterTools.split(' ')[0]} <span className="text-gradient">{commonT.allImageConverterTools.split(' ').slice(1).join(' ')}</span>
                </>
              ) : (
                <>All <span className="text-gradient">Image Converter Tools</span></>
              )}
            </h1>
            <p className="desc-text text-lg md:text-xl max-w-2xl mx-auto">
              {commonT.allImageConverterToolsDesc || 'Browse all available image converter tools. Convert between JPG, PNG, WebP, and HEIC formats.'}
            </p>
          </div>
        </header>

        {/* Primary Tools 板块 */}
        {menuTools.length > 0 && (
          <section className="py-24 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-4">
                {commonT.primaryTools || 'Primary Tools'}
              </h2>
              <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
                {commonT.primaryConverterToolsDesc || 'Essential converter tools for general use cases.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuTools.map((tool, idx) => {
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
        )}

        {/* Long-tail Tools 板块 */}
        {longTailTools.length > 0 && (
          <section className="py-24 px-6 bg-[#F8FAFF]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-4">
                {commonT.specializedTools || 'Specialized Tools'}
              </h2>
              <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
                {commonT.specializedConverterToolsDesc || 'Specialized converter tools for specific platforms and use cases.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {longTailTools.map((tool, idx) => {
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
                    />
                  )
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}
