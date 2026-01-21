import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { loadCommonTranslations, getAllSlugs, getSeoContent } from '@/lib/seo-loader'
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
  const pathWithoutLocale = '/image-compressor/all-tools'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  
  const t = await loadCommonTranslations(locale)
  const breadcrumbT = t?.breadcrumb || { home: 'Home', imageCompression: 'Image Compression' }
  
  return {
    title: `All Image Compression Tools - ${breadcrumbT.imageCompression} | Toolaze`,
    description: 'Browse all image compression tools for specific platforms and use cases. Find the perfect tool for your needs.',
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
  const breadcrumbT = t?.breadcrumb || { home: 'Home', imageCompression: 'Image Compression' }
  
  // 加载所有工具
  const allSlugs = await getAllSlugs('image-compressor', locale)
  const allTools = await Promise.all(
    allSlugs.map(async (slug) => {
      try {
        const toolData = await getSeoContent('image-compressor', slug, locale)
        const title = toolData?.hero?.h1 ? toolData.hero.h1.replace(/<[^>]*>/g, '').trim() : slug
        const description = toolData?.hero?.desc || toolData?.metadata?.description || ''
        const shortDesc = description.length > 120 ? description.substring(0, 120) + '...' : description
        const isInMenu = toolData?.in_menu !== false
        
        return {
          slug,
          title,
          description: shortDesc,
          href: locale === 'en' ? `/image-compressor/${slug}` : `/${locale}/image-compressor/${slug}`,
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
        { label: breadcrumbT.imageCompression, href: locale === 'en' ? '/image-compressor' : `/${locale}/image-compressor` },
        { label: 'All Tools' },
      ]} />

      <main className="min-h-screen bg-[#F8FAFF]">
        {/* Hero 板块 */}
        <header className="bg-[#F8FAFF] pb-12 px-6">
          <div className="max-w-4xl mx-auto text-center pt-8 mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
              All <span className="text-gradient">Image Compression Tools</span>
            </h1>
            <p className="desc-text text-lg md:text-xl max-w-2xl mx-auto">
              Browse all available image compression tools. Find the perfect tool for your specific needs.
            </p>
          </div>
        </header>

        {/* Primary Tools 板块 */}
        {menuTools.length > 0 && (
          <section className="py-24 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-4">
                Primary Tools
              </h2>
              <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
                Essential compression tools for general use cases.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={tool.href}
                    className="bg-[#F8FAFF] p-6 rounded-3xl border border-indigo-50 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
                  >
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {tool.description}
                    </p>
                    <div className="mt-4 text-sm font-bold text-indigo-600 group-hover:text-purple-600 transition-colors">
                      Try Now →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Long-tail Tools 板块 */}
        {longTailTools.length > 0 && (
          <section className="py-24 px-6 bg-[#F8FAFF]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-4">
                Specialized Tools
              </h2>
              <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
                Specialized compression tools for specific platforms and use cases.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {longTailTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={tool.href}
                    className="bg-white p-6 rounded-3xl border border-indigo-50 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
                  >
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {tool.description}
                    </p>
                    <div className="mt-4 text-sm font-bold text-indigo-600 group-hover:text-purple-600 transition-colors">
                      Try Now →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}
