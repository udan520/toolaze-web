'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
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
  copyright: '© {year} Toolaze Lab. All rights reserved.',
  tagline: 'AI generation tools • One-time credits • Clear usage policies',
  aiImageTools: 'AI Image Tools',
  aiVideoTools: 'AI Video Tools',
  aiImageModel: 'AI Image Model',
  aiVideoModel: 'AI Video Model',
  aiVideoGenerator: 'AI Video Generator',
  grok15Video: 'Grok 1.5 Video',
  aiImage: 'AI Image',
  aiVideo: 'AI Video',
  aiImageGenerator: 'AI Image Generator',
  textToImageGenerator: 'Text to Image Generator',
  aiImageToImageGenerator: 'AI Image to Image Generator',
  watermarkRemover: 'Watermark Remover',
  photoRestoration: 'Photo Restoration',
  aiCouplePhotoMaker: 'AI Couple Photo Maker',
  aiBabyGenerator: 'AI Baby Generator',
  aiDanceGenerator: 'AI Dance Generator',
  aiHairstyleChanger: 'AI Hairstyle Changer',
  aiHairColorChanger: 'AI Hair Color Changer',
  worldCupAiImageGenerator: 'World Cup AI Image Generator',
  seedance2: 'Seedance 2.0',
  seedance25: 'Seedance 2.5',
  kling3: 'Kling 3.0',
  gptImage2: 'GPT Image 2',
  wan27Image: 'Wan 2.7 Image',
  nanoBananaPro: 'Nano Banana Pro',
  nanoBanana2: 'Nano Banana 2',
  seedream50Lite: 'Seedream 5.0 Lite',
  seedream50Pro: 'Seedream 5.0 Pro',
  seedream45: 'Seedream 4.5',
}

function getInitialFooterTranslations(initialTranslations?: any) {
  if (!initialTranslations) return defaultTranslations
  return {
    ...defaultTranslations,
    ...(initialTranslations.footer || {}),
    ...(initialTranslations.nav || {}),
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
  const pathname = usePathname()

  useEffect(() => {
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
        <div className="grid grid-cols-1 gap-8 mb-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* AI Image */}
          <div>
            <Link 
              href={getLocalizedHref('/ai-image-generator')}
              className="text-white font-bold text-sm mb-4 tracking-wide block hover:text-indigo-400 transition-colors"
            >
              {translations.aiImage || 'AI Image'}
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
                  href={getLocalizedHref('/text-to-image-generator')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.textToImageGenerator || 'Text to Image Generator'}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedHref('/ai-image-to-image-generator')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.aiImageToImageGenerator || 'AI Image to Image Generator'}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedHref('/ai-hairstyle-changer')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.aiHairstyleChanger || 'AI Hairstyle Changer'}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedHref('/ai-hair-color-changer')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.aiHairColorChanger || 'AI Hair Color Changer'}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedHref('/ai-baby-generator')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.aiBabyGenerator || 'AI Baby Generator'}
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
                  href={getLocalizedHref('/world-cup-ai-image-generator')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.worldCupAiImageGenerator || 'World Cup AI Image Generator'}
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Video */}
          <div>
            <Link
              href={getLocalizedHref('/ai-video-generator')}
              className="text-white font-bold text-sm mb-4 tracking-wide block hover:text-indigo-400 transition-colors"
            >
              {translations.aiVideo || 'AI Video'}
            </Link>
            <ul className="space-y-2 mt-4">
              <li>
                <Link
                  href={getLocalizedHref('/ai-video-generator')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.aiVideoGenerator || 'AI Video Generator'}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedHref('/ai-dance-generator')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.aiDanceGenerator || 'AI Dance Generator'}
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Image Model */}
          <div>
            <Link 
              href={getLocalizedHref('/model')}
              className="text-white font-bold text-sm mb-4 tracking-wide block hover:text-indigo-400 transition-colors"
            >
              {translations.aiImageModel || 'AI Image Model'}
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
                  href={getLocalizedHref('/model/seedream-5-0-pro')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.seedream50Pro || 'Seedream 5.0 Pro'}
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
                  href={getLocalizedHref('/model/seedream-5-0-lite')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.seedream50Lite || 'Seedream 5.0 Lite'}
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

          {/* AI Video Model */}
          <div>
            <Link
              href={getLocalizedHref('/model')}
              className="text-white font-bold text-sm mb-4 tracking-wide block hover:text-indigo-400 transition-colors"
            >
              {translations.aiVideoModel || 'AI Video Model'}
            </Link>
            <ul className="space-y-2 mt-4">
              <li>
                <Link
                  href={getLocalizedHref('/model/grok-imagine-video-1-5')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.grok15Video || 'Grok 1.5 Video'}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalizedHref('/model/seedance-2-5')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm block pl-4"
                >
                  {translations.seedance25 || 'Seedance 2.5'}
                </Link>
              </li>
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
            Toolaze is an independent AI creative platform with a custom interface for supported third-party AI model workflows. Product names, trademarks, and model names belong to their respective owners; Toolaze is not affiliated with or endorsed by those model creators unless explicitly stated.
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
