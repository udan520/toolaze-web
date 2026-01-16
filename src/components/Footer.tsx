'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

// 翻译数据(默认英语)
const defaultTranslations = {
  home: 'Home',
  allTools: 'All Tools',
  aboutUs: 'About Us',
  privacyPolicy: 'Privacy Policy',
  termsOfService: 'Terms of Service',
  contact: 'Contact',
  copyright: '© {year} Toolaze Lab. All rights reserved.',
  tagline: 'Free Online Tools • No Registration Required • 100% Private'
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
      return data.default?.footer || defaultTranslations
    }
    
    try {
      const data = await import(`@/data/${normalizedLocale}/common.json`)
      return data.default?.footer || defaultTranslations
    } catch {
      return defaultTranslations
    }
  } catch {
    return defaultTranslations
  }
}

const locales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh-TW', name: '中文 (繁體)', flag: '🇹🇼' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
]

export default function Footer() {
  // Use a static year initially to avoid hydration mismatch
  // The year will be updated on client side after hydration
  const [currentYear, setCurrentYear] = useState(2024)
  const [currentLocale, setCurrentLocale] = useState<string>('en')
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const [translations, setTranslations] = useState(defaultTranslations)
  const pathname = usePathname()

  useEffect(() => {
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
      return `/${targetLocale}${pathname}`
    }
  }

  const currentLocaleInfo = locales.find(loc => loc.code === currentLocale) || locales[0]
  const otherLocales = locales.filter(loc => loc.code !== currentLocale)

  return (
    <footer className="bg-slate-900 pt-16 pb-8 px-6 mt-auto">
      <div className="max-w-6xl mx-auto">
        <nav className="mb-8" aria-label="Footer navigation">
          <ul className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-sm">
            <li><Link href={currentLocale === 'en' ? '/' : `/${currentLocale}`} className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.home}</Link></li>
            <li><Link href={currentLocale === 'en' ? '/#tools' : `/${currentLocale}#tools`} className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.allTools}</Link></li>
            <li><Link href={currentLocale === 'en' ? '/about' : `/${currentLocale}/about`} className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.aboutUs}</Link></li>
            <li><Link href={currentLocale === 'en' ? '/privacy' : `/${currentLocale}/privacy`} className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.privacyPolicy}</Link></li>
            <li><Link href={currentLocale === 'en' ? '/terms' : `/${currentLocale}/terms`} className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.termsOfService}</Link></li>
            <li><a href="mailto:support@toolaze.com" className="text-slate-300 hover:text-indigo-400 transition-colors font-medium">{translations.contact}</a></li>
            
            {/* Language Switcher */}
            <li className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center gap-2 text-slate-300 hover:text-indigo-400 transition-colors font-medium px-3 py-1 rounded-lg hover:bg-slate-800"
                aria-label="Language selector"
                aria-expanded={isLanguageMenuOpen}
              >
                <span className="text-base">{currentLocaleInfo.flag}</span>
                <span className="hidden sm:inline">{currentLocaleInfo.name}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`} 
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
                          <span className="text-base">{locale.flag}</span>
                          <span className="font-medium group-hover:text-white">{locale.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </li>
          </ul>
        </nav>

        <div className="text-center pt-6 border-t border-slate-700">
          <p className="text-xs text-slate-400 mb-2">
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
