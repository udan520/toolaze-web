'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getAllSlugs, getSeoContent } from '@/lib/seo-loader'
import {
  PREFERRED_LOCALE_STORAGE_KEY,
  SITE_LOCALES,
  getAlternateLanguageUrl,
  getCurrentLocaleFromPath,
  getPreferredLocalizedUrl,
  getSupportedLocaleCodes,
  isSiteLocaleCode,
  resolveLocaleForPath,
  shouldShowLanguageSwitcher,
} from '@/lib/site-language-switch'

// 翻译数据(默认英语)
const defaultTranslations = {
  home: 'Home',
  allTools: 'All Tools',
  aboutUs: 'About Us',
  privacyPolicy: 'Privacy Policy',
  termsOfService: 'Terms of Service',
  contact: 'Contact',
  language: 'Language',
  footerNavigation: 'Footer navigation',
  noToolsAvailable: 'No tools available',
  copyright: '© {year} Toolaze Lab. All rights reserved.',
  tagline: 'Free Online Tools • No Registration Required • 100% Private',
  quickTools: 'Quick Tools',
  aiTools: 'AI Tools',
  aiVideo: 'AI Video',
  aiImage: 'AI Image',
  watermarkRemover: 'Watermark Remover',
  photoRestoration: 'Photo Restoration',
  aiCouplePhotoMaker: 'AI Couple Photo Maker',
  imageCompression: 'Image Compression',
  imageConverter: 'Image Converter',
  fontGenerator: 'Font Generator',
  emojiCopyAndPaste: 'Emoji Copy & Paste',
  seedance2: 'Seedance 2.0',
  kling3: 'Kling 3.0',
  nanoBananaPro: 'Nano Banana Pro',
  nanoBanana2: 'Nano Banana 2',
  emojiMenu: {
    'crying-copy-and-paste': 'Crying Emoji Copy and Paste',
    'cross-copy-and-paste': 'Cross Emoji Copy and Paste',
    'adults-only-copy-and-paste': 'Adults Only Emoji Copy and Paste',
    'fire-copy-and-paste': 'Fire Emoji Copy and Paste',
    'birthday-copy-and-paste': 'Birthday Emoji Copy and Paste',
    'cat-copy-and-paste': 'Cat Emoji Copy and Paste',
  },
}

const emojiMenuFallbackItems = [
  { slug: 'crying-copy-and-paste', title: 'Crying Emoji Copy and Paste' },
  { slug: 'cross-copy-and-paste', title: 'Cross Emoji Copy and Paste' },
  { slug: 'adults-only-copy-and-paste', title: 'Adults Only Emoji Copy and Paste' },
  { slug: 'fire-copy-and-paste', title: 'Fire Emoji Copy and Paste' },
  { slug: 'birthday-copy-and-paste', title: 'Birthday Emoji Copy and Paste' },
  { slug: 'cat-copy-and-paste', title: 'Cat Emoji Copy and Paste' },
]

function getEmojiMenuFallbackTitle(translations: typeof defaultTranslations, slug: string) {
  return translations.emojiMenu?.[slug as keyof typeof defaultTranslations.emojiMenu]
    || emojiMenuFallbackItems.find((item) => item.slug === slug)?.title
    || slug
}

