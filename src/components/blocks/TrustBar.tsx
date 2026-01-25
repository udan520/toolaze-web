'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

const defaultTrustBar = {
  private: '100% Private',
  instantPreview: 'Instant Preview',
  noServerLogs: 'No Server Logs'
}

async function loadTrustBarTranslations(locale: string) {
  try {
    let normalizedLocale = locale
    if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') {
      normalizedLocale = 'zh-TW'
    }
    
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
    
    loadTrustBarTranslations(detectedLocale).then(setTrustBar)
  }, [pathname])
  
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4 text-[11px] font-bold text-indigo-900/60 uppercase tracking-widest">
      <span>🔒 {trustBar.private}</span> <span className="hidden md:block">|</span>
      <span>⚡ {trustBar.instantPreview}</span> <span className="hidden md:block">|</span>
      <span>🚫 {trustBar.noServerLogs}</span>
    </div>
  )
}
