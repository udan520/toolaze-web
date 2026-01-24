'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

// 默认翻译
const defaultBreadcrumbTranslations = {
  home: 'Home',
  quickTools: 'Quick Tools',
  imageCompression: 'Image Compression',
  imageConverter: 'Image Converter',
  fontGenerator: 'Font Generator',
  aboutUs: 'About Us',
  privacyPolicy: 'Privacy Policy',
  termsOfService: 'Terms of Service'
}

// 加载翻译的函数
async function loadBreadcrumbTranslations(locale: string) {
  try {
    let normalizedLocale = locale
    if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') {
      normalizedLocale = 'zh-TW'
    }
    
    if (normalizedLocale === 'en') {
      const data = await import('@/data/en/common.json')
      return data.default?.breadcrumb || defaultBreadcrumbTranslations
    }
    
    try {
      const data = await import(`@/data/${normalizedLocale}/common.json`)
      return data.default?.breadcrumb || defaultBreadcrumbTranslations
    } catch {
      return defaultBreadcrumbTranslations
    }
  } catch {
    return defaultBreadcrumbTranslations
  }
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const pathname = usePathname()
  const [translations, setTranslations] = useState(defaultBreadcrumbTranslations)
  
  // 检测当前语言
  const getCurrentLocale = (): string => {
    if (!pathname) return 'en'
    const pathParts = pathname.split('/').filter(Boolean)
    const firstPart = pathParts[0] || ''
    return locales.includes(firstPart) ? firstPart : 'en'
  }
  
  const currentLocale = getCurrentLocale()
  
  // 加载翻译
  useEffect(() => {
    loadBreadcrumbTranslations(currentLocale).then(setTranslations)
  }, [currentLocale])
  
  // 将常见的标签映射到翻译
  const getTranslatedLabel = (label: string): string => {
    if (label === 'Home') return translations.home
    if (label === 'Quick Tools') return translations.quickTools
    if (label === 'Image Compression') return translations.imageCompression
    if (label === 'Image Converter') return translations.imageConverter
    if (label === 'Font Generator') return translations.fontGenerator
    if (label === 'About Us') return translations.aboutUs
    if (label === 'Privacy Policy') return translations.privacyPolicy
    if (label === 'Terms of Service') return translations.termsOfService
    return label
  }
  
  // 确保 href 包含语言前缀（如果需要）
  const getLocalizedHref = (href: string | undefined): string | undefined => {
    if (!href) return href
    if (currentLocale === 'en') {
      return href
    }
    // 如果 href 已经包含语言前缀，直接返回
    if (href.startsWith(`/${currentLocale}`)) {
      return href
    }
    // 如果 href 是绝对路径，直接返回
    if (href.startsWith('http')) {
      return href
    }
    return `/${currentLocale}${href}`
  }
  
  return (
    <div className="px-6 max-w-6xl mx-auto w-full mt-8 mb-4">
      <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-slate-300">/</span>}
              {item.href ? (
                <Link href={getLocalizedHref(item.href) || item.href} className="hover:text-indigo-600 transition-colors">
                  {getTranslatedLabel(item.label)}
                </Link>
              ) : (
                <span className="text-slate-900 font-medium">{getTranslatedLabel(item.label)}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
