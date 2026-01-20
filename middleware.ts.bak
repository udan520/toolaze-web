import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 支持的语言列表（英语代码为 'en'，但不在 URL 中显示）
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const defaultLocale = 'en'

// 语言代码映射（浏览器语言 -> 网站语言代码）
const languageMap: Record<string, string> = {
  'en': 'en',
  'de': 'de',
  'ja': 'ja',
  'es': 'es',
  'zh-TW': 'zh-TW',
  'zh-HK': 'zh-TW',
  'zh': 'zh-TW', // 简体中文也映射到繁体
  'pt': 'pt',
  'fr': 'fr',
  'ko': 'ko',
  'it': 'it',
}

// 获取语言偏好
function getLocale(request: NextRequest): string {
  const pathname = request.nextUrl.pathname
  
  // 1. 检查 URL 路径中是否已经包含语言代码（除了英语）
  const pathnameHasLocale = locales.some(
    (locale) => locale !== 'en' && (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)
  )

  if (pathnameHasLocale) {
    // 如果路径已包含语言代码，提取它
    const locale = pathname.split('/')[1]
    if (locales.includes(locale)) {
      return locale
    }
  }

  // 2. 如果路径是根路径或看起来像英语路径，检查浏览器语言
  if (!pathnameHasLocale && pathname !== '/en' && !pathname.startsWith('/en/')) {
    const acceptLanguage = request.headers.get('accept-language')
    if (acceptLanguage) {
      // 解析 Accept-Language header
      // 格式通常是: "en-US,en;q=0.9,zh-TW;q=0.8,de;q=0.7"
      const languages = acceptLanguage
        .split(',')
        .map((lang) => {
          const [locale, q = 'q=1'] = lang.trim().split(';')
          const quality = parseFloat(q.replace('q=', ''))
          // 提取主要语言代码和地区代码
          const parts = locale.split('-')
          const mainLang = parts[0].toLowerCase()
          const region = parts[1]?.toUpperCase()
          const fullCode = region ? `${mainLang}-${region}` : mainLang
          
          return { 
            locale: languageMap[fullCode] || languageMap[mainLang] || mainLang, 
            quality 
          }
        })
        .sort((a, b) => b.quality - a.quality)

      // 找到第一个支持的语言
      for (const { locale } of languages) {
        if (locales.includes(locale)) {
          return locale
        }
      }
    }
  }

  // 3. 默认返回英语（不在 URL 中显示）
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 跳过静态文件和 API 路由
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml') ||
    pathname.startsWith('/apple-touch-icon') ||
    pathname.startsWith('/site.webmanifest') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next()
  }

  // 检查路径是否已经包含非英语的语言代码
  const pathnameHasLocale = locales.some(
    (locale) => locale !== 'en' && (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)
  )

  // 如果访问 /en 或 /en/*，且不是内部 rewrite 路径，重定向到根路径（移除 /en）
  // 但工具页面需要保留 /en 前缀用于内部路由，所以不重定向工具页面
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    // 检查是否是工具页面，如果是，不重定向（允许内部 rewrite）
    const enPathParts = pathname.replace('/en', '').split('/').filter(Boolean)
    const isEnToolPage = enPathParts.length === 2 && (
      enPathParts[0] === 'image-compressor' || 
      enPathParts[0] === 'image-converter'
    )
    
    // 如果是工具页面，跳过重定向（这可能是内部 rewrite 路径）
    if (!isEnToolPage) {
      const newPath = pathname === '/en' ? '/' : pathname.replace('/en', '')
      const newUrl = new URL(newPath, request.url)
      newUrl.search = request.nextUrl.search
      return NextResponse.redirect(newUrl)
    }
  }

  // 如果路径不包含语言代码，根据浏览器语言决定
  if (!pathnameHasLocale) {
    const locale = getLocale(request)
    
    // 如果是英语，直接使用根路径的页面（工具页面由根路径的路由文件处理）
    if (locale === 'en') {
      const response = NextResponse.next()
      response.headers.set('x-locale', 'en')
      return response
    }
    
    // 如果是其他语言，重定向到带语言代码的路径
    const newUrl = new URL(`/${locale}${pathname}`, request.url)
    newUrl.search = request.nextUrl.search
    return NextResponse.redirect(newUrl)
  }

  // 为其他语言的路径添加 locale 头部
  const locale = pathname.split('/')[1]
  if (locales.includes(locale) && locale !== 'en') {
    const response = NextResponse.next()
    response.headers.set('x-locale', locale)
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - 静态资源文件
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)).*)',
  ],
}
