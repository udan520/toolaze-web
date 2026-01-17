'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// 支持的语言列表
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const defaultLocale = 'en'

export default function HtmlLangSetter() {
  const pathname = usePathname()

  useEffect(() => {
    // 从路径名中提取语言代码
    const pathSegments = pathname.split('/').filter(Boolean)
    const firstSegment = pathSegments[0] || ''
    
    // 检查第一个路径段是否是语言代码
    const locale = locales.includes(firstSegment) ? firstSegment : defaultLocale
    
    // 立即设置 HTML lang 属性（在浏览器中执行，确保 SEO 友好）
    if (typeof document !== 'undefined') {
      // 使用 requestAnimationFrame 确保在浏览器渲染前执行
      requestAnimationFrame(() => {
        document.documentElement.lang = locale
      })
    }
  }, [pathname])

  // 在 SSR 阶段返回 null，只在客户端执行
  return null
}
