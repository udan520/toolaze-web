'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  variant?: 'page' | 'inline'
}

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

// 默认翻译
const defaultBreadcrumbTranslations = {
  home: 'Home',
  quickTools: 'Quick Tools',
  aiTools: 'AI Tools',
  imageCompression: 'Image Compression',
  imageConverter: 'Image Converter',
  watermarkRemover: 'Watermark Remover',
  photoRestoration: 'Photo Restoration',
  aiCouplePhotoMaker: 'AI Couple Photo Maker',
  aiBabyGenerator: 'AI Baby Generator',
  aiImageGenerator: 'AI Image Generator',
  textToImageGenerator: 'Text to Image Generator',
  aiImageToImageGenerator: 'AI Image to Image Generator',
  worldCupAiImageGenerator: 'World Cup AI Image Generator',
  fontGenerator: 'Font Generator',
  emojiCopyAndPaste: 'Emoji Copy & Paste',
  model: 'Model',
  aboutUs: 'About Us',
  pricing: 'Pricing',
  privacyPolicy: 'Privacy Policy',
  termsOfService: 'Terms of Service',
  refundPolicy: 'Refund Policy',
  acceptableUse: 'Acceptable Use Policy',
  contact: 'Contact',
  earnCredits: 'Earn Credits',
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

export default function Breadcrumb({ items, variant = 'page' }: BreadcrumbProps) {
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
    if (label === 'AI Tools') return translations.aiTools || 'AI Tools'
    if (label === 'Image Compression') return translations.imageCompression
    if (label === 'Image Converter') return translations.imageConverter
    if (label === 'Watermark Remover') return translations.watermarkRemover || 'Watermark Remover'
    if (label === 'Photo Restoration') return translations.photoRestoration || 'Photo Restoration'
    if (label === 'AI Couple Photo Maker') return translations.aiCouplePhotoMaker || 'AI Couple Photo Maker'
    if (label === 'AI Baby Generator') return translations.aiBabyGenerator || 'AI Baby Generator'
    if (label === 'AI Image Generator') return translations.aiImageGenerator || 'AI Image Generator'
    if (label === 'Text to Image Generator') return translations.textToImageGenerator || 'Text to Image Generator'
    if (label === 'AI Image to Image Generator') return translations.aiImageToImageGenerator || 'AI Image to Image Generator'
    if (label === 'World Cup AI Image Generator') return translations.worldCupAiImageGenerator || 'World Cup AI Image Generator'
    if (label === 'Font Generator') return translations.fontGenerator
    if (label === 'Emoji Copy & Paste') return translations.emojiCopyAndPaste || 'Emoji Copy & Paste'
    if (label === 'Model') return translations.model || 'Model'
    if (label === 'About Us') return translations.aboutUs
    if (label === 'Pricing') return translations.pricing || 'Pricing'
    if (label === 'Privacy Policy') return translations.privacyPolicy
    if (label === 'Terms of Service') return translations.termsOfService
    if (label === 'Refund Policy') return translations.refundPolicy || 'Refund Policy'
    if (label === 'Acceptable Use Policy') return translations.acceptableUse || 'Acceptable Use Policy'
    if (label === 'Contact') return translations.contact || 'Contact'
    if (label === 'Earn Credits') return translations.earnCredits || 'Earn Credits'
    return label
  }
  
  // 仅存在于根路径、无 [locale] 版本的页面，始终不添加 locale 前缀（有 [locale]/... 的勿列入）
  const LOCALE_LESS_PATHS = ['/model', '/model/seedance-2-5', '/model/seedance-2', '/model/kling-3', '/model/nano-banana-pro', '/model/nano-banana-2', '/model/gpt-image-2', '/model/seedream-4-5', '/model/seedream-5-0-lite', '/model/seedream-5-0-pro', '/model/wan-2-7-image']
  const getLocalizedHref = (href: string | undefined): string | undefined => {
    if (!href) return href
    if (href.startsWith('http')) return href
    if (LOCALE_LESS_PATHS.some(p => href === p || href.startsWith(p + '/'))) return href
    if (currentLocale === 'en') return href
    if (href.startsWith(`/${currentLocale}`)) return href
    return `/${currentLocale}${href}`
  }
  
  const isInline = variant === 'inline'

  return (
    <div className={isInline ? 'w-full py-1' : 'mx-auto w-full max-w-6xl px-4 py-2 md:px-6'}>
      <nav className="overflow-x-auto text-[11px] font-medium tracking-wide text-slate-400 md:text-xs" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 whitespace-nowrap">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && <span className="text-slate-300">/</span>}
              {item.href ? (
                <Link href={getLocalizedHref(item.href) || item.href} className="transition-colors hover:text-indigo-600">
                  {getTranslatedLabel(item.label)}
                </Link>
              ) : (
                <span className="text-slate-500">{getTranslatedLabel(item.label)}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
