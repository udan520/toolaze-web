'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getClientMenuItems, type ClientMenuItem } from '@/lib/client-menu-data'
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
  refundPolicy: 'Refund Policy',
  acceptableUse: 'Acceptable Use Policy',
  pricing: 'Pricing',
  contact: 'Contact',
  language: 'Language',
  footerNavigation: 'Footer navigation',
  noToolsAvailable: 'No tools available',
  copyright: '© {year} Toolaze Lab. All rights reserved.',
  tagline: 'AI generation tools • One-time credits • Clear usage policies',
  quickTools: 'Quick Tools',
  aiTools: 'AI Tools',
  aiVideo: 'AI Video',
  aiImage: 'AI Image',
  aiImageGenerator: 'AI Image Generator',
  watermarkRemover: 'Watermark Remover',
  photoRestoration: 'Photo Restoration',
  aiCouplePhotoMaker: 'AI Couple Photo Maker',
  worldCupAiImageGenerator: 'World Cup AI Image Generator',
  imageCompression: 'Image Compression',
  imageConverter: 'Image Converter',
  fontGenerator: 'Font Generator',
  emojiCopyAndPaste: 'Emoji Copy & Paste',
  seedance2: 'Seedance 2.0',
  kling3: 'Kling 3.0',
  gptImage2: 'GPT Image 2',
  wan27Image: 'Wan 2.7 Image',
  nanoBananaPro: 'Nano Banana Pro',
  nanoBanana2: 'Nano Banana 2',
  seedream45: 'Seedream 4.5',
  emojiMenu: {
    'crying-copy-and-paste': 'Crying Emoji Copy and Paste',
    'cross-copy-and-paste': 'Cross Emoji Copy and Paste',
    'adults-only-copy-and-paste': 'Adults Only Emoji Copy and Paste',
    'fire-copy-and-paste': 'Fire Emoji Copy and Paste',
    'birthday-copy-and-paste': 'Birthday Emoji Copy and Paste',
    'cat-copy-and-paste': 'Cat Emoji Copy and Paste',
  },
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
    'image-compressor': ClientMenuItem[]
    'image-converter': ClientMenuItem[]
    'font-generator': ClientMenuItem[]
    'emoji-copy-and-paste': ClientMenuItem[]
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
    
    // 翻译由 server page 作为 initialTranslations 传入，避免客户端重复加载 common.json。
    setTranslations(getInitialFooterTranslations(initialTranslations))
  }, [pathname, initialTranslations])

  // 加载页脚菜单数据：客户端只使用轻量菜单元数据，避免把服务端 SEO loader 打进浏览器包。
  useEffect(() => {
    if (isMounted) {
      const locale = resolveLocaleForPath(pathname || '/', currentLocale)
      setFooterMenuData({
        'image-compressor': getClientMenuItems('image-compressor', locale, translations),
        'image-converter': getClientMenuItems('image-converter', locale, translations),
        'font-generator': getClientMenuItems('font-generator', locale, translations),
        'emoji-copy-and-paste': getClientMenuItems('emoji-copy-and-paste', locale, translations),
      })
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
                  href={getLocalizedHref('/ai-image-generator')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.aiImageGenerator || 'AI Image Generator'}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedHref('/world-cup-ai-image-generator')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.worldCupAiImageGenerator || 'World Cup AI Image Generator'}
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
              href={getLocalizedHref('/model/gpt-image-2')}
              className="text-white font-bold text-sm mb-4 tracking-wide block hover:text-indigo-400 transition-colors"
            >
              {translations.aiImage || 'AI Image'}
            </Link>
            <ul className="space-y-2 mt-4">
              <li>
                <Link
                  href={getLocalizedHref('/model/gpt-image-2')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.gptImage2 || 'GPT Image 2'}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedHref('/model/wan-2-7-image')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.wan27Image || 'Wan 2.7 Image'}
                </Link>
              </li>
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
              <li>
                <Link
                  href={getLocalizedHref('/model/seedream-4-5')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.seedream45 || 'Seedream 4.5'}
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
            <li><Link href={getLocalizedHref('/pricing')} className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.pricing}</Link></li>
            <li><Link href={getLocalizedHref('/privacy')} className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.privacyPolicy}</Link></li>
            <li><Link href={getLocalizedHref('/terms')} className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.termsOfService}</Link></li>
            <li><Link href={getLocalizedHref('/refund-policy')} className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.refundPolicy}</Link></li>
            <li><Link href={getLocalizedHref('/acceptable-use')} className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.acceptableUse}</Link></li>
            <li><Link href={getLocalizedHref('/contact')} className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.contact}</Link></li>
            
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
          <p className="mx-auto mb-4 max-w-4xl text-xs leading-5 text-slate-500">
            Toolaze AI generation is powered by supported AI model providers, Toolaze integrations, and cloud infrastructure. Product names, trademarks, and model names belong to their respective owners and identify supported model workflows available through Toolaze.
          </p>
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
