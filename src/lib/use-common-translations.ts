'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

const defaultTranslations = {
  tool: {
    dropZone: {
      title: 'Click or Drag Images/Folders Here',
      formats: 'JPG, PNG, WebP, BMP, HEIC (Max 100 files)'
    },
    controls: {
      targetSize: 'Target Size:',
      convertTo: 'Convert to:',
      processing: 'Processing...',
      startCompression: 'Start Batch Compression',
      startConversion: 'Start Batch Conversion',
      downloadAll: 'Download All (ZIP)',
      download: 'Download',
      clear: 'Clear All'
    },
    messages: {
      processingCompleted: 'Processing completed!',
      convertedHeic: 'Converted HEIC to JPG:',
      failedConvertHeic: 'Failed to convert HEIC:',
      compressionTimeout: 'Compression timeout:',
      failedCompress: 'Failed to compress:',
      conversionTimeout: 'Conversion timeout:',
      failedConvert: 'Failed to convert:'
    }
  }
}

async function loadClientTranslations(locale: string) {
  try {
    let normalizedLocale = locale
    if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') {
      normalizedLocale = 'zh-TW'
    }
    
    if (!locales.includes(normalizedLocale)) {
      normalizedLocale = 'en'
    }
    
    if (normalizedLocale === 'en') {
      const data = await import('@/data/en/common.json')
      return data.default || data
    }
    
    try {
      const data = await import(`@/data/${normalizedLocale}/common.json`)
      return data.default || data
    } catch {
      const data = await import('@/data/en/common.json')
      return data.default || data
    }
  } catch {
    return null
  }
}

export function useCommonTranslations() {
  const [translations, setTranslations] = useState<any>(defaultTranslations)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()
  
  useEffect(() => {
    setIsMounted(true)
    const getCurrentLocale = (): string => {
      if (!pathname) return 'en'
      const pathParts = pathname.split('/').filter(Boolean)
      const firstPart = pathParts[0] || ''
      return locales.includes(firstPart) ? firstPart : 'en'
    }
    
    const locale = getCurrentLocale()
    loadClientTranslations(locale).then(data => {
      if (data) {
        setTranslations(data)
      }
    })
  }, [pathname])
  
  // 在服务器端和首次渲染时返回默认翻译，避免 hydration mismatch
  if (!isMounted) {
    return defaultTranslations
  }
  
  return translations || defaultTranslations
}
