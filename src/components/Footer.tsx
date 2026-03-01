'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getAllSlugs, getSeoContent } from '@/lib/seo-loader'

// 翻译数据(默认英语)
const defaultTranslations = {
  home: 'Home',
  allTools: 'All Tools',
  aboutUs: 'About Us',
  privacyPolicy: 'Privacy Policy',
  termsOfService: 'Terms of Service',
  contact: 'Contact',
  language: 'Language',
  copyright: '© {year} Toolaze Lab. All rights reserved.',
  tagline: 'Free Online Tools • No Registration Required • 100% Private',
  quickTools: 'Quick Tools',
  aiVideo: 'AI Video',
  aiImage: 'AI Image',
  imageCompression: 'Image Compression',
  imageConverter: 'Image Converter',
  fontGenerator: 'Font Generator',
  emojiCopyAndPaste: 'Emoji Copy & Paste',
  seedance2: 'Seedance 2.0',
  kling3: 'Kling 3.0',
  nanoBananaPro: 'Nano Banana Pro',
  nanoBanana2: 'Nano Banana 2'
}

// 加载翻译的函数
async function loadTranslations(locale: string) {
  try {
    let normalizedLocale = locale
    if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') {
      normalizedLocale = 'zh-TW'
    }
    
    if (normalizedLocale === 'en') {
      const data = await import('@/data/en/common.json')
      const footerData = data.default?.footer || {}
      const navData = data.default?.nav || {}
      return {
        ...defaultTranslations,
        ...footerData,
        // 从nav中获取二级菜单的翻译
        aiVideo: navData.aiVideo || footerData.aiVideo || defaultTranslations.aiVideo,
        aiImage: navData.aiImage || footerData.aiImage || defaultTranslations.aiImage,
        imageCompression: navData.imageCompression || footerData.imageCompression || defaultTranslations.imageCompression,
        imageConverter: navData.imageConverter || footerData.imageConverter || defaultTranslations.imageConverter,
        fontGenerator: navData.fontGenerator || footerData.fontGenerator || defaultTranslations.fontGenerator,
        emojiCopyAndPaste: navData.emojiCopyAndPaste || footerData.emojiCopyAndPaste || defaultTranslations.emojiCopyAndPaste,
        seedance2: navData.seedance2 || footerData.seedance2 || defaultTranslations.seedance2,
        kling3: navData.kling3 || footerData.kling3 || defaultTranslations.kling3,
        nanoBananaPro: navData.nanoBananaPro || footerData.nanoBananaPro || defaultTranslations.nanoBananaPro,
        nanoBanana2: navData.nanoBanana2 || footerData.nanoBanana2 || defaultTranslations.nanoBanana2,
      }
    }
    
    try {
      const data = await import(`@/data/${normalizedLocale}/common.json`)
      const footerData = data.default?.footer || {}
      const navData = data.default?.nav || {}
      return {
        ...defaultTranslations,
        ...footerData,
        // 从nav中获取二级菜单的翻译
        aiVideo: navData.aiVideo || footerData.aiVideo || defaultTranslations.aiVideo,
        aiImage: navData.aiImage || footerData.aiImage || defaultTranslations.aiImage,
        imageCompression: navData.imageCompression || footerData.imageCompression || defaultTranslations.imageCompression,
        imageConverter: navData.imageConverter || footerData.imageConverter || defaultTranslations.imageConverter,
        fontGenerator: navData.fontGenerator || footerData.fontGenerator || defaultTranslations.fontGenerator,
        emojiCopyAndPaste: navData.emojiCopyAndPaste || footerData.emojiCopyAndPaste || defaultTranslations.emojiCopyAndPaste,
        seedance2: navData.seedance2 || footerData.seedance2 || defaultTranslations.seedance2,
        kling3: navData.kling3 || footerData.kling3 || defaultTranslations.kling3,
        nanoBananaPro: navData.nanoBananaPro || footerData.nanoBananaPro || defaultTranslations.nanoBananaPro,
        nanoBanana2: navData.nanoBanana2 || footerData.nanoBanana2 || defaultTranslations.nanoBanana2,
      }
    } catch {
      return defaultTranslations
    }
  } catch {
    return defaultTranslations
  }
}