// 加载翻译的函数
async function loadTranslations(locale: string) {
  try {
    const read = (obj: unknown, key: string): string | undefined => {
      if (!obj || typeof obj !== 'object') return undefined
      const v = (obj as Record<string, unknown>)[key]
      return typeof v === 'string' ? v : undefined
    }

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
        aiVideo: read(navData, 'aiVideo') || read(footerData, 'aiVideo') || defaultTranslations.aiVideo,
        aiImage: read(navData, 'aiImage') || read(footerData, 'aiImage') || defaultTranslations.aiImage,
        imageCompression: read(navData, 'imageCompression') || read(footerData, 'imageCompression') || defaultTranslations.imageCompression,
        imageConverter: read(navData, 'imageConverter') || read(footerData, 'imageConverter') || defaultTranslations.imageConverter,
        fontGenerator: read(navData, 'fontGenerator') || read(footerData, 'fontGenerator') || defaultTranslations.fontGenerator,
        emojiCopyAndPaste: read(navData, 'emojiCopyAndPaste') || read(footerData, 'emojiCopyAndPaste') || defaultTranslations.emojiCopyAndPaste,
        seedance2: read(navData, 'seedance2') || read(footerData, 'seedance2') || defaultTranslations.seedance2,
        kling3: read(navData, 'kling3') || read(footerData, 'kling3') || defaultTranslations.kling3,
        nanoBananaPro: read(navData, 'nanoBananaPro') || read(footerData, 'nanoBananaPro') || defaultTranslations.nanoBananaPro,
        nanoBanana2: read(navData, 'nanoBanana2') || read(footerData, 'nanoBanana2') || defaultTranslations.nanoBanana2,
        aiTools: read(navData, 'aiTools') || read(footerData, 'aiTools') || defaultTranslations.aiTools,
        watermarkRemover: read(navData, 'watermarkRemover') || read(footerData, 'watermarkRemover') || defaultTranslations.watermarkRemover,
        photoRestoration: read(navData, 'photoRestoration') || read(footerData, 'photoRestoration') || defaultTranslations.photoRestoration,
        aiCouplePhotoMaker: read(navData, 'aiCouplePhotoMaker') || read(footerData, 'aiCouplePhotoMaker') || defaultTranslations.aiCouplePhotoMaker,
        emojiMenu: typeof navData.emojiMenu === 'object' && navData.emojiMenu ? navData.emojiMenu : defaultTranslations.emojiMenu,
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
        aiVideo: read(navData, 'aiVideo') || read(footerData, 'aiVideo') || defaultTranslations.aiVideo,
        aiImage: read(navData, 'aiImage') || read(footerData, 'aiImage') || defaultTranslations.aiImage,
        imageCompression: read(navData, 'imageCompression') || read(footerData, 'imageCompression') || defaultTranslations.imageCompression,
        imageConverter: read(navData, 'imageConverter') || read(footerData, 'imageConverter') || defaultTranslations.imageConverter,
        fontGenerator: read(navData, 'fontGenerator') || read(footerData, 'fontGenerator') || defaultTranslations.fontGenerator,
        emojiCopyAndPaste: read(navData, 'emojiCopyAndPaste') || read(footerData, 'emojiCopyAndPaste') || defaultTranslations.emojiCopyAndPaste,
        seedance2: read(navData, 'seedance2') || read(footerData, 'seedance2') || defaultTranslations.seedance2,
        kling3: read(navData, 'kling3') || read(footerData, 'kling3') || defaultTranslations.kling3,
        nanoBananaPro: read(navData, 'nanoBananaPro') || read(footerData, 'nanoBananaPro') || defaultTranslations.nanoBananaPro,
        nanoBanana2: read(navData, 'nanoBanana2') || read(footerData, 'nanoBanana2') || defaultTranslations.nanoBanana2,
        aiTools: read(navData, 'aiTools') || read(footerData, 'aiTools') || defaultTranslations.aiTools,
        watermarkRemover: read(navData, 'watermarkRemover') || read(footerData, 'watermarkRemover') || defaultTranslations.watermarkRemover,
        photoRestoration: read(navData, 'photoRestoration') || read(footerData, 'photoRestoration') || defaultTranslations.photoRestoration,
        aiCouplePhotoMaker: read(navData, 'aiCouplePhotoMaker') || read(footerData, 'aiCouplePhotoMaker') || defaultTranslations.aiCouplePhotoMaker,
        emojiMenu: typeof navData.emojiMenu === 'object' && navData.emojiMenu ? navData.emojiMenu : defaultTranslations.emojiMenu,
      }
    } catch {
      return defaultTranslations
    }
  } catch {
    return defaultTranslations
  }
}

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

function getInitialFooterTranslations(initialTranslations?: any) {
  if (!initialTranslations) return defaultTranslations
  return {
    ...defaultTranslations,
    ...(initialTranslations.footer || {}),
    ...(initialTranslations.nav || {}),
    emojiMenu: initialTranslations.nav?.emojiMenu || defaultTranslations.emojiMenu,
  }
}

interface FooterProps {
  initialTranslations?: any
}

