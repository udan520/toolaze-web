import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import { loadCommonTranslations, getAllSlugs, getSeoContent } from '@/lib/seo-loader'
import ToolCard from '@/components/ToolCard'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await loadCommonTranslations('en')
  const breadcrumbT = t?.breadcrumb || { home: 'Home', emojiCopyAndPaste: 'Emoji Copy & Paste' }

  return {
    title: `All Emoji Copy & Paste Tools | Toolaze`,
    description: 'Browse all emoji copy and paste pages. Crying emoji, cross emoji, fire emoji, birthday emoji, cat emoji, and more. Copy and paste emojis online for free.',
    robots: 'index, follow',
    alternates: {
      canonical: 'https://toolaze.com/emoji-copy-and-paste/all-tools',
    },
  }
}

export default async function AllToolsPage() {
  const locale = 'en'
  const homeHref = '/'

  const t = await loadCommonTranslations(locale)
  const breadcrumbT = t?.breadcrumb || { home: 'Home', emojiCopyAndPaste: 'Emoji Copy & Paste' }
  const commonT = t?.common || {}

  const allSlugs = await getAllSlugs('emoji-copy-and-paste', locale)
  const allTools = await Promise.all(
    allSlugs.map(async (slug) => {
      try {
        const toolData = await getSeoContent('emoji-copy-and-paste', slug, locale)
        const title = toolData?.hero?.h1 ? toolData.hero.h1.replace(/<[^>]*>/g, '').trim() : slug
        const description = toolData?.hero?.desc || toolData?.metadata?.description || ''
        const shortDesc = description.length > 120 ? description.substring(0, 120) + '...' : description

        return {
          slug,
          title,
          description: shortDesc,
          href: `/emoji-copy-and-paste/${slug}`,
        }
      } catch {
        return null
      }
    })
  )

  const filteredTools = allTools.filter(
    (tool): tool is { slug: string; title: string; description: string; href: string } =>
      tool !== null && tool.title !== undefined && tool.href !== undefined
  )

  return (
    <>
      <Navigation />

      <Breadcrumb
        items={[
          { label: breadcrumbT.home, href: homeHref },
          { label: breadcrumbT.emojiCopyAndPaste, href: '/emoji-copy-and-paste' },
          { label: commonT.viewAllTools?.all || 'All Tools' },
        ]}
      />

      <main className="min-h-screen bg-[#F8FAFF]">
        <header className="bg-[#F8FAFF] pb-12 px-6">
          <div className="max-w-4xl mx-auto text-center pt-8 mb-12">
            <h1 className="text-2xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
              All <span className="text-gradient">Emoji Copy & Paste</span> Tools
            </h1>
            <p className="desc-text text-lg md:text-xl max-w-2xl mx-auto">
              Browse all emoji copy and paste pages. Find crying emoji, cross emoji, fire emoji, birthday emoji, cat emoji, and more. Copy and paste emojis online for free.
            </p>
          </div>
        </header>

        {filteredTools.length > 0 && (
          <section className="py-24 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-12">
                {commonT.emojiCopyAndPaste?.moreTools || 'More Emoji Copy & Paste'}
              </h2>
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
        )}
      </main>

      <Footer />
    </>
  )
}