const locales = [
  { code: 'en', name: 'English', countryCode: 'US', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', countryCode: 'DE', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', countryCode: 'JP', flag: '🇯🇵' },
  { code: 'es', name: 'Español', countryCode: 'ES', flag: '🇪🇸' },
  { code: 'zh-TW', name: '中文(繁體)', countryCode: 'CN', flag: '🇨🇳' },
  { code: 'pt', name: 'Português', countryCode: 'PT', flag: '🇵🇹' },
  { code: 'fr', name: 'Français', countryCode: 'FR', flag: '🇫🇷' },
  { code: 'ko', name: '한국어', countryCode: 'KR', flag: '🇰🇷' },
  { code: 'it', name: 'Italiano', countryCode: 'IT', flag: '🇮🇹' },
]

// 格式化工具标题
function extractPageTitle(h1: string): string {
  if (!h1) return ''
  let cleanH1 = h1.replace(/<[^>]*>/g, '')
  if (/^[a-zA-Z]/.test(cleanH1)) {
    cleanH1 = cleanH1.replace(/^(Compress|Free|Convert|Optimize|Reduce|Generate|Create)\s+/i, '')
    cleanH1 = cleanH1.replace(/\s+(Compression|Tool|Compressor|Converter|Optimizer|Generator)$/i, '')
  }
  return cleanH1.trim() || h1.replace(/<[^>]*>/g, '')
}