export default function Footer({ initialTranslations }: FooterProps = {}) {
  // Use a static year initially to avoid hydration mismatch
  // The year will be updated on client side after hydration
  const [currentYear, setCurrentYear] = useState(2024)
  const [currentLocale, setCurrentLocale] = useState<string>('en')
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const [translations, setTranslations] = useState(getInitialFooterTranslations(initialTranslations))
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
    
    const detectedLocale = getCurrentLocaleFromPath(pathname ?? '')
    setCurrentLocale(detectedLocale)
    const firstSegment = (pathname ?? '').split('/').filter(Boolean)[0] ?? ''
    const hasExplicitLocale = isSiteLocaleCode(firstSegment)
    if (hasExplicitLocale && typeof window !== 'undefined') {
      window.localStorage.setItem(PREFERRED_LOCALE_STORAGE_KEY, detectedLocale)
    }
    
    // Load translations
    const effectiveLocale = resolveLocaleForPath(pathname || '/', detectedLocale)
    loadTranslations(effectiveLocale).then(setTranslations)
  }, [pathname])

  // 加载页脚菜单数据
  useEffect(() => {
    const loadFooterMenuData = async () => {
      const locale = resolveLocaleForPath(pathname || '/', currentLocale)
      
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
        const slugs = emojiSlugs && emojiSlugs.length > 0
          ? emojiSlugs
          : emojiMenuFallbackItems.map((item) => item.slug)
        if (slugs.length > 0) {
          const emojiItems = await Promise.all(
            slugs.map(async (slug) => {
              try {
                const toolData = await getSeoContent('emoji-copy-and-paste', slug, locale)
                if (toolData?.in_menu === false) return null
                return {
                  slug,
                  title: getEmojiMenuFallbackTitle(translations, slug),
                  href: getHref(`/emoji-copy-and-paste/${slug}`),
                }
              } catch (err) {
                return {
                  slug,
                  title: getEmojiMenuFallbackTitle(translations, slug),
                  href: getHref(`/emoji-copy-and-paste/${slug}`),
                }
              }
            })
          )
          const filteredEmojiItems = emojiItems.filter((item): item is { slug: string; title: string; href: string } =>
            item !== null && item.title !== undefined && item.href !== undefined
          )
          data['emoji-copy-and-paste'] = filteredEmojiItems.length > 0
            ? filteredEmojiItems
            : emojiMenuFallbackItems.map((item) => ({
                slug: item.slug,
                title: getEmojiMenuFallbackTitle(translations, item.slug),
                href: getHref(`/emoji-copy-and-paste/${item.slug}`),
              }))
        }
      } catch (error) {
        console.error('Failed to load emoji-copy-and-paste menu items:', error)
        data['emoji-copy-and-paste'] = emojiMenuFallbackItems.map((item) => ({
          slug: item.slug,
          title: getEmojiMenuFallbackTitle(translations, item.slug),
          href: getHref(`/emoji-copy-and-paste/${item.slug}`),
        }))
      }
      
      setFooterMenuData(data)
    }
    
    if (isMounted) {
      loadFooterMenuData()
    }
  }, [currentLocale, pathname, isMounted, translations])

  const supportedLocales = useMemo(() => {
    const codes = getSupportedLocaleCodes(pathname ?? null)
    return SITE_LOCALES.filter((l) => codes.includes(l.code))
  }, [pathname])

  const showLanguageSwitcher = shouldShowLanguageSwitcher(pathname ?? null)

  const effectiveLocale = resolveLocaleForPath(pathname || '/', currentLocale)
  const currentLocaleInfo = SITE_LOCALES.find((loc) => loc.code === effectiveLocale) || SITE_LOCALES[0]
  const otherLocales = supportedLocales.length === 1
    ? supportedLocales
    : supportedLocales.filter((loc) => loc.code !== effectiveLocale)

  const getLocalizedHref = (href: string): string => {
    if (href.startsWith('http')) return href
    return getPreferredLocalizedUrl(href, effectiveLocale)
  }

  return (
    <footer className="bg-slate-900 pt-16 pb-8 px-6 mt-auto">
      <div className="max-w-6xl mx-auto">
        {/* 二级和三级菜单 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {/* AI Tools */}
          <div>
            <Link 
              href={getLocalizedHref('/ai-tools')} 
              className="text-white font-bold text-sm mb-4 tracking-wide block hover:text-indigo-400 transition-colors"
            >
              {translations.aiTools || 'AI Tools'}
            </Link>
            <ul className="space-y-2 mt-4">
              <li>
                <Link 
                  href={getLocalizedHref('/watermark-remover')} 
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.watermarkRemover || 'Watermark Remover'}
                </Link>
              </li>
              <li>
                <Link 
                  href={getLocalizedHref('/photo-restoration')} 
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.photoRestoration || 'Photo Restoration'}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedHref('/ai-couple-photo-maker')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.aiCouplePhotoMaker || 'AI Couple Photo Maker'}
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Video */}
          <div>
            <Link 
              href={getLocalizedHref('/model/seedance-2')} 
              className="text-white font-bold text-sm mb-4 tracking-wide block hover:text-indigo-400 transition-colors"
            >
              {translations.aiVideo || 'AI Video'}
            </Link>
            <ul className="space-y-2 mt-4">
              <li>
                <Link 
                  href={getLocalizedHref('/model/seedance-2')} 
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.seedance2 || 'Seedance 2.0'}
                </Link>
              </li>
              <li>
                <Link 
                  href={getLocalizedHref('/model/kling-3')} 
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
              className="text-white font-bold text-sm mb-4 tracking-wide block hover:text-indigo-400 transition-colors"
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
              className="text-white font-bold text-sm mb-4 tracking-wide block hover:text-indigo-400 transition-colors"
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
                <li className="text-slate-500 text-xs pl-4">{translations.noToolsAvailable}</li>
              )}
            </ul>
          </div>

          {/* Image Converter */}
          <div>
            <Link 
              href={getLocalizedHref('/image-converter')} 
              className="text-white font-bold text-sm mb-4 tracking-wide block hover:text-indigo-400 transition-colors"
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
                <li className="text-slate-500 text-xs pl-4">{translations.noToolsAvailable}</li>
              )}
            </ul>
          </div>

          {/* Font Generator */}
          <div>
            <Link 
              href={getLocalizedHref('/font-generator')} 
              className="text-white font-bold text-sm mb-4 tracking-wide block hover:text-indigo-400 transition-colors"
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
                <li className="text-slate-500 text-xs pl-4">{translations.noToolsAvailable}</li>
              )}
            </ul>
          </div>

          {/* Emoji Copy & Paste */}
          <div>
            <Link 
              href={getLocalizedHref('/emoji-copy-and-paste')} 
              className="text-white font-bold text-sm mb-4 tracking-wide block hover:text-indigo-400 transition-colors"
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
                <li className="text-slate-500 text-xs pl-4">{translations.noToolsAvailable}</li>
              )}
            </ul>
          </div>
        </div>

        {/* 基础导航链接 */}
        <nav className="mb-8" aria-label={translations.footerNavigation}>
          <ul className="flex flex-wrap justify-center items-center gap-3 md:gap-4 text-sm">
            <li><Link href={getLocalizedHref('/')} className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.home}</Link></li>
            <li><Link href={getLocalizedHref('/about')} className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.aboutUs}</Link></li>
            <li><Link href={getLocalizedHref('/privacy')} className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.privacyPolicy}</Link></li>
            <li><Link href={getLocalizedHref('/terms')} className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.termsOfService}</Link></li>
            <li><a href="mailto:support@toolaze.com" className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.contact}</a></li>
            
            {/* Language Switcher - 只在支持多语言的页面显示，且只显示该页面实际支持的语言 */}
            {showLanguageSwitcher && (
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
                          href={getAlternateLanguageUrl(pathname || '/', locale.code)}
                          onClick={() => {
                            const nextLocale = resolveLocaleForPath(pathname || '/', locale.code)
                            if (typeof window !== 'undefined') {
                              window.localStorage.setItem(PREFERRED_LOCALE_STORAGE_KEY, nextLocale)
                            }
                            setIsLanguageMenuOpen(false)
                          }}
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
          <p className="text-[10px] text-slate-500 font-bold tracking-[0.18em]">
            {translations.tagline}
          </p>
        </div>
      </div>
    </footer>
  )
}
