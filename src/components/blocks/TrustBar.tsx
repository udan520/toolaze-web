'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

const defaultTrustBar = {
  private: 'Privacy Aware',
  instantPreview: 'Instant Preview',
  noServerLogs: 'Clear Policies'
}

async function loadTrustBarTranslations(locale: string, tool?: string) {
  try {
    let normalizedLocale = locale
    if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') {
      normalizedLocale = 'zh-TW'
    }
    
    // 如果是 nano-banana-pro，从工具特定的 JSON 文件加载
    if (tool === 'nano-banana-pro') {
      try {
        if (normalizedLocale === 'en') {
          const data = await import('@/data/en/nano-banana-pro.json')
          return (data.default as any)?.trustBar || defaultTrustBar
        }
        try {
          const data = await import(`@/data/${normalizedLocale}/nano-banana-pro.json`)
          return (data.default as any)?.trustBar || defaultTrustBar
        } catch {
          // 回退到英语
          const data = await import('@/data/en/nano-banana-pro.json')
          return (data.default as any)?.trustBar || defaultTrustBar
        }
      } catch {
        return defaultTrustBar
      }
    }
    
    // 其他工具从 common.json 加载
    if (normalizedLocale === 'en') {
      const data = await import('@/data/en/common.json')
      return data.default?.common?.fontGenerator?.trustBar || defaultTrustBar
    }
    
    try {
      const data = await import(`@/data/${normalizedLocale}/common.json`)
      return data.default?.common?.fontGenerator?.trustBar || defaultTrustBar
    } catch {
      return defaultTrustBar
    }
  } catch {
    return defaultTrustBar
  }
}

export default function TrustBar() {
  const pathname = usePathname()
  const [trustBar, setTrustBar] = useState(defaultTrustBar)
  
  useEffect(() => {
    if (!pathname) return
    
    const pathParts = pathname.split('/').filter(Boolean)
    const firstPart = pathParts[0] || ''
    const detectedLocale = locales.includes(firstPart) ? firstPart : 'en'
    
    // 检测当前工具
    let tool: string | undefined
    if (pathname.includes('/model/nano-banana-pro')) {
      tool = 'nano-banana-pro'
    } else if (pathname.includes('/font-generator')) {
      tool = 'font-generator'
    }
    
    loadTrustBarTranslations(detectedLocale, tool).then(setTrustBar)
  }, [pathname])
  
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4 text-[11px] font-bold text-indigo-900/60">
      <span>🔒 {trustBar.private}</span> <span className="hidden md:block">|</span>
      <span>⚡ {trustBar.instantPreview}</span> <span className="hidden md:block">|</span>
      <span>🚫 {trustBar.noServerLogs}</span>
    </div>
  )
}