export default function Footer() {
  // Use a static year initially to avoid hydration mismatch
  // The year will be updated on client side after hydration
  const [currentYear, setCurrentYear] = useState(2024)
  const [currentLocale, setCurrentLocale] = useState<string>('en')
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const [translations, setTranslations] = useState(defaultTranslations)
  const [isMounted, setIsMounted] = useState(false)
  const [footerMenuData, setFooterMenuData] = useState<{
    'image-compressor': Array<{slug: string, title: string, href: string}>
    'image-converter': Array<{slug: string, title: string, href: string}>
    'font-generator': Array<{slug: string, title: string, href: string}>
    'emoji-copy-and-paste': Array<{slug: string, title: string, href: string}>
  }>({
    'image-compressor': [],
    'image-converter': [],
    'font-generator': [],
    'emoji-copy-and-paste': []
  })
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
    // Update year after hydration to ensure it's current
    setCurrentYear(new Date().getFullYear())
    
    // Extract locale from pathname
    // English is default and doesn't show /en in URL
    const pathParts = pathname?.split('/').filter(Boolean) || []
    const firstPart = pathParts[0] || ''
    
    // Check if first part is a locale code
    const localeFromPath = locales.find(loc => loc.code === firstPart)
    const detectedLocale = localeFromPath ? localeFromPath.code : 'en'
    setCurrentLocale(detectedLocale)
    
    // Load translations
    loadTranslations(detectedLocale).then(setTranslations)
  }, [pathname])

  // 加载页脚菜单数据
  useEffect(() => {
    const loadFooterMenuData = async () => {
      const locale = currentLocale
      
      // 生成带语言前缀的链接的辅助函数
      const getHref = (href: string): string => {
        if (href.startsWith('http')) return href
        if (locale === 'en') return href
        if (href.startsWith(`/${locale}`)) return href
        return `/${locale}${href}`
      }
      
      const data: {
        'image-compressor': Array<{slug: string, title: string, href: string}>
        'image-converter': Array<{slug: string, title: string, href: string}>
        'font-generator': Array<{slug: string, title: string, href: string}>
        'emoji-copy-and-paste': Array<{slug: string, title: string, href: string}>
      } = {
        'image-compressor': [],
        'image-converter': [],
        'font-generator': [],
        'emoji-copy-and-paste': []
      }
      
      // 加载 Image Compressor 的三级菜单（只显示 in_menu: true 的工具，最多显示8个）
      try {
        const compressorSlugs = await getAllSlugs('image-compressor', locale)
        if (compressorSlugs && compressorSlugs.length > 0) {
          const compressorItems = await Promise.all(
            compressorSlugs.map(async (slug) => {
              try {
                const toolData = await getSeoContent('image-compressor', slug, locale)
                // 只显示 in_menu: true 的工具
                if (toolData?.in_menu !== true) {
                  return null
                }
                let title = slug
                if (toolData?.hero?.h1) {
                  // 直接使用原始h1标题，移除HTML标签即可
                  title = toolData.hero.h1.replace(/<[^>]*>/g, '').trim()
                  if (!title) title = slug
                }
                return {
                  slug,
                  title,
                  href: getHref(`/image-compressor/${slug}`),
                }
              } catch (err) {
                return null
              }
            })
          )
          // 过滤并限制最多8个
          const filteredItems = compressorItems.filter((item): item is { slug: string; title: string; href: string } => 
            item !== null && item.title !== undefined && item.href !== undefined
          )
          data['image-compressor'] = filteredItems.slice(0, 8)
        }
      } catch (error) {
        console.error('Failed to load image-compressor menu items:', error)
      }
      
      // 加载 Image Converter 的三级菜单（只显示 in_menu: true 的工具，最多显示8个）
      try {
        const converterSlugs = await getAllSlugs('image-converter', locale)
        if (converterSlugs && converterSlugs.length > 0) {
          const converterItems = await Promise.all(
            converterSlugs.slice(0, 8).map(async (slug) => {
              try {
                const toolData = await getSeoContent('image-converter', slug, locale)
                if (toolData?.in_menu === false) {
                  return null
                }
                let title = slug
                if (toolData?.hero?.h1) {
                  // 直接使用原始h1标题，移除HTML标签即可
                  title = toolData.hero.h1.replace(/<[^>]*>/g, '').trim()
                  if (!title) title = slug
                }
                return {
                  slug,
                  title,
                  href: getHref(`/image-converter/${slug}`),
                }
              } catch (err) {
                return null
              }
            })
          )
          data['image-converter'] = converterItems.filter((item): item is { slug: string; title: string; href: string } => 
            item !== null && item.title !== undefined && item.href !== undefined
          )
        }
      } catch (error) {
        console.error('Failed to load image-converter menu items:', error)
      }
      
      // 加载 Font Generator 的三级菜单（显示搜索量最大的8个）
      const topFontGeneratorSlugs = ['cursive', 'fancy', 'bold', 'tattoo', 'cool', 'instagram', 'italic', 'gothic']
      try {
        const fontGeneratorSlugs = await getAllSlugs('font-generator', locale)
        const topSlugs = fontGeneratorSlugs.filter(slug => topFontGeneratorSlugs.includes(slug))
        const sortedSlugs = topSlugs.sort((a, b) => {
          const indexA = topFontGeneratorSlugs.indexOf(a)
          const indexB = topFontGeneratorSlugs.indexOf(b)
          return indexA - indexB
        })
        
        const fontGeneratorItems = await Promise.all(
          sortedSlugs.map(async (slug) => {
            try {
              const toolData = await getSeoContent('font-generator', slug, locale)
              if (toolData?.in_menu === false) {
                return null
              }
              let title = slug
              if (toolData?.hero?.h1) {
                title = extractPageTitle(toolData.hero.h1)
                if (!title) title = slug
              }
              return {
                slug,
                title,
                href: getHref(`/font-generator/${slug}`),
              }
            } catch (err) {
              return null
            }
          })
        )
        data['font-generator'] = fontGeneratorItems.filter((item): item is { slug: string; title: string; href: string } => 
          item !== null && item.title !== undefined && item.href !== undefined
        )
      } catch (error) {
        console.error('Failed to load font-generator menu items:', error)
      }
      
      // 加载 Emoji Copy & Paste 的三级菜单（全部 6 个 L3 页面）
      try {
        const emojiSlugs = await getAllSlugs('emoji-copy-and-paste', locale)
        if (emojiSlugs && emojiSlugs.length > 0) {
          const emojiItems = await Promise.all(
            emojiSlugs.map(async (slug) => {
              try {
                const toolData = await getSeoContent('emoji-copy-and-paste', slug, locale)
                if (toolData?.in_menu === false) return null
                let title = slug
                if (toolData?.hero?.h1) {
                  title = toolData.hero.h1.replace(/<[^>]*>/g, '').trim()
                  if (!title) title = slug
                }
                return {
                  slug,
                  title,
                  href: getHref(`/emoji-copy-and-paste/${slug}`),
                }
              } catch (err) {
                return null
              }
            })
          )
          data['emoji-copy-and-paste'] = emojiItems.filter((item): item is { slug: string; title: string; href: string } =>
            item !== null && item.title !== undefined && item.href !== undefined
          )
        }
      } catch (error) {
        console.error('Failed to load emoji-copy-and-paste menu items:', error)
      }
      
      setFooterMenuData(data)
    }
    
    if (isMounted) {
      loadFooterMenuData()
    }
  }, [currentLocale, pathname, isMounted])

  // 检查页面是否支持多语言
  // 如果路径的第一部分是 locale 代码，或者路径包含支持多语言的工具，则支持多语言
  const hasMultilingualSupport = (): boolean => {
    if (!pathname) return false
    const pathParts = pathname.split('/').filter(Boolean)
    if (pathParts.length === 0) return false
    const firstPart = pathParts[0]
    
    // 如果路径的第一部分是 locale 代码，则支持多语言
    if (locales.some(loc => loc.code === firstPart)) {
      return true
    }
    
    // 仅当工具实际有多语言版本时才显示语言切换（emoji 仅英文，不显示）
    const multilingualTools = ['image-compressor', 'image-converter', 'font-generator']
    if (multilingualTools.some(tool => pathname.includes(`/${tool}`))) {
      return true
    }
    
    return false
  }

  const showLanguageSwitcher = hasMultilingualSupport()

  // Generate alternate language URLs
  const getAlternateLanguageUrl = (targetLocale: string): string => {
    if (!pathname) {
      // Root path
      return targetLocale === 'en' ? '/' : `/${targetLocale}`
    }
    
    const pathParts = pathname.split('/').filter(Boolean)
    const firstPart = pathParts[0] || ''
    
    // Check if current path has a locale
    const currentPathLocale = locales.find(loc => loc.code === firstPart)
    
    if (currentPathLocale) {
      // Replace current locale
      pathParts[0] = targetLocale === 'en' ? '' : targetLocale
      const newPath = pathParts.filter(Boolean).join('/')
      return newPath ? `/${newPath}` : '/'
    } else {
      // Current path is English (no locale prefix)
      if (targetLocale === 'en') {
        return pathname // Stay on same path for English
      }
      // Add locale prefix for other languages
      // 确保路径以 / 开头
      const pathWithSlash = pathname.startsWith('/') ? pathname : `/${pathname}`
      return `/${targetLocale}${pathWithSlash}`
    }
  }

  // 检查当前页面支持哪些语言
  const [supportedLocales, setSupportedLocales] = useState<typeof locales>([])
  
  useEffect(() => {
    const checkSupportedLocales = async () => {
      if (!pathname) {
        setSupportedLocales(locales)
        return
      }
      
      const pathParts = pathname.split('/').filter(Boolean)
      if (pathParts.length === 0) {
        setSupportedLocales(locales)
        return
      }
      
      // 检查第一个部分是否是locale代码
      const firstPart = pathParts[0]
      const isLocaleInPath = locales.some(loc => loc.code === firstPart)
      
      let tool: string | null = null
      let slug: string | null = null
      
      if (isLocaleInPath) {
        // 路径格式：/locale/tool 或 /locale/tool/slug
        if (pathParts.length >= 2) {
          tool = pathParts[1]
          if (pathParts.length >= 3) {
            slug = pathParts[2]
          }
        }
      } else {
        // 路径格式：/tool 或 /tool/slug（英语，无locale前缀）
        tool = pathParts[0]
        if (pathParts.length >= 2) {
          slug = pathParts[1]
        }
      }
      
      // 如果不是工具页面，支持所有语言
      const toolListForLocales = ['image-compressor', 'image-converter', 'font-generator', 'emoji-copy-and-paste']
      if (!tool || !toolListForLocales.includes(tool)) {
        setSupportedLocales(locales)
        return
      }
      
      // 检查哪些语言有内容（仅当前页面实际支持的语言才出现在切换列表中）
      const availableLocales: typeof locales = []
      
      // 定义已知支持的语言（基于实际存在的翻译/内容）
      const knownSupportedLocales: Record<string, string[]> = {
        'font-generator': ['en', 'de', 'ja', 'es', 'fr'],
        'image-compressor': locales.map(l => l.code),
        'image-converter': locales.map(l => l.code),
        'emoji-copy-and-paste': ['en'], // 仅英文有内容，其他 locale 会重定向到英文，故只算一种语言
      }
      
      if (tool && knownSupportedLocales[tool]) {
        // 使用已知的支持语言列表
        const supportedCodes = knownSupportedLocales[tool]
        for (const locale of locales) {
          if (supportedCodes.includes(locale.code)) {
            availableLocales.push(locale)
          }
        }
      } else {
        // 默认支持所有语言
        availableLocales.push(...locales)
      }
      
      setSupportedLocales(availableLocales)
    }
    
    if (isMounted) {
      checkSupportedLocales()
    } else {
      setSupportedLocales(locales)
    }
  }, [pathname, isMounted])
  
  const currentLocaleInfo = locales.find(loc => loc.code === currentLocale) || locales[0]
  const otherLocales = supportedLocales.filter(loc => loc.code !== currentLocale)

  // 生成带语言前缀的链接
  const getLocalizedHref = (href: string): string => {
    if (href.startsWith('http')) return href
    if (currentLocale === 'en') return href
    if (href.startsWith(`/${currentLocale}`)) return href
    return `/${currentLocale}${href}`
  }

  return (
    <footer className="bg-slate-900 pt-16 pb-8 px-6 mt-auto">
      <div className="max-w-6xl mx-auto">
        {/* 二级和三级菜单 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {/* AI Video */}
          <div>
            <Link 
              href={getLocalizedHref('/seedance-2')} 
              className="text-white font-bold text-sm mb-4 uppercase tracking-wider block hover:text-indigo-400 transition-colors"
            >
              {translations.aiVideo || 'AI Video'}
            </Link>
            <ul className="space-y-2 mt-4">
              <li>
                <Link 
                  href={getLocalizedHref('/seedance-2')} 
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.seedance2 || 'Seedance 2.0'}
                </Link>
              </li>
              <li>
                <Link 
                  href={getLocalizedHref('/kling-3')} 
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.kling3 || 'Kling 3.0'}
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Image */}
          <div>
            <Link 
              href={getLocalizedHref('/model/nano-banana-pro')} 
              className="text-white font-bold text-sm mb-4 uppercase tracking-wider block hover:text-indigo-400 transition-colors"
            >
              {translations.aiImage || 'AI Image'}
            </Link>
            <ul className="space-y-2 mt-4">
              <li>
                <Link 
                  href={getLocalizedHref('/model/nano-banana-pro')} 
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.nanoBananaPro || 'Nano Banana Pro'}
                </Link>
              </li>
              <li>
                <Link 
                  href={getLocalizedHref('/model/nano-banana-2')} 
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.nanoBanana2 || 'Nano Banana 2'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Image Compression */}
          <div>
            <Link 
              href={getLocalizedHref('/image-compressor')} 
              className="text-white font-bold text-sm mb-4 uppercase tracking-wider block hover:text-indigo-400 transition-colors"
            >
              {translations.imageCompression || 'Image Compression'}
            </Link>
            <ul className="space-y-2 mt-4">
              {footerMenuData['image-compressor'].length > 0 ? (
                footerMenuData['image-compressor'].map((item) => (
                  <li key={item.slug}>
                    <Link 
                      href={item.href} 
                      className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 text-xs pl-4">No tools available</li>
              )}
            </ul>
          </div>

          {/* Image Converter */}
          <div>
            <Link 
              href={getLocalizedHref('/image-converter')} 
              className="text-white font-bold text-sm mb-4 uppercase tracking-wider block hover:text-indigo-400 transition-colors"
            >
              {translations.imageConverter || 'Image Converter'}
            </Link>
            <ul className="space-y-2 mt-4">
              {footerMenuData['image-converter'].length > 0 ? (
                footerMenuData['image-converter'].map((item) => (
                  <li key={item.slug}>
                    <Link 
                      href={item.href} 
                      className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 text-xs pl-4">No tools available</li>
              )}
            </ul>
          </div>

          {/* Font Generator */}
          <div>
            <Link 
              href={getLocalizedHref('/font-generator')} 
              className="text-white font-bold text-sm mb-4 uppercase tracking-wider block hover:text-indigo-400 transition-colors"
            >
              {translations.fontGenerator || 'Font Generator'}
            </Link>
            <ul className="space-y-2 mt-4">
              {footerMenuData['font-generator'].length > 0 ? (
                footerMenuData['font-generator'].map((item) => (
                  <li key={item.slug}>
                    <Link 
                      href={item.href} 
                      className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 text-xs pl-4">No tools available</li>
              )}
            </ul>
          </div>

          {/* Emoji Copy & Paste */}
          <div>
            <Link 
              href={getLocalizedHref('/emoji-copy-and-paste')} 
              className="text-white font-bold text-sm mb-4 uppercase tracking-wider block hover:text-indigo-400 transition-colors"
            >
              {translations.emojiCopyAndPaste || 'Emoji Copy & Paste'}
            </Link>
            <ul className="space-y-2 mt-4">
              {footerMenuData['emoji-copy-and-paste'].length > 0 ? (
                footerMenuData['emoji-copy-and-paste'].map((item) => (
                  <li key={item.slug}>
                    <Link 
                      href={item.href} 
                      className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 text-xs pl-4">No tools available</li>
              )}
            </ul>
          </div>
        </div>

        {/* 基础导航链接 */}
        <nav className="mb-8" aria-label="Footer navigation">
          <ul className="flex flex-wrap justify-center items-center gap-3 md:gap-4 text-sm">
            <li><Link href={currentLocale === 'en' ? '/' : `/${currentLocale}`} className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.home}</Link></li>
            <li><Link href={currentLocale === 'en' ? '/about' : `/${currentLocale}/about`} className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.aboutUs}</Link></li>
            <li><Link href={currentLocale === 'en' ? '/privacy' : `/${currentLocale}/privacy`} className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.privacyPolicy}</Link></li>
            <li><Link href={currentLocale === 'en' ? '/terms' : `/${currentLocale}/terms`} className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.termsOfService}</Link></li>
            <li><a href="mailto:support@toolaze.com" className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.contact}</a></li>
            
            {/* Language Switcher - 只在支持多语言的页面显示，且只显示该页面实际支持的语言 */}
            {showLanguageSwitcher && supportedLocales.length > 1 && (
            <li className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center gap-2 text-slate-300 hover:text-indigo-400 transition-colors font-medium px-3 py-1 rounded-lg hover:bg-slate-800"
                aria-label={translations.language || 'Language selector'}
                aria-expanded={isLanguageMenuOpen}
              >
                <span className="text-base leading-none flag-emoji">{currentLocaleInfo.flag}</span>
                <span className="hidden sm:inline font-medium">{currentLocaleInfo.name}</span>
                <svg 
                  className={isLanguageMenuOpen ? 'w-4 h-4 transition-transform rotate-180' : 'w-4 h-4 transition-transform'} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Language Dropdown Menu */}
              {isLanguageMenuOpen && (
                <>
                  {/* Backdrop to close menu */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsLanguageMenuOpen(false)}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-slate-800 rounded-xl shadow-xl border border-slate-700 z-20 overflow-hidden">
                    <div className="py-2">
                      {otherLocales.map((locale) => (
                        <Link
                          key={locale.code}
                          href={getAlternateLanguageUrl(locale.code)}
                          onClick={() => setIsLanguageMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-indigo-600 hover:text-white transition-all group"
                        >
                          <span className="text-base leading-none flag-emoji">{locale.flag}</span>
                          <span className="font-medium group-hover:text-white">{locale.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </li>
            )}
          </ul>
        </nav>

        <div className="text-center pt-6 border-t border-slate-700">
          <p className="text-xs text-slate-400 mb-2" suppressHydrationWarning>
            {translations.copyright.replace('{year}', currentYear.toString())}
          </p>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">
            {translations.tagline}
          </p>
        </div>
      </div>
    </footer>
  )
}
